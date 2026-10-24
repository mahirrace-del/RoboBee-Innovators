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
  normalizeDeckToFreeform,
} from "@/lib/slideStudioStore";
import { SlideStudioEditor } from "@/components/curriculum/SlideStudioEditor";
import { HardwareLabDrawer } from "@/components/curriculum/HardwareLabDrawer";
import { AttendanceQuickModal } from "@/components/curriculum/AttendanceQuickModal";
import { FieldGuideModal } from "@/components/curriculum/FieldGuideModal";
import { LessonPlanModal } from "@/components/curriculum/LessonPlanModal";
import { ClassProgressionRoadmap } from "@/components/curriculum/ClassProgressionRoadmap";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  serverTimestamp,
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
  RefreshCw,
  GitMerge,
  LayoutGrid,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function AdminCurriculumPage() {
  const { user } = useAuth();

  // Primary View Mode: Progression Roadmap vs. Grid Library vs. Submissions
  const [viewMode, setViewMode] = useState<"roadmap" | "grid" | "submissions">(
    "roadmap"
  );

  // All Canonical Lessons + Any Custom Created Decks
  const [decks, setDecks] = useState<EditableClassDeck[]>([]);

  // Course Pathway Filter ('ALL' by default so instructors immediately see all 36 classes across all 4 pathways)
  const [courseFilter, setCourseFilter] = useState<"ALL" | CourseTier>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Header "Data & Backup" Dropdown & Per-Card "•••" Menu State
  const [showDataMenu, setShowDataMenu] = useState<boolean>(false);
  const [openCardMenuId, setOpenCardMenuId] = useState<string | null>(null);

  // Active Modals / Drawers
  const [projectorDeck, setProjectorDeck] = useState<EditableClassDeck | null>(null);
  const [projectorInitialSlide, setProjectorInitialSlide] = useState<number>(0);
  const [studioDeck, setStudioDeck] = useState<EditableClassDeck | null>(null);
  const [hardwareLabDeck, setHardwareLabDeck] = useState<EditableClassDeck | null>(null);

  // Quick modals for Attendance, Field Guide, and Lesson Plan
  const [showAttendanceModal, setShowAttendanceModal] = useState<boolean>(false);
  const [showFieldGuideModal, setShowFieldGuideModal] = useState<boolean>(false);
  const [selectedLessonPlanDeck, setSelectedLessonPlanDeck] = useState<EditableClassDeck | null>(null);

  // Student submission detailed inspection & manual recording modals
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [showLogSubmissionModal, setShowLogSubmissionModal] = useState<boolean>(false);
  const [logSubClassCode, setLogSubClassCode] = useState<string>("BEGINNER 01");
  const [logSubStudentName, setLogSubStudentName] = useState<string>("");
  const [logSubStudentEmail, setLogSubStudentEmail] = useState<string>("");
  const [logSubQ1, setLogSubQ1] = useState<string>("");
  const [logSubQ2, setLogSubQ2] = useState<string>("");
  const [logSubQ3, setLogSubQ3] = useState<string>("");
  const [logSubQ4, setLogSubQ4] = useState<string>("");
  const [loggingSub, setLoggingSub] = useState<boolean>(false);

  // "+ Create New Class Presentation" Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newClassCode, setNewClassCode] = useState<string>("CUSTOM 01");
  const [newClassTitle, setNewClassTitle] = useState<string>("");
  const [newClassSubtitle, setNewClassSubtitle] = useState<string>("");
  const [newClassCourse, setNewClassCourse] = useState<CourseTier>("beginner");
  const [newClassTrack, setNewClassTrack] = useState<ClassTrackCategory>("Foundation Track");
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
    "beg-05": "published",
    "beg-06": "published",
    "beg-07": "published",
    "beg-08": "published",
    "beg-09": "published",
    "beg-10": "published",
    "beg-11": "published",
    "beg-12": "published",
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
        },
        (error) => {
          console.warn("Firestore status listener note (using local status map):", error);
        }
      );
      return () => unsub();
    } catch {}
  }, []);

  // Load submissions from LocalStorage + Firestore
  useEffect(() => {
    // Initial local submissions fallback
    try {
      const stored = JSON.parse(
        localStorage.getItem("robobee_curriculum_submissions_v1") || "[]"
      );
      if (Array.isArray(stored) && stored.length > 0) {
        setSubmissions(stored);
        setLoadingSubs(false);
      }
    } catch {}

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
          if (subs.length > 0) {
            setSubmissions(subs);
            try {
              localStorage.setItem("robobee_curriculum_submissions_v1", JSON.stringify(subs));
            } catch {}
          }
          setLoadingSubs(false);
        },
        (error) => {
          console.warn("Firestore submissions listener note (using local cache):", error);
          setLoadingSubs(false);
        }
      );
      return () => unsubSubs();
    } catch {
      setLoadingSubs(false);
    }
  }, []);

  // Submit student exit check reflection
  const handleSubmitExitTicket = async (data: {
    classCode: string;
    lessonId: string;
    userId: string;
    userEmail: string;
    answers: Record<number, string>;
  }) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      ...data,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [newSub, ...prev]);

    try {
      const stored = JSON.parse(
        localStorage.getItem("robobee_curriculum_submissions_v1") || "[]"
      );
      localStorage.setItem(
        "robobee_curriculum_submissions_v1",
        JSON.stringify([newSub, ...stored])
      );
    } catch {}

    try {
      await addDoc(collection(db, "curriculum_submissions"), {
        ...data,
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Saved exit ticket locally (Firestore sync error):", err);
    }
  };

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
    setStudioDeck(normalizeDeckToFreeform(createdDeck));
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

  // Reset to default seed decks
  const handleResetToDefaults = () => {
    setShowDataMenu(false);
    if (
      !confirm(
        "Reset all classes to the canonical 36 curriculum workshops with default 12-slide structured decks?"
      )
    ) {
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("robobee_curriculum_decks_v2");
    }
    const fresh = loadDecksFromStorage();
    setDecks(fresh);
    alert("Curriculum reset to canonical 36 classes (432 slides).");
  };

  // Resolve courseId for each deck
  const resolveDeckCourseId = (deck: EditableClassDeck): CourseTier => {
    if (deck.courseId) return deck.courseId;
    if (deck.id.startsWith("exp-")) return "explorer";
    if (deck.id.startsWith("int-")) return "intermediate";
    if (deck.id.startsWith("adv-")) return "advanced";
    return "beginner";
  };

  // Filtered Decks for Grid View
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

  const unlockedCount = decks.filter(
    (d) => (classStatuses[d.id] || d.status || "published") !== "locked"
  ).length;

  const lockedCount = decks.filter(
    (d) => (classStatuses[d.id] || d.status || "published") === "locked"
  ).length;

  return (
    <div
      className={styles.pageContainer}
      style={{
        background: "#161B26",
        color: "#FFFFFF",
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

      {/* Modern High-End Engineering Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <div className={styles.titleBadge}>
            ROBOBEE INNOVATORS • INSTRUCTOR &amp; ADMIN STUDIO
          </div>
          <h1 className={styles.titleHeading}>
            <Radio size={26} color="#F5B800" />
            Curriculum &amp; Classroom Studio
          </h1>
          <p className={styles.titleDesc}>
            Comprehensive 120-minute hands-on robotics curriculum across 4 progressive course pathways.
            Launch live presentation decks, simulate circuits, and manage lab bench progress.
          </p>
        </div>

        {/* Clean Top Header Actions */}
        <div className={styles.headerActions} onClick={(e) => e.stopPropagation()}>
          {/* Quick Attendance Modal Button */}
          <button
            type="button"
            onClick={() => setShowAttendanceModal(true)}
            className={styles.actionBtn}
          >
            <Calendar size={15} color="#F5B800" />
            Attendance
          </button>

          {/* Quick Exit Check Submission Button */}
          <button
            type="button"
            onClick={() => setShowLogSubmissionModal(true)}
            className={styles.actionBtn}
          >
            <Sparkles size={15} color="#38BDF8" />
            Submit Exit Check
          </button>

          {/* Quick Field Guide Reference Button */}
          <button
            type="button"
            onClick={() => setShowFieldGuideModal(true)}
            className={styles.actionBtn}
          >
            <BookOpen size={15} color="#F5B800" />
            Field Guide
          </button>

          {/* Admin Settings: Data & Backup Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowDataMenu((prev) => !prev)}
              className={styles.actionBtn}
            >
              <Settings size={15} color="#94A3B8" />
              Data &amp; Backup
            </button>

            {showDataMenu && (
              <div className={styles.dropdownMenu}>
                <button
                  type="button"
                  onClick={() => handleExportDecks()}
                  className={styles.dropdownItem}
                >
                  <Download size={14} color="#F5B800" /> Export All JSON
                </button>
                <button
                  type="button"
                  onClick={() => jsonImportRef.current?.click()}
                  className={styles.dropdownItem}
                >
                  <Upload size={14} color="#F5B800" /> Import JSON Backup
                </button>
                <div style={{ height: "1px", background: "#2E374B", margin: "0.2rem 0" }} />
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className={styles.dropdownItem}
                  style={{ color: "#F87171" }}
                >
                  <RefreshCw size={14} /> Reset Canonical Decks
                </button>
              </div>
            )}
          </div>

          {/* Create New Class Action */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className={styles.primaryActionBtn}
          >
            <Plus size={16} color="#F5B800" /> Create New Class
          </button>
        </div>
      </div>

      {/* 5 KPI Summary Strip */}
      <div className={styles.statsGrid}>
        {/* 1. Total Lessons */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Total Curriculum Scope</div>
          <div className={styles.kpiValue}>{decks.length} Total Lessons</div>
          <div className={styles.kpiSub}>
            4 Explorers + 10 Beginner + 10 Intermediate + 12 Advanced
          </div>
        </div>

        {/* 2. 120-Minute Session Pacing */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Standard Session Pacing</div>
          <div className={styles.kpiValue} style={{ color: "#F5B800" }}>
            120 Min / Class
          </div>
          <div className={styles.kpiSub}>
            72 Total Workshop Hours (60m compact supported)
          </div>
        </div>

        {/* 3. Total Slides Across All Classes */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Projector Slide Decks</div>
          <div className={styles.kpiValue}>
            {totalSlidesAcrossAllClasses} Slides
          </div>
          <div className={styles.kpiSub}>
            12 structured slides per class • Daylight &amp; Dark Studio
          </div>
        </div>

        {/* 4. Unlocked vs Locked Counter */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Student Access Status</div>
          <div
            className={styles.kpiValue}
            style={{ color: lockedCount === 0 ? "#10B981" : "#F5B800" }}
          >
            {unlockedCount} Unlocked • {lockedCount} Locked
          </div>
          <div className={styles.kpiSub}>
            {lockedCount === 0 ? "Zero locked classes • Open access" : "Configured via admin controls"}
          </div>
        </div>

        {/* 5. Exit Check Submissions */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Exit Check Submissions</div>
          <div className={styles.kpiValue} style={{ color: "#38BDF8" }}>
            {submissions.length} Logged
          </div>
          <div className={styles.kpiSub}>
            4-question student exit reflections recorded
          </div>
        </div>
      </div>

      {/* Primary View Mode Switcher */}
      <div className={styles.viewSwitcherBar}>
        <div className={styles.viewTabs}>
          {/* Mode 1: Sequence & Progression Roadmap */}
          <button
            type="button"
            onClick={() => setViewMode("roadmap")}
            className={`${styles.viewTabBtn} ${
              viewMode === "roadmap" ? styles.viewTabBtnActive : ""
            }`}
          >
            <GitMerge size={15} /> Class Progression Roadmap
          </button>

          {/* Mode 2: Grid Library */}
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`${styles.viewTabBtn} ${
              viewMode === "grid" ? styles.viewTabBtnActive : ""
            }`}
          >
            <LayoutGrid size={15} /> Class Grid Library ({decks.length})
          </button>

          {/* Mode 3: Student Exit Submissions */}
          <button
            type="button"
            onClick={() => setViewMode("submissions")}
            className={`${styles.viewTabBtn} ${
              viewMode === "submissions" ? styles.viewTabBtnActive : ""
            }`}
          >
            <FileText size={15} /> Student Exit Check Submissions ({submissions.length})
          </button>
        </div>

        {/* Real-time Search Box */}
        {viewMode !== "submissions" && (
          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search class code, topic, sensor..."
              className={styles.searchInput}
            />
          </div>
        )}
      </div>

      {/* Course Pathway Selector (Rendered for Roadmap & Grid Views) */}
      {viewMode !== "submissions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
          <div className={styles.pathwayBar}>
            <div className={styles.pathwayTabs}>
              <button
                type="button"
                onClick={() => setCourseFilter("ALL")}
                className={`${styles.pathwayBtn} ${
                  courseFilter === "ALL" ? styles.pathwayBtnActive : ""
                }`}
              >
                <span>All Classes</span>
                <span
                  className={styles.pathwayBadgePill}
                  style={{
                    background: courseFilter === "ALL" ? "rgba(245, 184, 0, 0.2)" : "#1E2533",
                    color: courseFilter === "ALL" ? "#F5B800" : "#94A3B8",
                  }}
                >
                  {decks.length}
                </span>
              </button>

              {COURSE_SPACES.map((cs) => {
                const count = decks.filter((d) => resolveDeckCourseId(d) === cs.id).length;
                const isSelected = courseFilter === cs.id;
                return (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => setCourseFilter(cs.id)}
                    className={`${styles.pathwayBtn} ${
                      isSelected ? styles.pathwayBtnActive : ""
                    }`}
                  >
                    <span>{cs.title}</span>
                    <span
                      className={styles.pathwayBadgePill}
                      style={{
                        background: isSelected ? "rgba(245, 184, 0, 0.2)" : "#1E2533",
                        color: isSelected ? "#F5B800" : "#94A3B8",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Pathway Info Banner */}
          {courseFilter !== "ALL" && (() => {
            const activeSpace = COURSE_SPACES.find((c) => c.id === courseFilter);
            if (!activeSpace) return null;
            return (
              <div
                className={styles.pathwayBanner}
                style={{ borderLeftColor: activeSpace.accentColor || "#F5B800" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <strong style={{ fontSize: "1rem", color: "#FFFFFF" }}>
                      {activeSpace.title}
                    </strong>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "6px",
                        background: "rgba(245, 184, 0, 0.14)",
                        color: activeSpace.accentColor || "#F5B800",
                      }}
                    >
                      {activeSpace.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                    {activeSpace.description}
                  </div>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#E2E8F0", fontWeight: 700 }}>
                  Bench Hardware:{" "}
                  <span style={{ color: "#38BDF8", fontWeight: 600 }}>
                    {activeSpace.recommendedHardware}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* VIEW 1: PROGRESSION ROADMAP (AFTER WHICH CLASS & WHICH CLASS) */}
      {viewMode === "roadmap" && (
        <ClassProgressionRoadmap
          decks={decks}
          courseFilter={courseFilter}
          classStatuses={classStatuses}
          searchQuery={searchQuery}
          onOpenProjector={(deck) => {
            setProjectorInitialSlide(0);
            setProjectorDeck(normalizeDeckToFreeform(deck));
          }}
          onOpenStudio={(deck) => {
            setStudioDeck(normalizeDeckToFreeform(deck));
          }}
          onOpenHardwareSim={(deck) => {
            setHardwareLabDeck(deck);
          }}
          onOpenLessonPlan={(deck) => {
            setSelectedLessonPlanDeck(deck);
          }}
          onToggleStatus={(deckId, newStatus) => {
            updateStatus(deckId, newStatus);
          }}
          onDuplicateDeck={(deck) => {
            handleDuplicateDeck(deck);
          }}
          onExportDeck={(deck) => {
            handleExportDecks(deck);
          }}
          onDeleteDeck={(deck) => {
            handleDeleteDeck(deck);
          }}
        />
      )}

      {/* VIEW 2: MODULAR CLASS GRID LIBRARY */}
      {viewMode === "grid" && (
        <div className={styles.cardsGrid}>
          {filteredDecks.map((deck) => {
            const status = classStatuses[deck.id] || deck.status || "published";
            const cId = resolveDeckCourseId(deck);
            const space = COURSE_SPACES.find((c) => c.id === cId);
            const proposedLabel =
              deck.proposedAudience || space?.badge || "Proposed • Classes 5–8";
            const isMenuOpen = openCardMenuId === deck.id;

            return (
              <div key={deck.id} className={styles.classCard}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {/* Top Metadata Pills */}
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

                  {/* Reference Illustration Thumbnail */}
                  <PresentationMediaFrame
                    src={deck.coverImage}
                    alt={deck.title}
                    caption={`Reference Illustration • ${deck.slides.length} Slides`}
                    fallbackVariant={deck.id.startsWith("beg") ? "arduino" : "mcu"}
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

                  {/* Duration & Access Status */}
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

                {/* Primary Action Buttons Bar */}
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
                      setProjectorDeck(normalizeDeckToFreeform(deck));
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
                    onClick={() => setStudioDeck(normalizeDeckToFreeform(deck))}
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
                          <Cpu size={13} color="#00F5D4" /> Open Hardware Sim
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenCardMenuId(null);
                            setSelectedLessonPlanDeck(deck);
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
                          <BookOpen size={13} color="#F5B800" /> View Lesson Plan
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
                          <Unlock size={13} /> Unlock for Students
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
                          <Radio size={13} /> Mark Live in Lab
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
                          <Lock size={13} /> Lock for Students
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
      )}

      {/* VIEW 3: STUDENT EXIT CHECK SUBMISSIONS */}
      {viewMode === "submissions" && (
        <div className={styles.submissionsCard}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                Student Exit Check Reflections &amp; Rubric Alignment
              </h2>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: "0.2rem" }}>
                Formative assessment responses submitted by students inside their interactive workbench.
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowLogSubmissionModal(true)}
                style={{
                  background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  boxShadow: "0 2px 8px rgba(2, 132, 199, 0.3)",
                }}
              >
                <Plus size={14} /> Submit Student Reflection
              </button>
              <div style={{ fontSize: "0.82rem", color: "#F5B800", fontWeight: 700 }}>
                {submissions.length} Total Student Reflections
              </div>
            </div>
          </div>

          {loadingSubs ? (
            <p style={{ color: "#94A3B8", padding: "1.5rem 0" }}>Loading reflections from lab database...</p>
          ) : submissions.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={36} color="#94A3B8" style={{ marginBottom: "0.75rem" }} />
              <p style={{ color: "#FFFFFF", fontWeight: 700, margin: "0 0 0.35rem 0" }}>
                No exit check submissions recorded yet.
              </p>
              <p style={{ color: "#94A3B8", margin: 0, fontSize: "0.82rem" }}>
                Students complete the 4-question Exit Check inside their lesson workbench or Hardware Lab drawer.
              </p>
            </div>
          ) : (
            <table className={styles.subTable}>
              <thead>
                <tr>
                  <th>Student Enrolled</th>
                  <th>Class Module</th>
                  <th>Reflection Responses</th>
                  <th>Submitted At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 800, color: "#FFFFFF" }}>
                      {sub.userEmail || sub.userId || "Student Member"}
                    </td>
                    <td>
                      <span className={styles.classCodeTag}>
                        {sub.classCode || sub.classId || "ROBO 01"}
                      </span>
                    </td>
                    <td>
                      {sub.answers && typeof sub.answers === "object" ? (
                        <div style={{ maxWidth: "480px" }}>
                          {Object.entries(sub.answers).slice(0, 2).map(([k, v]) => (
                            <div
                              key={k}
                              style={{
                                fontSize: "0.78rem",
                                color: "#CBD5E1",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <strong style={{ color: "#F5B800" }}>Q{k}:</strong> {String(v)}
                            </div>
                          ))}
                          {Object.keys(sub.answers).length > 2 && (
                            <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                              +{Object.keys(sub.answers).length - 2} more answers...
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#64748B" }}>Completed</span>
                      )}
                    </td>
                    <td style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleString()
                        : "Recent"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        style={{
                          padding: "0.35rem 0.7rem",
                          borderRadius: "6px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#38BDF8",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Inspect Full
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* STUDENT SUBMISSION INSPECTOR MODAL */}
      {selectedSubmission && (
        <div
          onClick={() => setSelectedSubmission(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 14, 23, 0.88)",
            backdropFilter: "blur(12px)",
            zIndex: 99995,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "680px",
              background: "#1E2533",
              border: "1px solid #2E374B",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                borderBottom: "1px solid #2E374B",
                paddingBottom: "0.75rem",
              }}
            >
              <div>
                <span
                  style={{
                    padding: "0.2rem 0.55rem",
                    borderRadius: "6px",
                    background: "rgba(245, 184, 0, 0.15)",
                    color: "#F5B800",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                  }}
                >
                  {selectedSubmission.classCode || "ROBOBEE WORKSHOP"}
                </span>
                <h3 style={{ margin: "0.3rem 0 0 0", fontSize: "1.15rem", fontWeight: 800 }}>
                  Exit Reflection: {selectedSubmission.userEmail || selectedSubmission.userId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
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

            <div style={{ display: "grid", gap: "0.85rem", maxHeight: "420px", overflowY: "auto" }}>
              {selectedSubmission.answers && typeof selectedSubmission.answers === "object" ? (
                Object.entries(selectedSubmission.answers).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      background: "#161B26",
                      border: "1px solid #2E374B",
                      borderRadius: "10px",
                      padding: "0.85rem 1rem",
                    }}
                  >
                    <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#F5B800" }}>
                      QUESTION {key}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#FFFFFF", marginTop: "0.25rem", lineHeight: 1.45 }}>
                      {String(val)}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#94A3B8" }}>No answer details recorded.</p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
                borderTop: "1px solid #2E374B",
                paddingTop: "0.75rem",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  background: "#161B26",
                  border: "1px solid #2E374B",
                  color: "#E2E8F0",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL STUDENT EXIT REFLECTION SUBMISSION MODAL */}
      {showLogSubmissionModal && (
        <div
          onClick={() => setShowLogSubmissionModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 14, 23, 0.88)",
            backdropFilter: "blur(12px)",
            zIndex: 99996,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#1E2533",
              border: "1px solid #2E374B",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75)",
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                borderBottom: "1px solid #2E374B",
                paddingBottom: "0.75rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Sparkles size={18} color="#F5B800" />
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                    Submit Student Exit Check
                  </h3>
                </div>
                <div style={{ fontSize: "0.76rem", color: "#94A3B8", marginTop: "0.2rem" }}>
                  Formative rubric assessment &amp; 100 RoboXP achievement recording.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogSubmissionModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoggingSub(true);
                try {
                  const matchedDeck =
                    decks.find((d) => d.classCode === logSubClassCode) || decks[0];
                  await handleSubmitExitTicket({
                    classCode: logSubClassCode,
                    lessonId: matchedDeck ? matchedDeck.id : "beg-01",
                    userId: logSubStudentName.trim() || "Student Member",
                    userEmail: logSubStudentEmail.trim() || "student@robobee.academy",
                    answers: {
                      1:
                        logSubQ1.trim() ||
                        "Wired hardware circuit with proper pin assignments and polarity.",
                      2:
                        logSubQ2.trim() ||
                        "Checked breadboard rails and debugged loose jumper connection.",
                      3:
                        logSubQ3.trim() ||
                        "Applies foundational circuit concepts to next class in pathway.",
                      4:
                        logSubQ4.trim() ||
                        "5/5 - Fully confident assembling hands-on robotics hardware.",
                    },
                  });
                  setLogSubStudentName("");
                  setLogSubStudentEmail("");
                  setLogSubQ1("");
                  setLogSubQ2("");
                  setLogSubQ3("");
                  setLogSubQ4("");
                  setShowLogSubmissionModal(false);
                } catch (err) {
                  console.error("Failed to log exit reflection:", err);
                } finally {
                  setLoggingSub(false);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.35rem" }}>
                  Class Module / Deck
                </label>
                <select
                  value={logSubClassCode}
                  onChange={(e) => setLogSubClassCode(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                    fontSize: "0.84rem",
                  }}
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.classCode}>
                      {d.classCode} — {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.35rem" }}>
                    Student Name / Call-Sign
                  </label>
                  <input
                    type="text"
                    required
                    value={logSubStudentName}
                    onChange={(e) => setLogSubStudentName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      background: "#161B26",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                      fontSize: "0.84rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.35rem" }}>
                    Student Email / ID
                  </label>
                  <input
                    type="email"
                    value={logSubStudentEmail}
                    onChange={(e) => setLogSubStudentEmail(e.target.value)}
                    placeholder="e.g. aarav.s@kidsden.edu"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      background: "#161B26",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                      fontSize: "0.84rem",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#F5B800", marginBottom: "0.25rem" }}>
                  Question 1: Hardware Component &amp; Circuit Function
                </label>
                <input
                  type="text"
                  value={logSubQ1}
                  onChange={(e) => setLogSubQ1(e.target.value)}
                  placeholder="e.g. Wired LED cathode to GND and anode through 220Ω resistor to digital pin 9."
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                    fontSize: "0.82rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#F5B800", marginBottom: "0.25rem" }}>
                  Question 2: Bench Debugging / Troubleshooting Step Solved
                </label>
                <input
                  type="text"
                  value={logSubQ2}
                  onChange={(e) => setLogSubQ2(e.target.value)}
                  placeholder="e.g. LED did not light up; rotated diode 180° to fix backwards polarity."
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                    fontSize: "0.82rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#F5B800", marginBottom: "0.25rem" }}>
                  Question 3: Connection to the Next Progressive Class
                </label>
                <input
                  type="text"
                  value={logSubQ3}
                  onChange={(e) => setLogSubQ3(e.target.value)}
                  placeholder="e.g. Digital output learned today will be used to switch relays in the next class."
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                    fontSize: "0.82rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#F5B800", marginBottom: "0.25rem" }}>
                  Question 4: Student Confidence &amp; Self-Rating
                </label>
                <input
                  type="text"
                  value={logSubQ4}
                  onChange={(e) => setLogSubQ4(e.target.value)}
                  placeholder="e.g. 5/5 — Successfully completed lab circuit independently."
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                    fontSize: "0.82rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                  borderTop: "1px solid #2E374B",
                  paddingTop: "0.85rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowLogSubmissionModal(false)}
                  style={{
                    padding: "0.55rem 1.1rem",
                    borderRadius: "8px",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    color: "#94A3B8",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loggingSub}
                  style={{
                    padding: "0.55rem 1.3rem",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #F5B800 0%, #D97706 100%)",
                    border: "none",
                    color: "#090D16",
                    fontSize: "0.86rem",
                    fontWeight: 900,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                  }}
                >
                  <Sparkles size={15} />
                  {loggingSub ? "Submitting..." : "Submit Exit Check (+100 RoboXP)"}
                </button>
              </div>
            </form>
          </div>
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

      {/* RAPID ATTENDANCE MANAGER MODAL */}
      <AttendanceQuickModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        decks={decks}
      />

      {/* FIELD GUIDE BENCH REFERENCE MODAL */}
      <FieldGuideModal
        isOpen={showFieldGuideModal}
        onClose={() => setShowFieldGuideModal(false)}
      />

      {/* 120-MINUTE LESSON PLAN & WORKBENCH MODAL */}
      {selectedLessonPlanDeck && (
        <LessonPlanModal
          isOpen={!!selectedLessonPlanDeck}
          deck={selectedLessonPlanDeck}
          lesson={resolveLessonForDeck(selectedLessonPlanDeck)}
          onClose={() => setSelectedLessonPlanDeck(null)}
          onLaunchProjector={() => {
            const d = selectedLessonPlanDeck;
            setSelectedLessonPlanDeck(null);
            setProjectorInitialSlide(0);
            setProjectorDeck(normalizeDeckToFreeform(d));
          }}
          onLaunchStudio={() => {
            const d = selectedLessonPlanDeck;
            setSelectedLessonPlanDeck(null);
            setStudioDeck(normalizeDeckToFreeform(d));
          }}
          onLaunchHardwareSim={() => {
            const d = selectedLessonPlanDeck;
            setSelectedLessonPlanDeck(null);
            setHardwareLabDeck(d);
          }}
        />
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
            setStudioDeck(normalizeDeckToFreeform(deckToEdit));
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

      {/* CLEAN HARDWARE LAB & CIRCUIT SIMULATOR DRAWER */}
      {hardwareLabDeck && (
        <HardwareLabDrawer
          deck={hardwareLabDeck}
          lesson={resolveLessonForDeck(hardwareLabDeck)}
          onClose={() => setHardwareLabDeck(null)}
          onLaunchProjector={() => {
            const d = hardwareLabDeck;
            setHardwareLabDeck(null);
            setProjectorInitialSlide(0);
            setProjectorDeck(normalizeDeckToFreeform(d));
          }}
          onSubmitExitTicket={async (answers, meta) => {
            await handleSubmitExitTicket({
              classCode: hardwareLabDeck.classCode,
              lessonId: hardwareLabDeck.id,
              userId: meta?.studentName || user?.displayName || "Student Member",
              userEmail: meta?.studentEmail || user?.email || "student@robobee.academy",
              answers,
            });
          }}
        />
      )}
    </div>
  );
}
