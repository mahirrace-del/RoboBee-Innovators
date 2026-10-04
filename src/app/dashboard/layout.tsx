"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { Logo } from "@/components/Logo";
import { auth, db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Menu, X, Home, Package, Trophy, User as UserIcon, LayoutGrid, LogOut, Shield, DollarSign, CalendarCheck, CheckSquare, Layers } from "lucide-react";
import { getUserRoleBadge } from "@/lib/permissions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role, signOut, userData, canManage } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/portal");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className={styles.loader}>Loading your dashboard...</div>;
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
        // Delete Firestore document first
        await deleteDoc(doc(db, "users", user.uid));
        // Delete Firebase Auth account
        await user.delete();
      }
      router.push("/portal");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      // If it requires recent login to delete, catch and ask them to re-login or just sign out
      if (error.code === 'auth/requires-recent-login') {
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
      <div className={styles.dashboardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo width={60} height={60} />
          </div>
          <h2 style={{ color: '#F4B304', marginBottom: '1rem' }}>Application Under Review</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Your membership application has been received and is currently in a <strong>Pending</strong> state.
            An admin must approve your application before you can access the member portal.
          </p>
          <button onClick={handleSignOut} className={styles.submitBtn} style={{ width: '100%' }}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Lockdown screen for declined users
  if (role === "declined") {
    return (
      <div className={styles.dashboardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', borderTop: '4px solid #ff5555' }}>
          <h2 style={{ color: '#ff5555', marginBottom: '1rem' }}>Application Declined</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Unfortunately, your membership application was not approved. You can delete this application to start over or use a different email address.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleDeleteDeclinedAccount} className={styles.submitBtn} style={{ flex: 1, background: 'rgba(255, 85, 85, 0.2)', color: '#ff5555' }} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Application"}
            </button>
            <button onClick={handleSignOut} className={styles.submitBtn} style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handleToggle = () => setSidebarOpen(prev => !prev);
    window.addEventListener('toggle-portal-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-portal-sidebar', handleToggle);
  }, []);

  const pathname = usePathname();
  const isAct = (href: string) => pathname === href ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem;

  return (
    <div className={styles.dashboardContainer}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.5rem 1.25rem 0.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '0.75rem'
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--accent-primary)',
            background: 'rgba(244, 179, 4, 0.1)',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid rgba(244, 179, 4, 0.25)',
            display: 'inline-block'
          }}>
            Team Portal
          </span>
          <button
            onClick={closeSidebar}
            className={styles.sidebarCloseBtn}
            aria-label="Close sidebar navigation"
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          CORE
        </div>
        <Link href="/dashboard" className={isAct("/dashboard")} onClick={closeSidebar}>
          Dashboard Overview
        </Link>
        <Link href="/dashboard/profile" className={isAct("/dashboard/profile")} onClick={closeSidebar}>
          My Profile
        </Link>

        <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          ACTIVITIES
        </div>
        <Link href="/dashboard/tasks" className={isAct("/dashboard/tasks")} onClick={closeSidebar}>
          My Tasks
        </Link>
        <Link href="/dashboard/attendance" className={isAct("/dashboard/attendance")} onClick={closeSidebar}>
          Attendance
        </Link>
        <Link href="/dashboard/competitions" className={isAct("/dashboard/competitions")} onClick={closeSidebar}>
          Competitions
        </Link>

        <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          RESOURCES
        </div>
        <Link href="/dashboard/lab" className={isAct("/dashboard/lab")} onClick={closeSidebar}>
          Lab Status
        </Link>
        <Link href="/dashboard/inventory" className={isAct("/dashboard/inventory")} onClick={closeSidebar}>
          Inventory
        </Link>
        <Link href="/dashboard/checkout" className={isAct("/dashboard/checkout")} onClick={closeSidebar}>
          Hardware Checkout
        </Link>
        <Link href="/dashboard/bom" className={isAct("/dashboard/bom")} onClick={closeSidebar}>
          Project BOM
        </Link>

        <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          FINANCE
        </div>
        <Link href="/dashboard/finance" className={isAct("/dashboard/finance")} onClick={closeSidebar}>
          Finance & bKash
        </Link>

        {/* Admin Controls */}
        {role === "admin" ? (
          <>
            <div style={{ marginTop: '1.5rem', color: '#ff5555', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
              ADMIN CONTROLS
            </div>
            <Link href="/dashboard/members" className={isAct("/dashboard/members")} onClick={closeSidebar}>
              Manage Members
            </Link>
            <Link href="/dashboard/admin/finance" className={isAct("/dashboard/admin/finance")} onClick={closeSidebar}>
              Manage Finances
            </Link>
            <Link href="/dashboard/admin/attendance" className={isAct("/dashboard/admin/attendance")} onClick={closeSidebar}>
              Manage Attendance
            </Link>
            <Link href="/dashboard/admin/requests" className={isAct("/dashboard/admin/requests")} onClick={closeSidebar}>
              Parts Requests
            </Link>
            <Link href="/dashboard/admin/public-site" className={isAct("/dashboard/admin/public-site")} onClick={closeSidebar}>
              Public Site Content
            </Link>
            <Link href="/dashboard/admin/competitions" className={isAct("/dashboard/admin/competitions")} onClick={closeSidebar}>
              Manage Competitions
            </Link>
          </>
        ) : (
          /* Delegated Staff / Specialized Role Controls */
          (canManage("manage_store") || canManage("manage_achievements") || canManage("manage_competitions") || canManage("manage_finance") || canManage("manage_attendance") || canManage("manage_members")) && (
            <>
              <div style={{ marginTop: '1.5rem', color: '#a855f7', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                STAFF CONTROLS
              </div>
              {canManage("manage_members") && (
                <Link href="/dashboard/members" className={isAct("/dashboard/members")} onClick={closeSidebar}>
                  Manage Members
                </Link>
              )}
              {canManage("manage_store") && (
                <>
                  <Link href="/dashboard/inventory" className={isAct("/dashboard/inventory")} onClick={closeSidebar}>
                    Store Management
                  </Link>
                  <Link href="/dashboard/admin/requests" className={isAct("/dashboard/admin/requests")} onClick={closeSidebar}>
                    Parts Requests
                  </Link>
                </>
              )}
              {canManage("manage_competitions") && (
                <Link href="/dashboard/admin/competitions" className={isAct("/dashboard/admin/competitions")} onClick={closeSidebar}>
                  Manage Competitions
                </Link>
              )}
              {canManage("manage_achievements") && (
                <Link href="/dashboard/admin/public-site" className={isAct("/dashboard/admin/public-site")} onClick={closeSidebar}>
                  Public Site Content
                </Link>
              )}
              {canManage("manage_finance") && (
                <Link href="/dashboard/admin/finance" className={isAct("/dashboard/admin/finance")} onClick={closeSidebar}>
                  Manage Finances
                </Link>
              )}
              {canManage("manage_attendance") && (
                <Link href="/dashboard/admin/attendance" className={isAct("/dashboard/admin/attendance")} onClick={closeSidebar}>
                  Manage Attendance
                </Link>
              )}
            </>
          )
        )}

        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{user.email}</span>
          {(() => {
            const badge = getUserRoleBadge(userData);
            return (
              <span style={{
                fontSize: '0.75rem',
                color: badge.color,
                background: badge.background,
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontWeight: '600',
                display: 'inline-block',
                marginTop: '0.3rem',
                textTransform: 'uppercase',
                border: `1px solid ${badge.color}33`
              }}>
                {badge.label}
              </span>
            );
          })()}
          <button onClick={handleSignOut} className={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={closeSidebar}></div>
      )}

      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Dedicated Mobile Bottom App Bar */}
      <nav className={styles.mobileBottomNav} aria-label="Mobile Navigation">
        <Link
          href="/dashboard"
          className={`${styles.bottomNavItem} ${pathname === "/dashboard" ? styles.bottomNavItemActive : ""}`}
        >
          <Home size={20} />
          <span>Overview</span>
        </Link>
        <Link
          href="/dashboard/inventory"
          className={`${styles.bottomNavItem} ${pathname.startsWith("/dashboard/inventory") ? styles.bottomNavItemActive : ""}`}
        >
          <Package size={20} />
          <span>Store</span>
        </Link>
        <Link
          href="/dashboard/competitions"
          className={`${styles.bottomNavItem} ${pathname.startsWith("/dashboard/competitions") ? styles.bottomNavItemActive : ""}`}
        >
          <Trophy size={20} />
          <span>Events</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`${styles.bottomNavItem} ${pathname === "/dashboard/profile" ? styles.bottomNavItemActive : ""}`}
        >
          <UserIcon size={20} />
          <span>Profile</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className={`${styles.bottomNavItem} ${sidebarOpen ? styles.bottomNavItemActive : ""}`}
          aria-label="Toggle All Menus"
        >
          <LayoutGrid size={20} />
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
}
