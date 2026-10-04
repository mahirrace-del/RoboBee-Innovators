"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { Logo } from "@/components/Logo";
import { auth, db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role, signOut } = useAuth();
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

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.mobileHeader}>
        <Logo width={30} height={30} />
        <button className={styles.mobileMenuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarLogoDesktop} style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>
          <Logo width={30} height={30} />
        </div>
        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold' }}>
          CORE
        </div>
        <Link href="/dashboard" className={styles.navItem} onClick={closeSidebar}>
          Dashboard Overview
        </Link>
        <Link href="/dashboard/profile" className={styles.navItem} onClick={closeSidebar}>
          My Profile
        </Link>

        <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold' }}>
          ACTIVITIES
        </div>
        <Link href="/dashboard/tasks" className={styles.navItem} onClick={closeSidebar}>
          My Tasks
        </Link>
        <Link href="/dashboard/attendance" className={styles.navItem} onClick={closeSidebar}>
          Attendance
        </Link>
        <Link href="/dashboard/competitions" className={styles.navItem} onClick={closeSidebar}>
          Competitions
        </Link>

        <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold' }}>
          RESOURCES
        </div>
        <Link href="/dashboard/lab" className={styles.navItem} onClick={closeSidebar}>
          Lab Status
        </Link>
        <Link href="/dashboard/inventory" className={styles.navItem} onClick={closeSidebar}>
          Inventory
        </Link>
        <Link href="/dashboard/checkout" className={styles.navItem} onClick={closeSidebar}>
          Hardware Checkout
        </Link>
        <Link href="/dashboard/bom" className={styles.navItem} onClick={closeSidebar}>
          Project BOM
        </Link>

        <div style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold' }}>
          FINANCE
        </div>
        <Link href="/dashboard/finance" className={styles.navItem} onClick={closeSidebar}>
          Finance & bKash
        </Link>
        
        {role === "admin" && (
          <>
            <div style={{ marginTop: '1.5rem', color: '#ff5555', fontSize: '0.75rem', paddingLeft: '1rem', fontWeight: 'bold' }}>
              ADMIN CONTROLS
            </div>
            <Link href="/dashboard/members" className={styles.navItem} onClick={closeSidebar}>
              Manage Members
            </Link>
            <Link href="/dashboard/admin/finance" className={styles.navItem} onClick={closeSidebar}>
              Manage Finances
            </Link>
            <Link href="/dashboard/admin/attendance" className={styles.navItem} onClick={closeSidebar}>
              Manage Attendance
            </Link>
            <Link href="/dashboard/admin/requests" className={styles.navItem} onClick={closeSidebar}>
              Parts Requests
            </Link>
            <Link href="/dashboard/admin/public-site" className={styles.navItem} onClick={closeSidebar}>
              Public Site Content
            </Link>
            <Link href="/dashboard/admin/competitions" className={styles.navItem} onClick={closeSidebar}>
              Manage Competitions
            </Link>
          </>
        )}

        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{user.email}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
            Role: {role}
          </span>
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
    </div>
  );
}
