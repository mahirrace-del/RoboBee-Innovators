"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { Logo } from "@/components/Logo";
import ClientLabStatus from "@/components/ClientLabStatus";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo width={30} height={30} />
          </Link>
          <ClientLabStatus />
        </div>
        
        {/* Desktop Links */}
        <div className={`${styles.navLinks} ${styles.desktopOnly}`}>
          <Link href="/#projects" className={styles.link}>Projects</Link>
          <Link href="/#achievements" className={styles.link}>Achievements</Link>
          <Link href="/recruitment" className={styles.link}>Apply</Link>
          <Link href="/portal" className={styles.loginBtn}>Portal Login</Link>
        </div>

        {/* Mobile Toggle */}
        <div className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/#projects" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Projects</Link>
          <Link href="/#achievements" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Achievements</Link>
          <Link href="/recruitment" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Apply</Link>
          <Link href="/portal" className={styles.mobileLoginBtn} onClick={() => setIsOpen(false)}>Portal Login</Link>
        </div>
      )}
    </nav>
  );
}
