"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./adminCurriculum.module.css";
import {
  ALL_ROBOTICS_LESSONS,
  COURSE_SPACES,
  CourseTier,
  RoboticsLesson,
  ClassStatus,
} from "@/lib/curriculumData";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import { PresentationMediaFrame } from "@/components/curriculum/Class1WorkshopDeck";
import {
  EditableClassDeck,
  ClassTrackCategory,
  loadDecksFromStorage,
  saveDeckToStorageAndCloud,
  deleteDeckFromStorageAndCloud,
  syncDecksFromFirestore,
  createBlankSlide,
} from "@/lib/slideStudioStore";
import { SlideStudioEditor } from "@/components/curriculum/SlideStudioEditor";
import { HardwareLabDrawer } from "@/components/curriculum/HardwareLabDrawer";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  Tv,
  Lock,
  Unlock,
  Clock,
  Radio,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  Cpu,
  Edit3,
  Copy,
  Download,
  Upload,
  Search,
  FolderPlus,
  X,
  MoreHorizontal,
  Settings,
} from "lucide-react";

export default function AdminCurriculumPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"library" | "submissions">(
    "library"
  );

  // All 36 Canonical Lessons + Any Custom Created Decks
  const [decks, setDecks] = useState<EditableClassDeck[]>([]);

  // Course Pathway Filter ('beginner' default so instructors immediately see Beginner 01–10, or switch across all 4 courses)
  const [courseFilter, setCourseFilter] = useState<"ALL" | CourseTier>("beginner");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Header "Data & Backup" Dropdown & Per-Card "•••" Menu State
  const [showDataMenu, setShowDataMenu] = useState<boolean>(false);
  const [openCardMenuId, setOpenCardMenuId] = useState<string | null>(null);

  // Active Modals / Drawers
  const [projectorDeck, setProjectorDeck] = useState<EditableClassDeck | null>(
    null
  );
  const [projectorInitialSlide, setProjectorInitialSlide] = useState<number>(0);
  const [studioDeck, setStudioDeck] = useState<EditableClassDeck | null>(null);
  const [hardwareLabDeck, setHardwareLabDeck] =
    useState<EditableClassDeck | null>(null);

  // "+ Create New Class Presentation" Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newClassCode, setNewClassCode] = useState<string>("CUSTOM 01");
  const [newClassTitle, setNewClassTitle] = useState<string>("");
  const [newClassSubtitle, setNewClassSubtitle] = useState<string>("");
  const [newClassCourse, setNewClassCourse] = useState<CourseTier>("beginner");
  const [newClassTrack, setNewClassTrack] =
    useState<ClassTrackCategory>("Foundation Track");
  const [newClassCover, setNewClassCover] = useState<string>(
    "/illustrations/class1-external-blink-wiring.svg"
  );

  const jsonImportRef = useRef<HTMLInputElement | null>(null);

  // Class statuses & student submissions
  const [classStatuses, setClassStatuses] = useState<{
    [id: string]: ClassStatus;
  }>({
    "exp-01": "published",
    "exp-02": "published",
    "exp-03": "published",
    "exp-04": "published",
    "beg-01": "published",
    "beg-02": "published",
    "beg-03": "published",
    "beg-04": "published",
  });
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);

  // Load decks from LocalStorage & sync with Firestore
  useEffect(() => {
    const initial = loadDecksFromStorage();
    setDecks(initial);
    syncDecksFromFirestore().then((synced) => {
      setDecks(synced);
    });
  }, []);

  // Load real-time class status overrides from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, "curriculum_status"),
        (snapshot) => {
          const updates: { [id: string]: ClassStatus } = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.status) {
              updates[docSnap.id] = data.status;
            }
          });
          setClassStatuses((prev) => ({ ...prev, ...updates }));
        }
      );
      return () => unsub();
    } catch {}
  }, []);

  // Load submissions from Firestore
  useEffect(() => {
    try {
      const q = query(
        collection(db, "curriculum_submissions"),
        orderBy("submittedAt", "desc"),
        limit(50)
      );
      const unsubSubs = onSnapshot(
        q,
        (snapshot) => {
          const subs: any[] = [];
          snapshot.forEach((docSnap) => {
            subs.push({ id: docSnap.id, ...docSnap.data() });
          });
          setSubmissions(subs);
          setLoadingSubs(false);
        },
        () => {
          setLoadingSubs(false);
        }
      );
      return () => unsubSubs();
    } catch {
      setLoadingSubs(false);
    }
  }, []);

  const updateStatus = async (classId: string, newStatus: ClassStatus) => {
    setClassStatuses((prev) => ({ ...prev, [classId]: newStatus }));
    setOpenCardMenuId(null);
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

  // Match an EditableClassDeck to a fallback RoboticsLesson record
  const resolveLessonForDeck = (deck: EditableClassDeck): RoboticsLesson => {
    return (
      ALL_ROBOTICS_LESSONS.find((l) => l.id === deck.id) ||
      ALL_ROBOTICS_LESSONS[0]
    );
  };

  // Create New Class Presentation
  const handleCreateNewClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassTitle.trim()) return;
    const newId = `custom-class-${Date.now()}`;
    const starterSlides = [
      {
        ...createBlankSlide(1, "robobee-dark"),
        numberLabel: "01",
        layout: "hero-title" as const,
        badge: `${newClassCode.toUpperCase()} • PROPOSED WORKSHOP`,
        title: newClassTitle.trim(),
        subtitle:
          newClassSubtitle.trim() ||
          "Interactive 120-minute hands-on engineering workshop — customize slides in Slide Studio.",
        heroImage: newClassCover.trim(),
        imageCaption: `Reference Illustration • ${newClassCode}: ${newClassTitle.trim()}`,
      },
      {
        ...createBlankSlide(2, "daylight-studio"),
        numberLabel: "02",
        layout: "interactive-grid" as const,
        badge: "CORE CONCEPTS",
        title: "Key Engineering Concepts & Theory",
        subtitle: "Add custom cards, photos, or flip-cards in the Slide Studio editor.",
      },
      {
        ...createBlankSlide(3, "arduino-teal"),
        numberLabel: "03",
        layout: "interactive-hotspot" as const,
        badge: "HARDWARE ANATOMY",
        title: "Interactive Hardware & Wiring Map",
        subtitle: "Click pins on the diagram to inspect connections.",
      },
    ];

    const createdDeck: EditableClassDeck = {
      id: newId,
      courseId: newClassCourse,
      proposedAudience:
        COURSE_SPACES.find((c) => c.id === newClassCourse)?.badge ||
        "Proposed for Classes 5–8",
      classCode: newClassCode.trim().toUpperCase(),
      title: newClassTitle.trim(),
      subtitle:
        newClassSubtitle.trim() ||
        "Custom RoboBEE Innovators 120-minute interactive presentation deck.",
      track: newClassTrack,
      durationMinutes: 120,
      xpReward: 250,
      coverImage: newClassCover.trim(),
      lastEditedAt: new Date().toISOString(),
      status: "published",
      hardwareSimType: "breadboard_circuit_sim",
      kitComponents: [
        { name: "Arduino Uno R3", spec: "ATmega328P 5V", qty: 1 },
        { name: "Solderless Breadboard", spec: "400 Tie-Points", qty: 1 },
        { name: "Jumper Wires", spec: "Male-to-Male", qty: 4 },
      ],
      hardwareKit: [
        "1x Arduino Uno R3",
        "1x Solderless Breadboard",
        "Jumper Wires",
      ],
      slides: starterSlides,
    };

    const updated = await saveDeckToStorageAndCloud(createdDeck);
    setDecks(updated);
    setShowCreateModal(false);
    setNewClassTitle("");
    setNewClassSubtitle("");
    setStudioDeck(createdDeck);
  };

  // Duplicate Class Deck
  const handleDuplicateDeck = async (deck: EditableClassDeck) => {
    setOpenCardMenuId(null);
    const copyDeck: EditableClassDeck = {
      ...JSON.parse(JSON.stringify(deck)),
      id: `${deck.id}-copy-${Date.now()}`,
      classCode: `${deck.classCode} (COPY)`,
      title: `${deck.title} (Copy)`,
      lastEditedAt: new Date().toISOString(),
    };
    const updated = await saveDeckToStorageAndCloud(copyDeck);
    setDecks(updated);
  };

  // Delete / Reset Class Deck
  const handleDeleteDeck = async (deck: EditableClassDeck) => {
    setOpenCardMenuId(null);
    if (
      !confirm(
        `Reset or delete "${deck.classCode}: ${deck.title}"? (Canonical classes will reset to their default 12-slide deck.)`
      )
    )
      return;
    const updated = await deleteDeckFromStorageAndCloud(deck.id);
    setDecks(updated);
  };

  // Export Single Deck or All Decks as JSON
  const handleExportDecks = (targetDeck?: EditableClassDeck) => {
    setShowDataMenu(false);
    setOpenCardMenuId(null);
    const payload = targetDeck ? [targetDeck] : decks;
    const filename = targetDeck
      ? `RoboBEE_${targetDeck.classCode.replace(/\s+/g, "_")}_Deck.json`
      : `RoboBEE_All_36_Class_Decks_${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import Decks from JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDataMenu(false);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const list: EditableClassDeck[] = Array.isArray(parsed)
          ? parsed
          : [parsed];
        let latest = decks;
        for (const item of list) {
          if (item && item.id && Array.isArray(item.slides)) {
            latest = await saveDeckToStorageAndCloud({
              ...item,
              lastEditedAt: new Date().toISOString(),
            });
          }
        }
        setDecks(latest);
        alert(`Successfully imported ${list.length} class deck(s)!`);
      } catch {
        alert("Invalid JSON deck file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Resolve courseId for each deck
  const resolveDeckCourseId = (deck: EditableClassDeck): CourseTier => {
    if (deck.courseId) return deck.courseId;
    if (deck.id.startsWith("exp-")) return "explorer";
    if (deck.id.startsWith("int-")) return "intermediate";
    if (deck.id.startsWith("adv-")) return "advanced";
    return "beginner";
  };

  // Filtered Decks
  const filteredDecks = decks.filter((d) => {
    const cId = resolveDeckCourseId(d);
    const matchesCourse = courseFilter === "ALL" || cId === courseFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      d.classCode.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.subtitle.toLowerCase().includes(q);
    return matchesCourse && matchesSearch;
  });

  const totalSlidesAcrossAllClasses = decks.reduce(
    (acc, d) => acc + d.slides.length,
    0
  );

  return (
    <div
      className={styles.pageContainer}
      style={{
        background: "#161B26",
        color: "#FFFFFF",
        minHeight: "100vh",
        padding: "1.75rem",
      }}
      onClick={() => {
        if (openCardMenuId) setOpenCardMenuId(null);
        if (showDataMenu) setShowDataMenu(false);
      }}
    >
      {/* Hidden JSON File Input */}
      <input
        ref={jsonImportRef}
        type="file"
        accept="application/json"
        onChange={handleImportJson}
        style={{ display: "none" }}
      />

      {/* Editorial Engineering Header */}
      <div
        className={styles.headerRow}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div className={styles.titleArea} style={{ maxWidth: "720px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.25rem 0.7rem",
              borderRadius: "6px",
              background: "rgba(107, 15, 36, 0.45)",
              border: "1px solid #6B0F24",
              color: "#F5B800",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            ROBOBEE INNOVATORS • INSTRUCTOR &amp; ADMIN STUDIO
          </div>
          <h1
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <Radio size={24} color="#F5B800" />
            Curriculum &amp; Classroom Studio
          </h1>
          <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.55 }}>
            36 proposed 120-minute (2-hour) robotics lessons across 4 course pathways. Launch{" "}
            <strong style={{ color: "#FFFFFF" }}>Present Class</strong> for classroom delivery or{" "}
            <strong style={{ color: "#FFFFFF" }}>Edit / Manage</strong> to customize slides, diagrams, and bench tools.
          </p>
        </div>

        {/* Clean Top Header Actions (including tucked Data & Backup menu) */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="/dashboard/admin/attendance"
            style={{
              padding: "0.55rem 0.9rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              borderRadius: "8px",
              background: "#1E2533",
              color: "#E2E8F0",
              border: "1px solid #2E374B",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Calendar size={14} color="#F5B800" />
            Attendance
          </Link>

          <Link
            href="/dashboard/curriculum/reference"
            style={{
              padding: "0.55rem 0.9rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              borderRadius: "8px",
              background: "#1E2533",
              color: "#E2E8F0",
              border: "1px solid #2E374B",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <BookOpen size={14} color="#F5B800" />
            Field Guide
          </Link>

          {/* Admin Settings: Data & Backup Dropdown (Export/Import JSON moved out of search bar) */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowDataMenu((prev) => !prev)}
              style={{
                padding: "0.55rem 0.9rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                borderRadius: "8px",
                background: "#1E2533",
                color: "#E2E8F0",
                border: "1px solid #2E374B",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Settings size={14} color="#94A3B8" />
              Data &amp; Backup
            </button>

            {showDataMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  width: "220px",
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "10px",
                  padding: "0.4rem",
                  boxShadow: "0 16px 36px rgba(0, 0, 0, 0.55)",
                  zIndex: 50,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleExportDecks()}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 0.65rem",
                    borderRadius: "6px",
                    background: "transparent",
                    border: "none",
                    color: "#E2E8F0",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                  }}
                >
                  <Download size={14} color="#F5B800" /> Export All JSON
                </button>
                <button
                  type="button"
                  onClick={() => jsonImportRef.current?.click()}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 0.65rem",
                    borderRadius: "6px",
                    background: "transparent",
                    border: "none",
                    color: "#E2E8F0",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                  }}
                >
                  <Upload size={14} color="#F5B800" /> Import JSON Backup
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: "0.58rem 1rem",
              fontSize: "0.82rem",
              fontWeight: 800,
              borderRadius: "8px",
              background: "#6B0F24",
              color: "#FFFFFF",
              border: "1px solid #F5B800",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Plus size={15} color="#F5B800" /> Create New Class
          </button>
        </div>
      </div>

      {/* Accurate 36-Lesson KPI Summary Strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#1E2533",
            border: "1px solid #2E374B",
            borderRadius: "12px",
            padding: "1rem 1.2rem",
          }}
        >
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
            Total Curriculum Scope
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", marginTop: "0.2rem" }}>
            36 Total Lessons
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94A3B8", marginTop: "0.15rem" }}>
            4 Explorers + 10 Beginner + 10 Intermediate + 12 Advanced
          </div>
        </div>

        <div
          style={{
            background: "#1E2533",
            border: "1px solid #2E374B",
            borderRadius: "12px",
            padding: "1rem 1.2rem",
          }}
        >
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
            Standard Session Pacing
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#F5B800", marginTop: "0.2rem" }}>
            120 Min / Class
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94A3B8", marginTop: "0.15rem" }}>
            72 Total Workshop Hours (60m compact supported)
          </div>
        </div>

        <div
          style={{
            background: "#1E2533",
            border: "1px solid #2E374B",
            borderRadius: "12px",
            padding: "1rem 1.2rem",
          }}
        >
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
            Projector Slide Decks
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", marginTop: "0.2rem" }}>
            {totalSlidesAcrossAllClasses} Slides
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94A3B8", marginTop: "0.15rem" }}>
            12 structured slides per class • Daylight &amp; Dark Studio
          </div>
        </div>

        <div
          style={{
            background: "#1E2533",
            border: "1px solid #2E374B",
            borderRadius: "12px",
            padding: "1rem 1.2rem",
          }}
        >
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
            Exit Check Submissions
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#10B981", marginTop: "0.2rem" }}>
            {submissions.length} Logged
          </div>
          <div style={{ fontSize: "0.76rem", color: "#94A3B8", marginTop: "0.15rem" }}>
            4-question student exit reflections
          </div>
        </div>
      </div>

      {/* Primary View Switcher: Course Library vs. Student Exit Check Submissions */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid #2E374B",
          marginBottom: "1.25rem",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("library")}
          style={{
            padding: "0.65rem 1.15rem",
            background: activeTab === "library" ? "#1E2533" : "transparent",
            color: activeTab === "library" ? "#F5B800" : "#94A3B8",
            border: "1px solid",
            borderColor: activeTab === "library" ? "#2E374B" : "transparent",
            borderBottom: activeTab === "library" ? "2px solid #F5B800" : "none",
            borderRadius: "8px 8px 0 0",
            fontWeight: 800,
            fontSize: "0.84rem",
            cursor: "pointer",
          }}
        >
          Course Pathways &amp; Class Library ({decks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          style={{
            padding: "0.65rem 1.15rem",
            background: activeTab === "submissions" ? "#1E2533" : "transparent",
            color: activeTab === "submissions" ? "#F5B800" : "#94A3B8",
            border: "1px solid",
            borderColor: activeTab === "submissions" ? "#2E374B" : "transparent",
            borderBottom: activeTab === "submissions" ? "2px solid #F5B800" : "none",
            borderRadius: "8px 8px 0 0",
            fontWeight: 800,
            fontSize: "0.84rem",
            cursor: "pointer",
          }}
        >
          Student Exit Check Submissions ({submissions.length})
        </button>
      </div>

      {/* TAB 1: COURSE PATHWAYS & CLEAN CLASS GRID */}
      {activeTab === "library" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* 4 Course Pathway Tabs + Search Bar */}
          <div
            style={{
              background: "#1E2533",
              border: "1px solid #2E374B",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.85rem",
            }}
          >
            {/* 4 Course Pathway Tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
              {COURSE_SPACES.map((cs) => {
                const count = decks.filter((d) => resolveDeckCourseId(d) === cs.id).length;
                const isSelected = courseFilter === cs.id;
                return (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => setCourseFilter(cs.id)}
                    style={{
                      padding: "0.48rem 0.85rem",
                      borderRadius: "8px",
                      border: `1px solid ${isSelected ? "#F5B800" : "#2E374B"}`,
                      background: isSelected ? "#6B0F24" : "#161B26",
                      color: isSelected ? "#FFFFFF" : "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span>{cs.title}</span>
                    <span
                      style={{
                        padding: "0.1rem 0.4rem",
                        borderRadius: "999px",
                        background: isSelected ? "rgba(245, 184, 0, 0.2)" : "#1E2533",
                        color: isSelected ? "#F5B800" : "#94A3B8",
                        fontSize: "0.7rem",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCourseFilter("ALL")}
                style={{
                  padding: "0.48rem 0.85rem",
                  borderRadius: "8px",
                  border: `1px solid ${courseFilter === "ALL" ? "#F5B800" : "#2E374B"}`,
                  background: courseFilter === "ALL" ? "#6B0F24" : "#161B26",
                  color: courseFilter === "ALL" ? "#FFFFFF" : "#94A3B8",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                All 36 Classes
              </button>
            </div>

            {/* Clean Search Input */}
            <div style={{ position: "relative", minWidth: "240px", flex: "0 1 300px" }}>
              <Search
                size={14}
                color="#94A3B8"
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search class code, topic, sensor..."
                style={{
                  width: "100%",
                  padding: "0.48rem 0.75rem 0.48rem 2.1rem",
                  borderRadius: "8px",
                  background: "#161B26",
                  border: "1px solid #2E374B",
                  color: "#FFFFFF",
                  fontSize: "0.8rem",
                }}
              />
            </div>
          </div>

          {/* Selected Course Pathway Banner */}
          {courseFilter !== "ALL" && (() => {
            const activeSpace = COURSE_SPACES.find((c) => c.id === courseFilter);
            if (!activeSpace) return null;
            return (
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderLeft: "4px solid #F5B800",
                  borderRadius: "10px",
                  padding: "0.9rem 1.15rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <strong style={{ fontSize: "0.95rem", color: "#FFFFFF" }}>
                      {activeSpace.title}
                    </strong>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "6px",
                        background: "rgba(245, 184, 0, 0.14)",
                        color: "#F5B800",
                      }}
                    >
                      {activeSpace.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                    {activeSpace.description}
                  </div>
                </div>
                <div style={{ fontSize: "0.76rem", color: "#E2E8F0", fontWeight: 700 }}>
                  Hardware: <span style={{ color: "#94A3B8", fontWeight: 500 }}>{activeSpace.recommendedHardware}</span>
                </div>
              </div>
            );
          })()}

          {/* De-Cluttered 3-Column Class Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {filteredDecks.map((deck) => {
              const status = classStatuses[deck.id] || deck.status || "published";
              const cId = resolveDeckCourseId(deck);
              const space = COURSE_SPACES.find((c) => c.id === cId);
              const proposedLabel = deck.proposedAudience || space?.badge || "Proposed • Classes 5–8";
              const isMenuOpen = openCardMenuId === deck.id;

              return (
                <div
                  key={deck.id}
                  style={{
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    borderRadius: "14px",
                    padding: "1.2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {/* 1.3.1: Maximum 2 Metadata Pills at Top of Card */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          padding: "0.24rem 0.65rem",
                          borderRadius: "6px",
                          background: "rgba(245, 184, 0, 0.14)",
                          border: "1px solid rgba(245, 184, 0, 0.35)",
                          color: "#F5B800",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {deck.classCode}
                      </span>

                      <span
                        style={{
                          padding: "0.24rem 0.65rem",
                          borderRadius: "6px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#94A3B8",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                        }}
                      >
                        {proposedLabel}
                      </span>
                    </div>

                    {/* Clean Reference Illustration Thumbnail */}
                    <PresentationMediaFrame
                      src={deck.coverImage}
                      alt={deck.title}
                      caption={`Reference Illustration • ${deck.slides.length} Slides`}
                      fallbackVariant={deck.id === "beg-02" ? "mcu" : "arduino"}
                      accentColor="#F5B800"
                      height="168px"
                    />

                    {/* Title & Concise Promise */}
                    <div>
                      <h3
                        style={{
                          margin: "0 0 0.35rem 0",
                          fontSize: "1.08rem",
                          fontWeight: 800,
                          color: "#FFFFFF",
                          lineHeight: 1.3,
                        }}
                      >
                        {deck.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.82rem",
                          color: "#94A3B8",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {deck.subtitle}
                      </p>
                    </div>

                    {/* Subtle Duration & Member Access Indicator */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "0.5rem",
                        borderTop: "1px solid #2E374B",
                        fontSize: "0.74rem",
                        color: "#94A3B8",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Clock size={13} color="#F5B800" /> 120m Standard (60m Compact)
                      </span>
                      <span
                        style={{
                          color:
                            status === "locked"
                              ? "#EF4444"
                              : status === "live_in_class"
                              ? "#F5B800"
                              : "#10B981",
                          fontWeight: 700,
                        }}
                      >
                        {status === "locked"
                          ? "Locked"
                          : status === "live_in_class"
                          ? "Live in Lab"
                          : "Unlocked"}
                      </span>
                    </div>
                  </div>

                  {/* 1.3.1: 1 Primary Button (Present Class) + 1 Secondary Button (Edit / Manage) + ••• Menu */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr auto",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setProjectorInitialSlide(0);
                        setProjectorDeck(deck);
                      }}
                      style={{
                        padding: "0.6rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #F5B800",
                        background: "#6B0F24",
                        color: "#FFFFFF",
                        fontWeight: 800,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Tv size={14} color="#F5B800" /> Present Class
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudioDeck(deck)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #2E374B",
                        background: "#161B26",
                        color: "#E2E8F0",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Edit3 size={14} color="#94A3B8" /> Edit / Manage
                    </button>

                    {/* ••• Overflow Menu Button */}
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCardMenuId((prev) =>
                            prev === deck.id ? null : deck.id
                          )
                        }
                        title="More class actions"
                        style={{
                          padding: "0.6rem 0.65rem",
                          borderRadius: "8px",
                          border: "1px solid #2E374B",
                          background: "#161B26",
                          color: "#94A3B8",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {isMenuOpen && (
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: "calc(100% + 6px)",
                            width: "230px",
                            background: "#161B26",
                            border: "1px solid #2E374B",
                            borderRadius: "10px",
                            padding: "0.4rem",
                            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.65)",
                            zIndex: 40,
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.2rem",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setOpenCardMenuId(null);
                              setHardwareLabDeck(deck);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.48rem 0.6rem",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              color: "#FFFFFF",
                              fontSize: "0.76rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <Cpu size={13} color="#F5B800" /> Open Hardware Simulator
                          </button>

                          <div style={{ height: "1px", background: "#2E374B", margin: "0.2rem 0" }} />

                          <button
                            type="button"
                            onClick={() => updateStatus(deck.id, "published")}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.45rem 0.6rem",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              color: status === "published" ? "#10B981" : "#E2E8F0",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <Unlock size={13} /> Unlock for Members
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStatus(deck.id, "live_in_class")}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.45rem 0.6rem",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              color: status === "live_in_class" ? "#F5B800" : "#E2E8F0",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <Radio size={13} /> Mark as Live in Lab
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStatus(deck.id, "locked")}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.45rem 0.6rem",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              color: status === "locked" ? "#EF4444" : "#E2E8F0",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <Lock size={13} /> Lock for Members
                          </button>

                          <div style={{ height: "1px", background: "#2E374B", margin: "0.2rem 0" }} />

                          <button
                            type="button"
                            onClick={() => handleDuplicateDeck(deck)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.45rem 0.6rem",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              color: "#E2E8F0",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <Copy size={13} /> Duplicate Class
                          </button>

                          <button
                            type="button"
                            onClick={() => handleExportDecks(deck)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.45rem 0.6rem",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              color: "#E2E8F0",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <Download size={13} /> Export Class JSON
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDeck(deck)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.45rem 0.6rem",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "none",
                              color: "#EF4444",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <Trash2 size={13} /> Reset / Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT EXIT CHECK SUBMISSIONS */}
      {activeTab === "submissions" && (
        <div
          className={styles.submissionsCard}
          style={{
            background: "#1E2533",
            border: "1px solid #2E374B",
            borderRadius: "14px",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#FFFFFF",
              marginBottom: "1rem",
            }}
          >
            Student Exit Check Reflections
          </h2>

          {loadingSubs ? (
            <p style={{ color: "#94A3B8" }}>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <div className={styles.emptyState}>
              <p style={{ color: "#94A3B8" }}>
                No exit check submissions recorded yet. Have students complete
                the 4-Question Exit Check inside their lesson workbench!
              </p>
            </div>
          ) : (
            <table className={styles.subTable}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Reflection Answers</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 700, color: "#F8FAFC" }}>
                      {sub.userEmail || sub.userId || "Student"}
                    </td>
                    <td>
                      <span className={styles.classCode}>
                        {sub.classCode || sub.classId}
                      </span>
                    </td>
                    <td>
                      {sub.answers && typeof sub.answers === "object" ? (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "1.1rem",
                            color: "#CBD5E1",
                            fontSize: "0.82rem",
                          }}
                        >
                          {Object.entries(sub.answers).map(([k, v]) => (
                            <li key={k}>{String(v)}</li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: "#64748B" }}>Completed</span>
                      )}
                    </td>
                    <td style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleString()
                        : "Recent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* "+ CREATE NEW CLASS PRESENTATION" MODAL */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(22, 27, 38, 0.88)",
            backdropFilter: "blur(12px)",
            zIndex: 999990,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1E2533",
              border: "1px solid #2E374B",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "520px",
              width: "100%",
              color: "#FFFFFF",
              boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FolderPlus size={18} color="#F5B800" />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
                  Create New 120-Minute Class Deck
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateNewClass}
              style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.4fr",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Class Code Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                    placeholder="CUSTOM 01"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "8px",
                      background: "#161B26",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Course Pathway
                  </label>
                  <select
                    value={newClassCourse}
                    onChange={(e) => setNewClassCourse(e.target.value as CourseTier)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "8px",
                      background: "#161B26",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                  >
                    {COURSE_SPACES.map((cs) => (
                      <option key={cs.id} value={cs.id}>
                        {cs.title} ({cs.badge})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "#94A3B8",
                    marginBottom: "0.25rem",
                  }}
                >
                  Class Presentation Title
                </label>
                <input
                  type="text"
                  required
                  value={newClassTitle}
                  onChange={(e) => setNewClassTitle(e.target.value)}
                  placeholder="e.g., Servo Motors, Robotic Arms & Kinematics"
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.7rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "#94A3B8",
                    marginBottom: "0.25rem",
                  }}
                >
                  Subtitle / Workshop Promise
                </label>
                <textarea
                  rows={2}
                  value={newClassSubtitle}
                  onChange={(e) => setNewClassSubtitle(e.target.value)}
                  placeholder="What will students build, wire, and program in this 120-minute session?"
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.7rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "#94A3B8",
                    marginBottom: "0.25rem",
                  }}
                >
                  Reference Diagram / Cover Path
                </label>
                <input
                  type="text"
                  value={newClassCover}
                  onChange={(e) => setNewClassCover(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.7rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#F5B800",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.6rem",
                  marginTop: "0.4rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #2E374B",
                    background: "transparent",
                    color: "#94A3B8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.55rem 1.15rem",
                    borderRadius: "8px",
                    border: "1px solid #F5B800",
                    background: "#6B0F24",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Create &amp; Open in Slide Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE PROJECTOR MODAL */}
      {projectorDeck && (
        <ProjectorView
          lesson={resolveLessonForDeck(projectorDeck)}
          customDeck={projectorDeck}
          initialSlide={projectorInitialSlide}
          onClose={() => setProjectorDeck(null)}
          onEditDeck={(deckToEdit) => {
            setProjectorDeck(null);
            setStudioDeck(deckToEdit);
          }}
        />
      )}

      {/* IN-BROWSER POWERPOINT / CANVA SLIDE STUDIO EDITOR */}
      {studioDeck && (
        <SlideStudioEditor
          initialDeck={studioDeck}
          onClose={() => setStudioDeck(null)}
          onDeckSaved={(updatedDeck) => {
            setStudioDeck(updatedDeck);
            setDecks(loadDecksFromStorage());
          }}
          onLaunchProjector={(updatedDeck, slideIdx) => {
            setStudioDeck(null);
            setProjectorInitialSlide(slideIdx);
            setProjectorDeck(updatedDeck);
          }}
        />
      )}

      {/* CLEAN NON-OVERLAPPING HARDWARE LAB & CIRCUIT SIMULATOR DRAWER */}
      {hardwareLabDeck && (
        <HardwareLabDrawer
          deck={hardwareLabDeck}
          lesson={resolveLessonForDeck(hardwareLabDeck)}
          onClose={() => setHardwareLabDeck(null)}
        />
      )}
    </div>
  );
}
