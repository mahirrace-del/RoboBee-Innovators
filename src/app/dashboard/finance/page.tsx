"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./finance.module.css";
import { BUDGET_LINE_CATEGORIES, BudgetLineCategory } from "@/lib/portalRelations";
import { Wallet, Receipt, Trophy, Cpu, CheckCircle2, Clock } from "lucide-react";

export default function FinancePage() {
  const { user, userData } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"dues" | "requisitions">("dues");
  const [payments, setPayments] = useState<any[]>([]);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("monthly");
  const [paymentMonth, setPaymentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [paymentTxn, setPaymentTxn] = useState("");

  // Relational Expense Claim / Requisition State
  const [myExpenses, setMyExpenses] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [claimTitle, setClaimTitle] = useState("");
  const [claimCategory, setClaimCategory] = useState<BudgetLineCategory>("Lab Requisitions & Sensors");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimCompId, setClaimCompId] = useState("");
  const [claimInventoryId, setClaimInventoryId] = useState("");
  const [claimReceiptRef, setClaimReceiptRef] = useState("");
  const [claimNotes, setClaimNotes] = useState("");
  const [submittingClaim, setSubmittingClaim] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPayments = async () => {
      try {
        const payQuery = query(collection(db, "payments"), where("userId", "==", user.uid));
        const paySnap = await getDocs(payQuery);
        setPayments(paySnap.docs.map(p => ({ id: p.id, ...p.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();

    const unsubExpenses = onSnapshot(collection(db, "treasury_expenses"), (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as any))
        .filter(e => e.submittedByUid === user.uid);
      list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setMyExpenses(list);
    });

    const unsubComps = onSnapshot(collection(db, "competitions"), (snap) => {
      setCompetitions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubInv = onSnapshot(collection(db, "inventory"), (snap) => {
      setInventoryItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubExpenses();
      unsubComps();
      unsubInv();
    };
  }, [user]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingPayment(true);
    try {
      const newPayment = {
        userId: user.uid,
        type: paymentType,
        month: paymentType === "monthly" ? paymentMonth : null,
        amount: 1000,
        method: paymentMethod,
        txnId: paymentTxn,
        status: "pending_verification",
        date: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "payments"), newPayment);
      setPayments(prev => [{ id: docRef.id, ...newPayment }, ...prev]);
      alert("Payment submitted for verification!");
      setPaymentTxn("");
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !claimTitle.trim() || !claimAmount) return;
    setSubmittingClaim(true);
    const compObj = competitions.find(c => c.id === claimCompId);
    const invObj = inventoryItems.find(i => i.id === claimInventoryId);
    try {
      await addDoc(collection(db, "treasury_expenses"), {
        title: claimTitle.trim(),
        category: claimCategory,
        type: "expense",
        amount: Number(claimAmount),
        status: "pending",
        submittedByUid: user.uid,
        submittedByName: userData?.name || user.displayName || user.email || "Team Member",
        competitionId: claimCompId || null,
        competitionName: compObj ? compObj.name : null,
        inventoryItemId: claimInventoryId || null,
        inventoryItemName: invObj ? invObj.name : null,
        receiptUrl: claimReceiptRef.trim() || null,
        notes: claimNotes.trim() || null,
        date: new Date().toISOString(),
      });
      setClaimTitle("");
      setClaimAmount("");
      setClaimCompId("");
      setClaimInventoryId("");
      setClaimReceiptRef("");
      setClaimNotes("");
      alert("Expense Claim / Purchase Requisition submitted to Admin Treasury Queue!");
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Failed to submit expense claim.");
    } finally {
      setSubmittingClaim(false);
    }
  };

  const hasEnrollment = payments.some(p => p.type === 'enrollment' && p.status === 'verified');
  const hasPendingEnrollment = payments.some(p => p.type === 'enrollment' && p.status === 'pending_verification');
  
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const hasCurrentMonth = payments.some(p => p.type === 'monthly' && p.month === currentMonthStr && p.status === 'verified');
  const hasPendingCurrentMonth = payments.some(p => p.type === 'monthly' && p.month === currentMonthStr && p.status === 'pending_verification');

  let totalDue = 0;
  if (!hasEnrollment && !hasPendingEnrollment) totalDue += 1000;
  if (!hasCurrentMonth && !hasPendingCurrentMonth) totalDue += 1000;

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Lab Fees &amp; Requisition Claims</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: "0.25rem" }}>
            Manage your monthly lab dues or submit hardware/competition expense claims to the Treasury.
          </p>
        </div>
        <div style={{ display: "flex", background: "#ffffff", padding: "0.3rem", borderRadius: "10px", border: "1px solid var(--border-subtle, #dfd7cc)" }}>
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
            <Wallet size={15} /> Membership Dues
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requisitions")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.95rem",
              borderRadius: "7px",
              border: "none",
              background: activeTab === "requisitions" ? "rgba(245, 184, 0, 0.16)" : "transparent",
              color: activeTab === "requisitions" ? "#9c6f18" : "#6f665e",
              fontWeight: 700,
              fontSize: "0.84rem",
              cursor: "pointer",
            }}
          >
            <Receipt size={15} /> Expense Claims ({myExpenses.length})
          </button>
        </div>
      </div>

      {activeTab === "dues" ? (
        <>
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', flex: '1', borderLeft: `4px solid ${totalDue > 0 ? '#dc2626' : '#16a34a'}` }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Outstanding Due</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: totalDue > 0 ? '#dc2626' : '#065f46', fontFamily: 'var(--font-mono)' }}>
                <span style={{ marginRight: '0.2rem' }}>৳</span>{totalDue.toLocaleString()} BDT
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {totalDue === 0 ? "You are all caught up!" : "Please submit your pending payments."}
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Left Column: Dues & Payment Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className={`glass-panel ${styles.card}`}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-secondary, #ffffff)', border: '1px solid var(--border-subtle, #dfd7cc)', borderRadius: '8px', borderLeft: `4px solid ${hasEnrollment ? '#16a34a' : hasPendingEnrollment ? '#9c6f18' : '#dc2626'}` }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enrollment Fee (One-Time)</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasEnrollment ? '#065f46' : hasPendingEnrollment ? '#9c6f18' : '#dc2626' }}>
                      {hasEnrollment ? 'Paid' : hasPendingEnrollment ? 'Verification Pending' : 'Due (1,000 BDT)'}
                    </div>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-secondary, #ffffff)', border: '1px solid var(--border-subtle, #dfd7cc)', borderRadius: '8px', borderLeft: `4px solid ${hasCurrentMonth ? '#16a34a' : hasPendingCurrentMonth ? '#9c6f18' : '#dc2626'}` }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Monthly Fee ({currentMonthStr})</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasCurrentMonth ? '#065f46' : hasPendingCurrentMonth ? '#9c6f18' : '#dc2626' }}>
                      {hasCurrentMonth ? 'Paid' : hasPendingCurrentMonth ? 'Verification Pending' : 'Due (1,000 BDT)'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Due by 5th of every month</div>
                  </div>
                </div>
              </div>

              <div className={`glass-panel ${styles.card}`}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Submit Payment for Verification</h3>
                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Payment Type</label>
                    <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem', width: '100%' }}>
                      <option value="enrollment">Enrollment (1000 BDT)</option>
                      <option value="monthly">Monthly (1000 BDT)</option>
                    </select>
                  </div>
                  {paymentType === "monthly" && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>For Month</label>
                      <input type="month" required value={paymentMonth} onChange={e => setPaymentMonth(e.target.value)} className={styles.input} style={{ padding: '0.5rem', width: '100%' }} />
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Method</label>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem', width: '100%' }}>
                      <option value="bKash">bKash (Send to 01902821018)</option>
                      <option value="Cash">Cash to Admin</option>
                    </select>
                  </div>
                  {paymentMethod === "bKash" && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Transaction ID (Required for bKash)</label>
                      <input type="text" required value={paymentTxn} onChange={e => setPaymentTxn(e.target.value)} className={styles.input} placeholder="e.g. 9X2B..." style={{ padding: '0.5rem', width: '100%' }} />
                    </div>
                  )}
                  <button type="submit" disabled={submittingPayment} className={styles.submitBtn} style={{ padding: '0.8rem 1rem', marginTop: '0.5rem' }}>
                    {submittingPayment ? "Submitting..." : "Submit for Verification"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Payment History */}
            <div className={`glass-panel ${styles.card}`}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Payment History</h2>
              
              {payments.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No payment records found.</p>
              ) : (
                <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                  <table className={styles.historyTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Method/Txn</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment.id}>
                          <td>{new Date(payment.date).toLocaleDateString()}</td>
                          <td style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                            {payment.type} {payment.month ? `(${payment.month})` : ''}
                          </td>
                          <td>
                            {payment.method}
                            <br/>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.grid}>
          {/* Left Column: Submit Relational Expense Claim */}
          <div className={`glass-panel ${styles.card}`}>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.35rem" }}>Submit Hardware / Competition Expense Claim</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1.15rem" }}>
              Every treasury expense links directly to a Budget Pool, Competition, or Lab Inventory item.
            </p>
            <form onSubmit={handleClaimSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                  Expense / Requisition Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3x N20 Micro Gear Motors + LiPo Battery Charger"
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  className={styles.input}
                  style={{ padding: "0.55rem", width: "100%" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                    Budget Line Category
                  </label>
                  <select
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value as BudgetLineCategory)}
                    className={styles.input}
                    style={{ padding: "0.55rem", width: "100%" }}
                  >
                    {BUDGET_LINE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                    Total Amount (BDT)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="e.g. 1450"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className={styles.input}
                    style={{ padding: "0.55rem", width: "100%", fontFamily: "var(--font-mono)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                    Linked Competition (Optional)
                  </label>
                  <select
                    value={claimCompId}
                    onChange={(e) => setClaimCompId(e.target.value)}
                    className={styles.input}
                    style={{ padding: "0.55rem", width: "100%" }}
                  >
                    <option value="">None / General Lab</option>
                    {competitions.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                    Linked Lab Part (Optional)
                  </label>
                  <select
                    value={claimInventoryId}
                    onChange={(e) => setClaimInventoryId(e.target.value)}
                    className={styles.input}
                    style={{ padding: "0.55rem", width: "100%" }}
                  >
                    <option value="">New Part / Not in Store</option>
                    {inventoryItems.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                  Receipt Link / Invoice or bKash Reference
                </label>
                <input
                  type="text"
                  placeholder="Google Drive invoice link or vendor memo number..."
                  value={claimReceiptRef}
                  onChange={(e) => setClaimReceiptRef(e.target.value)}
                  className={styles.input}
                  style={{ padding: "0.55rem", width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                  Engineering Notes / Breakdown
                </label>
                <input
                  type="text"
                  placeholder="Unit breakdown and supplier details..."
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  className={styles.input}
                  style={{ padding: "0.55rem", width: "100%" }}
                />
              </div>

              <button type="submit" disabled={submittingClaim} className={styles.submitBtn} style={{ padding: "0.8rem 1rem", marginTop: "0.35rem" }}>
                {submittingClaim ? "Submitting Claim..." : "Submit Expense Requisition"}
              </button>
            </form>
          </div>

          {/* Right Column: My Expense Claims Status */}
          <div className={`glass-panel ${styles.card}`}>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "1rem" }}>My Expense &amp; Requisition Claims</h2>
            {myExpenses.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>
                You have not submitted any hardware or competition expense claims yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {myExpenses.map((exp) => (
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
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "#27211d", fontSize: "0.95rem" }}>{exp.title}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.35rem", fontSize: "0.75rem", color: "#6f665e" }}>
                        <span>{exp.category}</span>
                        {exp.competitionName && (
                          <span style={{ color: "#9c6f18", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                            <Trophy size={11} /> {exp.competitionName}
                          </span>
                        )}
                        {exp.inventoryItemName && (
                          <span style={{ color: "#0284c7", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                            <Cpu size={11} /> {exp.inventoryItemName}
                          </span>
                        )}
                      </div>
                      {exp.notes && (
                        <div style={{ fontSize: "0.76rem", color: "#64748B", marginTop: "0.25rem" }}>
                          {exp.notes}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "#9c6f18", fontSize: "1rem" }}>
                        <span style={{ marginRight: '0.2rem' }}>৳</span>{Number(exp.amount || 0).toLocaleString()}
                      </div>
                      <span
                        className={`${styles.statusBadge} ${
                          exp.status === "approved"
                            ? styles.statusApproved
                            : exp.status === "rejected"
                            ? styles.statusRejected
                            : styles.statusPending
                        }`}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.3rem" }}
                      >
                        {exp.status === "approved" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {exp.status}
                      </span>
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
