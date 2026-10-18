"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./curriculum.module.css";
import { 
  ALL_ROBOTICS_LESSONS, 
  COURSE_SPACES, 
  RoboticsLesson, 
  CourseTier, 
  ClassStatus, 
  getLessonsByTier 
} from "@/lib/curriculumData";
import { 
  ScheduledClassSession, 
  calculateScheduleProgression 
} from "@/lib/scheduleAttendance";
import {
  normalizeInventoryItem,
  verifyLessonBOMStock,
  RelationalInventoryItem,
  CustomSlideBlock,
} from "@/lib/portalRelations";
import { CurriculumSimulator } from "@/components/curriculum/CurriculumSimulator";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import {
  CLASS_01_SLIDES,
  THEME_PALETTE_CONFIG,
  PresentationMediaFrame,
} from "@/components/curriculum/Class1WorkshopDeck";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { 
  Award, Lock, Unlock, CheckCircle, Clock, Copy, Check, Download, 
  HelpCircle, Eye, Zap, BookOpen, Layers, X, Tv, Shield, Radio, Sparkles, Code,
  Wrench, AlertTriangle, FileText, Activity, CheckSquare, Info, ArrowRight, ExternalLink, Calendar,
  GraduationCap, Cloud, Database, Palette, Play, Compass
} from "lucide-react";

export default function MemberCurriculumPage() {
  const { user, userData } = useAuth();

  // Flagship Class 01 Lesson Record
  const class01Lesson: RoboticsLesson =
    ALL_ROBOTICS_LESSONS.find((l) => l.id === "beg-01") || ALL_ROBOTICS_LESSONS[0];

  // Class status tracking
  const [classStatuses, setClassStatuses] = useState<{ [id: string]: ClassStatus }>({
    "beg-01": "published",
  });

  // Selected lesson modal & Dual-Engine view modes
  const [activeLesson, setActiveLesson] = useState<RoboticsLesson | null>(null);
  const [workbenchMode, setWorkbenchMode] = useState<'student' | 'instructor'>('student');
  const [pacingMode, setPacingMode] = useState<'standard' | 'compact'>('standard');
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'hardware' | 'code_sim' | 'build_steps' | 'assessment'>('overview');

  // Completed classes tracking
  const [completedClasses, setCompletedClasses] = useState<{ [classId: string]: boolean }>({});
  const [userXp, setUserXp] = useState<number>(userData?.xp || 200);

  // Code copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Exit ticket submission state
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [revealedModelAnswers, setRevealedModelAnswers] = useState<{ [key: number]: boolean }>({});
  const [submittingQuiz, setSubmittingQuiz] = useState<boolean>(false);
  const [quizSuccess, setQuizSuccess] = useState<boolean>(false);

  // Projector preview & initial slide index
  const [projectorMode, setProjectorMode] = useState<boolean>(false);
  const [projectorInitialSlide, setProjectorInitialSlide] = useState<number>(0);

  // Live Lab Inventory & Custom Slide Blocks
  const [inventoryItems, setInventoryItems] = useState<RelationalInventoryItem[]>([]);
  const [customBlocks, setCustomBlocks] = useState<CustomSlideBlock[]>([]);

  useEffect(() => {
    try {
      const unsubInv = onSnapshot(collection(db, "inventory"), (snap) => {
        setInventoryItems(snap.docs.map(d => normalizeInventoryItem(d.id, d.data())));
      });
      const unsubBlocks = onSnapshot(collection(db, "curriculum_custom_blocks"), (snap) => {
        const blocks = snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomSlideBlock));
        blocks.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCustomBlocks(blocks);
      });
      return () => {
        unsubInv();
        unsubBlocks();
      };
    } catch {}
  }, []);

  // Listen to Firestore class status updates
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "curriculum_status"), (snapshot) => {
        const updates: { [id: string]: ClassStatus } = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.status) {
            updates[docSnap.id] = data.status;
          }
        });
        setClassStatuses(prev => ({ ...prev, ...updates }));
      }, (err) => {
        console.warn("Firestore curriculum_status offline, using fallback state:", err);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Error subscribing to curriculum_status:", e);
    }
  }, []);

  // Listen to user's completed quizzes in Firestore
  useEffect(() => {
    if (!user) return;
    try {
      const unsub = onSnapshot(collection(db, "curriculum_submissions"), (snapshot) => {
        const completed: { [classId: string]: boolean } = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.userId === user.uid && data.classId) {
            completed[data.classId] = true;
          }
        });
        setCompletedClasses(completed);
      }, (err) => {
        console.warn("Error reading submissions:", err);
      });
      return () => unsub();
    } catch (e) {}
  }, [user]);

  // Listen to scheduled sessions to sync with Class Schedule & Attendance
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledClassSession[]>([]);
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "sessions"), (snapshot) => {
        const list: ScheduledClassSession[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as ScheduledClassSession));
        setScheduledSessions(list);
      });
      return () => unsub();
    } catch (e) {}
  }, []);

  const progression = useMemo(() => calculateScheduleProgression(scheduledSessions), [scheduledSessions]);

  // Copy code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .ino file
  const handleDownloadIno = (lesson: RoboticsLesson) => {
    if (!lesson.codeLab) return;
    const filename = `RoboBEE_${lesson.code.replace(' ', '_')}.ino`;
    const blob = new Blob([lesson.codeLab.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Submit exit check quiz
  const handleQuizSubmit = async () => {
    if (!activeLesson) return;
    setSubmittingQuiz(true);

    try {
      const subId = `${user?.uid || 'anon'}_${activeLesson.id}_${Date.now()}`;
      await setDoc(doc(db, "curriculum_submissions", subId), {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'Student Pilot',
        classId: activeLesson.id,
        classCode: activeLesson.code,
        classTitle: activeLesson.title,
        answers: quizAnswers,
        xpAwarded: 100,
        submittedAt: new Date().toISOString()
      });

      // Update user XP in Firestore if logged in
      if (user) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            xp: increment(100)
          });
        } catch (e) {}
      }

      setCompletedClasses(prev => ({ ...prev, [activeLesson.id]: true }));
      setUserXp(prev => prev + 100);
      setQuizSuccess(true);
      setTimeout(() => setQuizSuccess(false), 4000);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      // Fallback local award
      setCompletedClasses(prev => ({ ...prev, [activeLesson.id]: true }));
      setUserXp(prev => prev + 100);
      setQuizSuccess(true);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const completedCount = Object.keys(completedClasses).length;
  const class01Status = classStatuses["beg-01"] || "published";
  const isClass01Completed = !!completedClasses["beg-01"];

  const launchProjectorAtSlide = (slideIdx: number) => {
    setProjectorInitialSlide(slideIdx);
    setActiveLesson(class01Lesson);
    setProjectorMode(true);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className={styles.heroTopRow}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>RoboBEE Innovators Academy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard/curriculum/reference"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#6B0F24',
                border: '1px solid #F5B800',
                color: '#ffffff',
                padding: '0.4rem 0.95rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(107, 15, 36, 0.4)'
              }}
            >
              <BookOpen size={16} color="#F5B800" />
              <span>Arduino &amp; Robotics Field Guide ➔</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 1rem', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Award size={18} color="#F5B800" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F5B800' }}>{userXp} RoboXP</span>
            </div>
          </div>
        </div>

        <h1 className={styles.heroTitle}>Interactive Learning Deck &amp; Live Presentation Studio</h1>
        <p className={styles.heroSubtitle}>
          <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em><br />
          Step inside <strong>Class 01: Introduction to Robotics &amp; Future Engineering</strong> — featuring a 12-slide multi-palette Keynote presentation, interactive Machine vs. Robot flip-cards, 5-part robot anatomy, and an interactive Arduino Uno R3 hardware lab!
        </p>

        <div className={styles.heroStats}>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue}>Class 01</span>
            <span className={styles.heroStatLabel}>Flagship Module</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#38bdf8' }}>12 Slides</span>
            <span className={styles.heroStatLabel}>Interactive Presentation</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#10b981' }}>{completedCount}</span>
            <span className={styles.heroStatLabel}>Completed Badges</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#F5B800' }}>4 Palettes</span>
            <span className={styles.heroStatLabel}>Dynamic Keynote Themes</span>
          </div>
        </div>
      </div>

      {/* Schedule Progression Live Banner */}
      {(progression.activeSession || progression.nextSession) && (
        <div style={{
          background: progression.activeSession 
            ? 'linear-gradient(135deg, rgba(107, 15, 36, 0.55), rgba(22, 27, 38, 0.95))' 
            : 'rgba(22, 27, 38, 0.85)',
          border: '1px solid',
          borderColor: progression.activeSession ? '#F5B800' : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '1.15rem 1.5rem',
          marginBottom: '2.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              {progression.activeSession ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                  <Radio size={12} /> Class Currently in Session
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 184, 0, 0.15)', color: '#F5B800', border: '1px solid rgba(245, 184, 0, 0.3)', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                  <Calendar size={12} /> Next Scheduled Class
                </span>
              )}
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                📅 {(progression.activeSession || progression.nextSession)?.date} &bull; {(progression.activeSession || progression.nextSession)?.time || '15:30'}
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
              {(progression.activeSession || progression.nextSession)?.lessonCode}: {(progression.activeSession || progression.nextSession)?.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              📍 {(progression.activeSession || progression.nextSession)?.location || 'RoboBEE Lab'}
            </div>
          </div>

          <Link
            href="/dashboard/attendance"
            style={{
              background: '#F5B800',
              color: '#161B26',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {progression.activeSession ? "Check In to Active Class ➔" : "View Schedule & Attendance ➔"}
          </Link>
        </div>
      )}

      {/* FLAGSHIP CLASS 01 RICH COURSE CARD */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #311042 52%, #0F172A 100%)",
          border: "2px solid rgba(0, 245, 212, 0.45)",
          borderRadius: "24px",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 24px 55px rgba(0, 0, 0, 0.5)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(0, 245, 212, 0.16)",
                border: "1px solid #00F5D4",
                color: "#00F5D4",
                padding: "0.3rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
              }}
            >
              CLASS 01 • FLAGSHIP MODULE
            </span>
            <span
              style={{
                background: "rgba(56, 189, 248, 0.16)",
                border: "1px solid #38BDF8",
                color: "#38BDF8",
                padding: "0.3rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Sparkles size={13} /> 12 Interactive Slides
            </span>
            <span
              style={{
                background: "rgba(251, 191, 36, 0.16)",
                border: "1px solid #FBBF24",
                color: "#FBBF24",
                padding: "0.3rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Palette size={13} /> 4 Dynamic Color Themes
            </span>
            {isClass01Completed && (
              <span
                style={{
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid #10B981",
                  color: "#34D399",
                  padding: "0.3rem 0.85rem",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <CheckCircle size={13} /> Completed (+100 XP)
              </span>
            )}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.7rem, 2.8vw, 2.35rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.15,
            }}
          >
            {class01Lesson.title}
          </h2>

          <p style={{ margin: 0, fontSize: "1rem", color: "#E0E7FF", lineHeight: 1.6 }}>
            {class01Lesson.promise}
          </p>

          {/* Topic Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {[
              "Why Robotics",
              "History (1206–Today)",
              "Machine vs. Robot Flip Quiz",
              "Sense → Think → Act",
              "5 Robot Parts",
              "Microcontrollers",
              "Arduino Uno Anatomy",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  color: "#FFFFFF",
                  padding: "0.28rem 0.65rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
            <button
              onClick={() => launchProjectorAtSlide(0)}
              style={{
                background: "linear-gradient(135deg, #00F5D4 0%, #38BDF8 100%)",
                color: "#090D16",
                border: "none",
                padding: "0.85rem 1.55rem",
                borderRadius: "14px",
                fontSize: "0.96rem",
                fontWeight: 900,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                boxShadow: "0 12px 28px rgba(0, 245, 212, 0.35)",
              }}
            >
              <Tv size={19} />
              Launch Live Projector (12 Slides)
            </button>

            <button
              onClick={() => {
                setActiveLesson(class01Lesson);
                setActiveTab("overview");
              }}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "0.85rem 1.35rem",
                borderRadius: "14px",
                fontSize: "0.92rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <BookOpen size={17} color="#00F5D4" />
              Open Hardware Lab &amp; Simulators
            </button>
          </div>
        </div>

        <div>
          <PresentationMediaFrame
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
            alt="Class 01: Introduction to Robotics & Future Engineering"
            caption="Class 01 Interactive Presentation • Click 'Launch Live Projector' to begin"
            fallbackVariant="robot-arm"
            accentColor="#00F5D4"
            height="320px"
            onZoom={() => launchProjectorAtSlide(0)}
          />
        </div>
      </div>

      {/* 12-SLIDE INTERACTIVE PREVIEW GRID */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.15rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 900, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Compass size={20} color="#38BDF8" />
              Class 01 Interactive Slide Deck (12 Slides • 4 Dynamic Palettes)
            </h3>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.86rem", color: "#94A3B8" }}>
              Click any slide below to launch the full-screen interactive presentation directly at that topic.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.1rem",
          }}
        >
          {CLASS_01_SLIDES.map((s, idx) => {
            const palette = THEME_PALETTE_CONFIG[s.theme];
            return (
              <div
                key={s.numberLabel}
                style={{
                  background: palette.canvasBg,
                  border: `2px solid ${palette.cardBorder}`,
                  borderRadius: "18px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "0.85rem",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.3)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.4rem", marginBottom: "0.65rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        padding: "0.22rem 0.6rem",
                        borderRadius: "999px",
                        background: palette.badgeBg,
                        color: palette.badgeText,
                        letterSpacing: "0.06em",
                      }}
                    >
                      SLIDE {s.numberLabel} • {palette.name.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        color: palette.mutedColor,
                        textTransform: "uppercase",
                      }}
                    >
                      {s.layout}
                    </span>
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <PresentationMediaFrame
                      src={s.heroImage}
                      alt={s.title}
                      caption={s.imageCaption}
                      fallbackVariant={s.theme === "arduino-teal" ? "arduino" : s.theme === "cyber-blueprint" ? "rover" : "robot-arm"}
                      accentColor={palette.accentPrimary}
                      height="165px"
                    />
                  </div>

                  <h4
                    style={{
                      margin: "0 0 0.35rem 0",
                      fontSize: "1.02rem",
                      fontWeight: 900,
                      color: palette.headingColor,
                      lineHeight: 1.25,
                    }}
                  >
                    {s.title}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: palette.bodyColor,
                      lineHeight: 1.45,
                    }}
                  >
                    {s.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => launchProjectorAtSlide(idx)}
                  style={{
                    width: "100%",
                    background: palette.isLight ? "#0F172A" : "rgba(255,255,255,0.14)",
                    color: "#FFFFFF",
                    border: `1px solid ${palette.accentPrimary}`,
                    borderRadius: "10px",
                    padding: "0.6rem 0.9rem",
                    fontSize: "0.82rem",
                    fontWeight: 900,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                  }}
                >
                  <Play size={14} /> Open Slide {s.numberLabel}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <div className={styles.lessonModalOverlay} onClick={() => setActiveLesson(null)}>
          <div className={styles.lessonModal} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={styles.lessonModalHeader}>
              <div className={styles.lessonModalTitleGroup} style={{ flexWrap: 'wrap', gap: '0.65rem' }}>
                <span className={styles.cardClassCode} style={{ fontSize: '0.9rem' }}>
                  {activeLesson.code}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                  {activeLesson.title}
                </h2>
                {/* Honest Save State Badge */}
                {user ? (
                  <span className={`${styles.syncBadge} ${styles.syncBadgeCloud}`} title="Your quiz submissions and progress sync to your cloud account.">
                    <Cloud size={12} />
                    <span>Saved to Account (Cloud)</span>
                  </span>
                ) : (
                  <span className={`${styles.syncBadge} ${styles.syncBadgeLocal}`} title="Work is saved locally in this browser. Sign in to sync across devices.">
                    <Database size={12} />
                    <span>Saved Locally in Browser (Sign in to sync)</span>
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* 3-Mode View Switcher */}
                <div className={styles.modeSwitcher}>
                  <button
                    onClick={() => setWorkbenchMode('student')}
                    className={`${styles.modeBtn} ${workbenchMode === 'student' ? styles.modeBtnActive : ''}`}
                    title="Student-facing workbench with interactive simulators, code, wiring, and exit tickets."
                  >
                    <BookOpen size={13} />
                    <span>Student Workbench</span>
                  </button>
                  <button
                    onClick={() => setWorkbenchMode('instructor')}
                    className={`${styles.modeBtn} ${workbenchMode === 'instructor' ? styles.modeBtnActive : ''}`}
                    title="Instructor teaching guide with lesson preparation checklist, pacing notes, and misconception alerts."
                  >
                    <GraduationCap size={13} />
                    <span>Instructor Guide</span>
                  </button>
                  <button
                    onClick={() => setProjectorMode(true)}
                    className={styles.modeBtn}
                    style={{ background: '#6B0F24', color: '#F5B800' }}
                    title="Launch full-screen 8-slide classroom teaching projector presentation."
                  >
                    <Tv size={13} color="#F5B800" />
                    <span style={{ color: '#ffffff' }}>Classroom Projector</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveLesson(null)}
                  className={styles.closeModalBtn}
                  aria-label="Close Modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Tabs Navigation (6 Tabs) */}
            <div className={styles.lessonNavTabs}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`${styles.lessonTabBtn} ${activeTab === 'overview' ? styles.lessonTabBtnActive : ''}`}
              >
                <BookOpen size={15} />
                <span>1. Overview &amp; Hook</span>
              </button>
              <button
                onClick={() => setActiveTab('agenda')}
                className={`${styles.lessonTabBtn} ${activeTab === 'agenda' ? styles.lessonTabBtnActive : ''}`}
              >
                <Calendar size={15} />
                <span>2. Schedule &amp; Agenda</span>
              </button>
              <button
                onClick={() => setActiveTab('hardware')}
                className={`${styles.lessonTabBtn} ${activeTab === 'hardware' ? styles.lessonTabBtnActive : ''}`}
              >
                <Layers size={15} />
                <span>3. Hardware &amp; Wiring</span>
              </button>
              <button
                onClick={() => setActiveTab('code_sim')}
                className={`${styles.lessonTabBtn} ${activeTab === 'code_sim' ? styles.lessonTabBtnActive : ''}`}
              >
                <Code size={15} />
                <span>4. Code Lab &amp; Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('build_steps')}
                className={`${styles.lessonTabBtn} ${activeTab === 'build_steps' ? styles.lessonTabBtnActive : ''}`}
              >
                <Wrench size={15} />
                <span>5. Build Steps &amp; Troubleshoot</span>
              </button>
              <button
                onClick={() => setActiveTab('assessment')}
                className={`${styles.lessonTabBtn} ${activeTab === 'assessment' ? styles.lessonTabBtnActive : ''}`}
              >
                <Award size={15} />
                <span>6. Assessment &amp; Sources</span>
              </button>
            </div>

            {/* Modal Tab Body */}
            <div className={styles.lessonTabBody}>
              {/* TAB 1: OVERVIEW & HOOK */}
              {activeTab === 'overview' && (
                <div>
                  {/* Instructor Banner */}
                  {workbenchMode === 'instructor' && (
                    <div className={styles.instructorBanner}>
                      <GraduationCap size={20} color="#F5B800" style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Instructor Teaching Guide Mode:</strong> Below are your classroom prep notes, verified materials kit, and pedagogical cues for <strong>{activeLesson.code}</strong>.
                      </div>
                    </div>
                  )}

                  {/* Instructor Prep & Materials if in Instructor Mode */}
                  {workbenchMode === 'instructor' && (
                    <div className={styles.twoColGrid} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                        <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckSquare size={16} />
                          <span>Teacher Preparation Checklist:</span>
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>
                          {activeLesson.teacherPrep.map((prep, i) => (
                            <li key={i} style={{ marginBottom: '0.35rem' }}>{prep}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                        <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Wrench size={16} />
                          <span>Verified Classroom Materials Kit:</span>
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>
                          {activeLesson.verifiedMaterials.map((mat, i) => (
                            <li key={i} style={{ marginBottom: '0.35rem' }}>{mat}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Hook / Promise Header */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(107, 15, 36, 0.35), rgba(22, 27, 38, 0.9))', border: '1px solid rgba(245, 184, 0, 0.3)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                      <span style={{ background: 'rgba(245, 184, 0, 0.15)', color: '#F5B800', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                        Proposed for {activeLesson.proposedAudience}
                      </span>
                      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                        ⏱ {activeLesson.durationMinutes}m Standard / {activeLesson.compactDurationMinutes || 60}m Compact
                      </span>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                        Deliverable: {activeLesson.project.deliverableType.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                      {activeLesson.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1rem', margin: 0 }}>
                      {activeLesson.promise}
                    </p>
                    <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                      <strong>Prerequisites:</strong> {activeLesson.prerequisites.join(', ')}
                    </div>
                  </div>

                  <div className={styles.twoColGrid}>
                    {/* Measurable Outcomes */}
                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                        🎯 Measurable Student Outcomes:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {activeLesson.outcomes.map((out, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.6rem' }}>
                            <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '0.88rem', color: '#f1f5f9' }}>{out}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Core Concepts */}
                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                        🧠 Core Engineering Concepts:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                        {activeLesson.concepts.map((concept, i) => (
                          <div key={i} style={{ background: '#090e18', padding: '0.75rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                            <div style={{ color: '#F5B800', fontWeight: 800, fontSize: '0.85rem' }}>
                              Concept {i + 1}: {concept.title}
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '0.25rem', lineHeight: '1.5' }}>
                              {concept.explanation}
                            </div>
                            {concept.instructorNote && (
                              <div style={{ marginTop: '0.5rem', background: 'rgba(245, 184, 0, 0.08)', padding: '0.45rem', borderRadius: '4px', fontSize: '0.75rem', color: '#F5B800' }}>
                                💡 <strong>Instructor Note:</strong> {concept.instructorNote}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vocabulary Table */}
                  <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      📖 Key Technical Vocabulary:
                    </div>
                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Term</th>
                            <th>Plain Language Meaning</th>
                            <th>Correct Technical Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeLesson.vocabulary.map((v, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 700, color: '#F5B800' }}>{v.term}</td>
                              <td style={{ color: '#cbd5e1' }}>{v.plainMeaning}</td>
                              <td style={{ color: '#38bdf8' }}>{v.technicalMeaning}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* FIELD GUIDE REFERENCE LINKS */}
                  {activeLesson.fieldGuideLinks && (
                    <div style={{ background: '#161B26', border: '1px solid #6B0F24', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BookOpen size={18} />
                          <span>Arduino &amp; Robotics Field Guide References</span>
                        </div>
                        <Link
                          href="/dashboard/curriculum/reference"
                          style={{ fontSize: '0.82rem', color: '#F5B800', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                        >
                          <span>Open Full Library</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                        {/* Read Before Class */}
                        <div style={{ background: '#0b101b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            📘 Read Before Class
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {activeLesson.fieldGuideLinks.readBeforeClass.map(id => (
                              <Link
                                key={id}
                                href={`/dashboard/curriculum/reference?entry=${id}`}
                                style={{ fontSize: '0.82rem', color: '#f1f5f9', textDecoration: 'none', padding: '0.35rem 0.6rem', background: '#1e293b', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <span>{id.replace(/^fg-/, '').replace(/-/g, ' ')}</span>
                                <ArrowRight size={12} color="#F5B800" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Look Up While Building */}
                        <div style={{ background: '#0b101b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F5B800', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            🔍 Look Up While Building
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {activeLesson.fieldGuideLinks.lookUpWhileBuilding.map(id => (
                              <Link
                                key={id}
                                href={`/dashboard/curriculum/reference?entry=${id}`}
                                style={{ fontSize: '0.82rem', color: '#f1f5f9', textDecoration: 'none', padding: '0.35rem 0.6rem', background: '#1e293b', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <span>{id.replace(/^fg-/, '').replace(/-/g, ' ')}</span>
                                <ArrowRight size={12} color="#F5B800" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Go Deeper */}
                        <div style={{ background: '#0b101b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            🚀 Go Deeper
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {activeLesson.fieldGuideLinks.goDeeper.map(id => (
                              <Link
                                key={id}
                                href={`/dashboard/curriculum/reference?entry=${id}`}
                                style={{ fontSize: '0.82rem', color: '#f1f5f9', textDecoration: 'none', padding: '0.35rem 0.6rem', background: '#1e293b', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <span>{id.replace(/^fg-/, '').replace(/-/g, ' ')}</span>
                                <ArrowRight size={12} color="#F5B800" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Differentiation & Next Class Teaser */}
                  <div className={styles.twoColGrid}>
                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        🌟 Differentiation &amp; Extension:
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                        <div><strong>Support for Learners:</strong> {activeLesson.differentiation.support.join(' ')}</div>
                        <div style={{ marginTop: '0.4rem' }}><strong>Challenge Extension:</strong> {activeLesson.differentiation.extension.join(' ')}</div>
                        {activeLesson.differentiation.offlineOption && (
                          <div style={{ marginTop: '0.4rem', color: '#94a3b8' }}>
                            <strong>Offline Alternative:</strong> {activeLesson.differentiation.offlineOption.join(' ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        ⏩ Coming Next:
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                        {activeLesson.nextLessonTeaser}
                      </p>
                    </div>
                  </div>

                  {/* Custom Instructor Slide Blocks (Admin CMS) */}
                  {customBlocks.filter(b => b.lessonId === activeLesson.id).length > 0 && (
                    <div style={{ marginTop: '1.5rem', background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(245, 184, 0, 0.35)' }}>
                      <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.95rem', marginBottom: '0.85rem' }}>
                        📌 Instructor Supplemental Slide Blocks (Live Lab CMS)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {customBlocks.filter(b => b.lessonId === activeLesson.id).map((block) => (
                          <div key={block.id} style={{ background: '#090e18', padding: '0.95rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                              <strong style={{ color: '#F9FAFB', fontSize: '0.9rem' }}>{block.title}</strong>
                              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: '#F5B800', fontWeight: 800 }}>
                                {block.blockType}
                              </span>
                            </div>
                            {block.blockType === 'code' ? (
                              <pre style={{ background: '#050811', padding: '0.75rem', borderRadius: '6px', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', overflowX: 'auto', margin: 0 }}>
                                {block.content}
                              </pre>
                            ) : (
                              <div style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.55' }}>
                                {block.content}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CLASS SCHEDULE & AGENDA */}
              {activeTab === 'agenda' && (
                <div>
                  {/* Scheduled Session Status Card */}
                  {(() => {
                    const sessionForLesson = scheduledSessions.find(s => s.lessonId === activeLesson.id);
                    const isAttended = sessionForLesson && user && (sessionForLesson.attendees || []).some(
                      a => a === user.uid || (user.email && a.toLowerCase() === user.email.toLowerCase())
                    );
                    const isActive = sessionForLesson && sessionForLesson.status === 'active';

                    return (
                      <div style={{
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(107, 15, 36, 0.5), rgba(22, 27, 38, 0.95))'
                          : 'rgba(22, 27, 38, 0.85)',
                        border: '1px solid',
                        borderColor: isActive ? '#F5B800' : 'rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            {isActive ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                                <Radio size={12} /> Class Currently Live in Session
                              </span>
                            ) : isAttended ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                                <CheckCircle size={12} /> Attendance Confirmed ✓
                              </span>
                            ) : sessionForLesson ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 184, 0, 0.15)', color: '#F5B800', border: '1px solid rgba(245, 184, 0, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                                <Calendar size={12} /> Scheduled on Calendar
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                                <Clock size={12} /> Available in On-Demand Lab Mode
                              </span>
                            )}

                            {sessionForLesson && (
                              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                                📅 {sessionForLesson.date} &bull; {sessionForLesson.time || '15:30'}
                              </span>
                            )}
                          </div>

                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>
                            {activeLesson.code}: {activeLesson.title}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                            📍 Location: {sessionForLesson?.location || 'RoboBEE Lab, Narayanganj'} &bull; Small Group Interactive Lab
                          </div>
                        </div>

                        <Link
                          href="/dashboard/attendance"
                          style={{
                            background: '#F5B800',
                            color: '#161B26',
                            padding: '0.6rem 1.15rem',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            textDecoration: 'none'
                          }}
                        >
                          <span>Open Attendance &amp; Roster ➔</span>
                        </Link>
                      </div>
                    );
                  })()}

                  {/* Pacing Toggle & Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                        Time-Boxed Classroom Agenda &amp; Pacing
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                        Step-by-step instructional flow mapped to active teacher and student behaviors.
                      </p>
                    </div>

                    <div className={styles.pacingToggle}>
                      <button
                        onClick={() => setPacingMode('standard')}
                        className={`${styles.pacingBtn} ${pacingMode === 'standard' ? styles.pacingBtnActive : ''}`}
                      >
                        Standard ({activeLesson.durationMinutes}m)
                      </button>
                      <button
                        onClick={() => setPacingMode('compact')}
                        className={`${styles.pacingBtn} ${pacingMode === 'compact' ? styles.pacingBtnActive : ''}`}
                      >
                        Compact ({activeLesson.compactDurationMinutes || 60}m)
                      </button>
                    </div>
                  </div>

                  {/* Class Rhythm Table */}
                  <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th style={{ width: '18%' }}>Segment</th>
                            <th style={{ width: '10%' }}>Duration</th>
                            <th style={{ width: '36%' }}>Teacher Action</th>
                            <th style={{ width: '36%' }}>Student Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeLesson.classRhythm.map((seg, i) => {
                            const standardMinutes = seg.minutes;
                            const scale = (activeLesson.compactDurationMinutes || 60) / activeLesson.durationMinutes;
                            const displayMinutes = pacingMode === 'compact' 
                              ? Math.max(3, Math.round(standardMinutes * scale)) 
                              : standardMinutes;

                            return (
                              <tr key={i}>
                                <td style={{ fontWeight: 800, color: '#F5B800' }}>
                                  {seg.segment}
                                </td>
                                <td>
                                  <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                                    {displayMinutes} min
                                  </span>
                                </td>
                                <td style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                  {seg.teacherAction}
                                </td>
                                <td style={{ color: '#f1f5f9', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                  {seg.studentAction}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pacing Milestones & Checkpoints */}
                  <div className={styles.twoColGrid}>
                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.9rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={16} />
                        <span>Pacing Milestones ({pacingMode === 'standard' ? `${activeLesson.durationMinutes}m` : `${activeLesson.compactDurationMinutes || 60}m`}):</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                        <div><strong>Minute 15:</strong> Hook &amp; vocabulary understood; hardware kits distributed safely.</div>
                        <div><strong>Minute 45:</strong> First physical circuit built and verified with pre-power checklist.</div>
                        <div><strong>Minute 75:</strong> Code uploaded, simulation validated, and student modifications tested.</div>
                        <div><strong>Final 15 min:</strong> Clean desk protocol, component inventory, and exit ticket submitted.</div>
                      </div>
                    </div>

                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <GraduationCap size={16} />
                        <span>Instructor Timing Advice:</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                        If students complete the primary build quickly, transition them to the <strong>Student Tweak to Predict &amp; Test</strong> in the Code Lab tab. 
                        If circuit debugging takes longer, launch the <strong>Interactive Simulator</strong> on the classroom projector to keep the whole class synchronized.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HARDWARE, WIRING & CAD */}
              {activeTab === 'hardware' && (
                <div>
                  {/* Reference Board Badge */}
                  <div style={{ background: 'rgba(245, 184, 0, 0.08)', border: '1px solid rgba(245, 184, 0, 0.35)', borderRadius: '10px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Shield size={18} color="#F5B800" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.9rem' }}>
                          Illustrative Reference Board (Arduino Uno R3 DIP ATmega328P / Verified Modules)
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                          Wiring diagrams represent official Arduino Uno pinouts. For alternate boards (ESP32, Nano), verify operating voltage (5V vs 3.3V) and GPIO mappings.
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeLesson.physicalBuildPack ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Connection Diagram / Wiring Illustration */}
                      <div className={styles.buildPackCard}>
                        <div className={styles.buildPackTitle}>
                          <Info size={16} />
                          <span>Official Reference Wiring Diagram</span>
                        </div>
                        {activeLesson.physicalBuildPack.connectionPhotoOrClearlyLabeledIllustration ? (
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.65rem', fontStyle: 'italic' }}>
                              ⚠ Reference wiring illustration — verify against your exact board/module before applying power.
                              Instructor-developed. Proprietary — RoboBEE Innovators.
                            </div>
                            <img
                              src={activeLesson.physicalBuildPack.connectionPhotoOrClearlyLabeledIllustration}
                              alt={`Connection diagram for ${activeLesson.title}`}
                              style={{ width: '100%', maxWidth: '650px', borderRadius: '10px', border: '1px solid #1e293b', background: '#090e18', display: 'block' }}
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div style={{ padding: '1rem', background: '#090e18', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                            No visual connection diagram for this class. Use the complete wire-by-wire connection table below.
                          </div>
                        )}
                      </div>

                      {/* Hardware BOM & Schematic */}
                      <div className={styles.buildPackGrid}>
                        {/* Component BOM with Live Lab Inventory Stock Verification */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <Wrench size={16} />
                            <span>Bill of Materials &amp; Live Lab Bench Stock</span>
                          </div>
                          <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                              <thead>
                                <tr>
                                  <th>Component</th>
                                  <th>Exact Variant</th>
                                  <th>Qty</th>
                                  <th>Live Lab Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  const stockStatuses = verifyLessonBOMStock(
                                    activeLesson.physicalBuildPack.componentList,
                                    inventoryItems
                                  );
                                  return activeLesson.physicalBuildPack.componentList.map((comp, idx) => {
                                    const st = stockStatuses[idx];
                                    return (
                                      <tr key={idx}>
                                        <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{comp.name}</td>
                                        <td style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{comp.exactVariant}</td>
                                        <td style={{ color: '#F5B800', fontWeight: 800 }}>{comp.quantity}</td>
                                        <td>
                                          <span style={{
                                            display: 'inline-block',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '999px',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            fontFamily: 'var(--font-mono)',
                                            background: st?.status === 'in_stock' ? 'rgba(16, 185, 129, 0.16)' : st?.status === 'low_stock' ? 'rgba(245, 184, 0, 0.16)' : 'rgba(239, 68, 68, 0.15)',
                                            color: st?.status === 'in_stock' ? '#10B981' : st?.status === 'low_stock' ? '#F5B800' : '#F87171',
                                          }}>
                                            {st && st.availableInLab > 0 ? `${st.availableInLab} in lab` : 'Verify Locker'}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  });
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Schematic & Wiring Note */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <Activity size={16} />
                            <span>Circuit Schematic &amp; Layout</span>
                          </div>
                          <div style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                            <strong>Schematic Description:</strong><br />
                            {activeLesson.physicalBuildPack.schematic}
                          </div>
                          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                            <strong>Verified Boards &amp; Modules:</strong> {activeLesson.physicalBuildPack.verifiedBoardAndModules.join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Wire-by-Wire Connection Table */}
                      <div className={styles.buildPackCard}>
                        <div className={styles.buildPackTitle}>
                          <Activity size={16} />
                          <span>Pin-by-Pin &amp; Wire-by-Wire Connection Table</span>
                        </div>
                        <div className={styles.tableWrapper}>
                          <table className={styles.dataTable}>
                            <thead>
                              <tr>
                                <th>From (Source Pin)</th>
                                <th>To (Target Hardware)</th>
                                <th>Wire Color / Polarity Rule</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeLesson.physicalBuildPack.wireTable.map((wire, idx) => (
                                <tr key={idx}>
                                  <td style={{ fontWeight: 800, color: '#F5B800' }}>{wire.from}</td>
                                  <td style={{ color: '#38bdf8' }}>{wire.to}</td>
                                  <td style={{ color: '#cbd5e1' }}>{wire.wireOrPolarityNote || 'Standard Jumper Wire'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Power and Safety Checks */}
                      <div className={styles.buildPackCard} style={{ background: 'rgba(107, 15, 36, 0.2)', border: '1px solid #6B0F24' }}>
                        <div className={styles.buildPackTitle} style={{ color: '#fca5a5' }}>
                          <Shield size={16} />
                          <span>Pre-Power Electrical Safety Inspection:</span>
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>
                          {activeLesson.physicalBuildPack.powerAndSafetyChecks.map((check, idx) => (
                            <li key={idx} style={{ marginBottom: '0.35rem' }}>{check}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#111827', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <FileText size={36} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>Design &amp; Software System Module</div>
                      <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto' }}>
                        This class focuses on 3D CAD modeling, mechanics, or algorithm simulation rather than a physical circuit build.
                        Check the Code Lab &amp; Simulator tab for interactive deliverables!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CODE LAB & SIMULATOR */}
              {activeTab === 'code_sim' && (
                <div>
                  {activeLesson.codeLab ? (
                    <>
                      <div className={styles.codeHeaderRow}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                            {activeLesson.codeLab.language.toUpperCase()} Code Artifact
                          </span>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F5B800', marginTop: '2px' }}>
                            {activeLesson.project.name}
                          </h3>
                        </div>
                        <div className={styles.codeButtonsGroup}>
                          <button
                            onClick={() => handleCopyCode(activeLesson.codeLab!.code)}
                            className={styles.codeBtn}
                          >
                            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                          <button
                            onClick={() => handleDownloadIno(activeLesson)}
                            className={styles.codeBtn}
                          >
                            <Download size={14} />
                            <span>Download .ino Sketch</span>
                          </button>
                        </div>
                      </div>

                      <pre className={styles.codeEditorBox}>
                        <code>{activeLesson.codeLab.code}</code>
                      </pre>

                      <div className={styles.twoColGridEqual}>
                        {/* Pin Map */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <Activity size={16} />
                            <span>Microcontroller Pin Map</span>
                          </div>
                          <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                              <thead>
                                <tr>
                                  <th>Pin</th>
                                  <th>Connected Hardware</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(activeLesson.codeLab.pinMap).map(([pin, dev]) => (
                                  <tr key={pin}>
                                    <td style={{ fontWeight: 800, color: '#F5B800' }}>{pin}</td>
                                    <td style={{ color: '#cbd5e1' }}>{dev}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Setup & Upload Instructions */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <CheckSquare size={16} />
                            <span>Upload &amp; Verification Steps</span>
                          </div>
                          <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                            {activeLesson.codeLab.setupAndUpload.map((step, idx) => (
                              <li key={idx} style={{ marginBottom: '0.35rem' }}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* Code Explanations */}
                      <div className={styles.xrayCard}>
                        <div className={styles.xrayTitle}>
                          <Eye size={16} />
                          <span>Line-by-Line Code Explanations:</span>
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                          {activeLesson.codeLab.explanations.map((exp, idx) => (
                            <li key={idx} style={{ marginBottom: '0.35rem' }}>{exp}</li>
                          ))}
                        </ul>
                      </div>

                      {activeLesson.codeLab.tweakTip && (
                        <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                          <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            💡 Student Tweak to Predict &amp; Test:
                          </div>
                          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                            {activeLesson.codeLab.tweakTip}
                          </p>
                        </div>
                      )}
                    </>
                  ) : null}

                  {/* Embedded Simulator */}
                  <div style={{ marginTop: '2rem', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Zap size={20} color="#F5B800" />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                        Interactive Hardware &amp; Code Simulator
                      </h3>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 700 }}>
                        Zero-Lag Lab Mode
                      </span>
                    </div>

                    <CurriculumSimulator type={activeLesson.visualizerId} classNumber={activeLesson.sequence} />
                  </div>
                </div>
              )}

              {/* TAB 5: BUILD STEPS & TROUBLESHOOTING */}
              {activeTab === 'build_steps' && (
                <div>
                  {/* Assembly & Power Up Steps */}
                  <div className={styles.buildPackCard} style={{ marginBottom: '1.5rem' }}>
                    <div className={styles.buildPackTitle}>
                      <CheckSquare size={16} />
                      <span>Step-by-Step Assembly &amp; Power-Up Protocol</span>
                    </div>
                    <ol style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.7', margin: 0 }}>
                      {(activeLesson.physicalBuildPack?.assemblyAndPowerUpSteps || activeLesson.activity.steps).map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '0.45rem' }}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Success Evidence & Test Cases */}
                  <div className={styles.twoColGrid}>
                    <div className={styles.buildPackCard}>
                      <div className={styles.buildPackTitle}>
                        <Award size={16} />
                        <span>Project Success Evidence &amp; Acceptance</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {activeLesson.project.successEvidence.map((ev, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.84rem' }}>
                            <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ color: '#cbd5e1' }}>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.buildPackCard}>
                      <div className={styles.buildPackTitle}>
                        <Zap size={16} />
                        <span>Required Functional Test Cases</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {(activeLesson.physicalBuildPack?.testCases || []).map((tc, idx) => (
                          <div key={idx} style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.65rem', fontSize: '0.82rem' }}>
                            <div style={{ color: '#F5B800', fontWeight: 700 }}>Test Case {idx + 1}: {tc.action}</div>
                            <div style={{ color: '#10b981', marginTop: '2px' }}>➔ Expected: {tc.expectedResult}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Troubleshooting Guide */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171', margin: '1.5rem 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} />
                    <span>Calm Engineering Troubleshooting Guide</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {activeLesson.troubleshooting.map((tb, idx) => (
                      <div key={idx} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fca5a5' }}>
                          Symptom: {tb.symptom}
                        </div>
                        <div style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                          <strong>Checks in safe order:</strong> {tb.checks.join(' ➔ ')}
                        </div>
                        <div style={{ marginTop: '0.35rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                          <strong>Root Cause Explanation:</strong> {tb.explanation}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Safety Checklist */}
                  <div style={{ background: 'rgba(107, 15, 36, 0.25)', border: '1px solid #6B0F24', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Shield size={16} />
                      <span>Lab Safety Checklist:</span>
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.6', margin: 0 }}>
                      {activeLesson.safetyNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 6: ASSESSMENT, EXIT TICKET & SOURCES */}
              {activeTab === 'assessment' && (
                <div>
                  {/* Checks for Understanding */}
                  <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HelpCircle size={16} />
                      <span>Formative Checks for Understanding:</span>
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>
                      {activeLesson.checksForUnderstanding.map((chk, i) => (
                        <li key={i} style={{ marginBottom: '0.35rem' }}>{chk}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Exit Ticket Reflection */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F5B800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} />
                    <span>Exit Ticket &amp; Knowledge Reflection (+100 RoboXP)</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {activeLesson.exitTicket.map((ticket, idx) => (
                      <div key={idx} className={styles.exitCheckItem}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
                            <span style={{ color: '#F5B800', marginRight: '0.5rem' }}>Question {idx + 1}:</span>
                            {ticket.question}
                          </div>
                          <button
                            onClick={() => setRevealedModelAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className={styles.codeBtn}
                          >
                            <HelpCircle size={14} />
                            <span>{revealedModelAnswers[idx] ? 'Hide Rubric' : 'Reveal Model Reasoning'}</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Type your explanation or observation here..."
                          value={quizAnswers[idx] || ''}
                          onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })}
                          className={styles.quizInput}
                        />

                        {revealedModelAnswers[idx] && (
                          <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid #10b981', borderRadius: '4px', fontSize: '0.85rem', color: '#34d399' }}>
                            🎯 <strong>Model Reasoning:</strong> {ticket.rubricOrSampleReasoning}
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={handleQuizSubmit}
                        disabled={submittingQuiz}
                        className={styles.submitQuizBtn}
                      >
                        <Award size={18} />
                        <span>{submittingQuiz ? 'Submitting to Lab...' : 'Submit Exit Ticket (+100 RoboXP)'}</span>
                      </button>

                      {quizSuccess && (
                        <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle size={18} /> +100 RoboXP Awarded!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Primary Sources & Standards */}
                  <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={16} />
                      <span>Authoritative Primary Sources &amp; Standards:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {activeLesson.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceCard}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#f1f5f9' }}>{src.title}</div>
                            {src.accessedOrVersioned && (
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{src.accessedOrVersioned}</div>
                            )}
                          </div>
                          <ExternalLink size={14} color="#F5B800" style={{ flexShrink: 0 }} />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Asset Credits & IP Notice */}
                  <div style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <div style={{ fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      RoboBEE Innovators Educational Licensing &amp; IP Notice:
                    </div>
                    <div style={{ lineHeight: '1.5', marginBottom: '0.5rem' }}>
                      {activeLesson.ipNotice}
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#64748b' }}>
                      RoboBEE Innovators &bull; &ldquo;Dream. Invent. Experiment. Inspire.&rdquo; &bull; Narayanganj, Bangladesh.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Projector View */}
      {projectorMode && activeLesson && (
        <ProjectorView
          lesson={activeLesson}
          initialSlide={projectorInitialSlide}
          onClose={() => setProjectorMode(false)}
        />
      )}
    </div>
  );
}
