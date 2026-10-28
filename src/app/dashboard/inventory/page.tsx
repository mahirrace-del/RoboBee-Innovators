"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./inventory.module.css";
import {
  Plus,
  Minus,
  ArrowLeft,
  AlertTriangle,
  LayoutGrid,
  Table,
  ShoppingCart,
  Cpu,
  X,
} from "lucide-react";
import {
  normalizeInventoryItem,
  RelationalInventoryItem,
  STANDARD_INVENTORY_CATEGORIES,
} from "@/lib/portalRelations";

export default function InventoryDashboard() {
  const { user, role, canManage } = useAuth();
  const canEditStore = role === "admin" || canManage("manage_store");

  const [inventory, setInventory] = useState<RelationalInventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "ledger">("ledger");
  const [showMobileAdd, setShowMobileAdd] = useState(false);

  // Quick Part Request Modal State (for all members)
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqPartName, setReqPartName] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);

  // Add Part Form (Admin / Store Manager)
  const [newPartName, setNewPartName] = useState("");
  const [newPartCategory, setNewPartCategory] = useState("Microcontrollers");
  const [newPartPrice, setNewPartPrice] = useState(0);
  const [newPartQty, setNewPartQty] = useState(1);
  const [newPartThreshold, setNewPartThreshold] = useState(3);
  const [newPartSpecs, setNewPartSpecs] = useState("");
  const [isAddingPart, setIsAddingPart] = useState(false);

  useEffect(() => {
    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((d) =>
        normalizeInventoryItem({ id: d.id, ...d.data() })
      );
      setInventory(items);
    });

    return () => {
      unsubInventory();
    };
  }, []);

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditStore || !newPartName) return;

    setIsAddingPart(true);
    try {
      const existingPart = inventory.find(
        (p) => p.name.trim().toLowerCase() === newPartName.trim().toLowerCase()
      );

      if (existingPart) {
        await updateDoc(doc(db, "inventory", existingPart.id), {
          quantity: increment(newPartQty),
          price: newPartPrice > 0 ? newPartPrice : existingPart.price,
          minThreshold: newPartThreshold,
          ...(newPartSpecs ? { specs: newPartSpecs.trim() } : {}),
        });
        alert(
          `Updated existing part: ${existingPart.name}. Added ${newPartQty} more.`
        );
      } else {
        await addDoc(collection(db, "inventory"), {
          name: newPartName.trim(),
          category: newPartCategory.trim() || "Microcontrollers",
          price: newPartPrice,
          quantity: newPartQty,
          minThreshold: newPartThreshold,
          specs: newPartSpecs.trim(),
          addedBy: user?.uid,
          addedAt: serverTimestamp(),
        });
      }

      setNewPartName("");
      setNewPartPrice(0);
      setNewPartQty(1);
      setNewPartThreshold(3);
      setNewPartSpecs("");
      setShowMobileAdd(false);
    } catch (error) {
      console.error("Error adding part:", error);
      alert("Failed to add part");
    } finally {
      setIsAddingPart(false);
    }
  };

  const handleUpdateQuantity = async (
    id: string,
    delta: number,
    currentQty: number
  ) => {
    if (!canEditStore) return;
    const newQty = currentQty + delta;
    if (newQty < 0) return;
    try {
      await updateDoc(doc(db, "inventory", id), {
        quantity: newQty,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeletePart = async (id: string) => {
    if (!canEditStore) return;
    if (
      window.confirm(
        "Are you sure you want to permanently remove this part from the inventory?"
      )
    ) {
      try {
        await deleteDoc(doc(db, "inventory", id));
      } catch (error) {
        console.error("Error deleting part:", error);
      }
    }
  };

  // One-click Purchase Requisition into Treasury & Parts Requests
  const handleLogPurchaseRequisition = async (item: RelationalInventoryItem) => {
    const restockQty = Math.max(5, item.minThreshold * 2);
    const estCost = (item.price || 150) * restockQty;
    try {
      await addDoc(collection(db, "partRequests"), {
        partId: item.id,
        partName: `${item.name} (Restock x${restockQty})`,
        reason: `Auto-flagged Stock Depletion Warning (Current: ${item.quantity}, Min Threshold: ${item.minThreshold}). Est. Cost: ৳${estCost}`,
        requestedBy: user?.email || "Inventory System",
        status: "pending",
        requestedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "treasury_expenses"), {
        title: `Lab Stock Replenishment: ${restockQty}x ${item.name}`,
        entryType: "expense",
        amount: estCost,
        budgetLine: "Hardware & Sensors",
        status: "pending_approval",
        submittedBy: user?.uid || "system",
        submittedByEmail: user?.email || "system",
        partId: item.id,
        partName: item.name,
        date: new Date().toISOString(),
        notes: `Triggered from Component Ledger stock depletion warning (${item.quantity} left in stock).`,
      });

      alert(
        `Purchase requisition logged for ${restockQty}x ${item.name} (Est. ৳${estCost}) in Treasury & Parts Queue!`
      );
    } catch (err) {
      console.error("Error logging requisition:", err);
      alert("Failed to log purchase requisition.");
    }
  };

  const handleQuickRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqPartName.trim()) return;

    setIsSubmittingReq(true);
    try {
      await addDoc(collection(db, "partRequests"), {
        partName: reqPartName.trim(),
        reason: reqReason.trim() || "Requested via Component Ledger",
        requestedBy: user?.email || "Member",
        uid: user?.uid || null,
        status: "pending",
        requestedAt: serverTimestamp(),
      });
      setReqPartName("");
      setReqReason("");
      setShowRequestModal(false);
      alert("Part request submitted successfully to Lab Logistics queue!");
    } catch (error) {
      console.error("Error submitting part request:", error);
      alert("Failed to submit request.");
    } finally {
      setIsSubmittingReq(false);
    }
  };

  const normalizeCat = (cat?: string) => {
    if (!cat || !cat.trim()) return "General";
    const trimmed = cat.trim();
    const match = STANDARD_INVENTORY_CATEGORIES.find(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) return match;
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  // Standard + custom categories
  const categories = useMemo(() => {
    const cats = new Set<string>(STANDARD_INVENTORY_CATEGORIES);
    inventory.forEach((item) => {
      if (item.category) cats.add(normalizeCat(item.category));
    });
    return ["All", "Low Stock Alerts", ...Array.from(cats)];
  }, [inventory]);

  const lowStockItems = useMemo(
    () => inventory.filter((i) => i.quantity <= i.minThreshold),
    [inventory]
  );

  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.specs || "").toLowerCase().includes(searchQuery.toLowerCase());
        if (selectedCategory === "All") return matchesSearch;
        if (selectedCategory === "Low Stock Alerts") {
          return matchesSearch && item.quantity <= item.minThreshold;
        }
        return (
          matchesSearch &&
          normalizeCat(item.category) === selectedCategory
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [inventory, searchQuery, selectedCategory]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Hardware &amp; Lab Component Ledger
          </h1>
          <p className={styles.subtitle}>
            Categorized ledger for Microcontrollers, Sensors, Actuators, Power/Batteries, and Mechanical Hardware with automated stock depletion alerts.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
          {canEditStore && (
            <button
              onClick={() => setShowMobileAdd((current) => !current)}
              className={styles.addComponentButton}
              aria-expanded={showMobileAdd}
              aria-controls="add-component-form"
            >
              <Plus size={16} />
              {showMobileAdd ? "Close form" : "Add component"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className={styles.backBtn}
            style={{
              background: "#ffffff",
              color: "#84243a",
              border: "1px solid #dfd7cc",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            <Plus size={16} /> Request Part
          </button>
          <div
            style={{
              display: "inline-flex",
              background: "#ffffff",
              border: "1px solid #dfd7cc",
              borderRadius: "8px",
              padding: "0.2rem",
              gap: "0.2rem",
            }}
          >
            <button
              onClick={() => setViewMode("ledger")}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: 700,
                background: viewMode === "ledger" ? "#6B0F24" : "transparent",
                color: viewMode === "ledger" ? "#ffffff" : "#6f665e",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Table size={14} />
              Ledger Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: 700,
                background: viewMode === "grid" ? "#6B0F24" : "transparent",
                color: viewMode === "grid" ? "#ffffff" : "#6f665e",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <LayoutGrid size={14} />
              Cards
            </button>
          </div>
          <Link href="/dashboard/checkout" className={styles.backBtn}>
            <Cpu size={16} /> Checkout Desk
          </Link>
        </div>
      </div>

      {/* Stock Depletion Warning Banner */}
      {lowStockItems.length > 0 && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <AlertTriangle size={20} color="#9c6f18" />
            <div>
              <strong style={{ color: "#9c6f18", fontSize: "0.92rem" }}>
                Stock Depletion Warning: {lowStockItems.length} component(s) at or below minimum threshold
              </strong>
              <div style={{ fontSize: "0.8rem", color: "#6f665e" }}>
                {lowStockItems.map((i) => `${i.name} (${i.quantity} left)`).slice(0, 5).join(" • ")}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory("Low Stock Alerts")}
            style={{
              padding: "0.45rem 0.85rem",
              background: "#9c6f18",
              color: "#f7f5f1",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.78rem",
            }}
          >
            Filter Depleted Stock
          </button>
        </div>
      )}

      {canEditStore && showMobileAdd && (
        <div className={`glass-panel ${styles.formCard} ${styles.mobileAddForm}`} style={{ marginBottom: "2rem" }}>
          <h2 className={styles.formTitle}>Add New Component</h2>
          <form onSubmit={handleAddPart}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Part Name *</label>
              <input
                type="text"
                required
                value={newPartName}
                onChange={(e) => setNewPartName(e.target.value)}
                className={styles.formInput}
                placeholder="e.g. STM32F411 BlackPill / VL53L0X ToF"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <select
                value={newPartCategory}
                onChange={(e) => setNewPartCategory(e.target.value)}
                className={styles.formInput}
              >
                {STANDARD_INVENTORY_CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: "#ffffff" }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <div>
                <label className={styles.formLabel}>Price (৳)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newPartPrice}
                  onChange={(e) => setNewPartPrice(parseFloat(e.target.value) || 0)}
                  className={styles.formInput}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPartQty}
                  onChange={(e) => setNewPartQty(parseInt(e.target.value) || 1)}
                  className={styles.formInput}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Min Alert</label>
                <input
                  type="number"
                  min="1"
                  value={newPartThreshold}
                  onChange={(e) => setNewPartThreshold(parseInt(e.target.value) || 3)}
                  className={styles.formInput}
                />
              </div>
            </div>
            <button type="submit" disabled={isAddingPart} className={styles.submitBtn}>
              {isAddingPart ? "Adding..." : "Add to Ledger"}
            </button>
          </form>
        </div>
      )}

      <div className={canEditStore && showMobileAdd ? styles.layoutGridWithAdmin : styles.layoutGrid}>
        <div>
          {/* Search & Category Pills */}
          <div className={`glass-panel ${styles.filterCard}`}>
            <input
              type="text"
              placeholder="Search components by name, model, or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.categoryScroll}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.categoryPill} ${
                    selectedCategory === cat
                      ? styles.categoryPillActive
                      : styles.categoryPillInactive
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredInventory.length === 0 ? (
            <div className={`glass-panel ${styles.emptyState}`}>
              No components found matching your selection.
            </div>
          ) : viewMode === "ledger" ? (
            /* TABULATED COMPONENT LEDGER VIEW */
            <div
              className="glass-panel"
              style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #f4f1eb" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: "0.86rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f4f1eb",
                      borderBottom: "1px solid #dfd7cc",
                      color: "#6f665e",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                    }}
                  >
                    <th style={{ padding: "0.9rem 1rem" }}>Component &amp; Specs</th>
                    <th style={{ padding: "0.9rem 1rem" }}>Category</th>
                    <th style={{ padding: "0.9rem 1rem" }}>In Stock</th>
                    <th style={{ padding: "0.9rem 1rem" }}>Unit Price</th>
                    <th style={{ padding: "0.9rem 1rem" }}>Status / Requisition</th>
                    {canEditStore && <th style={{ padding: "0.9rem 1rem" }}>Stock Controls</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const isLow = item.quantity <= item.minThreshold;
                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          background: isLow ? "rgba(239, 68, 68, 0.05)" : "transparent",
                        }}
                      >
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <div style={{ fontWeight: 700, color: "#27211d", fontSize: "0.94rem" }}>
                            {item.name}
                          </div>
                          {item.specs && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#6f665e",
                                fontFamily: "var(--font-mono)",
                                marginTop: "0.15rem",
                              }}
                            >
                              {item.specs}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.55rem",
                              borderRadius: "6px",
                              background: "rgba(245, 184, 0, 0.12)",
                              color: "#9c6f18",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                            }}
                          >
                            {normalizeCat(item.category)}
                          </span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: 800,
                              color: isLow ? "#EF4444" : "#10B981",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <span style={{ fontSize: "0.74rem", color: "#6f665e", marginLeft: 4 }}>
                            (min {item.minThreshold})
                          </span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem", fontFamily: "var(--font-mono)" }}>
                          {item.price ? (
                            <span>
                              <span style={{ marginRight: "0.2rem" }}>৳</span>
                              {item.price.toLocaleString()}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          {isLow ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <span
                                style={{
                                  padding: "0.2rem 0.5rem",
                                  borderRadius: "999px",
                                  background: "rgba(239, 68, 68, 0.18)",
                                  color: "#EF4444",
                                  fontSize: "0.7rem",
                                  fontWeight: 800,
                                }}
                              >
                                LOW STOCK
                              </span>
                              <button
                                onClick={() => handleLogPurchaseRequisition(item)}
                                style={{
                                  padding: "0.28rem 0.6rem",
                                  borderRadius: "6px",
                                  background: "rgba(245, 184, 0, 0.18)",
                                  color: "#9c6f18",
                                  border: "1px solid rgba(245, 184, 0, 0.4)",
                                  fontSize: "0.72rem",
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                }}
                                title="Log purchase requisition to Treasury & Requests Queue"
                              >
                                <ShoppingCart size={12} />
                                Requisition
                              </button>
                            </div>
                          ) : (
                            <span
                              style={{
                                padding: "0.2rem 0.55rem",
                                borderRadius: "999px",
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#10B981",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                              }}
                            >
                              ✓ Healthy
                            </span>
                          )}
                        </td>
                        {canEditStore && (
                          <td style={{ padding: "0.9rem 1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, -1, item.quantity)}
                                className={styles.stepperBtn}
                                style={{ width: 30, height: 30 }}
                              >
                                <Minus size={14} />
                              </button>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, 1, item.quantity)}
                                className={styles.stepperBtn}
                                style={{ width: 30, height: 30 }}
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                onClick={() => handleDeletePart(item.id)}
                                className={styles.deleteBtn}
                                style={{ padding: "0.35rem 0.6rem", fontSize: "0.74rem" }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* GRID CATALOG CARDS VIEW */
            <div className={styles.inventoryGrid}>
              {filteredInventory.map((item) => {
                const isLow = item.quantity <= item.minThreshold;
                return (
                  <div
                    key={item.id}
                    className={`glass-panel ${styles.partCard}`}
                    style={{
                      borderLeftColor: isLow ? "#EF4444" : "var(--accent-primary)",
                    }}
                  >
                    <div>
                      <div className={styles.partCategory}>
                        {normalizeCat(item.category)}
                      </div>
                      <h3 className={styles.partName}>{item.name}</h3>
                      {item.specs && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#6f665e",
                            fontFamily: "var(--font-mono)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {item.specs}
                        </div>
                      )}
                      <div
                        className={styles.partQuantity}
                        style={{ color: isLow ? "#EF4444" : "#27211d" }}
                      >
                        {item.quantity}{" "}
                        <span className={styles.quantitySub}>in stock</span>
                      </div>
                      <div className={styles.partPrice}>
                        {item.price ? (
                          <span>
                            <span style={{ marginRight: "0.2rem" }}>৳</span>
                            {item.price.toLocaleString()} / unit
                          </span>
                        ) : (
                          "Price not set"
                        )}
                      </div>
                      {isLow && (
                        <button
                          onClick={() => handleLogPurchaseRequisition(item)}
                          style={{
                            marginTop: "0.65rem",
                            width: "100%",
                            padding: "0.45rem",
                            borderRadius: "6px",
                            background: "rgba(245, 158, 11, 0.18)",
                            color: "#9c6f18",
                            border: "1px solid rgba(245, 184, 0, 0.4)",
                            fontSize: "0.76rem",
                            fontWeight: 700,
                          }}
                        >
                          ⚠️ Low Stock — Log Purchase Requisition
                        </button>
                      )}
                    </div>

                    {canEditStore && (
                      <div className={styles.controlArea}>
                        <div className={styles.stepperGroup}>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, -1, item.quantity)
                            }
                            className={styles.stepperBtn}
                            aria-label="Decrease stock"
                          >
                            <Minus size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, 1, item.quantity)
                            }
                            className={styles.stepperBtn}
                            aria-label="Increase stock"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeletePart(item.id)}
                          className={styles.deleteBtn}
                          aria-label="Delete item"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* The detailed add form is revealed only when it is needed. */}
        {canEditStore && showMobileAdd && (
          <div className={styles.adminFormContainer}>
            <div id="add-component-form" className={`glass-panel ${styles.formCard}`}>
              <h2 className={styles.formTitle}>Add Component to Ledger</h2>
              <form onSubmit={handleAddPart}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Component Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    className={styles.formInput}
                    placeholder="e.g. Arduino Uno R3 / TB6612FNG"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value)}
                    className={styles.formInput}
                  >
                    {STANDARD_INVENTORY_CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: "#ffffff" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Technical Specs / Voltage Note</label>
                  <input
                    type="text"
                    value={newPartSpecs}
                    onChange={(e) => setNewPartSpecs(e.target.value)}
                    className={styles.formInput}
                    placeholder="e.g. 3.3V-5V Logic • I2C Addr 0x29"
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.65rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <label className={styles.formLabel}>Price (৳)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newPartPrice}
                      onChange={(e) =>
                        setNewPartPrice(parseFloat(e.target.value) || 0)
                      }
                      className={styles.formInput}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPartQty}
                      onChange={(e) =>
                        setNewPartQty(parseInt(e.target.value) || 1)
                      }
                      className={styles.formInput}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Min Alert</label>
                    <input
                      type="number"
                      min="1"
                      value={newPartThreshold}
                      onChange={(e) =>
                        setNewPartThreshold(parseInt(e.target.value) || 3)
                      }
                      className={styles.formInput}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isAddingPart}
                  className={styles.submitBtn}
                >
                  {isAddingPart ? "Adding..." : "Add to Component Ledger"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Quick Part Request Modal */}
      {showRequestModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => setShowRequestModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              background: "var(--bg-primary, #ffffff)",
              border: "1px solid var(--border-subtle, #dfd7cc)",
              borderRadius: "14px",
              padding: "1.75rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Request Lab Hardware
              </h3>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Submit a component or sensor needed for your robot build. It will be added to the Lab Requisitions queue.
            </p>
            <form onSubmit={handleQuickRequest} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                  Component Name / Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ESP32-CAM / MPU6050 Gyro / SG90 Servo"
                  value={reqPartName}
                  onChange={(e) => setReqPartName(e.target.value)}
                  className={styles.formInput}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
                  Project or Purpose *
                </label>
                <textarea
                  required
                  placeholder="e.g. Needed for FIRSO Mega Sumo sensor array"
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className={styles.formInput}
                  style={{ minHeight: "80px", resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle, #dfd7cc)",
                    background: "var(--bg-secondary, #ffffff)",
                    color: "var(--text-secondary)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReq}
                  className={styles.submitBtn}
                  style={{ flex: 1 }}
                >
                  {isSubmittingReq ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
