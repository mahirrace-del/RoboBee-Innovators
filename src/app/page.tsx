"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Cpu,
  Shield,
  MapPin,
  CheckCircle2,
  X,
  Phone,
} from "lucide-react";
import { HeroLearningStackBento } from "@/components/public/HeroLearningStackBento";
import { FacilitiesAndPathwaysBento } from "@/components/public/FacilitiesAndPathwaysBento";
import { ProjectHardwareCard } from "@/components/public/ProjectHardwareCard";
import { CompetitionCard, CompetitionCardItem, Segment } from "@/components/public/CompetitionCard";
import { AchievementBentoCard } from "@/components/public/AchievementBentoCard";
import { MemberOrbitShowcase, MarqueeItem } from "@/components/public/MemberOrbitShowcase";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  status?: string;
  tags?: string[];
}

interface LeaderData {
  id: string;
  name: string;
  role: string;
  image?: string;
}

interface AchievementData {
  id: string;
  title: string;
  year: string;
  description: string;
  image?: string;
}

export default function Home() {
  // Live Firestore Real-Time Subscriptions
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionCardItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [marquees, setMarquees] = useState<MarqueeItem[]>([]);
  const [leaders, setLeaders] = useState<LeaderData[]>([]);

  // Project Category Filter
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Public Competition Registration Modal State
  const [selectedComp, setSelectedComp] = useState<CompetitionCardItem | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regInstitution, setRegInstitution] = useState("");
  const [regTeamName, setRegTeamName] = useState("");
  const [regNotes, setRegNotes] = useState("");
  const [regAgreed, setRegAgreed] = useState(false);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  useEffect(() => {
    // 1. Live Projects from Admin CMS
    const unsubProjects = onSnapshot(
      collection(db, "projects"),
      (snap) => {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectData)));
      },
      (err) => {
        console.warn("Could not read projects from Firestore:", err);
      }
    );

    // 2. Live Competitions from Admin CMS (Sorted chronologically by date)
    const unsubCompetitions = onSnapshot(
      collection(db, "competitions"),
      (snap) => {
        const publicComps = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as CompetitionCardItem))
          .filter((c) => c.visibility !== "members_only" && c.status !== "Completed");
        publicComps.sort((a, b) => {
          const timeA = a.date ? new Date(a.date).getTime() : 0;
          const timeB = b.date ? new Date(b.date).getTime() : 0;
          return timeA - timeB;
        });
        setCompetitions(publicComps);
      },
      (err) => {
        console.warn("Could not read competitions from Firestore:", err);
      }
    );

    // 3. Live Achievements from Admin CMS (Sorted by year desc with resilient fallback)
    const unsubAchievements = onSnapshot(
      collection(db, "achievements"),
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AchievementData));
        items.sort((a, b) => String(b.year || "").localeCompare(String(a.year || "")));
        setAchievements(items);
      },
      (err) => {
        console.warn("Could not read achievements from Firestore:", err);
      }
    );

    // 4. Live Marquee Member Avatars from Admin CMS
    const unsubMarquee = onSnapshot(
      collection(db, "marquee"),
      (snap) => {
        setMarquees(snap.docs.map((d) => ({ id: d.id, ...d.data() } as MarqueeItem)));
      },
      (err) => {
        console.warn("Could not read marquee items from Firestore:", err);
      }
    );

    // 5. Live Core Team Leaders from Admin CMS
    const unsubLeaders = onSnapshot(
      collection(db, "leaders"),
      (snap) => {
        setLeaders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as LeaderData)));
      },
      (err) => {
        console.warn("Could not read leaders from Firestore:", err);
      }
    );

    return () => {
      unsubProjects();
      unsubCompetitions();
      unsubAchievements();
      unsubMarquee();
      unsubLeaders();
    };
  }, []);

  // Filter projects by active tab
  const filteredProjects = projects.filter((p) => {
    if (projectFilter === "all") return true;
    const text = `${p.title || ""} ${p.description || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
    if (projectFilter === "beginner") {
      return text.includes("basic") || text.includes("beginner") || text.includes("circuit") || text.includes("starter");
    }
    if (projectFilter === "automation") {
      return text.includes("smart") || text.includes("sensor") || text.includes("automation") || text.includes("iot");
    }
    if (projectFilter === "competition") {
      return text.includes("maze") || text.includes("solver") || text.includes("arm") || text.includes("sumo") || text.includes("soccer") || text.includes("pid");
    }
    return true;
  });

  const handleOpenRegistration = (comp: CompetitionCardItem) => {
    setSelectedComp(comp);
    const firstSegId = comp.segments && comp.segments.length > 0 ? comp.segments[0].id : "default";
    setSelectedSegmentId(firstSegId);
    setRegAgreed(false);
    setRegSuccess(false);
    setRegError("");
  };

  const handleCloseRegistration = () => {
    setSelectedComp(null);
    setRegName("");
    setRegPhone("");
    setRegEmail("");
    setRegInstitution("");
    setRegTeamName("");
    setRegNotes("");
    setRegAgreed(false);
    setRegSuccess(false);
    setRegError("");
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setRegError("Please provide your Name and WhatsApp phone number.");
      return;
    }

    if (!regAgreed) {
      setRegError("Please confirm agreement with the tournament rules.");
      return;
    }

    if (!selectedComp) return;

    try {
      setIsSubmittingReg(true);
      setRegError("");

      const chosenSegment = selectedComp.segments?.find((s: Segment) => s.id === selectedSegmentId) || {
        name: selectedComp.name || "General Entry",
        fee: selectedComp.fee || 0,
      };

      // 100% Admin CMS Competitions Dashboard Compatibility:
      // Writes both standard schema (fullName, whatsapp, location, experience, submittedAt)
      // and legacy aliases for bulletproof interoperability.
      await addDoc(collection(db, "public_competition_registrations"), {
        competitionId: selectedComp.id,
        competitionName: selectedComp.name,
        segmentId: selectedSegmentId,
        segmentName: chosenSegment.name,
        fee: chosenSegment.fee || 0,
        fullName: regName.trim(),
        applicantName: regName.trim(),
        whatsapp: regPhone.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        location: regInstitution.trim(),
        institution: regInstitution.trim(),
        teamName: regTeamName.trim(),
        experience: regNotes.trim(),
        notes: regNotes.trim(),
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        status: "pending",
      });

      setRegSuccess(true);
    } catch (err: unknown) {
      console.error("Error submitting registration:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to submit registration. Please try again or contact us via WhatsApp.";
      setRegError(errMsg);
    } finally {
      setIsSubmittingReg(false);
    }
  };

  return (
    <div className={styles.main}>
      {/* Background Ambience & Architectural Grid */}
      <div className={styles.circuitOverlay} />
      <div className={`${styles.shape1} ${styles.shape}`} />
      <div className={`${styles.shape2} ${styles.shape}`} />

      {/* =========================================================================
          HERO SECTION (BALANCED 12-COLUMN MODERN ASYMMETRIC SPLIT)
          ========================================================================= */}
      <section className={styles.hero}>
        <div className={styles.heroSplitGrid}>
          {/* Left Column: Typography, Mission & High-Impact CTAs */}
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Sparkles size={14} />
              <span>NARAYANGANJ&apos;S PREMIER ROBOTICS &amp; MAKER LAB &bull; EVERY FRIDAY</span>
            </div>

            <h1 className={styles.title}>
              Learn Electronics, Build Real Robots,{" "}
              <span className={styles.titleHighlight}>Compete Globally.</span>
            </h1>

            <p className={styles.subtitle}>
              A hands-on robotics training hub and maker lab at North Chashara, Narayanganj. We mentor students
              step-by-step from basic breadboard circuits and Arduino programming to 3D-printed mechanisms and
              national robotics olympiads.
            </p>

            <div className={styles.ctaContainer}>
              <Link href="/recruitment" className={styles.primaryBtn}>
                <span>Apply for Membership</span>
                <ArrowRight size={18} />
              </Link>

              <Link href="#features" className={styles.secondaryBtn}>
                <Cpu size={18} color="#38BDF8" />
                <span>Explore Curriculum &amp; Lab</span>
              </Link>
            </div>

            {/* 4 Minimalist Stat Pillars */}
            <div className={styles.heroMetricsStrip}>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>Every Friday</span>
                <span className={styles.metricLabel}>Hands-On Lab Classes</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>100+ Modules</span>
                <span className={styles.metricLabel}>Electronics &amp; Sensors</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>Rapid Prototyping</span>
                <span className={styles.metricLabel}>3D Printers &amp; Hardware</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>Zero to Advanced</span>
                <span className={styles.metricLabel}>Guided Mentorship</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Layered Interactive Curriculum & Project Bento */}
          <div>
            <HeroLearningStackBento />
          </div>
        </div>
      </section>

      {/* =========================================================================
          INSIDE OUR MAKER LAB & PROGRAMS BENTO
          ========================================================================= */}
      <FacilitiesAndPathwaysBento />

      {/* =========================================================================
          DYNAMIC PROJECTS & LAB BUILDS (ADMIN CMS SYNCED)
          ========================================================================= */}
      <section id="projects" className={styles.projectsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionPill}>
            <Sparkles size={14} />
            <span>Hardware Prototypes</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Featured Projects &amp; <span style={{ color: "#38BDF8" }}>Lab Builds</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Autonomous mobile robots, intelligent microcontrollers, and custom-fabricated hardware built inside our maker laboratory.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className={styles.filterPillsRow}>
          <button
            onClick={() => setProjectFilter("all")}
            className={`${styles.filterPill} ${projectFilter === "all" ? styles.filterPillActive : ""}`}
          >
            All Builds ({projects.length})
          </button>
          <button
            onClick={() => setProjectFilter("beginner")}
            className={`${styles.filterPill} ${projectFilter === "beginner" ? styles.filterPillActive : ""}`}
          >
            Beginner Projects
          </button>
          <button
            onClick={() => setProjectFilter("automation")}
            className={`${styles.filterPill} ${projectFilter === "automation" ? styles.filterPillActive : ""}`}
          >
            Smart Automation
          </button>
          <button
            onClick={() => setProjectFilter("competition")}
            className={`${styles.filterPill} ${projectFilter === "competition" ? styles.filterPillActive : ""}`}
          >
            Competition Bots
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94A3B8", padding: "2rem" }}>
            No builds in this category yet. Explore our other projects or visit the lab on Friday.
          </p>
        ) : (
          <div className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <ProjectHardwareCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          DYNAMIC COMPETITIONS & TOURNAMENTS (ADMIN CMS SYNCED)
          ========================================================================= */}
      {competitions.length > 0 && (
        <section id="competitions" className={styles.competitionsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionPill}>
              <Trophy size={14} />
              <span>Tournaments &amp; Arenas</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Robotics <span style={{ color: "#38BDF8" }}>Competitions &amp; Challenges</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Test your engineering skills, race your autonomous robots, and compete for trophies in our scheduled regional and national matches.
            </p>
          </div>

          <div className={styles.competitionsGrid}>
            {competitions.map((comp) => (
              <CompetitionCard
                key={comp.id}
                comp={comp}
                onRegister={handleOpenRegistration}
              />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          DYNAMIC ACHIEVEMENTS & PODIUMS (ADMIN CMS SYNCED)
          ========================================================================= */}
      <section id="achievements" className={styles.achievementsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionPill}>
            <Sparkles size={14} />
            <span>Honors &amp; Podiums</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Competitive <span style={{ color: "#38BDF8" }}>Milestones &amp; Achievements</span>
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
              Meet the <span style={{ color: "#38BDF8" }}>Core Team</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              The hardware architects and mentors guiding RoboBee Innovators toward new horizons.
            </p>
          </div>

          <div className={styles.leaderGrid}>
            {leaders.map((leader) => (
              <div key={leader.id} className={styles.leaderCard}>
                {leader.image?.trim() ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={leader.image.trim()}
                    alt={leader.name}
                    className={styles.leaderAvatar}
                  />
                ) : (
                  <div className={styles.leaderAvatarPlaceholder}>
                    {leader.name ? leader.name.charAt(0) : "R"}
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
          MOVING ROUND MEMBER HEADS SHOWCASE (ADMIN CMS SYNCED)
          ========================================================================= */}
      <MemberOrbitShowcase marquees={marquees} />

      {/* =========================================================================
          CLEAN MODERN FOOTER
          ========================================================================= */}
      <footer className={styles.footer}>
        <div className={styles.footerContentGrid}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerBrandTitle}>RoboBee Innovators</div>
            <p className={styles.footerBrandDesc}>
              A hands-on robotics training hub and hardware maker laboratory at North Chashara, Narayanganj. Empowering curious minds to dream, invent, experiment, and inspire.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#64748B" }}>
              <MapPin size={15} color="#38BDF8" />
              <span>North Chashara, Narayanganj, Bangladesh</span>
            </div>
          </div>

          <div>
            <div className={styles.footerColTitle}>Navigation</div>
            <div className={styles.footerLinksList}>
              <Link href="/#features">Programs &amp; Lab</Link>
              <Link href="/#projects">Hardware Projects</Link>
              <Link href="/#competitions">Competitions</Link>
              <Link href="/#achievements">Achievements</Link>
              <Link href="/#members">Maker Community</Link>
              <Link href="/recruitment">Apply for Membership</Link>
            </div>
          </div>

          <div>
            <div className={styles.footerColTitle}>Lab Operations</div>
            <div className={styles.footerLinksList}>
              <span style={{ color: "#E2E8F0" }}>Every Friday In-Person</span>
              <span style={{ color: "#94A3B8" }}>Hands-on breadboarding, 3D printing &amp; soldering sessions</span>
              <a href="tel:+8801902821018" style={{ color: "#38BDF8", fontWeight: 600 }}>
                +880 1902-821018
              </a>
            </div>
          </div>
        </div>

        {/* Social Buttons */}
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

        <p style={{ fontSize: "0.86rem", color: "#64748B" }}>
          &copy; 2026 RoboBee Innovators. All rights reserved.
        </p>
      </footer>

      {/* =========================================================================
          PUBLIC COMPETITION REGISTRATION MODAL
          ========================================================================= */}
      {selectedComp && (
        <div className={styles.modalOverlay} onClick={handleCloseRegistration}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={handleCloseRegistration}
              aria-label="Close registration modal"
            >
              <X size={20} />
            </button>

            {regSuccess ? (
              <div className={styles.modalSuccessCard}>
                <div className={styles.modalSuccessIcon}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 className={styles.modalTitle}>Registration Submitted!</h3>
                <p className={styles.modalSubtitle}>
                  Thank you, <strong>{regName}</strong>. Your registration for{" "}
                  <strong>{selectedComp.name}</strong> has been received by our tournament coordinators. We will contact you on WhatsApp at <strong>{regPhone}</strong> with tournament slot details.
                </p>
                <button
                  type="button"
                  className={styles.modalSubmitBtn}
                  onClick={handleCloseRegistration}
                >
                  Close &amp; Return to Page
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: "16px", background: "rgba(56, 189, 248, 0.12)", color: "#38BDF8", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.6rem" }}>
                  <Trophy size={13} />
                  <span>Competition Registration</span>
                </div>

                <h3 className={styles.modalTitle}>{selectedComp.name}</h3>
                <p className={styles.modalSubtitle}>
                  Fill in your details below to secure a competition slot. Our tournament desk will verify your entry and notify you via WhatsApp.
                </p>

                {regError && (
                  <div style={{ padding: "0.75rem 1rem", borderRadius: "10px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.35)", color: "#FCA5A5", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
                    {regError}
                  </div>
                )}

                {/* Segments Selection */}
                {selectedComp.segments && selectedComp.segments.length > 0 && (
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>Select Competition Category / Segment</label>
                    <div className={styles.modalCategoriesGrid}>
                      {selectedComp.segments.map((seg: Segment) => {
                        const isChosen = selectedSegmentId === seg.id;
                        return (
                          <label
                            key={seg.id}
                            className={`${styles.modalCategoryRadio} ${isChosen ? styles.modalCategoryRadioActive : ""}`}
                          >
                            <input
                              type="radio"
                              name="competitionSegment"
                              value={seg.id}
                              checked={isChosen}
                              onChange={() => setSelectedSegmentId(seg.id)}
                              className={styles.modalRadioDot}
                            />
                            <div className={styles.modalCategoryDetails}>
                              <div className={styles.modalCategoryTop}>
                                <span>{seg.name}</span>
                                {seg.fee > 0 && (
                                  <span className={styles.modalCategoryFee}>{seg.fee} BDT</span>
                                )}
                              </div>
                              {seg.description && (
                                <div className={styles.modalCategoryNote}>{seg.description}</div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Name */}
                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>Full Name / Lead Competitor *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className={styles.modalInput}
                  />
                </div>

                {/* Phone (WhatsApp) */}
                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>WhatsApp Mobile Number *</label>
                  <div className={styles.whatsappPrefixBox}>
                    <div className={styles.whatsappIconBadge}>
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className={styles.whatsappInput}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. student@school.edu.bd"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className={styles.modalInput}
                  />
                </div>

                {/* Institution & Team Name */}
                <div className={styles.modalTwoColGrid}>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>School / College / Univ</label>
                    <input
                      type="text"
                      placeholder="e.g. Narayanganj Govt. College"
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>Team / Robot Name</label>
                    <input
                      type="text"
                      placeholder="e.g. TurboBee MK-1"
                      value={regTeamName}
                      onChange={(e) => setRegTeamName(e.target.value)}
                      className={styles.modalInput}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className={styles.modalFormGroup}>
                  <label className={styles.modalLabel}>Robot Specifications or Special Notes</label>
                  <textarea
                    placeholder="e.g. Arduino Nano based, 2-wheel drive, dual IR sensors..."
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    className={styles.modalTextarea}
                  />
                </div>

                {/* Terms & WhatsApp Contact Agreement Checkbox */}
                <label className={styles.modalCheckboxLabel}>
                  <input
                    type="checkbox"
                    required
                    checked={regAgreed}
                    onChange={(e) => setRegAgreed(e.target.checked)}
                    className={styles.modalCheckbox}
                  />
                  <span>
                    I confirm that our registration details are accurate and agree to tournament communications via WhatsApp.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className={styles.modalSubmitBtn}
                >
                  {isSubmittingReg ? "Submitting Registration..." : "Confirm Competition Entry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
