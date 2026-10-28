"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import styles from "./requests.module.css";
import {
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  AlertCircle,
  X,
  Camera,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Receipt,
  Layers,
} from "lucide-react";
import { RelationalInventoryItem, normalizeInventoryItem } from "@/lib/portalRelations";

interface PartRequestItem {
  id: string;
  name: string;
  category?: string;
  source?: string;
  price: number;
  quantity: number;
  totalCost: number;
  status?: string;
}

interface PartRequestDoc {
  id: string;
  type?: "bom_procurement" | string;
  projectId?: string;
  projectName?: string;
  items?: PartRequestItem[];
  itemsCount?: number;
  totalCost?: number;
  partName?: string; // legacy single
  reason?: string; // legacy single
  notes?: string;
  requestedBy: string;
  requestedByEmail?: string;
  requestedByUid?: string;
  requestedAt?: any;
  status: "pending" | "approved" | "completed" | "rejected" | string;
  expectedArrivalDate?: string;
  receivedAt?: string;
  receiptUrl?: string;
  actualTotalCost?: number;
}

export default function AdminPartRequestsPage() {
  const { user, role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_store");

  const [requests, setRequests] = useState<PartRequestDoc[]>([]);
  const [inventory, setInventory] = useState<RelationalInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Approval Modal State
  const [approvingReq, setApprovingReq] = useState<PartRequestDoc | null>(null);
  const [approvalDate, setApprovalDate] = useState("");
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  // Arrival / Stocking Modal State
  const [arrivingReq, setArrivingReq] = useState<PartRequestDoc | null>(null);
  const [receivedChecklist, setReceivedChecklist] = useState<
    Array<{
      id: string;
      name: string;
      category: string;
      source: string;
      unitPrice: number;
      quantity: number;
      isReceived: boolean;
    }>
  >([]);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [actualTotalSpent, setActualTotalSpent] = useState<number>(0);
  const [isSubmittingArrival, setIsSubmittingArrival] = useState(false);

  // Receipt Preview Modal
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!canAccess) return;

    const q = query(collection(db, "partRequests"), orderBy("requestedAt", "desc"));
    const unsubscribeReq = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setRequests(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching partRequests:", error);
        setLoading(false);
      }
    );

    const unsubscribeInv = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((d) =>
        normalizeInventoryItem({ id: d.id, ...d.data() })
      );
      setInventory(items);
    });

    return () => {
      unsubscribeReq();
      unsubscribeInv();
    };
  }, [canAccess]);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. OPEN APPROVAL MODAL
  const handleOpenApproveModal = (req: PartRequestDoc) => {
    setApprovingReq(req);
    // default date: 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setApprovalDate(d.toISOString().split("T")[0]);
  };

  // 2. SUBMIT APPROVAL
  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingReq) return;

    setIsSubmittingApproval(true);
    try {
      // Update partRequests document
      await updateDoc(doc(db, "partRequests", approvingReq.id), {
        status: "approved",
        expectedArrivalDate: approvalDate || null,
        approvedBy: user?.displayName || user?.email || "Admin",
        approvedAt: new Date().toISOString(),
      });

      // If tied to a project BOM, update project items
      if (approvingReq.projectId && approvingReq.items) {
        const projRef = doc(db, "projects", approvingReq.projectId);
        const projSnap = await getDoc(projRef);

        if (projSnap.exists()) {
          const projData = projSnap.data();
          const currentBOM = Array.isArray(projData.bom) ? [...projData.bom] : [];

          const updatedBOM = currentBOM.map((item: any) => {
            const isMatch = approvingReq.items?.some(
              (reqItem) => reqItem.id === item.id || reqItem.name === item.name
            );
            if (isMatch) {
              return {
                ...item,
                status: "Approved",
                expectedArrivalDate: approvalDate || undefined,
              };
            }
            return item;
          });

          await updateDoc(projRef, { bom: updatedBOM });
        }
      }

      alert("Requisition approved! Expected arrival date recorded.");
      setApprovingReq(null);
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request.");
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  // REJECT REQUEST
  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    try {
      await updateDoc(doc(db, "partRequests", id), {
        status: "rejected",
        rejectedBy: user?.displayName || user?.email || "Admin",
        rejectedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request.");
    }
  };

  // DELETE REQUEST
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request record permanently?")) return;
    try {
      await deleteDoc(doc(db, "partRequests", id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete request.");
    }
  };

  // 3. OPEN ARRIVAL / STOCKING MODAL
  const handleOpenArrivalModal = (req: PartRequestDoc) => {
    setArrivingReq(req);
    setReceiptImage(null);

    if (req.items && req.items.length > 0) {
      const initialList = req.items.map((i) => ({
        id: i.id || Date.now().toString(),
        name: i.name,
        category: i.category || "General",
        source: i.source || "Local Market",
        unitPrice: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        isReceived: true,
      }));
      setReceivedChecklist(initialList);
      const total = initialList.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
      setActualTotalSpent(total);
    } else {
      // Legacy single item
      setReceivedChecklist([
        {
          id: req.id,
          name: req.partName || "Component",
          category: "General",
          source: "Direct",
          unitPrice: 0,
          quantity: 1,
          isReceived: true,
        },
      ]);
      setActualTotalSpent(0);
    }
  };

  // Toggle item in arrival checklist
  const handleToggleChecklistItem = (idx: number) => {
    const next = [...receivedChecklist];
    next[idx].isReceived = !next[idx].isReceived;
    setReceivedChecklist(next);

    const newTotal = next
      .filter((it) => it.isReceived)
      .reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    setActualTotalSpent(newTotal);
  };

  // Update unit price or quantity in checklist
  const handleUpdateChecklistField = (
    idx: number,
    field: "unitPrice" | "quantity",
    val: number
  ) => {
    const next = [...receivedChecklist];
    next[idx][field] = val;
    setReceivedChecklist(next);

    const newTotal = next
      .filter((it) => it.isReceived)
      .reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    setActualTotalSpent(newTotal);
  };

  // Handle Receipt Upload with Canvas Compression
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.72);
          setReceiptImage(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // 4. CONFIRM ARRIVAL, AUTO-ADD TO STORE & LOG TREASURY EXPENSE
  const handleConfirmArrival = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arrivingReq) return;

    setIsSubmittingArrival(true);
    try {
      const receivedItems = receivedChecklist.filter((it) => it.isReceived);

      // STEP A: Auto-Add / Increment each received part in inventory
      for (const item of receivedItems) {
        const existingInv = inventory.find(
          (inv) => inv.name.trim().toLowerCase() === item.name.trim().toLowerCase()
        );

        if (existingInv) {
          await updateDoc(doc(db, "inventory", existingInv.id), {
            quantity: increment(item.quantity),
            price: item.unitPrice > 0 ? item.unitPrice : existingInv.price,
          });
        } else {
          await addDoc(collection(db, "inventory"), {
            name: item.name.trim(),
            category: item.category || "General",
            price: item.unitPrice,
            quantity: item.quantity,
            minThreshold: 3,
            specs: `Procured for project ${arrivingReq.projectName || "RoboBee"}`,
            locationBin: "Main Lab Rack",
            addedBy: user?.displayName || user?.email || "Admin Requisition",
            addedAt: serverTimestamp(),
          });
        }
      }

      // STEP B: Update Project BOM items to "In Stock" & "Lab Inventory"
      if (arrivingReq.projectId) {
        const projRef = doc(db, "projects", arrivingReq.projectId);
        const projSnap = await getDoc(projRef);

        if (projSnap.exists()) {
          const projData = projSnap.data();
          const currentBOM = Array.isArray(projData.bom) ? [...projData.bom] : [];

          const updatedBOM = currentBOM.map((bItem: any) => {
            const matchReceived = receivedItems.find(
              (rec) => rec.id === bItem.id || rec.name === bItem.name
            );
            if (matchReceived) {
              return {
                ...bItem,
                status: "In Stock",
                source: "Lab Inventory",
                price: matchReceived.unitPrice > 0 ? matchReceived.unitPrice : bItem.price,
                totalCost:
                  (matchReceived.unitPrice > 0 ? matchReceived.unitPrice : bItem.price) *
                  bItem.quantity,
              };
            }
            return bItem;
          });

          await updateDoc(projRef, { bom: updatedBOM });
        }
      }

      // STEP C: Log purchase to Treasury Expenses
      if (actualTotalSpent > 0 || receivedItems.length > 0) {
        await addDoc(collection(db, "treasury_expenses"), {
          title: `Procurement: ${arrivingReq.projectName || arrivingReq.partName || "Parts"}`,
          type: "expense",
          entryType: "expense",
          category: "Lab Requisitions & Sensors",
          amount: Number(actualTotalSpent) || 0,
          projectId: arrivingReq.projectId || null,
          projectName: arrivingReq.projectName || null,
          receiptUrl: receiptImage || null,
          status: "approved",
          submittedByUid: user?.uid || "admin",
          submittedByName: user?.displayName || user?.email || "Admin",
          verifiedBy: user?.email,
          notes: `Arrived at lab. Added ${receivedItems.length} components to store for "${arrivingReq.projectName || "General"}".`,
          date: new Date().toISOString(),
        });
      }

      // STEP D: Update partRequests status to "completed"
      await updateDoc(doc(db, "partRequests", arrivingReq.id), {
        status: "completed",
        receivedAt: new Date().toISOString(),
        receiptUrl: receiptImage || null,
        actualTotalCost: Number(actualTotalSpent) || 0,
      });

      alert(
        `Success! ${receivedItems.length} parts added to Lab Inventory, Project BOM updated to "In Stock", and Treasury Expense logged.`
      );
      setArrivingReq(null);
    } catch (err) {
      console.error("Error confirming arrival:", err);
      alert("Failed to confirm arrival. Please check the console.");
    } finally {
      setIsSubmittingArrival(false);
    }
  };

  const filteredRequests = useMemo(() => {
    if (filterStatus === "all") return requests;
    return requests.filter((r) => r.status === filterStatus);
  }, [requests, filterStatus]);

  if (!canAccess) {
    return (
      <div style={{ color: "#dc2626", padding: "2rem" }}>
        Access Denied. Store Management or Admin privileges required.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Parts Requests & Requisition Queue</h1>
        <p>Review project bills of materials, approve procurement dates, and stock received components into lab storage.</p>
      </div>

      {/* FILTER TABS */}
      <div className={styles.filterBar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterStatus === "all" ? styles.filterBtnActive : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All Requests ({requests.length})
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterStatus === "pending" ? styles.filterBtnActive : ""}`}
          onClick={() => setFilterStatus("pending")}
        >
          Pending Review ({requests.filter((r) => r.status === "pending").length})
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterStatus === "approved" ? styles.filterBtnActive : ""}`}
          onClick={() => setFilterStatus("approved")}
        >
          Approved & In Transit ({requests.filter((r) => r.status === "approved").length})
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filterStatus === "completed" ? styles.filterBtnActive : ""}`}
          onClick={() => setFilterStatus("completed")}
        >
          Arrived & Stored ({requests.filter((r) => r.status === "completed").length})
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#6f665e" }}>Loading parts requests queue...</p>
      ) : filteredRequests.length === 0 ? (
        <div
          className={styles.card}
          style={{ padding: "3rem", textAlign: "center", color: "#6f665e" }}
        >
          No requests found under this filter.
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredRequests.map((req) => {
            const isBOM = req.type === "bom_procurement";
            const isExpanded = !!expandedCards[req.id];
            const itemsCount = req.items?.length || (req.partName ? 1 : 0);

            return (
              <div key={req.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
                      <span className={styles.badgeType}>
                        {isBOM ? "BOM Requisition" : "Quick Request"}
                      </span>
                      {req.expectedArrivalDate && req.status === "approved" && (
                        <span style={{ fontSize: "0.75rem", color: "#1d4ed8", fontWeight: 700 }}>
                          • Arriving: {req.expectedArrivalDate}
                        </span>
                      )}
                    </div>
                    <h3 className={styles.cardTitle}>
                      {isBOM ? req.projectName || "Robot Build" : req.partName}
                    </h3>
                  </div>

                  <span
                    className={`${styles.badge} ${
                      req.status === "pending"
                        ? styles.badgePending
                        : req.status === "approved"
                        ? styles.badgeApproved
                        : req.status === "completed"
                        ? styles.badgeCompleted
                        : styles.badgeRejected
                    }`}
                  >
                    {req.status === "pending" && <Clock size={12} />}
                    {req.status === "approved" && <Calendar size={12} />}
                    {req.status === "completed" && <CheckCircle2 size={12} />}
                    {req.status}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  <div>
                    Requested by:{" "}
                    <strong style={{ color: "var(--accent-primary, #84243a)" }}>
                      {req.requestedBy}
                    </strong>
                  </div>
                  <div>
                    Date:{" "}
                    {req.requestedAt
                      ? new Date(
                          req.requestedAt.seconds
                            ? req.requestedAt.seconds * 1000
                            : req.requestedAt
                        ).toLocaleDateString()
                      : "Recently"}
                  </div>
                  {isBOM && (
                    <div style={{ fontWeight: 700, color: "#27211d", marginTop: "0.2rem" }}>
                      {itemsCount} item(s) • Est: ৳{(req.totalCost || 0).toLocaleString()}
                      {req.actualTotalCost !== undefined && req.status === "completed" && (
                        <span style={{ color: "#059669", marginLeft: "0.5rem" }}>
                          (Actual: ৳{req.actualTotalCost.toLocaleString()})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {req.notes && (
                  <div className={styles.reasonBox}>
                    <strong>Notes:</strong> {req.notes}
                  </div>
                )}

                {req.reason && !req.notes && (
                  <div className={styles.reasonBox}>
                    <strong>Reason:</strong> {req.reason}
                  </div>
                )}

                {/* BOM ITEMS TABLE PREVIEW */}
                {isBOM && req.items && req.items.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleExpand(req.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--accent-primary, #84243a)",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: 0,
                      }}
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      {isExpanded ? "Hide Components List" : `Inspect Components List (${req.items.length})`}
                    </button>

                    {isExpanded && (
                      <div style={{ overflowX: "auto", marginTop: "0.5rem" }}>
                        <table className={styles.partsTable}>
                          <thead>
                            <tr>
                              <th>Part</th>
                              <th>Category</th>
                              <th>Source</th>
                              <th style={{ textAlign: "center" }}>Qty</th>
                              <th style={{ textAlign: "right" }}>Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {req.items.map((item, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 600 }}>{item.name}</td>
                                <td style={{ color: "#6f665e" }}>{item.category || "General"}</td>
                                <td style={{ color: "#6f665e" }}>{item.source || "Market"}</td>
                                <td style={{ textAlign: "center" }}>{item.quantity}</td>
                                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                                  ৳{(item.totalCost || item.price * item.quantity).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* RECEIPT PREVIEW BUTTON IF COMPLETED */}
                {req.receiptUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewReceiptUrl(req.receiptUrl || null)}
                    style={{
                      background: "rgba(132, 36, 58, 0.08)",
                      border: "1px solid rgba(132, 36, 58, 0.25)",
                      color: "#84243a",
                      padding: "0.45rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      width: "fit-content",
                    }}
                  >
                    <Receipt size={14} />
                    View Purchase Receipt
                  </button>
                )}

                {/* CARD ACTIONS */}
                <div className={styles.cardActions}>
                  {req.status === "pending" && (
                    <>
                      <button
                        type="button"
                        className={styles.btnApprove}
                        onClick={() => handleOpenApproveModal(req)}
                      >
                        <Calendar size={14} />
                        Approve & Set Arrival Date
                      </button>
                      <button
                        type="button"
                        className={styles.btnReject}
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {req.status === "approved" && (
                    <button
                      type="button"
                      className={styles.btnArrived}
                      onClick={() => handleOpenArrivalModal(req)}
                    >
                      <Package size={14} />
                      Confirm Arrival & Add to Store
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => handleDelete(req.id)}
                    title="Delete Request"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: APPROVE & SET ARRIVAL DATE */}
      {approvingReq && (
        <div className={styles.modalOverlay} onClick={() => setApprovingReq(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Approve Requisition: {approvingReq.projectName || approvingReq.partName}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setApprovingReq(null)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleConfirmApproval}>
              <div className={styles.modalBody}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6f665e" }}>
                  Approving this requisition confirms that funds are cleared for procurement. Specify the expected date when these components will arrive at the lab.
                </p>

                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e" }}>
                    Expected Lab Arrival Date
                  </label>
                  <input
                    type="date"
                    className={styles.input}
                    value={approvalDate}
                    onChange={(e) => setApprovalDate(e.target.value)}
                    required
                  />
                </div>

                {approvingReq.items && approvingReq.items.length > 0 && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(37, 99, 235, 0.08)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.85rem",
                      color: "#1d4ed8",
                    }}
                  >
                    ✓ All {approvingReq.items.length} BOM components in this project will automatically be marked as <strong>Approved • Arriving {approvalDate}</strong>.
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnReject}
                  onClick={() => setApprovingReq(null)}
                  disabled={isSubmittingApproval}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnApprove}
                  style={{ flex: "none", padding: "0.65rem 1.5rem" }}
                  disabled={isSubmittingApproval}
                >
                  {isSubmittingApproval ? "Approving..." : "Confirm Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM ARRIVAL, AUTO-ADD TO STORE & ATTACH RECEIPT */}
      {arrivingReq && (
        <div className={styles.modalOverlay} onClick={() => setArrivingReq(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Receive Shipment & Stock Store</h3>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#6f665e" }}>
                  Project: <strong>{arrivingReq.projectName || arrivingReq.partName}</strong>
                </p>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setArrivingReq(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmArrival}>
              <div className={styles.modalBody}>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#6f665e" }}>
                  Confirm received items below. All received components will be <strong>automatically added / incremented into the Lab Store</strong> and updated to <strong>&ldquo;In Stock&rdquo;</strong> in the project&apos;s BOM.
                </p>

                {/* CHECKLIST */}
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
                        <th style={{ padding: "0.5rem 0.6rem", textAlign: "center" }}>Recv</th>
                        <th style={{ padding: "0.5rem 0.6rem", textAlign: "left" }}>Part</th>
                        <th style={{ padding: "0.5rem 0.6rem", textAlign: "left" }}>Category</th>
                        <th style={{ padding: "0.5rem 0.6rem", textAlign: "center", width: "70px" }}>Qty</th>
                        <th style={{ padding: "0.5rem 0.6rem", textAlign: "right", width: "95px" }}>Unit Cost (৳)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedChecklist.map((it, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: "1px solid rgba(0,0,0,0.05)",
                            background: it.isReceived ? "transparent" : "rgba(0,0,0,0.02)",
                            opacity: it.isReceived ? 1 : 0.5,
                          }}
                        >
                          <td style={{ textAlign: "center", padding: "0.5rem" }}>
                            <input
                              type="checkbox"
                              checked={it.isReceived}
                              onChange={() => handleToggleChecklistItem(idx)}
                              style={{ width: "16px", height: "16px", cursor: "pointer" }}
                            />
                          </td>
                          <td style={{ padding: "0.5rem", fontWeight: 600 }}>{it.name}</td>
                          <td style={{ padding: "0.5rem", color: "#6f665e" }}>{it.category}</td>
                          <td style={{ padding: "0.5rem", textAlign: "center" }}>
                            <input
                              type="number"
                              min="1"
                              disabled={!it.isReceived}
                              value={it.quantity}
                              onChange={(e) =>
                                handleUpdateChecklistField(
                                  idx,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              style={{
                                width: "55px",
                                padding: "0.25rem",
                                textAlign: "center",
                                borderRadius: "4px",
                                border: "1px solid var(--border-subtle)",
                              }}
                            />
                          </td>
                          <td style={{ padding: "0.5rem", textAlign: "right" }}>
                            <input
                              type="number"
                              min="0"
                              disabled={!it.isReceived}
                              value={it.unitPrice}
                              onChange={(e) =>
                                handleUpdateChecklistField(
                                  idx,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              style={{
                                width: "80px",
                                padding: "0.25rem",
                                textAlign: "right",
                                borderRadius: "4px",
                                border: "1px solid var(--border-subtle)",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TOTAL COST & TREASURY SYNC */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "center" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600, color: "#6f665e", fontSize: "0.85rem" }}>
                      Actual Total Spent (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className={styles.input}
                      value={actualTotalSpent}
                      onChange={(e) => setActualTotalSpent(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      background: "rgba(16, 185, 129, 0.08)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.82rem",
                      color: "#065f46",
                    }}
                  >
                    ✓ Automatically logs an approved expense in <strong>Treasury Ledger</strong> linked to this project.
                  </div>
                </div>

                {/* RECEIPT ATTACHMENT */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#6f665e", fontSize: "0.85rem" }}>
                    Attach Purchase Receipt / Invoice Photo
                  </label>

                  {receiptImage ? (
                    <div className={styles.receiptPreviewContainer}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={receiptImage}
                        alt="Receipt Preview"
                        className={styles.receiptPreviewImg}
                      />
                      <button
                        type="button"
                        className={styles.removeReceiptBtn}
                        onClick={() => setReceiptImage(null)}
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      style={{
                        border: "2px dashed var(--border-subtle, #dfd7cc)",
                        borderRadius: "var(--radius-md)",
                        padding: "1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        background: "rgba(0,0,0,0.01)",
                      }}
                    >
                      <Camera size={24} color="#84243a" />
                      <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#84243a" }}>
                        Click to snap or upload receipt photo
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "#6f665e" }}>
                        JPG, PNG accepted • compressed automatically
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: "none" }}
                        onChange={handleReceiptFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnReject}
                  onClick={() => setArrivingReq(null)}
                  disabled={isSubmittingArrival}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnArrived}
                  style={{ flex: "none", padding: "0.65rem 1.5rem" }}
                  disabled={isSubmittingArrival}
                >
                  {isSubmittingArrival ? "Storing & Syncing..." : "Stock Inventory & Complete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW RECEIPT PHOTO PREVIEW */}
      {previewReceiptUrl && (
        <div className={styles.modalOverlay} onClick={() => setPreviewReceiptUrl(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: "600px", background: "#111" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                color: "#fff",
              }}
            >
              <span style={{ fontWeight: 700 }}>Purchase Receipt</span>
              <button
                type="button"
                onClick={() => setPreviewReceiptUrl(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: "0 1rem 1rem", textAlign: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewReceiptUrl}
                alt="Receipt"
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  borderRadius: "8px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
