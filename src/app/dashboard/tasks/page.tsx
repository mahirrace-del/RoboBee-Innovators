"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
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
  Users,
  CheckCircle2,
  ArrowRight,
  Dices,
  X,
  Check,
  Search,
  Sparkles,
  Shield,
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
  { stage: "backlog", title: "Backlog", color: "#6f665e" },
  { stage: "in_progress", title: "In Progress", color: "#9c6f18" },
  { stage: "in_review", title: "In Review", color: "#06B6D4" },
  { stage: "completed", title: "Completed", color: "#10B981" },
];

export default function TasksPage() {
  const { user, role } = useAuth();
  const [tasks, setTasks] = useState<RelationalTask[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [subteams, setSubteams] = useState<any[]>([]);
  const [inventory, setInventory] = useState<RelationalInventoryItem[]>([]);

  // View Mode: Kanban vs Gantt Milestone Timeline
  const [viewMode, setViewMode] = useState<"kanban" | "gantt">("kanban");
  const [selectedCompetitionFilter, setSelectedCompetitionFilter] = useState<string>("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create Task Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Multi-Member Assignment State
  const [selectedMemberEmails, setSelectedMemberEmails] = useState<string[]>([]);
  const [isGeneralTask, setIsGeneralTask] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [randomNotice, setRandomNotice] = useState<string | null>(null);

  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [reservePartId, setReservePartId] = useState("");
  const [reserveQty, setReserveQty] = useState(1);
  const [autoReserveStock, setAutoReserveStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Listen to tasks collection ordered by createdAt descending
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allFetchedTasks = snapshot.docs.map((d) =>
          normalizeTask({ id: d.id, ...d.data() })
        );

        // For non-admin, filter to tasks assigned to them, to their squad, or GENERAL
        const userEmail = user?.email?.toLowerCase() || "";
        const taskData = allFetchedTasks.filter((t) => {
          if (role === "admin") return true;
          if (t.assignedTo === "GENERAL") return true;
          if (t.assignedTo?.toLowerCase() === userEmail) return true;
          if (
            t.assignedToEmails?.some(
              (e) => e.toLowerCase() === userEmail || e === "GENERAL"
            )
          ) {
            return true;
          }
          if (typeof t.assignedTo === "string" && t.assignedTo.toLowerCase().includes(userEmail)) {
            return true;
          }
          return false;
        });

        setTasks(taskData);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
      }
    );

    return () => unsubscribe();
  }, [user, role]);

  // Fetch relational entities: Competitions, Subteams, Inventory, Members
  useEffect(() => {
    const unsubComps = onSnapshot(
      collection(db, "competitions"),
      (snap) => {
        setCompetitions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    const unsubSubteams = onSnapshot(
      collection(db, "competition_subteams"),
      (snap) => {
        setSubteams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
          setMembers(usersData.filter((u) => u.role !== "pending" && u.email));
        },
        () => {}
      );
    }

    return () => {
      unsubComps();
      unsubSubteams();
      unsubInv();
      unsubUsers();
    };
  }, [role]);

  // Derived Squad / Team Presets for 1-Click Assignment
  const squadPresets = useMemo(() => {
    const list: Array<{ label: string; groupName: string; emails: string[] }> = [];

    // 1. Group by competition subteams
    const subteamMap = new Map<string, { label: string; groupName: string; emails: string[] }>();
    subteams.forEach((st) => {
      const comp = competitions.find((c) => c.id === st.competitionId);
      const compTitle = comp ? comp.name : st.competitionName || "Competition";
      const key = `${compTitle}: ${st.subteamName || st.role || "Squad"}`;

      if (!subteamMap.has(key)) {
        subteamMap.set(key, {
          label: key,
          groupName: `${compTitle} Squad`,
          emails: [],
        });
      }
      if (st.memberEmail && !subteamMap.get(key)!.emails.includes(st.memberEmail)) {
        subteamMap.get(key)!.emails.push(st.memberEmail);
      }
    });
    subteamMap.forEach((val) => {
      if (val.emails.length > 0) list.push(val);
    });

    // 2. Role squads: Admins & Mentors
    const adminEmails = members
      .filter((m) => m.role === "admin")
      .map((m) => m.email);
    if (adminEmails.length > 0) {
      list.push({
        label: `🛡️ Lead Mentors & Admins (${adminEmails.length})`,
        groupName: "Leadership",
        emails: adminEmails,
      });
    }

    // 3. Regular Members
    const regularEmails = members
      .filter((m) => m.role === "member")
      .map((m) => m.email);
    if (regularEmails.length > 0) {
      list.push({
        label: `🎓 All Registered Members (${regularEmails.length})`,
        groupName: "General Squad",
        emails: regularEmails,
      });
    }

    return list;
  }, [subteams, competitions, members]);

  // Filtered members list based on search query
  const filteredMemberList = useMemo(() => {
    if (!memberSearchQuery.trim()) return members;
    const q = memberSearchQuery.toLowerCase();
    return members.filter(
      (m) =>
        (m.name || "").toLowerCase().includes(q) ||
        (m.username || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.role || "").toLowerCase().includes(q)
    );
  }, [members, memberSearchQuery]);

  // Selection Handler: Toggle individual member
  const handleToggleMember = (email: string) => {
    setIsGeneralTask(false);
    setSelectedMemberEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Selection Handler: Select General (All Members)
  const handleSelectGeneral = () => {
    setIsGeneralTask(true);
    setSelectedMemberEmails(["GENERAL"]);
    setRandomNotice("Selected: 📢 Open Task (All Members)");
    setTimeout(() => setRandomNotice(null), 3000);
  };

  // Selection Handler: Select a Team / Squad preset
  const handleSelectSquadPreset = (presetKey: string) => {
    if (!presetKey) return;
    const found = squadPresets.find((p) => p.label === presetKey);
    if (found) {
      setIsGeneralTask(false);
      setSelectedMemberEmails(found.emails);
      setRandomNotice(`Selected squad: ${found.label}`);
      setTimeout(() => setRandomNotice(null), 3500);
    }
  };

  // Selection Handler: Randomly pick N members
  const handlePickRandom = (count: number) => {
    const pool = members.filter((m) => m.email && m.role !== "pending");
    if (pool.length === 0) return;

    // Shuffle array using Fisher-Yates
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const picked = shuffled.slice(0, Math.min(count, shuffled.length));
    const pickedEmails = picked.map((m) => m.email);

    setIsGeneralTask(false);
    setSelectedMemberEmails(pickedEmails);

    const names = picked
      .map((p) => p.name || p.username || p.email.split("@")[0])
      .join(", ");
    setRandomNotice(`🎲 Randomly selected ${picked.length} member(s): ${names}`);
    setTimeout(() => setRandomNotice(null), 4500);
  };

  // Selection Handler: Clear all
  const handleClearMembers = () => {
    setIsGeneralTask(false);
    setSelectedMemberEmails([]);
    setRandomNotice(null);
  };

  // Selected members objects for chip display
  const selectedMembersList = useMemo(() => {
    if (isGeneralTask || selectedMemberEmails.includes("GENERAL")) {
      return [];
    }
    return members.filter((m) => selectedMemberEmails.includes(m.email));
  }, [members, selectedMemberEmails, isGeneralTask]);

  // Form Submission: Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (!isGeneralTask && selectedMemberEmails.length === 0) {
      alert("Please assign at least one member or select 'General (All Members)'.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedComp = competitions.find((c) => c.id === competitionId);
      const selectedPart = inventory.find((i) => i.id === reservePartId);
      const reservedParts = [];

      // Determine assignment values
      const isGeneral = isGeneralTask || selectedMemberEmails.includes("GENERAL");

      const assignedToEmails = isGeneral ? ["GENERAL"] : [...selectedMemberEmails];

      const assignedTo = isGeneral
        ? "GENERAL"
        : selectedMembersList.length === 1
        ? selectedMembersList[0].email
        : selectedMembersList.map((m) => m.email).join(", ");

      const assignedToName = isGeneral
        ? "All Members (Open Task)"
        : selectedMembersList.length === 1
        ? selectedMembersList[0].name || selectedMembersList[0].username || selectedMembersList[0].email
        : `${selectedMembersList.length} Members (${selectedMembersList
            .map((m) => m.name || m.username || m.email.split("@")[0])
            .join(", ")})`;

      const assignedMembers = isGeneral
        ? []
        : selectedMembersList.map((m) => ({
            id: m.id || "",
            name: m.name || m.username || m.email,
            email: m.email,
            username: m.username || "",
          }));

      // If hardware part is attached and auto-reserve is enabled, reserve stock in Checkouts
      if (selectedPart && reserveQty > 0) {
        let checkoutDocId: string | undefined;
        if (autoReserveStock && selectedPart.quantity >= reserveQty) {
          await updateDoc(doc(db, "inventory", selectedPart.id), {
            quantity: increment(-reserveQty),
          });

          const primaryAssignee = selectedMembersList[0];
          const chkRef = await addDoc(collection(db, "checkouts"), {
            partId: selectedPart.id,
            partName: selectedPart.name,
            category: selectedPart.category || "General",
            quantity: reserveQty,
            checkedOutBy: isGeneral ? user?.email : assignedTo,
            userId: primaryAssignee?.id || user?.uid,
            userName: isGeneral
              ? "Open Team Task"
              : primaryAssignee?.name || assignedToName,
            checkedOutAt: serverTimestamp(),
            expectedReturnDate: dueDate || undefined,
            status: "Checked Out",
            competitionId: selectedComp?.id || null,
            competitionName: selectedComp?.name || null,
            taskTitle: title.trim(),
            notes: `Auto-reserved for Task: ${title.trim()} (${assignedToName})`,
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
        assignedToName,
        assignedToEmails,
        assignedMembers,
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

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedMemberEmails([]);
      setIsGeneralTask(false);
      setPriority("Medium");
      setDueDate("");
      setCompetitionId("");
      setReservePartId("");
      setReserveQty(1);
      setIsCreateOpen(false);
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
    if (p === "High") return { bg: "rgba(245, 158, 11, 0.2)", color: "#9c6f18" };
    if (p === "Low") return { bg: "rgba(156, 163, 175, 0.18)", color: "#6f665e" };
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
              ? "Assign competition-linked sprints, reserve lab hardware, and assign squads or individual members."
              : "Execute your assigned competition sprints and move tasks across the pipeline."}
          </p>
        </div>

        <div className={styles.headerActions}>
          {role === "admin" && (
            <button
              onClick={() => setIsCreateOpen((current) => !current)}
              className={styles.createTaskButton}
              aria-expanded={isCreateOpen}
              aria-controls="create-task-form"
            >
              <Plus size={16} />
              {isCreateOpen ? "Close Task Form" : "Create Task"}
            </button>
          )}
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
      </div>

      {/* Admin Task Creation with Multi-Member & Squad Assignment */}
      {role === "admin" && isCreateOpen && (
        <form id="create-task-form" onSubmit={handleCreateTask} className={styles.formCard}>
          <h3
            style={{
              fontSize: "1.1rem",
              marginBottom: "1rem",
              color: "#9c6f18",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Plus size={18} />
            Create a New Task or Sprint
          </h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
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

            {/* MULTI-MEMBER ASSIGNMENT WIDGET */}
            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                <label className={styles.label}>
                  Assign To (Members or Squad) *
                </label>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#84243a" }}>
                  {isGeneralTask
                    ? "📢 Open to All Members"
                    : selectedMemberEmails.length > 0
                    ? `${selectedMemberEmails.length} Member(s) Selected`
                    : "0 Selected"}
                </span>
              </div>

              <div className={styles.multiAssignContainer}>
                {/* TOOLBAR: QUICK PRESETS & RANDOM PICKERS */}
                <div className={styles.assignToolbar}>
                  <div className={styles.toolbarActions}>
                    <button
                      type="button"
                      className={`${styles.assignPillBtn} ${isGeneralTask ? styles.assignPillBtnActive : ""}`}
                      onClick={handleSelectGeneral}
                      title="Open task to everyone on the team"
                    >
                      📢 All Members (General)
                    </button>

                    {/* TEAM / SQUAD PRESET DROPDOWN */}
                    {squadPresets.length > 0 && (
                      <select
                        className={styles.groupSelect}
                        onChange={(e) => {
                          handleSelectSquadPreset(e.target.value);
                          e.target.value = "";
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          👥 Pick Team / Squad...
                        </option>
                        {squadPresets.map((sp, idx) => (
                          <option key={idx} value={sp.label}>
                            {sp.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* RANDOM PICKERS */}
                    <button
                      type="button"
                      className={styles.assignPillBtn}
                      onClick={() => handlePickRandom(2)}
                      title="Pick 2 random members from roster"
                    >
                      <Dices size={13} />
                      Random 2
                    </button>
                    <button
                      type="button"
                      className={styles.assignPillBtn}
                      onClick={() => handlePickRandom(3)}
                      title="Pick 3 random members from roster"
                    >
                      <Dices size={13} />
                      Random 3
                    </button>
                    <button
                      type="button"
                      className={styles.assignPillBtn}
                      onClick={() => handlePickRandom(5)}
                      title="Pick 5 random members from roster"
                    >
                      <Dices size={13} />
                      Random 5
                    </button>
                  </div>

                  {(selectedMemberEmails.length > 0 || isGeneralTask) && (
                    <button
                      type="button"
                      className={styles.assignPillBtn}
                      onClick={handleClearMembers}
                      style={{ color: "#dc2626", borderColor: "rgba(220,38,38,0.25)" }}
                    >
                      <X size={12} />
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* RANDOM SELECTION FEEDBACK NOTICE */}
                {randomNotice && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#9c6f18",
                      background: "rgba(245, 184, 0, 0.12)",
                      padding: "0.35rem 0.65rem",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontWeight: 600,
                    }}
                  >
                    <Sparkles size={13} />
                    {randomNotice}
                  </div>
                )}

                {/* SELECTED CHIPS AREA */}
                <div className={styles.selectedChipsArea}>
                  {isGeneralTask ? (
                    <span className={`${styles.memberChip} ${styles.memberChipGeneral}`}>
                      📢 All Members (Open / Unclaimed Task)
                      <button
                        type="button"
                        className={styles.memberChipRemove}
                        onClick={handleClearMembers}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ) : selectedMembersList.length > 0 ? (
                    selectedMembersList.map((m) => {
                      const initial = (m.name || m.username || m.email || "M").charAt(0).toUpperCase();
                      return (
                        <span key={m.id || m.email} className={styles.memberChip}>
                          <span className={styles.memberChipAvatar}>{initial}</span>
                          <span>{m.name || m.username || m.email.split("@")[0]}</span>
                          <button
                            type="button"
                            className={styles.memberChipRemove}
                            onClick={() => handleToggleMember(m.email)}
                            title="Remove member"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className={styles.noSelectionNotice}>
                      No members selected. Pick individuals from the list below, or use the squad / random shortcuts above.
                    </span>
                  )}
                </div>

                {/* SEARCH INPUT */}
                <div className={styles.memberSearchBox}>
                  <input
                    type="text"
                    className={styles.memberSearchInput}
                    placeholder="🔍 Filter members by name, role, or email..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                  />
                </div>

                {/* SCROLLABLE CHECKBOX MEMBER LIST */}
                <div className={styles.memberListScroll}>
                  {filteredMemberList.length === 0 ? (
                    <div style={{ padding: "1rem", textAlign: "center", fontSize: "0.8rem", color: "#6f665e" }}>
                      No matching members found.
                    </div>
                  ) : (
                    filteredMemberList.map((m) => {
                      const isSelected = selectedMemberEmails.includes(m.email) && !isGeneralTask;
                      const initial = (m.name || m.username || m.email || "M").charAt(0).toUpperCase();

                      return (
                        <div
                          key={m.id || m.email}
                          className={`${styles.memberOptionRow} ${isSelected ? styles.memberOptionRowActive : ""}`}
                          onClick={() => handleToggleMember(m.email)}
                        >
                          <div className={styles.memberInfoCol}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by row click
                              style={{ cursor: "pointer", width: "15px", height: "15px" }}
                            />
                            <div className={styles.memberOptionAvatar}>{initial}</div>
                            <div style={{ minWidth: 0 }}>
                              <div className={styles.memberOptionName}>
                                {m.name || m.username || "Team Member"}
                              </div>
                              <div className={styles.memberOptionSub}>
                                {m.email} {m.username ? `(@${m.username})` : ""}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            {m.role === "admin" && (
                              <span className={styles.memberOptionRoleTag} style={{ background: "rgba(132, 36, 58, 0.1)", color: "#84243a" }}>
                                Admin
                              </span>
                            )}
                            {m.roleTitle && (
                              <span className={styles.memberOptionRoleTag}>
                                {m.roleTitle}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
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
                placeholder="What should be delivered, tested, or reviewed?"
              />
            </div>

            <div className={styles.advancedFields}>
              <details className={styles.advancedDetails}>
                <summary>Project link, priority, and lab stock options</summary>
                <div className={styles.advancedGrid}>
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
                          color: "#6f665e",
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
                </div>
              </details>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Creating Task..." : "Create Task / Assign Squad"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Bar by Connected Competition */}
      <div className={styles.filterBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6f665e" }}>
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

        <div style={{ fontSize: "0.8rem", color: "#6f665e" }}>
          Showing <strong style={{ color: "#9c6f18" }}>{filteredTasks.length}</strong> task(s)
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
                      const userEmail = user?.email?.toLowerCase() || "";
                      const canAct =
                        role === "admin" ||
                        task.assignedTo === "GENERAL" ||
                        task.assignedTo?.toLowerCase() === userEmail ||
                        task.assignedToEmails?.some((e) => e.toLowerCase() === userEmail) ||
                        task.assignedMembers?.some((m) => m.email?.toLowerCase() === userEmail) ||
                        (typeof task.assignedTo === "string" &&
                          task.assignedTo.toLowerCase().includes(userEmail));

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

                          {/* ASSIGNEES DISPLAY */}
                          <div className={styles.metaInfo}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                              {task.assignedTo === "GENERAL" ? (
                                <>
                                  <Users size={12} style={{ color: "#9c6f18" }} />
                                  <strong style={{ color: "#27211d" }}>📢 All Members (Open Task)</strong>
                                </>
                              ) : task.assignedMembers && task.assignedMembers.length > 1 ? (
                                <>
                                  <Users size={12} style={{ color: "#84243a" }} />
                                  <strong style={{ color: "#84243a" }}>
                                    Squad ({task.assignedMembers.length}):
                                  </strong>
                                  <div style={{ display: "inline-flex", gap: "0.25rem", flexWrap: "wrap" }}>
                                    {task.assignedMembers.map((m: any, idx: number) => (
                                      <span
                                        key={idx}
                                        style={{
                                          fontSize: "0.72rem",
                                          padding: "0.1rem 0.4rem",
                                          borderRadius: "4px",
                                          background: "rgba(132, 36, 58, 0.08)",
                                          color: "#84243a",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {m.name || m.username || m.email.split("@")[0]}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <UserIcon size={12} style={{ color: "#6f665e" }} />
                                  <strong style={{ color: "#27211d" }}>
                                    {task.assignedToName || task.assignedTo}
                                  </strong>
                                </>
                              )}
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
            <div style={{ padding: "2rem", textAlign: "center", color: "#6f665e" }}>
              No tasks available for timeline visualization.
            </div>
          ) : (
            ganttGroups.map(([groupKey, group]) => (
              <div key={groupKey} className={styles.ganttGroup}>
                <div className={styles.ganttGroupHeader}>
                  <span>🏆 {group.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "#6f665e" }}>
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
                      ? "#9c6f18"
                      : "#6B7280";

                  return (
                    <div key={task.id} className={styles.ganttRow}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#27211d" }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "#6f665e" }}>
                          Assignees:{" "}
                          {task.assignedTo === "GENERAL"
                            ? "All Members (Open)"
                            : task.assignedMembers && task.assignedMembers.length > 0
                            ? task.assignedMembers.map((m: any) => m.name || m.email.split("@")[0]).join(", ")
                            : task.assignedToName || task.assignedTo}
                          {task.reservedParts && task.reservedParts.length > 0
                            ? ` • Gear: ${task.reservedParts
                                .map((p) => `${p.quantity}x ${p.partName}`)
                                .join(", ")}`
                            : ""}
                        </div>
                      </div>

                      <div style={{ fontSize: "0.78rem", color: "#6f665e" }}>
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
