"use client";

import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import styles from "./admin-finance.module.css";
import { useAuth } from "@/context/AuthContext";
import { BUDGET_LINE_CATEGORIES, BudgetLineCategory } from "@/lib/portalRelations";
import { Wallet, Receipt, Trophy, Cpu, PlusCircle } from "lucide-react";

export default function AdminFinancePage() {
  const { user, userData, role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_finance");

  const [activeTab, setActiveTab] = useState<"dues" | "ledger">("dues");
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [userLookup, setUserLookup] = useState<Record<string, { name?: string; email?: string }>>({});

  // Direct Admin Ledger Entry state
  const [entryTitle, setEntryTitle] = useState("");
  const [entryType, setEntryType] = useState<"expense" | "income">("expense");
  const [entryCategory, setEntryCategory] = useState<BudgetLineCategory>("Lab Requisitions & Sensors");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryCompId, setEntryCompId] = useState("");
  const [entryNotes, setEntryNotes] = useState("");
  const [submittingEntry, setSubmittingEntry] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState(false);

  useEffect(() => {
    if (!canAccess) return;
    const q = query(collection(db, "payments"));
    const unsubPay = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      data.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setPayments(data);
    });

    const unsubExp = onSnapshot(collection(db, "treasury_expenses"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      data.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setExpenses(data);
    });

    const unsubComp = onSnapshot(collection(db, "competitions"), (snapshot) => {
      setCompetitions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const map: Record<string, { name?: string; email?: string }> = {};
      snapshot.docs.forEach((d) => {
        const udata = d.data();
        const displayName = udata.name || udata.displayName || udata.fullName;
        map[d.id] = { name: displayName, email: udata.email };
        if (udata.email) {
          map[udata.email.toLowerCase()] = { name: displayName, email: udata.email };
        }
      });
      setUserLookup(map);
    });

    return () => {
      unsubPay();
      unsubExp();
      unsubComp();
      unsubUsers();
    };
  }, [canAccess]);

  const handleVerify = async (paymentId: string) => {
    try {
      await updateDoc(doc(db, "payments", paymentId), {
        status: "verified",
        verifiedBy: user?.email
      });
      alert("Payment verified successfully!");
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Failed to verify payment.");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Are you sure you want to reject this payment request?")) return;
    try {
      await updateDoc(doc(db, "payments", paymentId), {
        status: "rejected"
      });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Failed to reject payment.");
    }
  };

  const handleExpenseDecision = async (expenseId: string, status: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "treasury_expenses", expenseId), {
        status,
        verifiedBy: user?.email,
      });
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Failed to update expense claim.");
    }
  };

  const handleLogDirectLedgerEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryAmount) return;
    setSubmittingEntry(true);
    const compObj = competitions.find(c => c.id === entryCompId);
    try {
      await addDoc(collection(db, "treasury_expenses"), {
        title: entryTitle.trim(),
        type: entryType,
        category: entryCategory,
        amount: Number(entryAmount),
        status: "approved",
        submittedByUid: user?.uid || "admin",
        submittedByName: userData?.name || user?.email || "Admin",
        verifiedBy: user?.email,
        competitionId: entryCompId || null,
        competitionName: compObj ? compObj.name : null,
        notes: entryNotes.trim() || null,
        date: new Date().toISOString(),
      });
      setEntryTitle("");
      setEntryAmount("");
      setEntryCompId("");
      setEntryNotes("");
      setIsEntryOpen(false);
    } catch (err) {
      console.error("Error logging ledger entry:", err);
      alert("Failed to log ledger entry.");
    } finally {
      setSubmittingEntry(false);
    }
  };

  const treasuryMetrics = useMemo(() => {
    const verifiedDuesIncome = payments
      .filter(p => p.status === "verified")
      .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const approvedSponsorIncome = expenses
      .filter(e => (e.status === "approved" || e.status === "verified") && (e.type === "income" || e.entryType === "income"))
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const approvedExpenses = expenses
      .filter(e => (e.status === "approved" || e.status === "verified") && e.type !== "income" && e.entryType !== "income")
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const pendingExpenseClaims = expenses.filter(e => e.status === "pending" || e.status === "pending_approval").length;
    const pendingPaymentCount = payments.filter(p => p.status === "pending_verification").length;
    return {
      totalIncome: verifiedDuesIncome + approvedSponsorIncome,
      approvedExpenses,
      netBalance: verifiedDuesIncome + approvedSponsorIncome - approvedExpenses,
      pendingExpenseClaims,
      pendingPaymentCount,
    };
  }, [payments, expenses]);

  if (!canAccess) {
    return (
      <div className={styles.container} style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ff5555', marginBottom: '1rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to manage club finances.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Financial Treasury &amp; Requisition Ledger</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: "0.25rem" }}>
            Verify member bKash dues, approve hardware/competition expense claims, and track allocated budget lines.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.65rem" }}>
        <div style={{ display: "flex", background: "#ffffff", padding: "0.3rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("dues")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.95rem",
              borderRadius: "7px",
              border: "none",
              background: activeTab === "dues" ? "rgba(245, 184, 0, 0.16)" : "transparent",
              color: activeTab === "dues" ? "#9c6f18" : "#6f665e",
              fontWeight: 700,
              fontSize: "0.84rem",
              cursor: "pointer",
            }}
          >
            <Wallet size={15} /> Member Dues ({treasuryMetrics.pendingPaymentCount} pending)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ledger")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.95rem",
              borderRadius: "7px",
              border: "none",
              background: activeTab === "ledger" ? "rgba(245, 184, 0, 0.16)" : "transparent",
              color: activeTab === "ledger" ? "#9c6f18" : "#6f665e",
              fontWeight: 700,
              fontSize: "0.84rem",
              cursor: "pointer",
            }}
          >
            <Receipt size={15} /> Expense Queue &amp; Ledger ({treasuryMetrics.pendingExpenseClaims} pending)
          </button>
        </div>
        {activeTab === "ledger" && (
          <button
            type="button"
            className={styles.btnAction}
            onClick={() => setIsEntryOpen((open) => !open)}
            aria-expanded={isEntryOpen}
            aria-controls="treasury-entry-form"
          >
            <PlusCircle size={16} /> {isEntryOpen ? "Close entry" : "Record entry"}
          </button>
        )}
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid #10B981' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Net Treasury Balance</h3>
          <div style={{ fontSize: '2.1rem', fontWeight: 'bold', color: '#10B981', fontFamily: 'var(--font-mono)' }}>
            ৳{treasuryMetrics.netBalance.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.76rem", color: "#6f665e", marginTop: "0.25rem" }}>
            Inflow: ৳{treasuryMetrics.totalIncome.toLocaleString()} • Outflow: ৳{treasuryMetrics.approvedExpenses.toLocaleString()}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid #9c6f18' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Pending Member Dues</h3>
          <div style={{ fontSize: '2.1rem', fontWeight: 'bold', color: '#9c6f18', fontFamily: 'var(--font-mono)' }}>
            {treasuryMetrics.pendingPaymentCount}
          </div>
          <div style={{ fontSize: "0.76rem", color: "#6f665e", marginTop: "0.25rem" }}>
            {payments.filter(p => p.status === 'verified').length} total verified payments
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.35rem', borderLeft: '4px solid #EF4444' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Pending Requisition Claims</h3>
          <div style={{ fontSize: '2.1rem', fontWeight: 'bold', color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
            {treasuryMetrics.pendingExpenseClaims}
          </div>
          <div style={{ fontSize: "0.76rem", color: "#6f665e", marginTop: "0.25rem" }}>
            Linked to Lab Inventory &amp; Competitions
          </div>
        </div>
      </div>

      {activeTab === "dues" ? (
        <div className={`glass-panel ${styles.panel}`}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Member bKash &amp; Cash Payment Submissions</h2>
          
          {payments.length === 0 ? (
            <div className={styles.emptyState}>No payments recorded yet.</div>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className={styles.desktopTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Member</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Method &amp; Txn</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => {
                      const info = userLookup[payment.userId] || (payment.userEmail ? userLookup[payment.userEmail.toLowerCase()] : null);
                      const memberName = info?.name || payment.userName;
                      const memberEmail = info?.email || payment.userEmail || (payment.userId?.includes("@") ? payment.userId : null);

                      return (
                        <tr key={payment.id}>
                          <td>{new Date(payment.date).toLocaleDateString()}</td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>
                                {memberName || memberEmail || payment.userId}
                              </div>
                              {memberName && memberEmail && (
                                <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>
                                  {memberEmail}
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>
                            {payment.type} {payment.month ? `(${payment.month})` : ''}
                          </td>
                          <td style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ marginRight: "0.2rem" }}>৳</span>{payment.amount}
                          </td>
                          <td>
                            {payment.method}
                            <br/>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                              {payment.txnId || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${
                              payment.status === 'verified' ? styles.statusApproved : 
                              payment.status === 'rejected' ? styles.statusRejected : styles.statusPending
                            }`}>
                              {payment.status === 'pending_verification' ? 'pending' : payment.status}
                            </span>
                          </td>
                          <td>
                            {payment.status === 'pending_verification' && (
                              <div className={styles.actions}>
                                <button onClick={() => handleVerify(payment.id)} className={styles.approveBtn}>Verify</button>
                                <button onClick={() => handleReject(payment.id)} className={styles.rejectBtn}>Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Transaction Stream Cards */}
              <div className={styles.mobileCardList}>
                {payments.map(payment => {
                  const info = userLookup[payment.userId] || (payment.userEmail ? userLookup[payment.userEmail.toLowerCase()] : null);
                  const memberName = info?.name || payment.userName || info?.email || payment.userId;

                  return (
                    <div key={payment.id} className={styles.paymentCard}>
                      <div className={styles.paymentCardHeader}>
                        <div>
                          <div className={styles.paymentAmount}>
                            <span style={{ marginRight: "0.2rem" }}>৳</span>{payment.amount}
                          </div>
                          <div className={styles.paymentType}>
                            {payment.type} {payment.month ? `(${payment.month})` : ''}
                          </div>
                        </div>
                        <span className={`${styles.statusBadge} ${
                          payment.status === 'verified' ? styles.statusApproved : 
                          payment.status === 'rejected' ? styles.statusRejected : styles.statusPending
                        }`}>
                          {payment.status === 'pending_verification' ? 'pending' : payment.status}
                        </span>
                      </div>

                      <div className={styles.paymentMeta}>
                        <div>Date: <strong>{new Date(payment.date).toLocaleDateString()}</strong></div>
                        <div>Member: <strong>{memberName}</strong></div>
                        <div>Method: <strong>{payment.method}</strong></div>
                        {payment.txnId && (
                          <div>Txn ID: <code style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{payment.txnId}</code></div>
                        )}
                      </div>

                      {payment.status === 'pending_verification' && (
                        <div className={styles.mobileActionRow}>
                          <button onClick={() => handleVerify(payment.id)} className={styles.approveBtn}>
                            ✓ Verify
                          </button>
                          <button onClick={() => handleReject(payment.id)} className={styles.rejectBtn}>
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isEntryOpen ? "repeat(auto-fit, minmax(320px, 1fr))" : "minmax(0, 1fr)", gap: "1.5rem" }}>
          {/* Direct Admin Ledger Entry Form */}
          {isEntryOpen && <div id="treasury-entry-form" className={`glass-panel ${styles.panel}`}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <PlusCircle size={18} color="#9c6f18" /> Log Treasury Entry (Sponsorship / Direct Expense)
            </h2>
            <form onSubmit={handleLogDirectLedgerEntry} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#6f665e", marginBottom: "0.25rem" }}>Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechFest Sponsorship Grant or PCB Fabrication Batch"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", background: "#f7f5f1", border: "1px solid var(--border-subtle, #dfd7cc)", color: "#27211d" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#6f665e", marginBottom: "0.25rem" }}>Flow Type</label>
                  <select
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value as "expense" | "income")}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", background: "#f7f5f1", border: "1px solid var(--border-subtle, #dfd7cc)", color: "#27211d" }}
                  >
                    <option value="expense">Expense Outflow (-)</option>
                    <option value="income">Sponsorship / Grant Inflow (+)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#6f665e", marginBottom: "0.25rem" }}>Amount (BDT)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={entryAmount}
                    onChange={(e) => setEntryAmount(e.target.value)}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", background: "#f7f5f1", border: "1px solid var(--border-subtle, #dfd7cc)", color: "#27211d", fontFamily: "var(--font-mono)" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#6f665e", marginBottom: "0.25rem" }}>Budget Pool</label>
                  <select
                    value={entryCategory}
                    onChange={(e) => setEntryCategory(e.target.value as BudgetLineCategory)}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", background: "#f7f5f1", border: "1px solid var(--border-subtle, #dfd7cc)", color: "#27211d" }}
                  >
                    {BUDGET_LINE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#6f665e", marginBottom: "0.25rem" }}>Competition Link</label>
                  <select
                    value={entryCompId}
                    onChange={(e) => setEntryCompId(e.target.value)}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", background: "#f7f5f1", border: "1px solid var(--border-subtle, #dfd7cc)", color: "#27211d" }}
                  >
                    <option value="">General Lab Pool</option>
                    {competitions.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#6f665e", marginBottom: "0.25rem" }}>Memo / Invoice Reference</label>
                <input
                  type="text"
                  placeholder="Optional receipt or sponsor reference..."
                  value={entryNotes}
                  onChange={(e) => setEntryNotes(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", background: "#f7f5f1", border: "1px solid var(--border-subtle, #dfd7cc)", color: "#27211d" }}
                />
              </div>
              <button type="submit" disabled={submittingEntry} className={styles.approveBtn} style={{ padding: "0.7rem 1rem", fontWeight: 700 }}>
                {submittingEntry ? "Recording..." : "Record Approved Ledger Entry"}
              </button>
            </form>
          </div>}

          {/* Expense Approval Queue & Ledger Stream */}
          <div className={`glass-panel ${styles.panel}`}>
            <h2 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>Relational Expense Approval Queue &amp; Ledger</h2>
            {expenses.length === 0 ? (
              <div className={styles.emptyState}>No expense claims or requisitions logged yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      padding: "0.95rem 1.15rem",
                      borderRadius: "10px",
                      background: "var(--bg-primary, #ffffff)",
                      border: "1px solid var(--border-subtle, #dfd7cc)",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "#27211d", fontSize: "0.95rem" }}>{exp.title}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem", fontSize: "0.75rem", color: "#6f665e" }}>
                        <span>{exp.category}</span>
                        <span>• By {exp.submittedByName || exp.submittedByUid}</span>
                        {exp.competitionName && (
                          <span style={{ color: "#9c6f18", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                            <Trophy size={11} /> {exp.competitionName}
                          </span>
                        )}
                        {(exp.inventoryItemName || exp.partName) && (
                          <span style={{ color: "#0284c7", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                            <Cpu size={11} /> {exp.inventoryItemName || exp.partName}
                          </span>
                        )}
                      </div>
                      {exp.notes && (
                        <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.25rem" }}>{exp.notes}</div>
                      )}
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        fontSize: "1.02rem",
                        color: exp.type === "income" ? "#16a34a" : "#9c6f18",
                      }}>
                        {exp.type === "income" ? "+" : "-"} ৳ {Number(exp.amount || 0).toLocaleString()}
                      </div>
                      <div style={{ marginTop: "0.35rem", display: "flex", gap: "0.4rem", justifyContent: "flex-end", alignItems: "center" }}>
                        <span className={`${styles.statusBadge} ${
                          exp.status === "approved" || exp.status === "verified"
                            ? styles.statusApproved
                            : exp.status === "rejected"
                            ? styles.statusRejected
                            : styles.statusPending
                        }`}>
                          {exp.status === "pending_approval" ? "pending" : exp.status}
                        </span>
                        {(exp.status === "pending" || exp.status === "pending_approval") && (
                          <>
                            <button onClick={() => handleExpenseDecision(exp.id, "approved")} className={styles.approveBtn}>
                              Approve
                            </button>
                            <button onClick={() => handleExpenseDecision(exp.id, "rejected")} className={styles.rejectBtn}>
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
