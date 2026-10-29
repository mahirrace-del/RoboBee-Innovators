"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { Logo } from "@/components/Logo";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import {
  Menu,
  X,
  Home,
  Package,
  Trophy,
  User as UserIcon,
  LogOut,
  Shield,
  DollarSign,
  CalendarCheck,
  CheckSquare,
  BookOpen,
  Compass,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Radio,
  Wrench,
  Globe,
  Users,
} from "lucide-react";
import { getUserRoleBadge } from "@/lib/permissions";
import { normalizeCheckout, normalizeInventoryItem } from "@/lib/portalRelations";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role, signOut, userData, canManage } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAdminNavOpen, setIsAdminNavOpen] = useState(() => pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/members"));

  // Live relational alerts for top contextual bar & nav badges
  const [overdueCheckoutsCount, setOverdueCheckoutsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [hasLiveClass, setHasLiveClass] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/portal");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleToggle = () => setSidebarOpen((prev) => !prev);
    window.addEventListener("toggle-portal-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-portal-sidebar", handleToggle);
  }, []);

  // Subscribe to relational alerts (Overdue Checkouts, Low Stock, Active Session)
  useEffect(() => {
    if (!user) return;

    const unsubCheckouts = onSnapshot(
      collection(db, "checkouts"),
      (snap) => {
        const items = snap.docs.map((d) => normalizeCheckout({ id: d.id, ...d.data() }));
        const relevant =
          role === "admin" || canManage("manage_store")
            ? items
            : items.filter((c) => c.checkedOutBy === user.email || c.userId === user.uid);
        setOverdueCheckoutsCount(relevant.filter((c) => c.isOverdue).length);
      },
      () => {}
    );

    const unsubInventory = onSnapshot(
      collection(db, "inventory"),
      (snap) => {
        const items = snap.docs.map((d) => normalizeInventoryItem({ id: d.id, ...d.data() }));
        setLowStockCount(items.filter((i) => i.quantity <= i.minThreshold).length);
      },
      () => {}
    );

    const unsubSessions = onSnapshot(
      collection(db, "sessions"),
      (snap) => {
        const active = snap.docs.some((d) => d.data().status === "active");
        setHasLiveClass(active);
      },
      () => {}
    );

    return () => {
      unsubCheckouts();
      unsubInventory();
      unsubSessions();
    };
  }, [user, role, canManage]);

  if (loading || !user) {
    return <div className={styles.loader}>Loading RoboBEE Portal Engine...</div>;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleDeleteDeclinedAccount = async () => {
    setIsDeleting(true);
    try {
      if (user) {
        await deleteDoc(doc(db, "users", user.uid));
        await user.delete();
      }
      router.push("/portal");
    } catch (error: unknown) {
      console.error("Error deleting account:", error);
      const errorCode = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
      if (errorCode === "auth/requires-recent-login") {
        alert("For security, please sign out and sign in again before deleting your application.");
      } else {
        alert("Failed to delete application. Please contact admin.");
      }
      setIsDeleting(false);
    }
  };

  // Lockdown screen for pending users
  if (role === "pending") {
    return (
      <div className={styles.dashboardContainer} style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "500px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Logo width={60} height={60} />
          </div>
          <h2 style={{ color: "#9c6f18", marginBottom: "1rem" }}>Application Under Review</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
            Your membership application has been received and is currently in a <strong>Pending</strong> state.
            An admin must approve your application before you can access the member portal.
          </p>
          <button onClick={handleSignOut} className={styles.submitBtn} style={{ width: "100%" }}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Lockdown screen for declined users
  if (role === "declined") {
    return (
      <div className={styles.dashboardContainer} style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "500px", borderTop: "4px solid #EF4444" }}>
          <h2 style={{ color: "#EF4444", marginBottom: "1rem" }}>Application Declined</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
            Unfortunately, your membership application was not approved. You can delete this application to start over or use a different email address.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleDeleteDeclinedAccount}
              className={styles.submitBtn}
              style={{ flex: 1, background: "rgba(239, 68, 68, 0.2)", color: "#EF4444" }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Application"}
            </button>
            <button
              onClick={handleSignOut}
              className={styles.submitBtn}
              style={{ flex: 1, background: "var(--bg-elevated, #f4f1eb)", border: "1px solid var(--border-subtle, #dfd7cc)", color: "#27211d" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAct = (href: string) =>
    pathname === href ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem;

  const getBreadcrumbLabel = () => {
    if (pathname === "/dashboard") return role === "admin" ? "Overview" : "My workspace";
    if (pathname === "/dashboard/curriculum") return "Learning";
    if (pathname === "/dashboard/curriculum/reference") return "Field guide";
    if (pathname === "/dashboard/tasks") return "Tasks";
    if (pathname === "/dashboard/attendance") return "Schedule & attendance";
    if (pathname === "/dashboard/competitions") return "Competitions";
    if (pathname === "/dashboard/checkout") return "Equipment checkout";
    if (pathname === "/dashboard/inventory") return "Inventory";
    if (pathname === "/dashboard/bom") return "Project budgets";
    if (pathname === "/dashboard/finance") return "Dues & expenses";
    if (pathname === "/dashboard/profile") return "My profile";
    if (pathname.startsWith("/dashboard/admin/curriculum")) return "Classroom";
    if (pathname.startsWith("/dashboard/admin/competitions")) return "Manage competitions";
    if (pathname.startsWith("/dashboard/admin/finance")) return "Finance";
    if (pathname.startsWith("/dashboard/admin/attendance")) return "Manage attendance";
    if (pathname.startsWith("/dashboard/admin/requests")) return "Parts requests";
    if (pathname.startsWith("/dashboard/members")) return "Members & access";
    return "RoboBEE Portal";
  };

  const badge = getUserRoleBadge(userData);

  return (
    <div className={styles.dashboardContainer}>
      {/* Left Navigation Sidebar Rail (260px Desktop / Collapsible 76px / Off-Canvas Drawer Mobile) */}
      <aside
        className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ""} ${
          sidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          {!sidebarCollapsed && <span className={styles.portalBadge}>RoboBEE OS</span>}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className={styles.collapseRailBtn}
            title={sidebarCollapsed ? "Expand sidebar rail" : "Collapse sidebar rail"}
            aria-label="Toggle sidebar rail width"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            onClick={closeSidebar}
            className={styles.sidebarCloseBtn}
            aria-label="Close sidebar navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* SECTION 1: MEMBER PORTAL & LEARNING DECK */}
        {!sidebarCollapsed && <div className={styles.sectionHeading}>WORKSPACE</div>}
        <Link href="/dashboard" className={isAct("/dashboard")} onClick={closeSidebar} title="Central Hub">
          <Home size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>Central Hub</span>}
        </Link>
        <Link
          href="/dashboard/curriculum"
          className={isAct("/dashboard/curriculum")}
          onClick={closeSidebar}
          title="Learning Deck (38 Classes)"
        >
          <BookOpen size={18} className={styles.navIcon} />
          {!sidebarCollapsed && (
            <>
              <span className={styles.navLabel}>Learning Deck</span>
              <span className={styles.navPill}>38 Classes</span>
            </>
          )}
        </Link>
        <Link
          href="/dashboard/curriculum/reference"
          className={isAct("/dashboard/curriculum/reference")}
          onClick={closeSidebar}
          title="Field Guide & Pinouts"
        >
          <Compass size={18} className={styles.navIcon} color="#9c6f18" />
          {!sidebarCollapsed && (
            <>
              <span className={styles.navLabel} style={{ color: "#9c6f18" }}>
                Field Guide
              </span>
              <span className={styles.navPill}>22 Docs</span>
            </>
          )}
        </Link>

        {/* SECTION 2: SPRINT & ARENA */}
        {!sidebarCollapsed && <div className={styles.sectionHeading}>PROJECTS &amp; CLASSES</div>}
        <Link
          href="/dashboard/tasks"
          className={isAct("/dashboard/tasks")}
          onClick={closeSidebar}
          title="Task & Sprint Board"
        >
          <CheckSquare size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>Task &amp; Sprint Board</span>}
        </Link>
        <Link
          href="/dashboard/competitions"
          className={isAct("/dashboard/competitions")}
          onClick={closeSidebar}
          title="Competition Arena & Workbench"
        >
          <Trophy size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>Competition Arena</span>}
        </Link>
        <Link
          href="/dashboard/attendance"
          className={isAct("/dashboard/attendance")}
          onClick={closeSidebar}
          title="Class Schedule & Attendance"
        >
          <CalendarCheck size={18} className={styles.navIcon} />
          {!sidebarCollapsed && (
            <>
              <span className={styles.navLabel}>Schedule &amp; Routine</span>
              {hasLiveClass && <span className={styles.navPill}>LIVE</span>}
            </>
          )}
        </Link>

        {/* SECTION 3: HARDWARE & LAB LOGISTICS */}
        {!sidebarCollapsed && <div className={styles.sectionHeading}>LAB</div>}
        <Link
          href="/dashboard/checkout"
          className={isAct("/dashboard/checkout")}
          onClick={closeSidebar}
          title="Lab Requisition & Checkout"
        >
          <Cpu size={18} className={styles.navIcon} />
          {!sidebarCollapsed && (
            <>
              <span className={styles.navLabel}>Lab Requisition</span>
              {overdueCheckoutsCount > 0 && (
                <span className={`${styles.navPill} ${styles.navPillAlert}`}>
                  {overdueCheckoutsCount} Overdue
                </span>
              )}
            </>
          )}
        </Link>
        <Link
          href="/dashboard/inventory"
          className={isAct("/dashboard/inventory")}
          onClick={closeSidebar}
          title="Components & Inventory"
        >
          <Package size={18} className={styles.navIcon} />
          {!sidebarCollapsed && (
            <>
              <span className={styles.navLabel}>Components</span>
              {(role === "admin" || canManage("manage_store")) && lowStockCount > 0 && (
                <span className={`${styles.navPill} ${styles.navPillAlert}`}>{lowStockCount} Low</span>
              )}
            </>
          )}
        </Link>
        <Link
          href="/dashboard/bom"
          className={isAct("/dashboard/bom")}
          onClick={closeSidebar}
          title="Project BOM & Budgets"
        >
          <Layers size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>Project BOM</span>}
        </Link>
        <Link
          href="/dashboard/lab"
          className={isAct("/dashboard/lab")}
          onClick={closeSidebar}
          title="Lab Telemetry & Status"
        >
          <Wrench size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>Lab Status</span>}
        </Link>

        {/* SECTION 4: TREASURY & PROFILE */}
        {!sidebarCollapsed && <div className={styles.sectionHeading}>ACCOUNT</div>}
        <Link
          href="/dashboard/finance"
          className={isAct("/dashboard/finance")}
          onClick={closeSidebar}
          title="Dues & Expense Requisitions"
        >
          <DollarSign size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>Dues &amp; Claims</span>}
        </Link>
        <Link
          href="/dashboard/profile"
          className={isAct("/dashboard/profile")}
          onClick={closeSidebar}
          title="My Profile"
        >
          <UserIcon size={18} className={styles.navIcon} />
          {!sidebarCollapsed && <span className={styles.navLabel}>My Profile</span>}
        </Link>

        {/* SECTION 5: ADMIN / INSTRUCTOR COMMAND CONTROLS */}
        {role === "admin" ? (
          <details className={styles.managementNav} open={isAdminNavOpen} onToggle={(event) => setIsAdminNavOpen(event.currentTarget.open)}>
            <summary className={`${styles.sectionHeading} ${styles.sectionHeadingAdmin} ${styles.managementSummary}`}>
              <span><Shield size={15} /> {!sidebarCollapsed && "Administration"}</span>
              {!sidebarCollapsed && <ChevronDown size={15} className={styles.managementChevron} />}
            </summary>
            <Link
              href="/dashboard/admin/curriculum"
              className={isAct("/dashboard/admin/curriculum")}
              onClick={closeSidebar}
              title="Curriculum & Classroom Studio"
              style={{ color: "#9c6f18", fontWeight: 700 }}
            >
              <Radio size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Classroom Studio</span>}
            </Link>
            <Link
              href="/dashboard/admin/competitions"
              className={isAct("/dashboard/admin/competitions")}
              onClick={closeSidebar}
              title="Competition Command Center"
            >
              <Trophy size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Competition Command</span>}
            </Link>
            <Link
              href="/dashboard/admin/finance"
              className={isAct("/dashboard/admin/finance")}
              onClick={closeSidebar}
              title="Treasury & Expense Ledger"
            >
              <DollarSign size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Treasury &amp; Ledger</span>}
            </Link>
            <Link
              href="/dashboard/admin/attendance"
              className={isAct("/dashboard/admin/attendance")}
              onClick={closeSidebar}
              title="Attendance & Routine Command"
            >
              <CalendarCheck size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Manage Attendance</span>}
            </Link>
            <Link
              href="/dashboard/admin/requests"
              className={isAct("/dashboard/admin/requests")}
              onClick={closeSidebar}
              title="Parts Requisition Queue"
            >
              <Package size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Parts Requisitions</span>}
            </Link>
            <Link
              href="/dashboard/members"
              className={isAct("/dashboard/members")}
              onClick={closeSidebar}
              title="Manage Members & RBAC"
            >
              <Users size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Members &amp; RBAC</span>}
            </Link>
            <Link
              href="/dashboard/admin/public-site"
              className={isAct("/dashboard/admin/public-site")}
              onClick={closeSidebar}
              title="Public Site CMS"
            >
              <Globe size={18} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Public Site CMS</span>}
            </Link>
          </details>
        ) : (
          (canManage("manage_curriculum") ||
            canManage("manage_store") ||
            canManage("manage_achievements") ||
            canManage("manage_competitions") ||
            canManage("manage_finance") ||
            canManage("manage_attendance") ||
            canManage("manage_members")) && (
            <>
              {!sidebarCollapsed && (
                <div className={`${styles.sectionHeading} ${styles.sectionHeadingAdmin}`}>
                  MANAGEMENT
                </div>
              )}
              {canManage("manage_curriculum") && (
                <Link
                  href="/dashboard/admin/curriculum"
                  className={isAct("/dashboard/admin/curriculum")}
                  onClick={closeSidebar}
                  style={{ color: "#9c6f18", fontWeight: 700 }}
                >
                  <Radio size={18} className={styles.navIcon} />
                  {!sidebarCollapsed && <span className={styles.navLabel}>Classroom Studio</span>}
                </Link>
              )}
              {canManage("manage_members") && (
                <Link href="/dashboard/members" className={isAct("/dashboard/members")} onClick={closeSidebar}>
                  <Users size={18} className={styles.navIcon} />
                  {!sidebarCollapsed && <span className={styles.navLabel}>Manage Members</span>}
                </Link>
              )}
              {canManage("manage_store") && (
                <Link
                  href="/dashboard/admin/requests"
                  className={isAct("/dashboard/admin/requests")}
                  onClick={closeSidebar}
                >
                  <Package size={18} className={styles.navIcon} />
                  {!sidebarCollapsed && <span className={styles.navLabel}>Parts Requisitions</span>}
                </Link>
              )}
              {canManage("manage_competitions") && (
                <Link
                  href="/dashboard/admin/competitions"
                  className={isAct("/dashboard/admin/competitions")}
                  onClick={closeSidebar}
                >
                  <Trophy size={18} className={styles.navIcon} />
                  {!sidebarCollapsed && <span className={styles.navLabel}>Competition Command</span>}
                </Link>
              )}
              {canManage("manage_achievements") && (
                <Link
                  href="/dashboard/admin/public-site"
                  className={isAct("/dashboard/admin/public-site")}
                  onClick={closeSidebar}
                >
                  <Globe size={18} className={styles.navIcon} />
                  {!sidebarCollapsed && <span className={styles.navLabel}>Public Site CMS</span>}
                </Link>
              )}
              {canManage("manage_finance") && (
                <Link
                  href="/dashboard/admin/finance"
                  className={isAct("/dashboard/admin/finance")}
                  onClick={closeSidebar}
                >
                  <DollarSign size={18} className={styles.navIcon} />
                  {!sidebarCollapsed && <span className={styles.navLabel}>Treasury &amp; Ledger</span>}
                </Link>
              )}
              {canManage("manage_attendance") && (
                <Link
                  href="/dashboard/admin/attendance"
                  className={isAct("/dashboard/admin/attendance")}
                  onClick={closeSidebar}
                >
                  <CalendarCheck size={18} className={styles.navIcon} />
                  {!sidebarCollapsed && <span className={styles.navLabel}>Manage Attendance</span>}
                </Link>
              )}
            </>
          )
        )}

        <div className={styles.userInfo}>
          {!sidebarCollapsed && <span className={styles.userEmail}>{user.email}</span>}
          {!sidebarCollapsed && (
            <span
              style={{
                fontSize: "0.7rem",
                color: badge.color,
                background: badge.background,
                padding: "0.2rem 0.55rem",
                borderRadius: "4px",
                fontWeight: 700,
                display: "inline-block",
                textTransform: "uppercase",
                border: `1px solid ${badge.color}33`,
                width: "fit-content",
              }}
            >
              {badge.label}
            </span>
          )}
          <button onClick={handleSignOut} className={styles.logoutBtn} title="Sign Out">
            <LogOut size={15} />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={closeSidebar} />}

      {/* Main Fluid Content Area + Sticky Contextual Top Header Bar */}
      <div className={`${styles.mainWrapper} ${sidebarCollapsed ? styles.mainWrapperExpanded : ""}`}>
        <header className={styles.contextTopBar}>
          <div className={styles.contextLeft}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={styles.mobileDrawerTrigger}
              aria-label="Open Portal Navigation Drawer"
            >
              <Menu size={20} />
            </button>
            <div className={styles.breadcrumbGroup}>
              <span>RoboBEE Portal</span>
              <span>/</span>
              <span className={styles.breadcrumbCurrent}>{getBreadcrumbLabel()}</span>
            </div>
          </div>

          <div className={styles.contextRight}>
            {hasLiveClass && (
              <Link href="/dashboard/attendance" className={`${styles.alertChip} ${styles.alertChipSuccess}`}>
                <Radio size={13} />
                <span>Class Live Now</span>
              </Link>
            )}
            {overdueCheckoutsCount > 0 && (
              <Link href="/dashboard/checkout" className={`${styles.alertChip} ${styles.alertChipDanger}`}>
                <AlertTriangle size={13} />
                <span>{overdueCheckoutsCount} Overdue Gear</span>
              </Link>
            )}
            {(role === "admin" || canManage("manage_store")) && lowStockCount > 0 && (
              <Link href="/dashboard/inventory" className={`${styles.alertChip} ${styles.alertChipWarning}`}>
                <Package size={13} />
                <span>{lowStockCount} Low Stock</span>
              </Link>
            )}
            <NotificationCenter />
            <span
              style={{
                fontSize: "0.72rem",
                color: badge.color,
                background: badge.background,
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
                fontWeight: 700,
                textTransform: "uppercase",
                border: `1px solid ${badge.color}33`,
              }}
            >
              <Shield size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              {badge.label}
            </span>
          </div>
        </header>

        <main className={styles.mainContent}>{children}</main>
      </div>

      {/* Fixed Bottom Glassmorphic Navigation Bar (Dashboard, Tasks, Class, Lab, Profile) */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile Navigation">
        <Link
          href="/dashboard"
          className={`${styles.bottomNavItem} ${pathname === "/dashboard" ? styles.bottomNavItemActive : ""}`}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/dashboard/tasks"
          className={`${styles.bottomNavItem} ${pathname.startsWith("/dashboard/tasks") ? styles.bottomNavItemActive : ""}`}
        >
          <CheckSquare size={20} />
          <span>Tasks</span>
        </Link>
        <Link
          href="/dashboard/curriculum"
          className={`${styles.bottomNavItem} ${pathname.startsWith("/dashboard/curriculum") ? styles.bottomNavItemActive : ""}`}
        >
          <BookOpen size={20} />
          <span>Class</span>
        </Link>
        <Link
          href="/dashboard/checkout"
          className={`${styles.bottomNavItem} ${
            pathname.startsWith("/dashboard/checkout") || pathname.startsWith("/dashboard/inventory")
              ? styles.bottomNavItemActive
              : ""
          }`}
        >
          <Cpu size={20} />
          <span>Lab</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`${styles.bottomNavItem} ${pathname === "/dashboard/profile" ? styles.bottomNavItemActive : ""}`}
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
