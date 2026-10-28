"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  serverTimestamp, 
  increment, 
  getDocs
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./checkout.module.css";
import {
  Cpu,
  ArrowUpRight,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Trophy,
  PlusCircle,
  Clock,
} from "lucide-react";
import {
  normalizeInventoryItem,
  normalizeCheckout,
  RelationalInventoryItem,
  RelationalCheckout,
  INVENTORY_CATEGORIES,
} from "@/lib/portalRelations";

export default function CheckoutDashboard() {
  const { user, role, userData, canManage } = useAuth();
  const canManageStore = role === "admin" || canManage("manage_store");

  const [storeParts, setStoreParts] = useState<RelationalInventoryItem[]>([]);
  const [checkouts, setCheckouts] = useState<RelationalCheckout[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [partRequests, setPartRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Category filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Checkout Modal State
  const [selectedPart, setSelectedPart] = useState<RelationalInventoryItem | null>(null);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [checkoutNote, setCheckoutNote] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [linkedCompetitionId, setLinkedCompetitionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Hardware Requisition Modal State (for out-of-stock or missing gear)
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqPartName, setReqPartName] = useState("");
  const [reqCategory, setReqCategory] = useState<string>(INVENTORY_CATEGORIES[1]);
  const [reqQty, setReqQty] = useState(1);
  const [reqCost, setReqCost] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [reqCompId, setReqCompId] = useState("");
  const [submittingReq, setSubmittingReq] = useState(false);

  useEffect(() => {
    const purgeLegacyHardware = async () => {
      try {
        const legacySnap = await getDocs(collection(db, "hardware"));
        if (!legacySnap.empty) {
          const deletePromises = legacySnap.docs.map(d => deleteDoc(doc(db, "hardware", d.id)));
          await Promise.all(deletePromises);
        }
      } catch (err) {
        console.warn("Legacy hardware check/cleanup notice:", err);
      }
    };
    purgeLegacyHardware();

    const unsubInventory = onSnapshot(collection(db, "inventory"), (snap) => {
      const items = snap.docs.map(d => normalizeInventoryItem(d.id, d.data()));
      setStoreParts(items);
      setLoading(false);
    }, (error) => {
      console.error("Error reading store inventory:", error);
      setLoading(false);
    });

    const unsubCheckouts = onSnapshot(collection(db, "checkouts"), (snap) => {
      const active = snap.docs.map(d => normalizeCheckout(d.id, d.data()));
      setCheckouts(active);
    }, (error) => {
      console.error("Error reading checkouts:", error);
    });

    const unsubComps = onSnapshot(collection(db, "competitions"), (snap) => {
      setCompetitions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubReqs = onSnapshot(collection(db, "partRequests"), (snap) => {
      setPartRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubInventory();
      unsubCheckouts();
      unsubComps();
      unsubReqs();
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(INVENTORY_CATEGORIES);
    storeParts.forEach(p => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [storeParts]);

  const filteredParts = useMemo(() => {
    return storeParts.filter(part => {
      const matchesCategory = selectedCategory === "All" || part.category === selectedCategory;
      const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (part.category && part.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (part.specs && part.specs.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [storeParts, selectedCategory, searchQuery]);

  const visibleCheckouts = useMemo(() => {
    if (canManageStore) {
      return checkouts;
    }
    return checkouts.filter(c => c.checkedOutBy === user?.email || c.userId === user?.uid);
  }, [checkouts, canManageStore, user]);

  const overdueCheckouts = useMemo(() => {
    return visibleCheckouts.filter(c => c.isOverdue);
  }, [visibleCheckouts]);

  const handleOpenCheckoutModal = (part: RelationalInventoryItem) => {
    if (part.quantity <= 0) return;
    setSelectedPart(part);
    setCheckoutQty(1);
    setCheckoutNote("");
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setExpectedReturnDate(d.toISOString().split("T")[0]);
    setLinkedCompetitionId("");
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPart) return;

    if (checkoutQty > selectedPart.quantity) {
      alert(`Only ${selectedPart.quantity} units are currently available in the store.`);
      return;
    }

    const compObj = competitions.find(c => c.id === linkedCompetitionId);

    setIsProcessing(true);
    try {
      await updateDoc(doc(db, "inventory", selectedPart.id), {
        quantity: increment(-checkoutQty)
      });

      await addDoc(collection(db, "checkouts"), {
        partId: selectedPart.id,
        partName: selectedPart.name,
        category: selectedPart.category || "General",
        quantity: checkoutQty,
        checkedOutBy: user.email,
        userId: user.uid,
        userName: userData?.name || user.displayName || user.email?.split("@")[0] || "Club Member",
        checkedOutAt: serverTimestamp(),
        expectedReturnDate: expectedReturnDate || null,
        competitionId: linkedCompetitionId || null,
        competitionName: compObj ? compObj.name : null,
        status: "Checked Out",
        notes: checkoutNote.trim()
      });

      setSelectedPart(null);
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Failed to checkout part: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturn = async (checkout: RelationalCheckout) => {
    if (!window.confirm(`Return ${checkout.quantity}x ${checkout.partName} back to store inventory?`)) {
      return;
    }

    try {
      await updateDoc(doc(db, "inventory", checkout.partId), {
        quantity: increment(checkout.quantity || 1)
      });

      await deleteDoc(doc(db, "checkouts", checkout.id));
    } catch (err: any) {
      console.error("Return error:", err);
      alert("Failed to return part: " + (err.message || "Unknown error"));
    }
  };

  const handleSubmitHardwareRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reqPartName.trim()) return;
    setSubmittingReq(true);
    const compObj = competitions.find(c => c.id === reqCompId);
    const estTotal = (Number(reqCost) || 0) * Math.max(1, reqQty);
    try {
      await addDoc(collection(db, "partRequests"), {
        partName: reqPartName.trim(),
        category: reqCategory,
        quantity: Math.max(1, reqQty),
        estimatedUnitCost: Number(reqCost) || 0,
        estimatedTotalCost: estTotal,
        reason: reqReason.trim() || "Lab Requisition Request",
        competitionId: reqCompId || null,
        competitionName: compObj ? compObj.name : null,
        requestedBy: user.email,
        requestedByName: userData?.name || user.displayName || user.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      if (estTotal > 0) {
        await addDoc(collection(db, "treasury_expenses"), {
          title: `Lab Requisition: ${Math.max(1, reqQty)}x ${reqPartName.trim()}`,
          category: "Lab Requisitions & Sensors",
          type: "expense",
          amount: estTotal,
          status: "pending",
          submittedByUid: user.uid,
          submittedByName: userData?.name || user.displayName || user.email || "Member",
          competitionId: reqCompId || null,
          competitionName: compObj ? compObj.name : null,
          notes: reqReason.trim() || "Hardware requisition from Checkout Desk",
          date: new Date().toISOString(),
        });
      }

      setShowRequestModal(false);
      setReqPartName("");
      setReqQty(1);
      setReqCost("");
      setReqReason("");
      setReqCompId("");
      alert("Hardware requisition submitted to Lab Logistics & Treasury Queue!");
    } catch (err) {
      console.error("Error submitting requisition:", err);
      alert("Failed to submit hardware requisition.");
    } finally {
      setSubmittingReq(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently";
    try {
      const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Recently";
    }
  };

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Connecting to Store Inventory...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Cpu size={28} color="var(--accent-primary)" />
            Hardware Checkout &amp; Requisition Desk
          </h1>
          <p className={styles.subtitle}>
            Sign out components with expected return dates, link gear to competitions, or request missing hardware
          </p>
        </div>
        <div className={styles.headerActions} style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowRequestModal(true)}
            className={styles.btnCheckout}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 0.95rem" }}
          >
            <PlusCircle size={16} /> Request Missing Gear
          </button>
          <Link href="/dashboard/inventory" className={styles.storeLinkBtn}>
            <span>Component Ledger</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Overdue Custody Warning Banner */}
      {overdueCheckouts.length > 0 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.9rem 1.15rem",
          marginBottom: "1.25rem",
          borderRadius: "10px",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          color: "#FCA5A5",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <AlertTriangle size={20} color="#EF4444" />
            <span style={{ fontSize: "0.86rem" }}>
              <strong>{overdueCheckouts.length} Checked-Out Component(s) Overdue:</strong>{" "}
              {overdueCheckouts.map(c => `${c.partName} (${c.userName})`).join(", ")}
            </span>
          </div>
          <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#F87171" }}>
            PLEASE RETURN TO LAB LOCKER
          </span>
        </div>
      )}

      {/* Controls Bar: Search & Category Pills */}
      <div className={styles.controlsBar}>
        <div style={{ position: "relative" }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text"
            placeholder="Search parts by name, category, or technical specs..."
            className={styles.searchBar}
            style={{ paddingLeft: "2.4rem" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categoryPills}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.categoryPill} ${selectedCategory === cat ? styles.categoryPillActive : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className={styles.grid}>
        {/* Left: Available Store Parts */}
        <div>
          <div className={styles.sectionTitle}>
            <span>Available Lab Components</span>
            <span className={styles.countBadge}>{filteredParts.length} items</span>
          </div>

          <div className={styles.panel}>
            {filteredParts.length === 0 ? (
              <div className={styles.emptyState}>
                <Cpu size={40} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                <div className={styles.emptyStateTitle}>No Store Parts Available</div>
                <div className={styles.emptyStateDesc}>
                  {storeParts.length === 0 
                    ? "Your store inventory is currently empty. Add parts in the Store to make them available for sign-out." 
                    : "No parts match your search or selected category filter."}
                </div>
                {canManageStore && storeParts.length === 0 && (
                  <Link href="/dashboard/inventory" className={styles.storeLinkBtn} style={{ marginTop: "0.5rem" }}>
                    Go to Store &amp; Add Parts
                  </Link>
                )}
              </div>
            ) : (
              <div className={styles.list}>
                {filteredParts.map(part => {
                  const isAvailable = part.quantity > 0;
                  const isLow = isAvailable && part.quantity <= (part.minThreshold || 2);
                  return (
                    <div key={part.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{part.name}</div>
                        {part.specs && (
                          <div style={{ fontSize: "0.75rem", color: "#6f665e", marginBottom: "0.25rem" }}>
                            {part.specs}
                          </div>
                        )}
                        <div className={styles.metaRow}>
                          <span className={styles.categoryTag}>{part.category || "General"}</span>
                          <span className={`${styles.stockBadge} ${isAvailable ? styles.stockInStock : styles.stockOut}`}>
                            {isAvailable ? `${part.quantity} in lab` : "Out of Stock"}
                          </span>
                          {isLow && (
                            <span style={{ fontSize: "0.7rem", color: "#9c6f18", fontWeight: 700 }}>
                              LOW STOCK
                            </span>
                          )}
                          {part.price ? (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                              <span style={{ marginRight: '0.2rem' }}>৳</span>{part.price.toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {isAvailable ? (
                        <button
                          className={styles.btnCheckout}
                          onClick={() => handleOpenCheckoutModal(part)}
                        >
                          Check Out
                        </button>
                      ) : (
                        <button
                          className={styles.btnReturn}
                          onClick={() => {
                            setReqPartName(part.name);
                            setReqCategory(part.category || "Sensors");
                            setReqCost(String(part.price || ""));
                            setShowRequestModal(true);
                          }}
                        >
                          Request Restock
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Checked Out Items & Requisitions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <div className={styles.sectionTitle}>
              <span>{canManageStore ? "All Checked Out Custody Logs" : "My Checked Out Custody"}</span>
              <span className={styles.countBadge}>{visibleCheckouts.length} active</span>
            </div>

            <div className={styles.panel}>
              {visibleCheckouts.length === 0 ? (
                <div className={styles.emptyState}>
                  <CheckCircle2 size={40} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
                  <div className={styles.emptyStateTitle}>All Parts Accounted For</div>
                  <div className={styles.emptyStateDesc}>
                    {canManageStore 
                      ? "No items are currently signed out of the lab store." 
                      : "You haven't checked out any components yet. Choose an available part on the left to sign it out."}
                  </div>
                </div>
              ) : (
                <div className={styles.list}>
                  {visibleCheckouts.map(item => {
                    const canReturnThis = canManageStore || item.checkedOutBy === user?.email || item.userId === user?.uid;
                    return (
                      <div
                        key={item.id}
                        className={styles.itemCard}
                        style={item.isOverdue ? { borderColor: "rgba(239, 68, 68, 0.45)", background: "rgba(239, 68, 68, 0.06)" } : undefined}
                      >
                        <div className={styles.itemInfo}>
                          <div className={styles.itemName} style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                            <span>{item.quantity > 1 ? `${item.quantity}x ` : ""}{item.partName}</span>
                            {item.isOverdue && (
                              <span style={{
                                fontSize: "0.65rem",
                                padding: "0.12rem 0.45rem",
                                borderRadius: "999px",
                                background: "rgba(239, 68, 68, 0.2)",
                                color: "#F87171",
                                border: "1px solid rgba(239, 68, 68, 0.4)",
                                fontWeight: 700,
                              }}>
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <div className={styles.metaRow}>
                            <span className={styles.categoryTag}>{item.category || "General"}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                              Out: {formatDate(item.checkedOutAt)}
                            </span>
                            {item.expectedReturnDate && (
                              <span style={{
                                fontSize: "0.73rem",
                                color: item.isOverdue ? "#F87171" : "#9c6f18",
                                fontFamily: "var(--font-mono)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem"
                              }}>
                                <Calendar size={11} /> Due: {item.expectedReturnDate}
                              </span>
                            )}
                          </div>
                          <div className={styles.itemDesc}>
                            Custodian: <span className={styles.borrowerTag}>{item.userName || item.checkedOutBy}</span>
                            {item.competitionName && (
                              <div style={{ fontSize: "0.75rem", color: "#9c6f18", marginTop: "2px", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <Trophy size={11} /> {item.competitionName}
                              </div>
                            )}
                            {item.notes ? (
                              <div style={{ fontStyle: "italic", marginTop: "2px", color: "#6f665e" }}>
                                &ldquo;{item.notes}&rdquo;
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {canReturnThis && (
                          <button
                            className={styles.btnReturn}
                            onClick={() => handleReturn(item)}
                          >
                            Return Part
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pending Hardware Requisitions */}
          {partRequests.length > 0 && (
            <div>
              <div className={styles.sectionTitle}>
                <span>Active Hardware Requisitions</span>
                <span className={styles.countBadge}>{partRequests.length} logged</span>
              </div>
              <div className={styles.panel}>
                <div className={styles.list}>
                  {partRequests.slice(0, 6).map((req) => (
                    <div key={req.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>
                          {req.quantity || 1}x {req.partName}
                        </div>
                        <div className={styles.metaRow}>
                          <span className={styles.categoryTag}>{req.category || "Hardware"}</span>
                          {req.estimatedTotalCost > 0 && (
                            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#9c6f18", fontWeight: 700 }}>
                              Est. <span style={{ marginRight: '0.2rem' }}>৳</span>{req.estimatedTotalCost.toLocaleString()}
                            </span>
                          )}
                          <span style={{ fontSize: "0.72rem", color: "#6f665e", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <Clock size={11} /> {req.status || "pending"}
                          </span>
                        </div>
                        <div className={styles.itemDesc}>
                          Requested by {req.requestedByName || req.requestedBy}
                          {req.competitionName ? ` • For ${req.competitionName}` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Confirmation Modal */}
      {selectedPart && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPart(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Check Out Lab Component</div>
              <button className={styles.closeBtn} onClick={() => setSelectedPart(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmCheckout}>
              <div style={{ marginBottom: "1.25rem", padding: "0.85rem", background: "rgba(0,0,0,0.3)", borderRadius: "6px" }}>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>{selectedPart.name}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", marginTop: "4px" }}>
                  {selectedPart.quantity} units currently available in store
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Quantity to Sign Out</label>
                <input 
                  type="number"
                  min={1}
                  max={selectedPart.quantity}
                  value={checkoutQty}
                  onChange={(e) => setCheckoutQty(Math.max(1, Math.min(selectedPart.quantity, parseInt(e.target.value) || 1)))}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Expected Return Date</label>
                <input 
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Connected Competition / Project (Optional)</label>
                <select
                  value={linkedCompetitionId}
                  onChange={(e) => setLinkedCompetitionId(e.target.value)}
                  className={styles.input}
                >
                  <option value="">General Lab Research / Unlinked</option>
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Purpose / Engineering Note</label>
                <input 
                  type="text"
                  placeholder="e.g. Line Follower PID sensor array testing..."
                  value={checkoutNote}
                  onChange={(e) => setCheckoutNote(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setSelectedPart(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isProcessing}>
                  {isProcessing ? "Signing Out..." : `Confirm Sign Out (${checkoutQty})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hardware Requisition Modal */}
      {showRequestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRequestModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Request New / Restock Lab Hardware</div>
              <button className={styles.closeBtn} onClick={() => setShowRequestModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitHardwareRequest}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Component Name &amp; Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STM32F411 BlackPill or Pololu QTR-8RC"
                  value={reqPartName}
                  onChange={(e) => setReqPartName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className={styles.input}
                  >
                    {INVENTORY_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Quantity Needed</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className={styles.input}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Est. Unit Cost (BDT)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 450"
                    value={reqCost}
                    onChange={(e) => setReqCost(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Link to Competition</label>
                  <select
                    value={reqCompId}
                    onChange={(e) => setReqCompId(e.target.value)}
                    className={styles.input}
                  >
                    <option value="">General Lab Stock</option>
                    {competitions.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Engineering Justification</label>
                <input
                  type="text"
                  required
                  placeholder="Why is this sensor/actuator required?"
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowRequestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={submittingReq}>
                  {submittingReq ? "Submitting..." : "Submit Requisition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
