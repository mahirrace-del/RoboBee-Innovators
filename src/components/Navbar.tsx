import Link from "next/link";
import styles from "./Navbar.module.css";
import { Logo } from "@/components/Logo";
import ClientLabStatus from "@/components/ClientLabStatus";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo width={30} height={30} />
          </Link>
          <ClientLabStatus />
        </div>
        <div className={styles.navLinks}>
          <Link href="/#projects" className={styles.link}>Projects</Link>
          <Link href="/#achievements" className={styles.link}>Achievements</Link>
          <Link href="/recruitment" className={styles.link}>Apply</Link>
          <Link href="/portal" className={styles.loginBtn}>Portal Login</Link>
        </div>
      </div>
    </nav>
  );
}
