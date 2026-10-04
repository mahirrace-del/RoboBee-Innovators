"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  serverTimestamp, 
  increment, 
  getDocs,
  orderBy 
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./checkout.module.css";
import { Cpu, ArrowUpRight, Search, X, CheckCircle2 } from "lucide-react";

interface StorePart {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  price?: number;
}

interface ActiveCheckout {
  id: string;
  partId: string;
  partName: string;
  category?: string;
  quantity: number;
  checkedOutBy: string;
  userId?: string;
  userName?: string;
  checkedOutAt?: any;
  status: string;
  notes?: string;
}

export default function CheckoutDashboard() {
  const { user, role, userData, canManage } = useAuth();
  const canManageStore = role === "admin" || canManage("manage_store");

  const [storeParts, setStoreParts] = useState<StorePart[]>([]);
  const [checkouts, setCheckouts] = useState<ActiveCheckout[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Category filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Checkout Modal State
  const [selectedPart, setSelectedPart] = useState<StorePart | null>(null);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [checkoutNote, setCheckoutNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 1. Purge legacy dummy hardware documents (RPLIDAR, HuskyLens, STM32, Jetson Nano test data)
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

    // 2. Listen to real Store Inventory parts
    const unsubInventory = onSnapshot(collection(db, "inventory"), (snap) => {
      const items = snap.docs.map(d => ({
        id: d.id,
        name: d.data().name || "Unnamed Part",
        category: d.data().category || "General",
        quantity: typeof d.data().quantity === "number" ? d.data().quantity : 0,
        price: d.data().price || 0
      })) as StorePart[];
      setStoreParts(items);
      setLoading(false);
    }, (error) => {
      console.error("Error reading store inventory:", error);
      setLoading(false);
    });

    // 3. Listen to Active Checkouts
    const unsubCheckouts = onSnapshot(collection(db, "checkouts"), (snap) => {
      const active = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ActiveCheckout[];
      setCheckouts(active);
    }, (error) => {
      console.error("Error reading checkouts:", error);
    });

    return () => {
      unsubInventory();
      unsubCheckouts();
    };
  }, []);

  // Compute Categories from available Store parts
  const categories = useMemo(() => {
    const set = new Set<string>();
    storeParts.forEach(p => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [storeParts]);

  // Filter Store parts by category and search
  const filteredParts = useMemo(() => {
    return storeParts.filter(part => {
      const matchesCategory = selectedCategory === "All" || part.category === selectedCategory;
      const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (part.category && part.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [storeParts, selectedCategory, searchQuery]);

  // Filter Checkouts: Admin/Store Managers see all, Members see only their own
  const visibleCheckouts = useMemo(() => {
    if (canManageStore) {
      return checkouts;
    }
    return checkouts.filter(c => c.checkedOutBy === user?.email || c.userId === user?.uid);
  }, [checkouts, canManageStore, user]);

  const handleOpenCheckoutModal = (part: StorePart) => {
    if (part.quantity <= 0) return;
    setSelectedPart(part);
    setCheckoutQty(1);
    setCheckoutNote("");
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPart) return;

    if (checkoutQty > selectedPart.quantity) {
      alert(`Only ${selectedPart.quantity} units are currently available in the store.`);
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Decrement store inventory
      await updateDoc(doc(db, "inventory", selectedPart.id), {
        quantity: increment(-checkoutQty)
      });

      // 2. Add checkout record
      await addDoc(collection(db, "checkouts"), {
        partId: selectedPart.id,
        partName: selectedPart.name,
        category: selectedPart.category || "General",
        quantity: checkoutQty,
        checkedOutBy: user.email,
        userId: user.uid,
        userName: userData?.name || user.displayName || user.email?.split("@")[0] || "Club Member",
        checkedOutAt: serverTimestamp(),
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

  const handleReturn = async (checkout: ActiveCheckout) => {
    if (!window.confirm(`Return ${checkout.quantity}x ${checkout.partName} back to store inventory?`)) {
      return;
    }

    try {
      // 1. Restore inventory quantity in the store
      await updateDoc(doc(db, "inventory", checkout.partId), {
        quantity: increment(checkout.quantity || 1)
      });

      // 2. Remove from active checkouts
      await deleteDoc(doc(db, "checkouts", checkout.id));
    } catch (err: any) {
      console.error("Return error:", err);
      alert("Failed to return part: " + (err.message || "Unknown error"));
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
            Hardware Checkout
          </h1>
          <p className={styles.subtitle}>
            Sign out components directly from available Store Inventory for your robotics projects
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/dashboard/inventory" className={styles.storeLinkBtn}>
            <span>View Full Store</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Controls Bar: Search & Category Pills */}
      <div className={styles.controlsBar}>
        <div style={{ position: "relative" }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text"
            placeholder="Search parts by name or category..."
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
            <span>Available Store Parts</span>
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
                    Go to Store & Add Parts
                  </Link>
                )}
              </div>
            ) : (
              <div className={styles.list}>
                {filteredParts.map(part => {
                  const isAvailable = part.quantity > 0;
                  return (
                    <div key={part.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{part.name}</div>
                        <div className={styles.metaRow}>
                          <span className={styles.categoryTag}>{part.category || "General"}</span>
                          <span className={`${styles.stockBadge} ${isAvailable ? styles.stockInStock : styles.stockOut}`}>
                            {isAvailable ? `${part.quantity} in lab` : "Out of Stock"}
                          </span>
                          {part.price ? (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                              ৳{part.price}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        className={styles.btnCheckout}
                        disabled={!isAvailable}
                        onClick={() => handleOpenCheckoutModal(part)}
                      >
                        {isAvailable ? "Check Out" : "Out of Stock"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Checked Out Items */}
        <div>
          <div className={styles.sectionTitle}>
            <span>{canManageStore ? "All Checked Out Items" : "My Checked Out Items"}</span>
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
                    <div key={item.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>
                          {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.partName}
                        </div>
                        <div className={styles.metaRow}>
                          <span className={styles.categoryTag}>{item.category || "General"}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                            {formatDate(item.checkedOutAt)}
                          </span>
                        </div>
                        <div className={styles.itemDesc}>
                          Borrower: <span className={styles.borrowerTag}>{item.userName || item.checkedOutBy}</span>
                          {item.notes ? (
                            <div style={{ fontStyle: "italic", marginTop: "2px", color: "rgba(255,255,255,0.7)" }}>
                              "{item.notes}"
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
      </div>

      {/* Checkout Confirmation Modal */}
      {selectedPart && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPart(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Check Out Component</div>
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
                <label className={styles.label}>Purpose / Project Note (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Line Follower Robot, AI Camera testing..."
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
    </div>
  );
}
