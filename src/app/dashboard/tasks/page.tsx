"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  increment,
} from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import styles from "./tasks.module.css";
import {
  CheckSquare,
  Trophy,
  Cpu,
  Columns,
  GanttChart,
  Plus,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  normalizeTask,
  normalizeInventoryItem,
  RelationalTask,
  RelationalInventoryItem,
  TaskStatusStage,
  TaskPriority,
} from "@/lib/portalRelations";

const KANBAN_COLUMNS: Array<{
  stage: TaskStatusStage;
  title: string;
  color: string;
}> = [
  { stage: "backlog", title: "Backlog", color: "#9CA3AF" },
  { stage: "in_progress", title: "In Progress", color: "#F5B800" },
  { stage: "in_review", title: "In Review", color: "#06B6D4" },
  { stage: "completed", title: "Completed", color: "#10B981" },
];

export default function TasksPage() {
  const { user, role, userData } = useAuth();
  const [tasks, setTasks] = useState<RelationalTask[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [inventory, setInventory] = useState<RelationalInventoryItem[]>([]);

  // View Mode: Kanban vs Gantt Milestone Timeline
  const [viewMode, setViewMode] = useState<"kanban" | "gantt">("kanban");
  const [selectedCompetitionFilter, setSelectedCompetitionFilter] = useState<string>("ALL");

  // Create Task Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [reservePartId, setReservePartId] = useState("");
  const [reserveQty, setReserveQty] = useState(1);
  const [autoReserveStock, setAutoReserveStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    let q;
    if (role === "admin") {
      q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    } else {
      q = query(
        collection(db, "tasks"),
        where("assignedTo", "in", [user.email, "GENERAL"])
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const taskData = snapshot.docs.map((d) =>
          normalizeTask({ id: d.id, ...d.data() })
        );
        if (role !== "admin") {
          taskData.sort(
            (a, b) =>
              (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
          );
        }
        setTasks(taskData);
      },
      () => {}
    );

    return () => unsubscribe();
  }, [user, role]);

  // Fetch relational entities: Members, Competitions, Inventory
  useEffect(() => {
    const unsubComps = onSnapshot(
      collection(db, "competitions"),
      (snap) => {
        setCompetitions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    const unsubInv = onSnapshot(
      collection(db, "inventory"),
      (snap) => {
        setInventory(
          snap.docs.map((d) => normalizeInventoryItem({ id: d.id, ...d.data() }))
        );
      },
      () => {}
    );

    let unsubUsers = () => {};
    if (role === "admin") {
      unsubUsers = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          const usersData = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as any[];
          setMembers(usersData.filter((u) => u.role !== "pending"));
        },
        () => {}
      );
    }

    return () => {
      unsubComps();
      unsubInv();
      unsubUsers();
    };
  }, [role]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedTo) return;
    setIsSubmitting(true);

    try {
      const selectedComp = competitions.find((c) => c.id === competitionId);
      const selectedPart = inventory.find((i) => i.id === reservePartId);
      const reservedParts = [];

      // If hardware part is attached and auto-reserve is enabled, reserve stock in Checkouts
      if (selectedPart && reserveQty > 0) {
        let checkoutDocId: string | undefined;
        if (autoReserveStock && selectedPart.quantity >= reserveQty) {
          await updateDoc(doc(db, "inventory", selectedPart.id), {
            quantity: increment(-reserveQty),
          });
          const assigneeMember = members.find((m) => m.email === assignedTo);
          const chkRef = await addDoc(collection(db, "checkouts"), {
            partId: selectedPart.id,
            partName: selectedPart.name,
            category: selectedPart.category || "General",
            quantity: reserveQty,
            checkedOutBy: assignedTo === "GENERAL" ? user?.email : assignedTo,
            userId: assigneeMember?.id || user?.uid,
            userName:
              assigneeMember?.name ||
              (assignedTo === "GENERAL" ? "Open Team Task" : assignedTo),
            checkedOutAt: serverTimestamp(),
            expectedReturnDate: dueDate || undefined,
            status: "Checked Out",
            competitionId: selectedComp?.id || null,
            competitionName: selectedComp?.name || null,
            taskTitle: title.trim(),
            notes: `Auto-reserved for Task: ${title.trim()}`,
          });
          checkoutDocId = chkRef.id;
        }

        reservedParts.push({
          partId: selectedPart.id,
          partName: selectedPart.name,
          quantity: reserveQty,
          checkoutId: checkoutDocId,
        });
      }

      await addDoc(collection(db, "tasks"), {
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        assignedBy: user?.email,
        status: "pending",
        stage: "backlog",
        priority,
        dueDate: dueDate || null,
        competitionId: selectedComp?.id || null,
        competitionName: selectedComp?.name || null,
        reservedParts,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setPriority("Medium");
      setDueDate("");
      setCompetitionId("");
      setReservePartId("");
      setReserveQty(1);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveStage = async (taskId: string, nextStage: TaskStatusStage) => {
    try {
      const isDone = nextStage === "completed";
      await updateDoc(doc(db, "tasks", taskId), {
        stage: nextStage,
        status: isDone ? "Done" : "pending",
        ...(isDone
          ? {
              completedAt: serverTimestamp(),
              completedBy: user?.email || "unknown",
            }
          : {}),
      });
    } catch (error) {
      console.error("Error updating task stage:", error);
    }
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    if (selectedCompetitionFilter === "ALL") return tasks;
    if (selectedCompetitionFilter === "UNLINKED") {
      return tasks.filter((t) => !t.competitionId);
    }
    return tasks.filter((t) => t.competitionId === selectedCompetitionFilter);
  }, [tasks, selectedCompetitionFilter]);

  // Group by Competition for Gantt View
  const ganttGroups = useMemo(() => {
    const map = new Map<string, { name: string; tasks: RelationalTask[] }>();
    filteredTasks.forEach((t) => {
      const key = t.competitionId || "general";
      const name = t.competitionName || "General Club Operations & Lab Sprints";
      if (!map.has(key)) {
        map.set(key, { name, tasks: [] });
      }
      map.get(key)!.tasks.push(t);
    });
    return Array.from(map.entries());
  }, [filteredTasks]);

  const getPriorityStyle = (p: TaskPriority) => {
    if (p === "Critical") return { bg: "rgba(239, 68, 68, 0.2)", color: "#EF4444" };
    if (p === "High") return { bg: "rgba(245, 158, 11, 0.2)", color: "#F59E0B" };
    if (p === "Low") return { bg: "rgba(156, 163, 175, 0.18)", color: "#9CA3AF" };
    return { bg: "rgba(6, 182, 212, 0.18)", color: "#06B6D4" };
  };

  return (
    <div className={styles.container}>
      {/* Header & Dual View Switcher */}
      <div className={styles.header}>
        <div>
          <h1 style={{ fontSize: "1.9rem", color: "var(--text-primary)", fontWeight: 800 }}>
            Task &amp; Milestone Pipeline
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            {role === "admin"
              ? "Assign competition-linked sprints, reserve lab hardware, and track milestones."
              : "Execute your assigned competition sprints and move tasks across the pipeline."}
          </p>
        </div>

        <div className={styles.viewToggleGroup}>
          <button
            onClick={() => setViewMode("kanban")}
            className={`${styles.viewToggleBtn} ${
              viewMode === "kanban" ? styles.viewToggleBtnActive : ""
            }`}
          >
            <Columns size={15} />
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode("gantt")}
            className={`${styles.viewToggleBtn} ${
              viewMode === "gantt" ? styles.viewToggleBtnActive : ""
            }`}
          >
            <GanttChart size={15} />
            Gantt Milestone Timeline
          </button>
        </div>
      </div>

      {/* Admin Task Creation with Competition & Lab Stock Auto-Reservation */}
      {role === "admin" && (
        <form onSubmit={handleCreateTask} className={styles.formCard}>
          <h3
            style={{
              fontSize: "1.1rem",
              marginBottom: "1rem",
              color: "#F5B800",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Plus size={18} />
            Assign Relational Sprint Task (Linked to Competition &amp; Lab Inventory)
          </h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Task Title *</label>
              <input
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Solder STM32 Breakout & Calibrate PID"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Assign To (Member) *</label>
              <select
                className={styles.input}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a member...
                </option>
                <option value="GENERAL">📢 General / Open Task (All Members)</option>
                {members.map((m) => (
                  <option key={m.id} value={m.email}>
                    {m.name} (@{m.username}) - {m.email}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Connected Competition / Milestone</label>
              <select
                className={styles.input}
                value={competitionId}
                onChange={(e) => setCompetitionId(e.target.value)}
              >
                <option value="">-- General Club / Unlinked --</option>
                {competitions.map((c) => (
                  <option key={c.id} value={c.id}>
                    🏆 {c.name} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Priority &amp; Target Due Date</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <select
                  className={styles.input}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <input
                  type="date"
                  className={styles.input}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>
                Attach Required Lab Accessory / Component (Optional Auto-Reserve)
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 90px auto",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <select
                  className={styles.input}
                  value={reservePartId}
                  onChange={(e) => setReservePartId(e.target.value)}
                >
                  <option value="">-- No hardware reservation needed --</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id} disabled={item.quantity <= 0}>
                      {item.name} ({item.quantity} in stock • {item.category})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className={styles.input}
                  value={reserveQty}
                  onChange={(e) => setReserveQty(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={!reservePartId}
                  title="Quantity to reserve"
                />
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.8rem",
                    color: "#9CA3AF",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={autoReserveStock}
                    onChange={(e) => setAutoReserveStock(e.target.checked)}
                    disabled={!reservePartId}
                  />
                  Auto-reserve stock in Lab Checkout
                </label>
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>Task Description &amp; Acceptance Criteria *</label>
              <textarea
                className={styles.input}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ minHeight: "72px", resize: "vertical" }}
                placeholder="Specify pinout details, calibration targets, or deliverable expectations..."
              />
            </div>

            <div>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Assigning Sprint..." : "Create & Link Task"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Bar by Connected Competition */}
      <div className={styles.filterBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#9CA3AF" }}>
            Filter by Competition Milestone:
          </span>
          <select
            className={styles.input}
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.82rem" }}
            value={selectedCompetitionFilter}
            onChange={(e) => setSelectedCompetitionFilter(e.target.value)}
          >
            <option value="ALL">All Tasks ({tasks.length})</option>
            <option value="UNLINKED">General Lab Tasks</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>
                🏆 {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
          Showing <strong style={{ color: "#F5B800" }}>{filteredTasks.length}</strong> task(s)
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: 4-COLUMN KANBAN SPRINT BOARD
          ===================================================================== */}
      {viewMode === "kanban" && (
        <div className={styles.kanbanBoard}>
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.stage === col.stage);
            return (
              <div key={col.stage} className={styles.kanbanColumn}>
                <div className={styles.kanbanColHeader}>
                  <div className={styles.kanbanColTitle} style={{ color: col.color }}>
                    <span>{col.title}</span>
                  </div>
                  <span className={styles.kanbanCount}>{colTasks.length}</span>
                </div>

                <div className={styles.kanbanCards}>
                  {colTasks.length === 0 ? (
                    <div
                      style={{
                        padding: "1.5rem 0.75rem",
                        textAlign: "center",
                        fontSize: "0.78rem",
                        color: "#6B7280",
                        border: "1px dashed rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                      }}
                    >
                      No tasks in {col.title}
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const pStyle = getPriorityStyle(task.priority);
                      const canAct =
                        role === "admin" ||
                        user?.email === task.assignedTo ||
                        task.assignedTo === "GENERAL";

                      return (
                        <div
                          key={task.id}
                          className={styles.taskCard}
                          style={{ borderLeftColor: col.color }}
                        >
                          <div className={styles.taskHeader}>
                            <div className={styles.taskTitle}>{task.title}</div>
                            <span
                              className={styles.priorityBadge}
                              style={{ background: pStyle.bg, color: pStyle.color }}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <div className={styles.taskDesc}>{task.description}</div>

                          {/* Relational Badges: Competition & Reserved Lab Hardware */}
                          {(task.competitionName ||
                            (task.reservedParts && task.reservedParts.length > 0)) && (
                            <div className={styles.relationTags}>
                              {task.competitionName && (
                                <span className={styles.relChip}>
                                  <Trophy size={11} />
                                  {task.competitionName}
                                </span>
                              )}
                              {task.reservedParts?.map((rp, i) => (
                                <span
                                  key={i}
                                  className={`${styles.relChip} ${styles.relChipHardware}`}
                                >
                                  <Cpu size={11} />
                                  {rp.quantity}x {rp.partName}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className={styles.metaInfo}>
                            <div>
                              <UserIcon
                                size={12}
                                style={{ display: "inline", marginRight: 4 }}
                              />
                              <strong style={{ color: "#F9FAFB" }}>
                                {task.assignedTo === "GENERAL"
                                  ? "All Members"
                                  : task.assignedTo}
                              </strong>
                            </div>
                            {task.dueDate && (
                              <div>
                                <Calendar
                                  size={12}
                                  style={{ display: "inline", marginRight: 4 }}
                                />
                                Due: {task.dueDate}
                              </div>
                            )}
                            {task.stage === "completed" && task.completedBy && (
                              <div style={{ color: "#10B981" }}>
                                ✓ Completed by {task.completedBy}
                              </div>
                            )}
                          </div>

                          {canAct && (
                            <div className={styles.stageActions}>
                              {task.stage !== "in_progress" && task.stage !== "completed" && (
                                <button
                                  onClick={() => handleMoveStage(task.id, "in_progress")}
                                  className={styles.stageBtn}
                                >
                                  Start Sprint
                                </button>
                              )}
                              {task.stage === "in_progress" && (
                                <button
                                  onClick={() => handleMoveStage(task.id, "in_review")}
                                  className={styles.stageBtn}
                                >
                                  Submit Review
                                </button>
                              )}
                              {task.stage !== "completed" && (
                                <button
                                  onClick={() => handleMoveStage(task.id, "completed")}
                                  className={styles.completeBtn}
                                >
                                  ✓ Complete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          VIEW 2: GANTT MILESTONE TIMELINE
          ===================================================================== */}
      {viewMode === "gantt" && (
        <div className={styles.ganttContainer}>
          {ganttGroups.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#9CA3AF" }}>
              No tasks available for timeline visualization.
            </div>
          ) : (
            ganttGroups.map(([groupKey, group]) => (
              <div key={groupKey} className={styles.ganttGroup}>
                <div className={styles.ganttGroupHeader}>
                  <span>🏆 {group.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                    {group.tasks.filter((t) => t.stage === "completed").length} /{" "}
                    {group.tasks.length} Completed
                  </span>
                </div>

                {group.tasks.map((task) => {
                  const pct =
                    task.stage === "completed"
                      ? 100
                      : task.stage === "in_review"
                      ? 75
                      : task.stage === "in_progress"
                      ? 45
                      : 15;
                  const fillColor =
                    task.stage === "completed"
                      ? "#10B981"
                      : task.stage === "in_review"
                      ? "#06B6D4"
                      : task.stage === "in_progress"
                      ? "#F5B800"
                      : "#6B7280";

                  return (
                    <div key={task.id} className={styles.ganttRow}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#F9FAFB" }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "#9CA3AF" }}>
                          Assignee: {task.assignedTo}
                          {task.reservedParts && task.reservedParts.length > 0
                            ? ` • Gear: ${task.reservedParts
                                .map((p) => `${p.quantity}x ${p.partName}`)
                                .join(", ")}`
                            : ""}
                        </div>
                      </div>

                      <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>
                        {task.dueDate ? `📅 Target: ${task.dueDate}` : "Ongoing Sprint"}
                      </div>

                      <div className={styles.ganttBarTrack}>
                        <div
                          className={styles.ganttBarFill}
                          style={{ width: `${pct}%`, background: fillColor }}
                        >
                          {pct}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
