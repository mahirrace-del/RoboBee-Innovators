"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./adminCurriculum.module.css";
import { 
  ALL_ROBOTICS_LESSONS, 
  RoboticsLesson, 
  ClassStatus, 
} from "@/lib/curriculumData";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import { 
  CLASS_01_SLIDES, 
  THEME_PALETTE_CONFIG, 
  PresentationMediaFrame 
} from "@/components/curriculum/Class1WorkshopDeck";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { 
  Tv, Lock, Unlock, Eye, Clock, 
  Users, Award, Radio, BookOpen, Calendar, PlusCircle, Trash2, Layers,
  Sparkles, Palette, Play, ChevronDown, ChevronUp, Cpu, Compass
} from "lucide-react";
import { CustomSlideBlock, SlideBlockType } from "@/lib/portalRelations";

export default function AdminCurriculumPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'classes' | 'builder' | 'submissions'>('classes');

  // Flagship Class 01 Lesson Record
  const class01Lesson: RoboticsLesson =
    ALL_ROBOTICS_LESSONS.find((l) => l.id === "beg-01") || ALL_ROBOTICS_LESSONS[0];

  const [classStatuses, setClassStatuses] = useState<{ [id: string]: ClassStatus }>({
    "beg-01": "published",
  });

  // Projector modal & initial slide launcher
  const [projectorClass, setProjectorClass] = useState<RoboticsLesson | null>(null);
  const [projectorInitialSlide, setProjectorInitialSlide] = useState<number>(0);
  const [showSlidePreviewDrawer, setShowSlidePreviewDrawer] = useState<boolean>(true);
  const [zoomedCover, setZoomedCover] = useState<boolean>(false);

  // Submissions list from Firestore
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);

  // Slide Block Builder (Admin CMS) state
  const [customBlocks, setCustomBlocks] = useState<CustomSlideBlock[]>([]);
  const [builderLessonId, setBuilderLessonId] = useState<string>("beg-01");
  const [blockType, setBlockType] = useState<SlideBlockType>("text");
  const [blockTitle, setBlockTitle] = useState<string>("");
  const [blockContent, setBlockContent] = useState<string>("");
  const [blockCodeLang, setBlockCodeLang] = useState<"cpp" | "python">("cpp");
  const [blockMediaUrl, setBlockMediaUrl] = useState<string>("");
  const [savingBlock, setSavingBlock] = useState<boolean>(false);

  // Load real-time class status overrides from Firestore
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
        setClassStatuses((prev) => ({ ...prev, ...updates }));
      }, (err) => {
        console.warn("Firestore curriculum_status offline, using fallback state:", err);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Firestore onSnapshot error:", e);
    }
  }, []);

  // Load submissions & custom slide blocks from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "curriculum_submissions"), orderBy("submittedAt", "desc"), limit(50));
      const unsubSubs = onSnapshot(q, (snapshot) => {
        const subs: any[] = [];
        snapshot.forEach((docSnap) => {
          subs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setSubmissions(subs);
        setLoadingSubs(false);
      }, (err) => {
        console.warn("Could not load curriculum submissions:", err);
        setLoadingSubs(false);
      });

      const unsubBlocks = onSnapshot(collection(db, "curriculum_custom_blocks"), (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomSlideBlock));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCustomBlocks(list);
      });

      return () => {
        unsubSubs();
        unsubBlocks();
      };
    } catch {
      setLoadingSubs(false);
    }
  }, []);

  // Update status in Firestore & local state
  const updateStatus = async (classId: string, newStatus: ClassStatus) => {
    setClassStatuses((prev) => ({ ...prev, [classId]: newStatus }));
    try {
      await setDoc(
        doc(db, "curriculum_status", classId),
        {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to sync status to Firestore:", err);
    }
  };

  const handleAddSlideBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim() || !blockContent.trim()) return;
    setSavingBlock(true);
    const existingForLesson = customBlocks.filter((b) => b.lessonId === builderLessonId);
    try {
      await addDoc(collection(db, "curriculum_custom_blocks"), {
        lessonId: builderLessonId,
        blockType,
        title: blockTitle.trim(),
        content: blockContent.trim(),
        codeLang: blockType === "code" ? blockCodeLang : null,
        mediaUrl: blockMediaUrl.trim() || null,
        order: existingForLesson.length + 1,
        createdBy: user?.email || "Instructor",
        updatedAt: new Date().toISOString(),
      });
      setBlockTitle("");
      setBlockContent("");
      setBlockMediaUrl("");
      alert("Modular Slide Block added to Class 01 Deck!");
    } catch (err) {
      console.error("Failed to add slide block:", err);
      alert("Error saving custom slide block.");
    } finally {
      setSavingBlock(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Remove this custom slide block?")) return;
    try {
      await deleteDoc(doc(db, "curriculum_custom_blocks", blockId));
    } catch (err) {
      console.error("Error deleting block:", err);
    }
  };

  const class01Status = classStatuses["beg-01"] || "published";
  const class01Submissions = submissions.filter((s) => s.classId === "beg-01").length;

  const launchProjectorAtSlide = (slideIdx: number) => {
    setProjectorInitialSlide(slideIdx);
    setProjectorClass(class01Lesson);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <Radio size={28} color="#F5B800" />
            Classroom Studio &amp; Multi-Palette Presentation Engine
          </h1>
          <p>
            RoboBEE Innovators Live Keynote Studio: Launch the 12-Slide Dynamic Multi-Palette Projector Deck for{" "}
            <strong>Class 01: Introduction to Robotics &amp; Future Engineering</strong>, inspect slide themes, and manage student reflections.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link
            href="/dashboard/admin/attendance"
            className={styles.statusBtn}
            style={{
              padding: "0.65rem 1rem",
              fontSize: "0.85rem",
              background: "#111827",
              color: "#10b981",
              borderColor: "#10b981",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Calendar size={14} style={{ marginRight: "6px" }} />
            Class Schedule &amp; Attendance
          </Link>
          <Link
            href="/dashboard/curriculum/reference"
            className={styles.statusBtn}
            style={{
              padding: "0.65rem 1rem",
              fontSize: "0.85rem",
              background: "#111827",
              color: "#F5B800",
              borderColor: "#F5B800",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <BookOpen size={14} style={{ marginRight: "6px" }} />
            Open Field Guide
          </Link>
          <button
            onClick={() => launchProjectorAtSlide(0)}
            className={styles.statusBtn}
            style={{
              padding: "0.65rem 1.2rem",
              fontSize: "0.88rem",
              fontWeight: 900,
              background: "linear-gradient(135deg, #4F46E5, #00F5D4)",
              color: "#090D16",
              borderColor: "#00F5D4",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              boxShadow: "0 8px 25px rgba(0, 245, 212, 0.3)",
            }}
          >
            <Tv size={16} />
            Launch Class 01 Projector
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Flagship Course</span>
          <span className={styles.statValue}>Class 01</span>
          <span className={styles.statSub}>Intro to Robotics &amp; Future Engineering</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Interactive Slide Deck</span>
          <span className={styles.statValue} style={{ color: "#38bdf8" }}>12 Slides</span>
          <span className={styles.statSub}>Zero text walls • Interactive hotspots &amp; polls</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Projector Color Architecture</span>
          <span className={styles.statValue} style={{ color: "#10b981" }}>4 Palettes</span>
          <span className={styles.statSub}>Indigo • Daylight • Blueprint • Arduino Teal</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Exit Check Submissions</span>
          <span className={styles.statValue} style={{ color: "#F5B800" }}>{submissions.length}</span>
          <span className={styles.statSub}>Student reflections logged</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button
          onClick={() => setActiveTab("classes")}
          className={`${styles.tabBtn} ${activeTab === "classes" ? styles.tabBtnActive : ""}`}
        >
          Class 01 Interactive Studio (12 Slides)
        </button>
        <button
          onClick={() => setActiveTab("builder")}
          className={`${styles.tabBtn} ${activeTab === "builder" ? styles.tabBtnActive : ""}`}
        >
          Slide Block Builder CMS ({customBlocks.filter((b) => b.lessonId === "beg-01").length})
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`${styles.tabBtn} ${activeTab === "submissions" ? styles.tabBtnActive : ""}`}
        >
          Exit Check Submissions ({submissions.length})
        </button>
      </div>

      {/* TAB 1: CLASS 01 FLAGSHIP INTERACTIVE PRESENTATION SHOWCASE */}
      {activeTab === "classes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Flagship Hero Course Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #1E1B4B 0%, #311042 52%, #0F172A 100%)",
              border: "2px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 24px 55px rgba(0, 0, 0, 0.5)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {/* Left Column: Course Info, Badges, Topic Tags & Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
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
                    textTransform: "uppercase",
                  }}
                >
                  CLASS 01 • FLAGSHIP DECK
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
                <span
                  className={`${styles.badge} ${
                    class01Status === "published"
                      ? styles.badgePublished
                      : class01Status === "live_in_class"
                      ? styles.badgeLive
                      : styles.badgeLocked
                  }`}
                >
                  {class01Status === "published" && <><Eye size={12} /> Published</>}
                  {class01Status === "live_in_class" && <><Radio size={12} /> Live in Lab</>}
                  {class01Status === "locked" && <><Lock size={12} /> Locked</>}
                </span>
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(1.75rem, 2.8vw, 2.4rem)",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Class 01: Introduction to Robotics &amp; Future Engineering
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  color: "#E0E7FF",
                  lineHeight: 1.6,
                }}
              >
                A high-contrast, Keynote &amp; Apple Event style classroom presentation. Guides students from why
                extracurriculars and robotics matter, through a live classroom career poll, Machine vs. Robot flip-cards,
                the history of automation (1206 Al-Jazari to Today), the Sense-Think-Act loop, the 5 main parts of a
                robot, microcontroller families, and an interactive hotspot tour of the Arduino Uno R3!
              </p>

              {/* Topic Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {[
                  "Why Extracurriculars",
                  "Why Learn Robotics",
                  "Live Student Poll (+1)",
                  "Machine vs. Robot Flip Quiz",
                  "History (1206–Today)",
                  "Sense → Think → Act",
                  "5 Robot Subsystems",
                  "Microcontroller Brains",
                  "Arduino Uno Hotspots",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.22)",
                      color: "#FFFFFF",
                      padding: "0.3rem 0.7rem",
                      borderRadius: "8px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta Row */}
              <div
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  flexWrap: "wrap",
                  fontSize: "0.86rem",
                  color: "#E0E7FF",
                  paddingTop: "0.25rem",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
                  <Clock size={15} color="#00F5D4" /> 90 Mins (60 Min Compact)
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
                  <Users size={15} color="#38BDF8" /> {class01Submissions} Exit Submissions
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
                  <Award size={15} color="#FBBF24" /> +100 RoboXP
                </span>
              </div>

              {/* Primary CTA & Status Controls */}
              <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.35rem" }}>
                <button
                  onClick={() => launchProjectorAtSlide(0)}
                  style={{
                    background: "linear-gradient(135deg, #00F5D4 0%, #38BDF8 100%)",
                    color: "#090D16",
                    border: "none",
                    padding: "0.9rem 1.65rem",
                    borderRadius: "14px",
                    fontSize: "1rem",
                    fontWeight: 900,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    boxShadow: "0 12px 30px rgba(0, 245, 212, 0.35)",
                  }}
                >
                  <Tv size={20} />
                  Launch Live Projector (Slide 01 / 12)
                </button>

                <button
                  onClick={() => setShowSlidePreviewDrawer((v) => !v)}
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.28)",
                    padding: "0.85rem 1.25rem",
                    borderRadius: "14px",
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                  }}
                >
                  {showSlidePreviewDrawer ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                  {showSlidePreviewDrawer ? "Hide 12-Slide Preview Drawer" : "Open 12-Slide Preview Drawer"}
                </button>

                {/* Status Toggles */}
                <div style={{ display: "inline-flex", gap: "0.4rem", background: "rgba(15, 23, 42, 0.65)", padding: "0.35rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <button
                    onClick={() => updateStatus("beg-01", "published")}
                    className={`${styles.statusBtn} ${class01Status === "published" ? styles.statusBtnActive : ""}`}
                    title="Publish Class 01 to all students"
                  >
                    <Unlock size={13} />
                    <span>Published</span>
                  </button>
                  <button
                    onClick={() => updateStatus("beg-01", "live_in_class")}
                    className={`${styles.statusBtn} ${class01Status === "live_in_class" ? styles.statusBtnLive : ""}`}
                    title="Mark Class 01 as Live in the Lab"
                  >
                    <Radio size={13} />
                    <span>Live Now</span>
                  </button>
                  <button
                    onClick={() => updateStatus("beg-01", "locked")}
                    className={`${styles.statusBtn} ${class01Status === "locked" ? styles.statusBtnLocked : ""}`}
                    title="Lock Class 01"
                  >
                    <Lock size={13} />
                    <span>Lock</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Protected High-Res PresentationMediaFrame Cover */}
            <div>
              <PresentationMediaFrame
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
                alt="Class 01: Introduction to Robotics & Future Engineering"
                caption="Class 01 Flagship Deck • 4 Curated Color Themes & Interactive Hardware Diagrams"
                fallbackVariant="robot-arm"
                accentColor="#00F5D4"
                height="320px"
                onZoom={() => setZoomedCover(true)}
              />
            </div>
          </div>

          {/* 4-Theme Palette Legend Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.9rem",
            }}
          >
            {(Object.keys(THEME_PALETTE_CONFIG) as Array<keyof typeof THEME_PALETTE_CONFIG>).map((themeKey) => {
              const t = THEME_PALETTE_CONFIG[themeKey];
              const slideNumbers = CLASS_01_SLIDES.filter((s) => s.theme === themeKey)
                .map((s) => s.numberLabel)
                .join(", ");
              return (
                <div
                  key={themeKey}
                  style={{
                    background: t.canvasBg,
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: "16px",
                    padding: "1rem 1.15rem",
                    color: t.headingColor,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: t.accentPrimary,
                      }}
                    >
                      {t.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.18rem 0.55rem",
                        borderRadius: "999px",
                        background: t.badgeBg,
                        color: t.badgeText,
                      }}
                    >
                      Slides {slideNumbers}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: t.bodyColor, fontWeight: 600 }}>
                    Auto-switches canvas &amp; typography for maximum projector contrast.
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive 12-Slide Preview Drawer */}
          {showSlidePreviewDrawer && (
            <div
              style={{
                background: "#0B1120",
                border: "1px solid #1E293B",
                borderRadius: "22px",
                padding: "1.65rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 900, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Compass size={20} color="#38BDF8" />
                    Class 01 Slide-by-Slide Preview Drawer (All 12 Interactive Slides)
                  </h3>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#94A3B8" }}>
                    Click any slide card below to launch the Live Projector directly to that slide.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
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
                        <Play size={14} /> Present from Slide {s.numberLabel}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SLIDE BLOCK BUILDER (ADMIN CMS) */}
      {activeTab === "builder" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
          <div className={styles.submissionsCard}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <PlusCircle size={18} color="#F5B800" /> Modular Slide Block Builder (Class 01 CMS)
            </h2>
            <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
              Author supplemental modular content blocks (Concept Callout, Pinout Diagram, Code Block, Safety Warning, or Quiz Check) for Class 01.
            </p>
            <form onSubmit={handleAddSlideBlock} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.3rem", fontWeight: 700 }}>
                  Target Curriculum Lesson
                </label>
                <select
                  value={builderLessonId}
                  onChange={(e) => setBuilderLessonId(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", background: "#090e18", border: "1px solid #1e293b", color: "#f1f5f9" }}
                >
                  <option value="beg-01">CLASS 01: Introduction to Robotics &amp; Future Engineering</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.3rem", fontWeight: 700 }}>
                    Block Type
                  </label>
                  <select
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value as SlideBlockType)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", background: "#090e18", border: "1px solid #1e293b", color: "#f1f5f9" }}
                  >
                    <option value="text">Concept Text &amp; Bullet</option>
                    <option value="diagram">Circuit / Pinout Diagram</option>
                    <option value="code">Code Lab Block (C++ / Python)</option>
                    <option value="warning">Hardware Safety Alert</option>
                    <option value="quiz">Interactive Knowledge Check</option>
                    <option value="video">Lab Demonstration Video</option>
                  </select>
                </div>
                {blockType === "code" && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.3rem", fontWeight: 700 }}>
                      Code Language
                    </label>
                    <select
                      value={blockCodeLang}
                      onChange={(e) => setBlockCodeLang(e.target.value as "cpp" | "python")}
                      style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", background: "#090e18", border: "1px solid #1e293b", color: "#f1f5f9" }}
                    >
                      <option value="cpp">Arduino C++ (.ino)</option>
                      <option value="python">MicroPython / ROS2 (.py)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.3rem", fontWeight: 700 }}>
                  Slide Block Heading
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why We Always Connect a 220Ω Resistor in Series"
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", background: "#090e18", border: "1px solid #1e293b", color: "#f1f5f9" }}
                />
              </div>

              {(blockType === "diagram" || blockType === "video") && (
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.3rem", fontWeight: 700 }}>
                    SVG Illustration Path or Media URL
                  </label>
                  <input
                    type="text"
                    placeholder="/illustrations/class1-arduino-uno-anatomy.svg"
                    value={blockMediaUrl}
                    onChange={(e) => setBlockMediaUrl(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", background: "#090e18", border: "1px solid #1e293b", color: "#f1f5f9" }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.3rem", fontWeight: 700 }}>
                  {blockType === "code" ? "Source Code Snippet" : "Teaching Content / Speaker Notes"}
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder={blockType === "code" ? "void setup() {\n  pinMode(13, OUTPUT);\n}" : "Enter concise visual callout points..."}
                  value={blockContent}
                  onChange={(e) => setBlockContent(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", background: "#090e18", border: "1px solid #1e293b", color: "#f1f5f9", fontFamily: blockType === "code" ? "var(--font-mono)" : "inherit" }}
                />
              </div>

              <button
                type="submit"
                disabled={savingBlock}
                className={styles.projectorBtn}
                style={{ justifyContent: "center", marginTop: "0.25rem" }}
              >
                <Layers size={16} />
                <span>{savingBlock ? "Saving Block..." : "Add Modular Block to Class 01"}</span>
              </button>
            </form>
          </div>

          <div className={styles.submissionsCard}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.85rem" }}>
              Published Custom Blocks for Class 01
            </h2>
            {customBlocks.filter((b) => b.lessonId === builderLessonId).length === 0 ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#94a3b8", fontSize: "0.86rem" }}>
                No extra custom blocks added yet. All 12 built-in interactive slides are active.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {customBlocks.filter((b) => b.lessonId === builderLessonId).map((block) => (
                  <div key={block.id} style={{ background: "#090e18", border: "1px solid #1e293b", borderRadius: "10px", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#F5B800", textTransform: "uppercase", marginRight: "0.5rem" }}>
                          [{block.blockType}]
                        </span>
                        <strong style={{ color: "#f1f5f9", fontSize: "0.94rem" }}>{block.title}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(block.id)}
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                        title="Delete Block"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#cbd5e1", whiteSpace: "pre-wrap", fontFamily: block.blockType === "code" ? "var(--font-mono)" : "inherit" }}>
                      {block.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SUBMISSIONS LOG */}
      {activeTab === "submissions" && (
        <div className={styles.submissionsCard}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "1rem" }}>
            Recent Exit Ticket Knowledge Reflections
          </h2>

          {loadingSubs ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
              No student exit tickets submitted yet. When students complete the Class 01 check, their responses will appear here in real time!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {submissions.map((sub) => (
                <div key={sub.id} style={{ background: "#0b0f19", border: "1px solid #1e293b", borderRadius: "10px", padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#F5B800" }}>{sub.classCode || sub.classId}</span>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", marginLeft: "0.5rem" }}>{sub.classTitle}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                      {new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#38bdf8", marginBottom: "0.75rem" }}>
                    Student: <strong>{sub.userEmail}</strong> • Awarded: <strong>+{sub.xpAwarded} RoboXP</strong>
                  </div>

                  <div style={{ background: "#111827", padding: "0.85rem", borderRadius: "8px", fontSize: "0.85rem" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.4rem", fontWeight: 600 }}>Answers Submitted:</div>
                    {sub.answers && typeof sub.answers === "object" ? (
                      Object.entries(sub.answers).map(([qKey, ans]) => (
                        <div key={qKey} style={{ marginTop: "0.35rem" }}>
                          <span style={{ color: "#F5B800" }}>Q{Number(qKey) + 1}: </span>
                          <span style={{ color: "#cbd5e1" }}>{String(ans)}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: "#64748b" }}>No answer payload</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Cover Zoom Lightbox */}
      {zoomedCover && (
        <div
          onClick={() => setZoomedCover(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(6, 10, 22, 0.92)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "1050px", width: "100%" }}>
            <PresentationMediaFrame
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=85"
              alt="Class 01: Introduction to Robotics & Future Engineering"
              caption="Class 01: Introduction to Robotics & Future Engineering • 12 Interactive Slides"
              fallbackVariant="robot-arm"
              accentColor="#00F5D4"
              height="520px"
            />
          </div>
        </div>
      )}

      {/* Full-Screen Projector Slide Deck */}
      {projectorClass && (
        <ProjectorView
          lesson={projectorClass}
          initialSlide={projectorInitialSlide}
          onClose={() => setProjectorClass(null)}
        />
      )}
    </div>
  );
}
