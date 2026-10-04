"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { Logo } from "@/components/Logo";
import ClientLabStatus from "@/components/ClientLabStatus";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.brandGroup}>
          <Link href={isDashboard ? "/dashboard" : "/"} className={styles.brandLink}>
            <Logo width={28} height={28} />
          </Link>
          <ClientLabStatus />
        </div>
        
        {/* Desktop Links */}
        <div className={`${styles.navLinks} ${styles.desktopOnly}`}>
          {isDashboard ? (
            <>
              <Link href="/" className={styles.link}>Public Site</Link>
              <Link href="/dashboard" className={styles.loginBtn}>Portal Overview</Link>
            </>
          ) : (
            <>
              <Link href="/#projects" className={styles.link}>Projects</Link>
              <Link href="/#achievements" className={styles.link}>Achievements</Link>
              <Link href="/recruitment" className={styles.link}>Apply</Link>
              {!authLoading && user ? (
                <Link href="/dashboard" className={styles.portalActiveBtn}>
                  <span className={styles.onlineDot} />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link href="/portal" className={styles.loginBtn}>Portal Login</Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Toggle (Only on public pages; dashboard uses dedicated drawer toggle) */}
        {!isDashboard && (
          <button 
            className={styles.mobileToggle} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        )}
      </div>

      {/* Mobile Menu for Public Pages */}
      {!isDashboard && isOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/#projects" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Projects</Link>
          <Link href="/#achievements" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Achievements</Link>
          <Link href="/recruitment" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Apply</Link>
          {!authLoading && user ? (
            <Link href="/dashboard" className={styles.mobilePortalActiveBtn} onClick={() => setIsOpen(false)}>
              <span className={styles.onlineDot} />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <Link href="/portal" className={styles.mobileLoginBtn} onClick={() => setIsOpen(false)}>Portal Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

