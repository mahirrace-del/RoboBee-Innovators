"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Cpu,
  Shield,
  Layers,
} from "lucide-react";
import { HeroRobotics3DViewport } from "@/components/public/HeroRobotics3DViewport";
import { FacilitiesAndPathwaysBento } from "@/components/public/FacilitiesAndPathwaysBento";
import { AchievementBentoCard } from "@/components/public/AchievementBentoCard";
import { MemberOrbitShowcase } from "@/components/public/MemberOrbitShowcase";

export default function Home() {
  // Live Firestore Real-Time Subscriptions
  const [achievements, setAchievements] = useState<any[]>([]);
  const [marquees, setMarquees] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    // 1. Live Achievements from Admin CMS (Ordered by year desc)
    const unsubAchievements = onSnapshot(
      query(collection(db, "achievements"), orderBy("year", "desc")),
      (snap) => {
        setAchievements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    // 2. Live Marquee Member Avatars from Admin CMS
    const unsubMarquee = onSnapshot(collection(db, "marquee"), (snap) => {
      setMarquees(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // 3. Live Core Team Leaders from Admin CMS
    const unsubLeaders = onSnapshot(collection(db, "leaders"), (snap) => {
      setLeaders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubAchievements();
      unsubMarquee();
      unsubLeaders();
    };
  }, []);

  return (
    <div className={styles.main}>
      {/* Background Ambience & Circuit Grid */}
      <div className={styles.circuitOverlay} />
      <div className={`${styles.shape1} ${styles.shape}`} />
      <div className={`${styles.shape2} ${styles.shape}`} />

      {/* =========================================================================
          HERO SECTION (SPLIT 3D ENGINEERING HERO)
          ========================================================================= */}
      <section className={styles.hero}>
        <div className={styles.heroSplitGrid}>
          {/* Left Column: Mission, Branding & High-Impact CTAs */}
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Sparkles size={14} />
              <span>Next-Gen Robotics &amp; STEM Lab</span>
            </div>

            <h1 className={styles.title}>
              Engineering the <span className={styles.titleHighlight}>Future</span> of Autonomous Robotics
            </h1>

            <p className={styles.subtitle}>
              Welcome to <strong>RoboBee Innovators</strong>. We are a community of passionate builders,
              engineers, and creators advancing robotics, automation, and artificial intelligence.
              Join us to turn your ideas into reality.
            </p>

            <div className={styles.ctaContainer}>
              <Link href="/recruitment" className={styles.primaryBtn}>
                <span>Apply for Membership</span>
                <ArrowRight size={18} />
              </Link>

              <Link href="#features" className={styles.secondaryBtn}>
                <Cpu size={18} color="#F5B700" />
                <span>Explore Our Lab</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D Spatial Hardware Viewport */}
          <div>
            <HeroRobotics3DViewport />
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHAT WE DO, FACILITIES & CURRICULUM BENTO
          ========================================================================= */}
      <FacilitiesAndPathwaysBento />

      {/* Invisible anchor target for backwards compatibility with navbar links */}
      <div id="projects" style={{ position: "relative", top: "-80px" }} />
      <div id="competitions" style={{ position: "relative", top: "-80px" }} />

      {/* =========================================================================
          DYNAMIC ACHIEVEMENTS & TROPHY ARENA (ADMIN CMS SYNCED)
          ========================================================================= */}
      <section id="achievements" className={styles.achievementsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionPill}>
            <Sparkles size={14} />
            <span>Honors &amp; Podiums</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Competitive <span style={{ color: "#F5B700" }}>Milestones &amp; Achievements</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Representing on the national and international stage—from FIRSO 2026 UIU to international arenas in Malaysia.
          </p>
        </div>

        {achievements.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94A3B8" }}>Our journey has just begun.</p>
        ) : (
          <div className={styles.achievementsGrid}>
            {achievements.map((ach) => (
              <AchievementBentoCard key={ach.id} achievement={ach} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          CORE TEAM / LEADERSHIP SECTION (ADMIN CMS SYNCED)
          ========================================================================= */}
      {leaders.length > 0 && (
        <section id="leadership" className={styles.leadershipSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionPill}>
              <Shield size={14} />
              <span>Leadership &amp; Mentorship</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Meet the <span style={{ color: "#F5B700" }}>Core Team</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              The leaders, hardware architects, and visionaries guiding RoboBee Innovators toward new horizons.
            </p>
          </div>

          <div className={styles.leaderGrid}>
            {leaders.map((leader) => (
              <div key={leader.id} className={styles.leaderCard}>
                {leader.image?.trim() ? (
                  <img
                    src={leader.image.trim()}
                    alt={leader.name}
                    className={styles.leaderAvatar}
                  />
                ) : (
                  <div className={styles.leaderAvatarPlaceholder}>
                    {leader.name.charAt(0)}
                  </div>
                )}
                <h3 className={styles.leaderName}>{leader.name}</h3>
                <p className={styles.leaderRole}>{leader.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          PRESERVED MOVING ROUND MEMBER HEADS SHOWCASE (ADMIN CMS SYNCED)
          ========================================================================= */}
      <MemberOrbitShowcase marquees={marquees} />

      {/* =========================================================================
          FOOTER & SOCIAL CONNECT
          ========================================================================= */}
      <footer className={styles.footer}>
        <div className={styles.socialContainer}>
          <a
            href="https://www.facebook.com/robobeeinnovators/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fbLink}
            aria-label="Visit RoboBee Innovators on Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </a>

          <a
            href="https://www.instagram.com/robobee.innovators/reels/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.igLink}
            aria-label="Visit RoboBee Innovators on Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
        <p style={{ fontSize: "0.88rem", color: "#64748B" }}>
          &copy; 2026 RoboBee Innovators. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
