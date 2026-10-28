"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import styles from "./bom.module.css";
import { STANDARD_INVENTORY_CATEGORIES } from "@/lib/portalRelations";
import {
  Pencil,
  Trash2,
  Send,
  Plus,
  X,
  Package,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface BOMItem {
  id: string;
  itemId?: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  totalCost: number;
  source: string;
  status: "Needed" | "Requested" | "Approved" | "In Stock" | "Cancelled" | string;
  expectedArrivalDate?: string;
}

export default function BOMDashboard() {
  const { user, role } = useAuth();

  const [projects, setProjects] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // New Project Form
  const [newProjectName, setNewProjectName] = useState("");
  const [isProjectCreateOpen, setIsProjectCreateOpen] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);

  // Add Item to BOM Form (Custom or Inventory)
  const [addMode, setAddMode] = useState<"custom" | "inventory">("custom");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Microcontrollers");
  const [customPrice, setCustomPrice] = useState(0);
  const [customSource, setCustomSource] = useState("RoboShop BD");
  const [quantity, setQuantity] = useState(1);

  // Edit Item Modal State
  const [editingItem, setEditingItem] = useState<BOMItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Microcontrollers");
  const [editSource, setEditSource] = useState("Daraz");
  const [editPrice, setEditPrice] = useState(0);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editStatus, setEditStatus] = useState("Needed");

  // Requisition Modal State
  const [isRequisitionOpen, setIsRequisitionOpen] = useState(false);
  const [requisitionNotes, setRequisitionNotes] = useState("");
  const [isSubmittingRequisition, setIsSubmittingRequisition] = useState(false);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setProjects(items);
      if (items.length > 0 && !selectedProjectId) {
        setSelectedProjectId(items[0].id);
      }
    });

    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
        price: (d.data() as any).price || 150,
      }));
      setInventory(items);
    });

    return () => {
      unsubProjects();
      unsubInventory();
    };
  }, [selectedProjectId]);

  const activeProject = projects.find((p) => p.id === selectedProjectId);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const docRef = await addDoc(collection(db, "projects"), {
      name: newProjectName.trim(),
      bom: [],
    });
    setNewProjectName("");
    setSelectedProjectId(docRef.id);
    setIsProjectCreateOpen(false);
  };

  const handleAddItemToBOM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || quantity < 1) return;

    let newItem: BOMItem | null = null;

    if (addMode === "inventory") {
      const item = inventory.find((i) => i.id === selectedItemId);
      if (!item) return;
      newItem = {
        id: Date.now().toString(),
        itemId: item.id,
        name: item.name,
        category: item.category || "General",
        price: Number(item.price) || 0,
        quantity: Number(quantity) || 1,
        totalCost: (Number(item.price) || 0) * (Number(quantity) || 1),
        source: "Lab Inventory",
        status: "In Stock",
      };
    } else {
      if (!customName.trim() || customPrice < 0) return;
      newItem = {
        id: Date.now().toString(),
        name: customName.trim(),
        category: customCategory || "General",
        price: Number(customPrice) || 0,
        quantity: Number(quantity) || 1,
        totalCost: (Number(customPrice) || 0) * (Number(quantity) || 1),
        source: customSource,
        status: "Needed",
      };
    }

    if (newItem && activeProject) {
      const currentBOM: BOMItem[] = Array.isArray(activeProject.bom) ? [...activeProject.bom] : [];
      currentBOM.push(newItem);
      await updateDoc(doc(db, "projects", selectedProjectId), {
        bom: currentBOM,
      });
    }

    // Reset form
    setCustomName("");
    setCustomPrice(0);
    setSelectedItemId("");
    setQuantity(1);
    setIsItemFormOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: BOMItem) => {
    setEditingItem(item);
    setEditName(item.name || "");
    setEditCategory(item.category || "Microcontrollers");
    setEditSource(item.source || "Daraz");
    setEditPrice(Number(item.price) || 0);
    setEditQuantity(Number(item.quantity) || 1);
    setEditStatus(item.status || "Needed");
  };

  // Save Edited Item
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !activeProject) return;

    const currentBOM: BOMItem[] = Array.isArray(activeProject.bom) ? [...activeProject.bom] : [];
    const updatedBOM = currentBOM.map((item) => {
      if (item.id === editingItem.id) {
        const p = Number(editPrice) || 0;
        const q = Number(editQuantity) || 1;
        return {
          ...item,
          name: editName.trim(),
          category: editCategory,
          source: editSource,
          price: p,
          quantity: q,
          totalCost: p * q,
          status: editStatus,
        };
      }
      return item;
    });

    await updateDoc(doc(db, "projects", selectedProjectId), {
      bom: updatedBOM,
    });
    setEditingItem(null);
  };

  // Delete Item from BOM
  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Remove "${itemName}" from this project's BOM?`)) return;
    if (!activeProject) return;

    const currentBOM: BOMItem[] = Array.isArray(activeProject.bom) ? [...activeProject.bom] : [];
    const updatedBOM = currentBOM.filter((item) => item.id !== itemId);

    await updateDoc(doc(db, "projects", selectedProjectId), {
      bom: updatedBOM,
    });
  };

  // Items needing procurement (status is Needed and not already from Lab Inventory)
  const neededItems = useMemo(() => {
    if (!activeProject?.bom) return [];
    return activeProject.bom.filter(
      (b: BOMItem) => b.status === "Needed" && b.source !== "Lab Inventory"
    );
  }, [activeProject]);

  const totalProjectCost =
    activeProject?.bom?.reduce((acc: number, item: any) => acc + (Number(item.totalCost) || 0), 0) || 0;

  // New Funds Needed: all items that are NOT yet "In Stock"
  const neededCost =
    activeProject?.bom
      ?.filter((b: any) => b.status !== "In Stock")
      .reduce((acc: number, item: any) => acc + (Number(item.totalCost) || 0), 0) || 0;

  // Submit Requisition to Admin
  const handleSubmitRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || neededItems.length === 0) return;

    setIsSubmittingRequisition(true);
    try {
      const itemsToRequest = neededItems.map((item: BOMItem) => ({
        id: item.id || Date.now().toString(),
        name: item.name,
        category: item.category || "General",
        source: item.source || "Local Market",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        totalCost: (Number(item.price) || 0) * (Number(item.quantity) || 1),
        status: "Needed",
      }));

      const reqTotal = itemsToRequest.reduce(
        (sum: number, i: any) => sum + i.totalCost,
        0
      );

      // Add to partRequests collection
      await addDoc(collection(db, "partRequests"), {
        type: "bom_procurement",
        projectId: activeProject.id,
        projectName: activeProject.name,
        items: itemsToRequest,
        itemsCount: itemsToRequest.length,
        totalCost: reqTotal,
        notes: requisitionNotes.trim() || null,
        requestedBy: user?.displayName || user?.email || "Team Member",
        requestedByEmail: user?.email || "",
        requestedByUid: user?.uid || "",
        requestedAt: new Date().toISOString(),
        status: "pending",
      });

      // Update BOM items in this project to "Requested"
      const currentBOM: BOMItem[] = Array.isArray(activeProject.bom) ? [...activeProject.bom] : [];
      const updatedBOM = currentBOM.map((item) => {
        const isRequested = itemsToRequest.some((reqItem: any) => reqItem.id === item.id);
        if (isRequested) {
          return { ...item, status: "Requested" };
        }
        return item;
      });

      await updateDoc(doc(db, "projects", activeProject.id), {
        bom: updatedBOM,
      });

      alert(
        `Procurement request for ${itemsToRequest.length} part(s) has been submitted to Admin!`
      );
      setIsRequisitionOpen(false);
      setRequisitionNotes("");
    } catch (err) {
      console.error("Error submitting requisition:", err);
      alert("Failed to submit requisition. Please try again.");
    } finally {
      setIsSubmittingRequisition(false);
    }
  };

  const renderStatusBadge = (status: string, expectedArrivalDate?: string) => {
    if (status === "In Stock") {
      return (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            background: "rgba(16, 185, 129, 0.14)",
            color: "#065f46",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <CheckCircle size={12} />
          In Stock
        </span>
      );
    }

    if (status === "Requested") {
      return (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            background: "rgba(245, 158, 11, 0.14)",
            color: "#b45309",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <Clock size={12} />
          Requested (Pending Admin)
        </span>
      );
    }

    if (status === "Approved") {
      return (
        <span
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            background: "rgba(37, 99, 235, 0.14)",
            color: "#1d4ed8",
            border: "1px solid rgba(37, 99, 235, 0.35)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <Calendar size={12} />
          Approved {expectedArrivalDate ? `• Arriving ${expectedArrivalDate}` : "• Order Placed"}
        </span>
      );
    }

    // Default "Needed" or other
    return (
      <span
        style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "20px",
          fontSize: "0.78rem",
          fontWeight: 700,
          background: "rgba(239, 68, 68, 0.14)",
          color: "#dc2626",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
        }}
      >
        <AlertCircle size={12} />
        {status || "Needed"}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Project Budgets & BOM</h1>
        <p>Plan robot builds, track required purchases, and estimate total competition costs.</p>
      </div>

      <div
        className={styles.panel}
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "240px" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
            Select Project
          </label>
          <select
            className={styles.select}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.title || "Untitled Project"}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles.btn}
          style={{ width: "auto" }}
          onClick={() => setIsProjectCreateOpen((open) => !open)}
          aria-expanded={isProjectCreateOpen}
        >
          {isProjectCreateOpen ? "Close Form" : "New Project"}
        </button>

        {isProjectCreateOpen && (
          <form
            onSubmit={handleCreateProject}
            style={{ display: "flex", gap: "1rem", flex: "1 1 360px" }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
                Create New Project
              </label>
              <input
                className={styles.input}
                style={{ marginBottom: 0 }}
                placeholder="e.g. RoboCup 2026 Build"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={styles.btn}
              style={{ width: "auto", whiteSpace: "nowrap" }}
            >
              Create
            </button>
          </form>
        )}
      </div>

      {activeProject ? (
        <div className={styles.panels}>
          <div style={{ gridColumn: "span 2" }}>
            <div className={styles.panel}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h2
                    className={styles.sectionTitle}
                    style={{ marginBottom: "0.25rem", color: "#27211d" }}
                  >
                    {activeProject.name || activeProject.title} - Bill of Materials
                  </h2>
                  <div style={{ fontSize: "0.85rem", color: "#6f665e" }}>
                    {activeProject.bom?.length || 0} total part(s) listed for this robot build.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: "800",
                        color: "var(--brand-burgundy, #84243a)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Total Est: <span style={{ marginRight: "0.2rem" }}>৳</span>
                      {totalProjectCost.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: neededCost > 0 ? "#dc2626" : "#059669",
                        fontWeight: "700",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {neededCost > 0 ? (
                        <>New Funds Needed: <span style={{ marginRight: "0.2rem" }}>৳</span>{neededCost.toLocaleString()}</>
                      ) : (
                        "✓ 100% Fully Stocked"
                      )}
                    </div>
                  </div>

                  {neededItems.length > 0 && (
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={() => setIsRequisitionOpen(true)}
                      title="Send needed parts list to Admin for procurement"
                    >
                      <Send size={15} />
                      Request Parts from Admin ({neededItems.length})
                    </button>
                  )}
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  className={styles.table}
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    color: "#27211d",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle, #dfd7cc)" }}>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem" }}>
                        Part Name
                      </th>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem" }}>
                        Category
                      </th>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem" }}>
                        Source
                      </th>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem" }}>
                        Unit Cost
                      </th>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem" }}>
                        Qty
                      </th>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem" }}>
                        Total Cost
                      </th>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem" }}>
                        Status
                      </th>
                      <th style={{ padding: "1rem", color: "#6f665e", fontWeight: 700, fontSize: "0.88rem", textAlign: "right" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProject.bom?.length > 0 ? (
                      activeProject.bom.map((b: any, idx: number) => (
                        <tr
                          key={b.id || idx}
                          style={{ borderBottom: "1px solid var(--border-subtle, #dfd7cc)" }}
                        >
                          <td
                            className={styles.partName}
                            style={{ padding: "1rem", fontWeight: "bold", color: "#27211d" }}
                          >
                            {b.name}
                          </td>
                          <td style={{ padding: "1rem", color: "#6f665e", fontSize: "0.85rem" }}>
                            <span
                              style={{
                                background: "rgba(0, 0, 0, 0.04)",
                                padding: "0.2rem 0.55rem",
                                borderRadius: "4px",
                                border: "1px solid var(--border-subtle, #dfd7cc)",
                              }}
                            >
                              {b.category || "General"}
                            </span>
                          </td>
                          <td
                            className={styles.partSource}
                            style={{ padding: "1rem", color: "#6f665e" }}
                          >
                            {b.source}
                          </td>
                          <td
                            className={styles.partPrice}
                            style={{ padding: "1rem", fontFamily: "var(--font-mono)", color: "#27211d" }}
                          >
                            <span style={{ marginRight: "0.2rem" }}>৳</span>
                            {(Number(b.price) || 0).toLocaleString()}
                          </td>
                          <td
                            className={styles.partQty}
                            style={{ padding: "1rem", color: "#27211d", fontWeight: 600 }}
                          >
                            {b.quantity}
                          </td>
                          <td
                            style={{
                              padding: "1rem",
                              color: "var(--brand-burgundy, #84243a)",
                              fontWeight: "700",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            <span style={{ marginRight: "0.2rem" }}>৳</span>
                            {(Number(b.totalCost) || (Number(b.price) || 0) * (Number(b.quantity) || 1)).toLocaleString()}
                          </td>
                          <td style={{ padding: "1rem" }}>
                            {renderStatusBadge(b.status, b.expectedArrivalDate)}
                          </td>
                          <td style={{ padding: "1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                            <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                              <button
                                type="button"
                                className={`${styles.actionBtn} ${styles.editBtn}`}
                                onClick={() => handleOpenEdit(b)}
                                title="Edit Part details"
                              >
                                <Pencil size={13} />
                                Edit
                              </button>
                              <button
                                type="button"
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                onClick={() => handleDeleteItem(b.id, b.name)}
                                title="Delete Part from BOM"
                              >
                                <Trash2 size={13} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          style={{ padding: "2.5rem", textAlign: "center", color: "#6f665e" }}
                        >
                          No items added to this project&apos;s BOM yet. Use the form below to add components.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <div className={styles.bomActionHeader}>
              <h2 className={styles.sectionTitle} style={{ color: "#27211d" }}>
                Add Part to BOM
              </h2>
              <button
                type="button"
                className={styles.btn}
                style={{ width: "auto" }}
                onClick={() => setIsItemFormOpen((open) => !open)}
                aria-expanded={isItemFormOpen}
                aria-controls="bom-item-form"
              >
                {isItemFormOpen ? "Close Form" : "+ Add Component"}
              </button>
            </div>

            {isItemFormOpen && (
              <div id="bom-item-form" className={styles.panel} style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAddMode("custom")}
                    className={styles.btn}
                    style={{
                      background: addMode === "custom" ? "var(--accent-primary)" : "var(--bg-elevated)",
                      color: addMode === "custom" ? "#fff" : "#27211d",
                      width: "auto",
                      border: addMode === "custom" ? "none" : "1px solid var(--border-subtle)",
                    }}
                  >
                    Add Custom Part (To Procure)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMode("inventory")}
                    className={styles.btn}
                    style={{
                      background: addMode === "inventory" ? "var(--accent-primary)" : "var(--bg-elevated)",
                      color: addMode === "inventory" ? "#fff" : "#27211d",
                      width: "auto",
                      border: addMode === "inventory" ? "none" : "1px solid var(--border-subtle)",
                    }}
                  >
                    Add from Lab Inventory (In Stock)
                  </button>
                </div>

                <form
                  onSubmit={handleAddItemToBOM}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    alignItems: "end",
                  }}
                >
                  {addMode === "inventory" ? (
                    <div className={styles.formGroup} style={{ marginBottom: 0, gridColumn: "span 2" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          color: "#6f665e",
                          fontWeight: 600,
                        }}
                      >
                        Select Part from Inventory
                      </label>
                      <select
                        className={styles.select}
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        required
                        style={{ color: "#27211d" }}
                      >
                        <option value="">-- Choose In-Stock Component --</option>
                        {inventory.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} [{i.category || "General"}] (Qty: {i.quantity} in lab • Est. ৳{i.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            color: "#6f665e",
                            fontWeight: 600,
                          }}
                        >
                          Part Name
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          style={{ marginBottom: 0, color: "#27211d" }}
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          required
                          placeholder="e.g. ESP32-WROOM-32D"
                        />
                      </div>

                      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            color: "#6f665e",
                            fontWeight: 600,
                          }}
                        >
                          Category
                        </label>
                        <select
                          className={styles.select}
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          style={{ color: "#27211d" }}
                        >
                          {STANDARD_INVENTORY_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            color: "#6f665e",
                            fontWeight: 600,
                          }}
                        >
                          Est. Unit Cost (৳)
                        </label>
                        <input
                          type="number"
                          className={styles.input}
                          style={{ marginBottom: 0, color: "#27211d" }}
                          min="0"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>

                      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            color: "#6f665e",
                            fontWeight: 600,
                          }}
                        >
                          Vendor / Source
                        </label>
                        <select
                          className={styles.select}
                          value={customSource}
                          onChange={(e) => setCustomSource(e.target.value)}
                          style={{ color: "#27211d" }}
                        >
                          <option value="RoboShop BD">RoboShop BD</option>
                          <option value="TechShop BD">TechShop BD</option>
                          <option value="Daraz">Daraz</option>
                          <option value="AliExpress">AliExpress</option>
                          <option value="Local Market (Patuatuli / Stadium)">Local Market (Patuatuli / Stadium)</option>
                          <option value="Direct Supplier">Direct Supplier</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        color: "#6f665e",
                        fontWeight: 600,
                      }}
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      className={styles.input}
                      style={{ marginBottom: 0, color: "#27211d" }}
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <button type="submit" className={styles.btn} style={{ height: "46px" }}>
                    Add to BOM
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6f665e" }}>
          Select or create a project to start planning the budget.
        </div>
      )}

      {/* EDIT BOM ITEM MODAL */}
      {editingItem && (
        <div className={styles.modalOverlay} onClick={() => setEditingItem(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Component: {editingItem.name}</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setEditingItem(null)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className={styles.modalBody}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Part Name
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    style={{ color: "#27211d" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                      Category
                    </label>
                    <select
                      className={styles.select}
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      style={{ color: "#27211d" }}
                    >
                      {STANDARD_INVENTORY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                      Vendor / Source
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      required
                      style={{ color: "#27211d" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                      Unit Cost (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                      required
                      style={{ color: "#27211d" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={styles.input}
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                      required
                      style={{ color: "#27211d" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Status
                  </label>
                  <select
                    className={styles.select}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ color: "#27211d" }}
                  >
                    <option value="Needed">Needed (To Procure)</option>
                    <option value="Requested">Requested (Pending Admin)</option>
                    <option value="Approved">Approved (In Procurement)</option>
                    <option value="In Stock">In Stock (Available in Lab)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(132, 36, 58, 0.06)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                  }}
                >
                  <span style={{ color: "#6f665e" }}>Total Calculated Cost:</span>
                  <span style={{ color: "#84243a", fontFamily: "var(--font-mono)" }}>
                    ৳{(editPrice * editQuantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btn}
                  style={{ width: "auto" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND REQUISITION TO ADMIN MODAL */}
      {isRequisitionOpen && activeProject && (
        <div className={styles.modalOverlay} onClick={() => setIsRequisitionOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Submit Parts Requisition</h3>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#6f665e" }}>
                  Project: <strong>{activeProject.name}</strong>
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsRequisitionOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequisition}>
              <div className={styles.modalBody}>
                <p style={{ fontSize: "0.9rem", color: "#6f665e", margin: 0 }}>
                  The following <strong>{neededItems.length}</strong> part(s) are currently needed and not in lab storage. They will be submitted to the Admin Parts Queue for review, approval, and procurement.
                </p>

                <div
                  style={{
                    maxHeight: "220px",
                    overflowY: "auto",
                    border: "1px solid var(--border-subtle, #dfd7cc)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                    <thead style={{ background: "rgba(0,0,0,0.03)" }}>
                      <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "left", color: "#6f665e" }}>Part</th>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "left", color: "#6f665e" }}>Category</th>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "center", color: "#6f665e" }}>Qty</th>
                        <th style={{ padding: "0.6rem 0.8rem", textAlign: "right", color: "#6f665e" }}>Est. Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {neededItems.map((item: BOMItem, i: number) => (
                        <tr key={item.id || i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <td style={{ padding: "0.6rem 0.8rem", fontWeight: 600 }}>{item.name}</td>
                          <td style={{ padding: "0.6rem 0.8rem", color: "#6f665e" }}>{item.category || "General"}</td>
                          <td style={{ padding: "0.6rem 0.8rem", textAlign: "center" }}>{item.quantity}</td>
                          <td style={{ padding: "0.6rem 0.8rem", textAlign: "right", fontWeight: 700, color: "#84243a" }}>
                            ৳{((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.85rem 1rem",
                    background: "rgba(132, 36, 58, 0.08)",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 700,
                  }}
                >
                  <span style={{ color: "#27211d" }}>Total Requisition Amount:</span>
                  <span style={{ color: "#84243a", fontSize: "1.1rem", fontFamily: "var(--font-mono)" }}>
                    ৳{neededItems.reduce((sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Requisition Notes / Urgency (Optional)
                  </label>
                  <textarea
                    className={styles.input}
                    style={{ minHeight: "70px", resize: "vertical", color: "#27211d" }}
                    placeholder="e.g. Critical components needed before next Friday's sprint assembly."
                    value={requisitionNotes}
                    onChange={(e) => setRequisitionNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsRequisitionOpen(false)}
                  disabled={isSubmittingRequisition}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btn}
                  style={{ width: "auto" }}
                  disabled={isSubmittingRequisition}
                >
                  {isSubmittingRequisition ? "Sending Request..." : "Confirm & Send to Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
