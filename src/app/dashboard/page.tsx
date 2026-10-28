"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./overview.module.css";
import {
  Zap,
  CheckSquare,
  Calendar,
  Package,
  Trophy,
  Cpu,
  DollarSign,
  AlertTriangle,
  Activity,
  Shield,
  User as UserIcon,
  ArrowUpRight,
  Clock,
  BookOpen,
  Wrench,
} from "lucide-react";
import {
  normalizeTask,
  normalizeCheckout,
  normalizeInventoryItem,
  RelationalTask,
  RelationalCheckout,
  RelationalInventoryItem,
} from "@/lib/portalRelations";
import {
  ScheduledClassSession,
  calculateScheduleProgression,
} from "@/lib/scheduleAttendance";

export default function DashboardOverview() {
  const { user, role, userData } = useAuth();
  const isAdmin = role === "admin";
  const [viewMode, setViewMode] = useState<"command" | "member">(
    role === "admin" ? "command" : "member"
  );

  // Sync default viewMode once role loads
  useEffect(() => {
    if (role === "admin") {
      setViewMode("command");
    } else {
      setViewMode("member");
    }
  }, [role]);

  const [labStatus, setLabStatus] = useState<"Open" | "Closed">("Closed");
  const [allTasks, setAllTasks] = useState<RelationalTask[]>([]);
  const [allCheckouts, setAllCheckouts] = useState<RelationalCheckout[]>([]);
  const [inventory, setInventory] = useState<RelationalInventoryItem[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [sessions, setSessions] = useState<ScheduledClassSession[]>([]);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // 1. Lab Status
    const unsubLab = onSnapshot(
      doc(db, "settings", "labStatus"),
      (docSnap) => {
        if (docSnap.exists()) {
          setLabStatus(docSnap.data().status);
        }
      },
      () => {}
    );

    // 2. Tasks
    const unsubTasks = onSnapshot(
      collection(db, "tasks"),
      (snap) => {
        setAllTasks(snap.docs.map((d) => normalizeTask({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    // 3. Hardware Checkouts
    const unsubCheckouts = onSnapshot(
      collection(db, "checkouts"),
      (snap) => {
        setAllCheckouts(snap.docs.map((d) => normalizeCheckout({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    // 4. Inventory
    const unsubInventory = onSnapshot(
      collection(db, "inventory"),
      (snap) => {
        setInventory(snap.docs.map((d) => normalizeInventoryItem({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    // 5. Competitions
    const unsubComps = onSnapshot(
      collection(db, "competitions"),
      (snap) => {
        setCompetitions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    // 6. Payments
    const unsubPayments = onSnapshot(
      collection(db, "payments"),
      (snap) => {
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    // 7. Treasury Expenses
    const unsubExpenses = onSnapshot(
      collection(db, "treasury_expenses"),
      (snap) => {
        setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    // 8. Class Sessions
    const unsubSessions = onSnapshot(
      collection(db, "sessions"),
      (snap) => {
        const list: ScheduledClassSession[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            lessonId: data.lessonId || "",
            lessonCode: data.lessonCode || "CLASS",
            title: data.title || "Robotics Session",
            courseTier: data.courseTier || "beginner",
            date: data.date || "",
            time: data.time || "15:30",
            durationMinutes: data.durationMinutes || 60,
            status: data.status || "upcoming",
            instructor: data.instructor || "RoboBEE Faculty",
            location: data.location || "RoboBEE Lab",
            attendees: Array.isArray(data.attendees) ? data.attendees : [],
          };
        });
        setSessions(list);
      },
      () => {}
    );

    // 9. Member Attendance Count
    const unsubAttendance = onSnapshot(
      collection(db, "attendance"),
      (snap) => {
        const myAtt = snap.docs.filter((d) => d.data().userId === user.uid);
        setAttendanceCount(myAtt.length);
      },
      () => {}
    );

    return () => {
      unsubLab();
      unsubTasks();
      unsubCheckouts();
      unsubInventory();
      unsubComps();
      unsubPayments();
      unsubExpenses();
      unsubSessions();
      unsubAttendance();
    };
  }, [user]);

  // Derived Member Data
  const myTasks = useMemo(
    () =>
      allTasks.filter(
        (t) => t.assignedTo === user?.email || t.assignedTo === "GENERAL"
      ),
    [allTasks, user]
  );
  const myActiveTasks = useMemo(
    () => myTasks.filter((t) => t.stage !== "completed"),
    [myTasks]
  );
  const myCompletedTasksCount = useMemo(
    () => myTasks.filter((t) => t.stage === "completed").length,
    [myTasks]
  );
  const myCheckouts = useMemo(
    () =>
      allCheckouts.filter(
        (c) => c.checkedOutBy === user?.email || c.userId === user?.uid
      ),
    [allCheckouts, user]
  );
  const myOverdueCheckouts = useMemo(
    () => myCheckouts.filter((c) => c.isOverdue),
    [myCheckouts]
  );
  const myPendingPayments = useMemo(
    () =>
      payments.filter(
        (p) => p.userId === user?.uid && p.status === "pending_verification"
      ).length,
    [payments, user]
  );

  // Schedule Progression
  const progression = useMemo(
    () => calculateScheduleProgression(sessions),
    [sessions]
  );

  // Admin KPI Calculations
  const overdueTotalCount = useMemo(
    () => allCheckouts.filter((c) => c.isOverdue).length,
    [allCheckouts]
  );
  const lowStockItems = useMemo(
    () => inventory.filter((i) => i.quantity <= i.minThreshold),
    [inventory]
  );

  const upcomingCompetitions = useMemo(() => {
    return competitions
      .filter((c) => c.status === "Upcoming" || c.status === "Ongoing")
      .sort(
        (a, b) =>
          new Date(a.date || "2099-01-01").getTime() -
          new Date(b.date || "2099-01-01").getTime()
      );
  }, [competitions]);

  const nextCompetition = upcomingCompetitions[0] || null;
  const daysToNextComp = useMemo(() => {
    if (!nextCompetition?.date) return null;
    const diff =
      new Date(nextCompetition.date).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [nextCompetition]);

  // Treasury Balance Calculation
  const verifiedIncome = useMemo(() => {
    const memberFees = payments
      .filter((p) => p.status === "verified")
      .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const inflows = expenses
      .filter((e) => e.entryType === "income" && e.status === "approved")
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    return memberFees + inflows;
  }, [payments, expenses]);

  const approvedOutflow = useMemo(() => {
    return expenses
      .filter((e) => e.entryType !== "income" && e.status === "approved")
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const netTreasuryBalance = verifiedIncome - approvedOutflow;
  const pendingFinanceApprovals =
    payments.filter((p) => p.status === "pending_verification").length +
    expenses.filter((e) => e.status === "pending_approval").length;

  // Unified Real-Time Activity Stream (Admin)
  const activityStream = useMemo(() => {
    const events: Array<{
      id: string;
      type: "task" | "checkout" | "finance" | "session";
      title: string;
      subtitle: string;
      tag: string;
      color: string;
    }> = [];

    allCheckouts.slice(0, 4).forEach((c) => {
      events.push({
        id: `chk_${c.id}`,
        type: "checkout",
        title: `${c.userName} checked out ${c.quantity}x ${c.partName}`,
        subtitle: c.competitionName
          ? `Linked to Competition: ${c.competitionName}`
          : c.notes || "Hardware Lab Requisition",
        tag: c.isOverdue ? "OVERDUE" : "LAB GEAR",
        color: c.isOverdue ? "#EF4444" : "#06B6D4",
      });
    });

    allTasks.slice(0, 4).forEach((t) => {
      events.push({
        id: `tsk_${t.id}`,
        type: "task",
        title: `Task: ${t.title}`,
        subtitle: `Assigned to ${
          t.assignedTo === "GENERAL" ? "All Members" : t.assignedTo
        }${t.competitionName ? ` • ${t.competitionName}` : ""}`,
        tag: t.stage.toUpperCase().replace("_", " "),
        color: t.stage === "completed" ? "#10B981" : "#9c6f18",
      });
    });

    payments.slice(0, 3).forEach((p) => {
      events.push({
        id: `pay_${p.id}`,
        type: "finance",
        title: `Member Payment (${p.amount} BDT via ${p.method})`,
        subtitle: `Type: ${p.type} • Status: ${p.status}`,
        tag: p.status === "verified" ? "VERIFIED" : "PENDING",
        color: p.status === "verified" ? "#10B981" : "#9c6f18",
      });
    });

    return events.slice(0, 8);
  }, [allCheckouts, allTasks, payments]);

  // Dedication Score Calculation
  let score = attendanceCount * 10 + myCompletedTasksCount * 15;
  if (score < 0) score = 0;

  let scoreGrade = "Needs Improvement";
  let scoreColor = "#EF4444";
  if (score >= 50) {
    scoreGrade = "Solid Contributor";
    scoreColor = "#9c6f18";
  }
  if (score >= 100) {
    scoreGrade = "Top Innovator";
    scoreColor = "#10B981";
  }

  return (
    <div className={styles.container}>
      {/* Top Header + Admin/Member View Switcher */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {isAdmin && viewMode === "command"
              ? "Operations overview"
              : `Welcome back, ${userData?.name || "Innovator"}!`}
          </h1>
          <p className={styles.subtitle}>
            {isAdmin && viewMode === "command"
              ? "The lab, team, and finance updates that need attention today."
              : "Your tasks, upcoming classes, and equipment in one place."}
          </p>
        </div>

        {isAdmin && (
          <div className={styles.modeSwitcher}>
            <button
              onClick={() => setViewMode("command")}
              className={`${styles.modeBtn} ${
                viewMode === "command" ? styles.modeBtnActive : ""
              }`}
            >
              <Shield size={14} />
              Admin overview
            </button>
            <button
              onClick={() => setViewMode("member")}
              className={`${styles.modeBtn} ${
                viewMode === "member" ? styles.modeBtnActive : ""
              }`}
            >
              <UserIcon size={14} />
              My member view
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          VIEW 1: ADMIN COMMAND DASHBOARD
          ===================================================================== */}
      {isAdmin && viewMode === "command" && (
        <>
          {/* 4 Core KPI Metric Tiles */}
          <div className={styles.kpiGrid}>
            {/* Tile 1: Active Lab Checkouts */}
            <div className={styles.kpiTile}>
              <div>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiTitle}>Active Lab Checkouts</span>
                  <Cpu size={18} color="#06B6D4" />
                </div>
                <div className={styles.kpiValue}>{allCheckouts.length}</div>
              </div>
              <div className={styles.kpiMeta}>
                <span
                  style={{
                    color: overdueTotalCount > 0 ? "#EF4444" : "#10B981",
                    fontWeight: 700,
                  }}
                >
                  {overdueTotalCount > 0
                    ? `⚠️ ${overdueTotalCount} Overdue Return(s)`
                    : "✓ All on schedule"}
                </span>
                <Link
                  href="/dashboard/checkout"
                  style={{ color: "#9c6f18", fontWeight: 700 }}
                >
                  Track &rarr;
                </Link>
              </div>
            </div>

            {/* Tile 2: Upcoming Competition Countdown */}
            <div className={styles.kpiTile}>
              <div>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiTitle}>Competition Countdown</span>
                  <Trophy size={18} color="#9c6f18" />
                </div>
                <div className={styles.kpiValue}>
                  {daysToNextComp !== null
                    ? `${daysToNextComp} Days`
                    : `${upcomingCompetitions.length} Active`}
                </div>
              </div>
              <div className={styles.kpiMeta}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {nextCompetition
                    ? nextCompetition.name
                    : "Launch next tournament"}
                </span>
                <Link
                  href="/dashboard/admin/competitions"
                  style={{ color: "#9c6f18", fontWeight: 700 }}
                >
                  Command &rarr;
                </Link>
              </div>
            </div>

            {/* Tile 3: Treasury Balance */}
            <div className={styles.kpiTile}>
              <div>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiTitle}>Net Treasury Balance</span>
                  <DollarSign size={18} color="#10B981" />
                </div>
                <div
                  className={styles.kpiValue}
                  style={{
                    color: netTreasuryBalance >= 0 ? "#10B981" : "#EF4444",
                  }}
                >
                  ৳{netTreasuryBalance.toLocaleString()}
                </div>
              </div>
              <div className={styles.kpiMeta}>
                <span>
                  {pendingFinanceApprovals > 0
                    ? `${pendingFinanceApprovals} pending verification`
                    : "All claims reviewed"}
                </span>
                <Link
                  href="/dashboard/admin/finance"
                  style={{ color: "#9c6f18", fontWeight: 700 }}
                >
                  Ledger &rarr;
                </Link>
              </div>
            </div>

            {/* Tile 4: Classroom & Attendance Progression */}
            <div className={styles.kpiTile}>
              <div>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiTitle}>Academy Progression</span>
                  <Calendar size={18} color="#A855F7" />
                </div>
                <div className={styles.kpiValue}>
                  {progression.completedSessions.length} / 36
                </div>
              </div>
              <div className={styles.kpiMeta}>
                <span
                  style={{
                    color: progression.activeSession ? "#10B981" : "#6f665e",
                    fontWeight: 700,
                  }}
                >
                  {progression.activeSession
                    ? `🔴 Live: ${progression.activeSession.lessonCode}`
                    : `Next: ${progression.suggestedNextLesson.code}`}
                </span>
                <Link
                  href="/dashboard/admin/curriculum"
                  style={{ color: "#9c6f18", fontWeight: 700 }}
                >
                  Studio &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Two-Column Split: Live Activity Stream & Stock Depletion / Alerts */}
          <div className={styles.commandSplit}>
            {/* Left: Real-Time Activity Stream */}
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>
                  <Activity size={18} color="#9c6f18" />
                  <span>Recent activity</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#6f665e" }}>
                  Latest updates
                </span>
              </div>

              {activityStream.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#6f665e" }}>
                  No recent activity recorded yet.
                </div>
              ) : (
                <div className={styles.streamList}>
                  {activityStream.map((ev) => (
                    <div key={ev.id} className={styles.streamItem}>
                      <div className={styles.streamLeft}>
                        <div
                          className={styles.streamDot}
                          style={{
                            background: `${ev.color}20`,
                            color: ev.color,
                          }}
                        >
                          {ev.type === "checkout" ? (
                            <Cpu size={16} />
                          ) : ev.type === "task" ? (
                            <CheckSquare size={16} />
                          ) : (
                            <DollarSign size={16} />
                          )}
                        </div>
                        <div>
                          <div className={styles.streamBodyTitle}>{ev.title}</div>
                          <div className={styles.streamBodySub}>{ev.subtitle}</div>
                        </div>
                      </div>
                      <span
                        className={styles.tagBadge}
                        style={{
                          background: `${ev.color}20`,
                          color: ev.color,
                          border: `1px solid ${ev.color}40`,
                        }}
                      >
                        {ev.tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Stock Depletion Warnings & Overdue Hardware Alerts */}
            <div className={styles.panelCard}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>
                  <AlertTriangle size={18} color="#9c6f18" />
                  <span>Equipment alerts</span>
                </div>
                <Link
                  href="/dashboard/inventory"
                  style={{ fontSize: "0.78rem", color: "#9c6f18", fontWeight: 700 }}
                >
                  Manage Ledger &rarr;
                </Link>
              </div>

              <div className={styles.streamList}>
                {lowStockItems.length === 0 && overdueTotalCount === 0 ? (
                  <div style={{ padding: "1.75rem", textAlign: "center", color: "#10B981" }}>
                    ✓ All component stocks are above minimum thresholds and no gear is overdue.
                  </div>
                ) : (
                  <>
                    {lowStockItems.slice(0, 5).map((item) => (
                      <div key={item.id} className={styles.streamItem}>
                        <div>
                          <div className={styles.streamBodyTitle}>{item.name}</div>
                          <div className={styles.streamBodySub}>
                            Category: {item.category} • Min Threshold: {item.minThreshold}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span
                            className={styles.tagBadge}
                            style={{
                              background: "rgba(239, 68, 68, 0.18)",
                              color: "#EF4444",
                              border: "1px solid rgba(239, 68, 68, 0.4)",
                            }}
                          >
                            {item.quantity} left
                          </span>
                          <Link
                            href="/dashboard/admin/finance"
                            style={{
                              fontSize: "0.74rem",
                              color: "#9c6f18",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Requisition &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          VIEW 2: MEMBER CENTRAL HUB (Personalized Daily Briefing & Floating Dock)
          ===================================================================== */}
      {/* Overdue Warning Banner for Borrower */}
      {myOverdueCheckouts.length > 0 && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.14)",
            border: "1px solid rgba(239, 68, 68, 0.45)",
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
            <AlertTriangle size={22} color="#EF4444" />
            <div>
              <strong style={{ color: "#EF4444", fontSize: "0.95rem" }}>
                Action Required: {myOverdueCheckouts.length} Checked-Out Lab Component(s) Overdue
              </strong>
              <div style={{ fontSize: "0.82rem", color: "#27211d" }}>
                Please return {myOverdueCheckouts.map((c) => c.partName).join(", ")} to the Lab Rack or renew your checkout.
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/checkout"
            className={styles.dockBtnPrimary}
            style={{ padding: "0.5rem 0.95rem", borderRadius: "8px", fontWeight: 800, fontSize: "0.82rem" }}
          >
            Return Hardware Now
          </Link>
        </div>
      )}

      {/* Quick Actions Floating Dock */}
      <div className={styles.quickActionsDock}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#9c6f18", textTransform: "uppercase", letterSpacing: "1px" }}>
            Frequent actions
          </div>
          <div style={{ fontSize: "0.92rem", color: "#27211d", fontWeight: 600 }}>
            Start a common workspace task
          </div>
        </div>
        <div className={styles.dockButtons}>
          <Link href="/dashboard/checkout" className={`${styles.dockBtn} ${styles.dockBtnPrimary}`}>
            <Cpu size={16} />
            <span>Request Lab Gear</span>
          </Link>
          <Link href="/dashboard/finance" className={styles.dockBtn}>
            <DollarSign size={16} />
            <span>Submit Expense / Dues</span>
          </Link>
          <Link href="/dashboard/tasks" className={styles.dockBtn}>
            <Wrench size={16} />
            <span>Log Build Progress</span>
          </Link>
          <Link href="/dashboard/curriculum" className={styles.dockBtn}>
            <BookOpen size={16} />
            <span>Open Learning Deck</span>
          </Link>
        </div>
      </div>

      {/* Personalized Daily Briefing (3 Pillars: My Tasks Due, Upcoming Classes, Hardware in My Custody) */}
      <div className={styles.briefingGrid}>
        {/* Pillar 1: My Tasks Due / Active Sprints */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <CheckSquare size={18} color="#10B981" />
              <span>My Active Tasks ({myActiveTasks.length})</span>
            </div>
            <Link href="/dashboard/tasks" style={{ fontSize: "0.78rem", color: "#9c6f18", fontWeight: 700 }}>
              Sprint Board &rarr;
            </Link>
          </div>
          <div className={styles.streamList}>
            {myActiveTasks.length === 0 ? (
              <div style={{ padding: "1.25rem", textAlign: "center", color: "#6f665e", fontSize: "0.86rem" }}>
                No pending tasks assigned to you right now.
              </div>
            ) : (
              myActiveTasks.slice(0, 3).map((t) => (
                <div key={t.id} className={styles.streamItem}>
                  <div>
                    <div className={styles.streamBodyTitle}>{t.title}</div>
                    <div className={styles.streamBodySub}>
                      {t.competitionName ? `🏆 ${t.competitionName}` : "General Team Sprint"}
                      {t.dueDate ? ` • Due ${t.dueDate}` : ""}
                    </div>
                  </div>
                  <span
                    className={styles.tagBadge}
                    style={{
                      background: "rgba(245, 184, 0, 0.15)",
                      color: "#9c6f18",
                      border: "1px solid rgba(245, 184, 0, 0.35)",
                    }}
                  >
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pillar 2: Upcoming Classes / Routines */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Calendar size={18} color="#9c6f18" />
              <span>Upcoming Class Routine</span>
            </div>
            <Link href="/dashboard/attendance" style={{ fontSize: "0.78rem", color: "#9c6f18", fontWeight: 700 }}>
              Full Schedule &rarr;
            </Link>
          </div>
          <div className={styles.streamList}>
            {progression.activeSession ? (
              <div className={styles.streamItem} style={{ borderColor: "rgba(16, 185, 129, 0.45)" }}>
                <div>
                  <div className={styles.streamBodyTitle} style={{ color: "#10B981" }}>
                    🔴 LIVE NOW: {progression.activeSession.title}
                  </div>
                  <div className={styles.streamBodySub}>
                    {progression.activeSession.lessonCode} • {progression.activeSession.location}
                  </div>
                </div>
                <Link
                  href="/dashboard/attendance"
                  className={styles.tagBadge}
                  style={{ background: "#10B981", color: "#f7f5f1" }}
                >
                  Check In
                </Link>
              </div>
            ) : progression.nextSession ? (
              <div className={styles.streamItem}>
                <div>
                  <div className={styles.streamBodyTitle}>{progression.nextSession.title}</div>
                  <div className={styles.streamBodySub}>
                    📅 {progression.nextSession.date} at {progression.nextSession.time || "15:30"}
                  </div>
                </div>
                <span
                  className={styles.tagBadge}
                  style={{ background: "rgba(245, 184, 0, 0.16)", color: "#9c6f18" }}
                >
                  {progression.nextSession.lessonCode}
                </span>
              </div>
            ) : (
              <div className={styles.streamItem}>
                <div>
                  <div className={styles.streamBodyTitle}>
                    Next in Track: {progression.suggestedNextLesson.title}
                  </div>
                  <div className={styles.streamBodySub}>
                    {progression.suggestedNextLesson.code} • Review pre-class material
                  </div>
                </div>
                <Link
                  href="/dashboard/curriculum"
                  className={styles.tagBadge}
                  style={{ background: "rgba(245, 184, 0, 0.16)", color: "#9c6f18" }}
                >
                  Study &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Pillar 3: Hardware in My Custody */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Cpu size={18} color="#06B6D4" />
              <span>Hardware in My Custody ({myCheckouts.length})</span>
            </div>
            <Link href="/dashboard/checkout" style={{ fontSize: "0.78rem", color: "#9c6f18", fontWeight: 700 }}>
              Lab Desk &rarr;
            </Link>
          </div>
          <div className={styles.streamList}>
            {myCheckouts.length === 0 ? (
              <div style={{ padding: "1.25rem", textAlign: "center", color: "#6f665e", fontSize: "0.86rem" }}>
                You currently have 0 components checked out from the lab.
              </div>
            ) : (
              myCheckouts.slice(0, 3).map((c) => (
                <div key={c.id} className={styles.streamItem}>
                  <div>
                    <div className={styles.streamBodyTitle}>
                      {c.quantity}x {c.partName}
                    </div>
                    <div className={styles.streamBodySub}>
                      {c.expectedReturnDate
                        ? `Return by: ${c.expectedReturnDate}`
                        : `${c.daysCheckedOut || 0} day(s) in custody`}
                    </div>
                  </div>
                  <span
                    className={styles.tagBadge}
                    style={{
                      background: c.isOverdue
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(6, 182, 212, 0.18)",
                      color: c.isOverdue ? "#EF4444" : "#06B6D4",
                    }}
                  >
                    {c.isOverdue ? "OVERDUE" : "IN CUSTODY"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Preserved Dedication Scorecard */}
      <div
        className={`glass-panel ${styles.scoreCard}`}
        style={{ borderColor: `${scoreColor}40` }}
      >
        <div className={styles.scoreMain}>
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.82rem",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            Innovator Dedication Scorecard
          </div>
          <div className={styles.scoreVal} style={{ color: scoreColor }}>
            {score} <span className={styles.scorePts}>XP</span>
          </div>
          <div className={styles.scoreGrade} style={{ color: scoreColor }}>
            {scoreGrade}
          </div>
        </div>

        <div className={styles.scoreDivider}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{attendanceCount}</div>
            <div className={styles.statLabel}>Classes Attended</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{myCompletedTasksCount}</div>
            <div className={styles.statLabel}>Tasks Completed</div>
          </div>
          <div className={styles.statItem}>
            <div
              className={styles.statNum}
              style={{ color: labStatus === "Open" ? "#10B981" : "#EF4444" }}
            >
              {labStatus}
            </div>
            <div className={styles.statLabel}>Physical Lab Status</div>
          </div>
          <div className={styles.statItem}>
            <div
              className={styles.statNum}
              style={{ color: myPendingPayments > 0 ? "#9c6f18" : "#10B981" }}
            >
              {myPendingPayments > 0 ? `${myPendingPayments} Pending` : "Clear"}
            </div>
            <div className={styles.statLabel}>Dues Status</div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Tiles */}
      <div className={styles.quickSectionTitle}>
        <Zap size={18} style={{ color: "var(--accent-primary)" }} />
          <span>Explore the workspace</span>
      </div>
      <div className={styles.quickGrid}>
        <Link
          href="/dashboard/curriculum"
          className={styles.quickCard}
          style={{
            border: "1px solid rgba(245, 184, 0, 0.35)",
            background:
              "linear-gradient(135deg, rgba(245, 184, 0, 0.1), rgba(17, 24, 39, 0.95))",
          }}
        >
          <div
            className={styles.quickIconBox}
            style={{ background: "rgba(245, 184, 0, 0.2)", color: "#9c6f18" }}
          >
            <Zap size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4 style={{ color: "#9c6f18" }}>Learning Deck &amp; LMS</h4>
            <p>36 Classes • 4 Tracks</p>
          </div>
        </Link>

        <Link href="/dashboard/checkout" className={styles.quickCard}>
          <div className={styles.quickIconBox}>
            <Package size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>Lab Requisition Desk</h4>
            <p>{inventory.length} components tracked</p>
          </div>
        </Link>

        <Link href="/dashboard/competitions" className={styles.quickCard}>
          <div
            className={styles.quickIconBox}
            style={{ background: "rgba(6, 182, 212, 0.15)", color: "#06B6D4" }}
          >
            <Trophy size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>Competition Arena</h4>
            <p>Rosters, Vault &amp; Events</p>
          </div>
        </Link>

        <Link href="/dashboard/tasks" className={styles.quickCard}>
          <div
            className={styles.quickIconBox}
            style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981" }}
          >
            <CheckSquare size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>Sprint &amp; Task Board</h4>
            <p>{myActiveTasks.length} active for you</p>
          </div>
        </Link>

        <Link href="/dashboard/attendance" className={styles.quickCard}>
          <div
            className={styles.quickIconBox}
            style={{ background: "rgba(168, 85, 247, 0.15)", color: "#A855F7" }}
          >
            <Calendar size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>Schedule &amp; Routine</h4>
            <p>Check-in &amp; class history</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
