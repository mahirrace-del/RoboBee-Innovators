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
  const isStyledPublicPage = pathname === '/' || pathname === '/recruitment';

  return (
    <nav className={isDashboard ? styles.navbar : isStyledPublicPage ? `${styles.navbar} ${styles.publicNavbar}` : styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.brandGroup}>
          <Link href={isDashboard ? "/dashboard" : "/"} className={styles.brandLink}>
            <Logo width={28} height={28} />
          </Link>
          <ClientLabStatus variant={isStyledPublicPage ? "light" : "default"} />
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
              <Link href="/#features" className={styles.link}>Programs</Link>
              <Link href="/#projects" className={styles.link}>Projects</Link>
              <Link href="/#competitions" className={styles.link}>Competitions</Link>
              <Link href="/#achievements" className={styles.link}>Achievements</Link>
              <Link href="/#members" className={styles.link}>Community</Link>
              <Link href="/recruitment" className={styles.link}>Apply</Link>
              {!authLoading && user ? (
                <Link href="/dashboard" className={styles.portalActiveBtn}>
                  <span className={styles.onlineDot} />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Link href="/portal" className={styles.loginBtn}>Portal Login</Link>
                  <Link href="/recruitment" className={styles.joinBtn}>Join the Lab &rarr;</Link>
                </div>
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
          <Link href="/#features" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Programs</Link>
          <Link href="/#projects" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Projects</Link>
          <Link href="/#competitions" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Competitions</Link>
          <Link href="/#achievements" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Achievements</Link>
          <Link href="/#members" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Community</Link>
          <Link href="/recruitment" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Apply</Link>
          {!authLoading && user ? (
            <Link href="/dashboard" className={styles.mobilePortalActiveBtn} onClick={() => setIsOpen(false)}>
              <span className={styles.onlineDot} />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem" }}>
              <Link href="/portal" className={styles.mobileLoginBtn} onClick={() => setIsOpen(false)}>Portal Login</Link>
              <Link href="/recruitment" className={styles.joinBtn} style={{ textAlign: "center" }} onClick={() => setIsOpen(false)}>Join the Lab &rarr;</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
