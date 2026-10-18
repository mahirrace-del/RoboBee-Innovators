"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./adminCurriculum.module.css";
import {
  ALL_ROBOTICS_LESSONS,
  RoboticsLesson,
  ClassStatus,
} from "@/lib/curriculumData";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import {
  THEME_PALETTE_CONFIG,
  PresentationMediaFrame,
} from "@/components/curriculum/Class1WorkshopDeck";
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
  Eye,
  Clock,
  Radio,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  Sparkles,
  Play,
  Cpu,
  Compass,
  Edit3,
  Copy,
  Download,
  Upload,
  Search,
  Filter,
  FolderPlus,
  X,
} from "lucide-react";

export default function AdminCurriculumPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"library" | "submissions">(
    "library"
  );

  // Multi-Class Deck Store (Class 01, Class 02, Class 03, Class 04 + Custom Decks)
  const [decks, setDecks] = useState<EditableClassDeck[]>([]);
  const [selectedPreviewDeckId, setSelectedPreviewDeckId] =
    useState<string>("beg-01");

  // Search & Track Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [trackFilter, setTrackFilter] = useState<"ALL" | ClassTrackCategory>(
    "ALL"
  );

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
  const [newClassCode, setNewClassCode] = useState<string>("CLASS 05");
  const [newClassTitle, setNewClassTitle] = useState<string>("");
  const [newClassSubtitle, setNewClassSubtitle] = useState<string>("");
  const [newClassTrack, setNewClassTrack] =
    useState<ClassTrackCategory>("Foundation Track");
  const [newClassCover, setNewClassCover] = useState<string>(
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
  );

  const jsonImportRef = useRef<HTMLInputElement | null>(null);

  // Class statuses & student submissions
  const [classStatuses, setClassStatuses] = useState<{
    [id: string]: ClassStatus;
  }>({
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
        ...createBlankSlide(0),
        numberLabel: "01",
        theme: "electric-indigo" as const,
        layout: "hero-title" as const,
        badge: `${newClassCode.toUpperCase()} • LIVE WORKSHOP`,
        title: newClassTitle.trim(),
        subtitle:
          newClassSubtitle.trim() ||
          "Interactive hands-on engineering workshop — customize slides in Slide Studio.",
        heroImage: newClassCover.trim(),
        imageCaption: `${newClassCode}: ${newClassTitle.trim()}`,
      },
      {
        ...createBlankSlide(1),
        numberLabel: "02",
        theme: "daylight-studio" as const,
        layout: "interactive-grid" as const,
        badge: "CORE CONCEPTS",
        title: "Key Engineering Concepts & Theory",
        subtitle: "Add custom cards, photos, or flip-cards in the Slide Studio editor.",
      },
      {
        ...createBlankSlide(2),
        numberLabel: "03",
        theme: "arduino-teal" as const,
        layout: "interactive-hotspot" as const,
        badge: "HARDWARE ANATOMY",
        title: "Interactive Hardware & Wiring Map",
        subtitle: "Click pins on the diagram to inspect connections.",
      },
    ];

    const createdDeck: EditableClassDeck = {
      id: newId,
      classCode: newClassCode.trim().toUpperCase(),
      title: newClassTitle.trim(),
      subtitle:
        newClassSubtitle.trim() ||
        "Custom RoboBEE Innovators interactive presentation deck.",
      track: newClassTrack,
      durationMinutes: 90,
      xpReward: 100,
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
    setNewClassCode(`CLASS 0${updated.length + 1}`);
    // Immediately open in Slide Studio so the Admin can customize!
    setStudioDeck(createdDeck);
  };

  // Duplicate Class Deck
  const handleDuplicateDeck = async (deck: EditableClassDeck) => {
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

  // Delete Custom Class Deck
  const handleDeleteDeck = async (deck: EditableClassDeck) => {
    if (
      !confirm(
        `Delete "${deck.classCode}: ${deck.title}"? (Built-in classes will reset to default if deleted.)`
      )
    )
      return;
    const updated = await deleteDeckFromStorageAndCloud(deck.id);
    setDecks(updated);
  };

  // Export Single Deck or All Decks as JSON
  const handleExportDecks = (targetDeck?: EditableClassDeck) => {
    const payload = targetDeck ? [targetDeck] : decks;
    const filename = targetDeck
      ? `RoboBEE_${targetDeck.classCode.replace(/\s+/g, "_")}_Deck.json`
      : `RoboBEE_All_Class_Decks_${new Date().toISOString().slice(0, 10)}.json`;
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
      } catch (err) {
        alert("Invalid JSON deck file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Filtered Decks
  const filteredDecks = decks.filter((d) => {
    const matchesTrack = trackFilter === "ALL" || d.track === trackFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      d.classCode.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.subtitle.toLowerCase().includes(q) ||
      d.track.toLowerCase().includes(q);
    return matchesTrack && matchesSearch;
  });

  const activePreviewDeck =
    decks.find((d) => d.id === selectedPreviewDeckId) || decks[0];

  const totalSlidesAcrossAllClasses = decks.reduce(
    (acc, d) => acc + d.slides.length,
    0
  );

  return (
    <div className={styles.pageContainer}>
      {/* Hidden JSON File Input */}
      <input
        ref={jsonImportRef}
        type="file"
        accept="application/json"
        onChange={handleImportJson}
        style={{ display: "none" }}
      />

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <Radio size={28} color="#F5B800" />
            Classroom Studio • Multi-Class Library &amp; PowerPoint Slide Editor
          </h1>
          <p>
            Select any class below to <strong>Launch Live Projector</strong>,{" "}
            <strong>Edit in Slide Studio</strong> (add/remove slides, upload
            multiple photos, drag hotspot pins, customize fonts &amp; palettes),
            or open the <strong>Virtual Breadboard &amp; Ohm&apos;s Law Lab</strong>.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.65rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/dashboard/admin/attendance"
            className={styles.statusBtn}
            style={{
              padding: "0.6rem 0.95rem",
              fontSize: "0.82rem",
              background: "#111827",
              color: "#10b981",
              borderColor: "#10b981",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Calendar size={14} style={{ marginRight: "6px" }} />
            Schedule &amp; Attendance
          </Link>
          <Link
            href="/dashboard/curriculum/reference"
            className={styles.statusBtn}
            style={{
              padding: "0.6rem 0.95rem",
              fontSize: "0.82rem",
              background: "#111827",
              color: "#F5B800",
              borderColor: "#F5B800",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <BookOpen size={14} style={{ marginRight: "6px" }} />
            Field Guide
          </Link>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: "0.65rem 1.15rem",
              fontSize: "0.86rem",
              fontWeight: 900,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00F5D4, #38BDF8)",
              color: "#090D16",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              boxShadow: "0 8px 25px rgba(0, 245, 212, 0.3)",
            }}
          >
            <Plus size={16} />+ Create New Class Presentation
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Curriculum Library</span>
          <span className={styles.statValue}>{decks.length} Classes</span>
          <span className={styles.statSub}>
            Class 01, Class 02, Class 03, Class 04 + Custom
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Interactive Slides</span>
          <span className={styles.statValue} style={{ color: "#38bdf8" }}>
            {totalSlidesAcrossAllClasses} Slides
          </span>
          <span className={styles.statSub}>
            Editable in In-Browser PowerPoint Studio
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Hardware &amp; Ohm&apos;s Law Lab</span>
          <span className={styles.statValue} style={{ color: "#10b981" }}>
            4-Tab Sim
          </span>
          <span className={styles.statSub}>
            Virtual Breadboard • Wiring • C++ • Exit Check
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Exit Check Submissions</span>
          <span className={styles.statValue} style={{ color: "#F5B800" }}>
            {submissions.length}
          </span>
          <span className={styles.statSub}>Student reflections logged</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabsBar}>
        <button
          onClick={() => setActiveTab("library")}
          className={`${styles.tabBtn} ${
            activeTab === "library" ? styles.tabBtnActive : ""
          }`}
        >
          Multi-Class Library Hub ({decks.length} Classes)
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`${styles.tabBtn} ${
            activeTab === "submissions" ? styles.tabBtnActive : ""
          }`}
        >
          Student Exit Check Submissions ({submissions.length})
        </button>
      </div>

      {/* TAB 1: MULTI-CLASS LIBRARY HUB */}
      {activeTab === "library" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Top Action Bar: Search, Track Filter Pills & JSON Import/Export */}
          <div
            style={{
              background: "#0B1120",
              border: "1px solid #1E293B",
              borderRadius: "18px",
              padding: "1rem 1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {/* Search & Track Filters */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                flexWrap: "wrap",
                flex: 1,
              }}
            >
              <div
                style={{
                  position: "relative",
                  minWidth: "240px",
                  flex: "1 1 260px",
                  maxWidth: "360px",
                }}
              >
                <Search
                  size={15}
                  color="#64748B"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Class 01, Class 02, Breadboard, Ohm's Law..."
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem 0.55rem 2.2rem",
                    borderRadius: "10px",
                    background: "#0F172A",
                    border: "1px solid #334155",
                    color: "#F8FAFC",
                    fontSize: "0.84rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                }}
              >
                <Filter size={14} color="#38BDF8" />
                {(
                  [
                    "ALL",
                    "Foundation Track",
                    "Hardware & Sensors",
                    "Combat & Autonomous Bots",
                  ] as const
                ).map((track) => {
                  const active = trackFilter === track;
                  return (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setTrackFilter(track)}
                      style={{
                        padding: "0.42rem 0.85rem",
                        borderRadius: "999px",
                        border: `1px solid ${
                          active ? "#00F5D4" : "rgba(255,255,255,0.12)"
                        }`,
                        background: active
                          ? "rgba(0, 245, 212, 0.16)"
                          : "rgba(255,255,255,0.04)",
                        color: active ? "#00F5D4" : "#94A3B8",
                        fontSize: "0.76rem",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {track === "ALL" ? "All Tracks" : track}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Backup & Restore JSON Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => handleExportDecks()}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  background: "rgba(56, 189, 248, 0.1)",
                  color: "#38BDF8",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Download size={14} /> Export All JSON
              </button>
              <button
                type="button"
                onClick={() => jsonImportRef.current?.click()}
                style={{
                  padding: "0.5rem 0.9rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(251, 191, 36, 0.35)",
                  background: "rgba(251, 191, 36, 0.1)",
                  color: "#FBBF24",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Upload size={14} /> Import JSON
              </button>
            </div>
          </div>

          {/* Responsive 3-Column Class Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "1.35rem",
            }}
          >
            {filteredDecks.map((deck) => {
              const status = classStatuses[deck.id] || deck.status || "published";
              const isSelectedForPreview = activePreviewDeck?.id === deck.id;
              return (
                <div
                  key={deck.id}
                  style={{
                    background:
                      "linear-gradient(160deg, #111827 0%, #0F172A 60%, #1E1B4B 100%)",
                    border: `2px solid ${
                      isSelectedForPreview
                        ? "#00F5D4"
                        : "rgba(56, 189, 248, 0.25)"
                    }`,
                    borderRadius: "22px",
                    padding: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                    boxShadow: isSelectedForPreview
                      ? "0 20px 45px rgba(0, 245, 212, 0.18)"
                      : "0 16px 35px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                    }}
                  >
                    {/* Top Badges Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            padding: "0.28rem 0.75rem",
                            borderRadius: "999px",
                            background: "rgba(0, 245, 212, 0.16)",
                            border: "1px solid #00F5D4",
                            color: "#00F5D4",
                            fontSize: "0.74rem",
                            fontWeight: 900,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {deck.classCode}
                        </span>
                        <span
                          style={{
                            padding: "0.26rem 0.65rem",
                            borderRadius: "999px",
                            background: "rgba(56, 189, 248, 0.14)",
                            border: "1px solid rgba(56, 189, 248, 0.4)",
                            color: "#38BDF8",
                            fontSize: "0.7rem",
                            fontWeight: 800,
                          }}
                        >
                          {deck.track}
                        </span>
                      </div>

                      <span
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "999px",
                          background: "rgba(251, 191, 36, 0.15)",
                          border: "1px solid #FBBF24",
                          color: "#FBBF24",
                          fontSize: "0.72rem",
                          fontWeight: 900,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Sparkles size={12} /> {deck.slides.length} Slides
                      </span>
                    </div>

                    {/* Cover Thumbnail */}
                    <PresentationMediaFrame
                      src={deck.coverImage}
                      alt={deck.title}
                      caption={`${deck.classCode} • ${deck.slides.length} Interactive Slides`}
                      fallbackVariant={
                        deck.id === "beg-02" ? "mcu" : "arduino"
                      }
                      accentColor="#00F5D4"
                      height="185px"
                    />

                    {/* Title & Subtitle */}
                    <div>
                      <h3
                        style={{
                          margin: "0 0 0.35rem 0",
                          fontSize: "1.2rem",
                          fontWeight: 900,
                          color: "#FFFFFF",
                          lineHeight: 1.25,
                        }}
                      >
                        {deck.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.84rem",
                          color: "#CBD5E1",
                          lineHeight: 1.5,
                        }}
                      >
                        {deck.subtitle}
                      </p>
                    </div>

                    {/* Metadata & Status Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        paddingTop: "0.3rem",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        fontSize: "0.75rem",
                        color: "#94A3B8",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Clock size={13} color="#00F5D4" /> {deck.durationMinutes}m
                        • Edited{" "}
                        {new Date(deck.lastEditedAt).toLocaleDateString()}
                      </span>

                      {/* Status Switcher */}
                      <div style={{ display: "inline-flex", gap: "0.25rem" }}>
                        <button
                          type="button"
                          onClick={() => updateStatus(deck.id, "published")}
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            border: "1px solid",
                            borderColor:
                              status === "published"
                                ? "#10B981"
                                : "rgba(255,255,255,0.12)",
                            background:
                              status === "published"
                                ? "rgba(16, 185, 129, 0.2)"
                                : "transparent",
                            color:
                              status === "published" ? "#10B981" : "#64748B",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                          title="Published to Students"
                        >
                          <Unlock size={11} /> Pub
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(deck.id, "live_in_class")}
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            border: "1px solid",
                            borderColor:
                              status === "live_in_class"
                                ? "#F5B800"
                                : "rgba(255,255,255,0.12)",
                            background:
                              status === "live_in_class"
                                ? "rgba(245, 184, 0, 0.2)"
                                : "transparent",
                            color:
                              status === "live_in_class" ? "#F5B800" : "#64748B",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                          title="Mark as Live in Lab"
                        >
                          <Radio size={11} /> Live
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(deck.id, "locked")}
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "6px",
                            border: "1px solid",
                            borderColor:
                              status === "locked"
                                ? "#F43F5E"
                                : "rgba(255,255,255,0.12)",
                            background:
                              status === "locked"
                                ? "rgba(244, 63, 94, 0.2)"
                                : "transparent",
                            color: status === "locked" ? "#F43F5E" : "#64748B",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                          title="Lock Class"
                        >
                          <Lock size={11} /> Lock
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3 Primary Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.55rem",
                    }}
                  >
                    {/* 1. Launch Live Projector */}
                    <button
                      type="button"
                      onClick={() => {
                        setProjectorInitialSlide(0);
                        setProjectorDeck(deck);
                      }}
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        border: "none",
                        background:
                          "linear-gradient(135deg, #00F5D4 0%, #38BDF8 100%)",
                        color: "#090D16",
                        fontWeight: 900,
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: "0 10px 25px rgba(0, 245, 212, 0.25)",
                      }}
                    >
                      <Tv size={16} /> 1. Launch Live Projector (
                      {deck.slides.length} Slides)
                    </button>

                    {/* 2. Edit in Slide Studio + 3. Hardware Lab & Kit Config */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setStudioDeck(deck)}
                        style={{
                          padding: "0.65rem 0.75rem",
                          borderRadius: "10px",
                          border: "1px solid #38BDF8",
                          background: "rgba(56, 189, 248, 0.14)",
                          color: "#38BDF8",
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <Edit3 size={14} /> Edit in Slide Studio
                      </button>

                      <button
                        type="button"
                        onClick={() => setHardwareLabDeck(deck)}
                        style={{
                          padding: "0.65rem 0.75rem",
                          borderRadius: "10px",
                          border: "1px solid #10B981",
                          background: "rgba(16, 185, 129, 0.14)",
                          color: "#34D399",
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <Cpu size={14} /> Hardware Lab Sim
                      </button>
                    </div>

                    {/* Utility Row: Preview Slides, Duplicate, Export JSON, Delete */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.35rem",
                        paddingTop: "0.2rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewDeckId(deck.id)}
                        style={{
                          flex: 1,
                          padding: "0.4rem 0.6rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: isSelectedForPreview
                            ? "rgba(0, 245, 212, 0.15)"
                            : "rgba(255,255,255,0.04)",
                          color: isSelectedForPreview ? "#00F5D4" : "#CBD5E1",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Eye size={12} /> Inspect {deck.slides.length} Slides Below
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateDeck(deck)}
                        title="Duplicate this Class Presentation"
                        style={{
                          padding: "0.4rem 0.55rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                          color: "#CBD5E1",
                          cursor: "pointer",
                        }}
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportDecks(deck)}
                        title="Export Class JSON"
                        style={{
                          padding: "0.4rem 0.55rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                          color: "#CBD5E1",
                          cursor: "pointer",
                        }}
                      >
                        <Download size={13} />
                      </button>

                      {deck.id.startsWith("custom-") ||
                      deck.id.includes("-copy-") ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteDeck(deck)}
                          title="Delete Custom Class"
                          style={{
                            padding: "0.4rem 0.55rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(244,63,94,0.3)",
                            background: "rgba(244,63,94,0.1)",
                            color: "#FDA4AF",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide-by-Slide Inspector Drawer for the Selected Class */}
          {activePreviewDeck && (
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
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Compass size={20} color="#00F5D4" />
                    {activePreviewDeck.classCode}: {activePreviewDeck.title} —
                    Slide-by-Slide Preview ({activePreviewDeck.slides.length}{" "}
                    Slides)
                  </h3>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      fontSize: "0.85rem",
                      color: "#94A3B8",
                    }}
                  >
                    Click any slide to present live at that exact slide, or click{" "}
                    <strong>Edit in Slide Studio</strong> to customize text,
                    images, hotspots, and animations.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button
                    type="button"
                    onClick={() => setStudioDeck(activePreviewDeck)}
                    style={{
                      padding: "0.55rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #38BDF8",
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38BDF8",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Edit3 size={14} /> Customize {activePreviewDeck.classCode}{" "}
                    in Slide Studio
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.1rem",
                }}
              >
                {activePreviewDeck.slides.map((s, idx) => {
                  const palette = THEME_PALETTE_CONFIG[s.theme];
                  return (
                    <div
                      key={s.id}
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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0.4rem",
                            marginBottom: "0.65rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 900,
                              padding: "0.2rem 0.55rem",
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
                            fallbackVariant={s.fallbackVariant || "arduino"}
                            accentColor={palette.accentPrimary}
                            height="155px"
                          />
                        </div>

                        <h4
                          style={{
                            margin: "0 0 0.35rem 0",
                            fontSize: "1rem",
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
                            fontSize: "0.78rem",
                            color: palette.bodyColor,
                            lineHeight: 1.45,
                          }}
                        >
                          {s.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setProjectorInitialSlide(idx);
                          setProjectorDeck(activePreviewDeck);
                        }}
                        style={{
                          width: "100%",
                          background: palette.isLight
                            ? "#0F172A"
                            : "rgba(255,255,255,0.14)",
                          color: "#FFFFFF",
                          border: `1px solid ${palette.accentPrimary}`,
                          borderRadius: "10px",
                          padding: "0.55rem 0.9rem",
                          fontSize: "0.8rem",
                          fontWeight: 900,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
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

      {/* TAB 2: STUDENT EXIT CHECK SUBMISSIONS */}
      {activeTab === "submissions" && (
        <div className={styles.submissionsCard}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#f1f5f9",
              marginBottom: "1rem",
            }}
          >
            Student Exit Check Reflections
          </h2>

          {loadingSubs ? (
            <p style={{ color: "#94a3b8" }}>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                No exit check submissions recorded yet. Have students complete
                the Exit Check inside the Hardware Lab Drawer during class!
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
                    <td style={{ fontWeight: 700, color: "#f8fafc" }}>
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
                            color: "#cbd5e1",
                            fontSize: "0.82rem",
                          }}
                        >
                          {Object.entries(sub.answers).map(([k, v]) => (
                            <li key={k}>{String(v)}</li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: "#64748b" }}>Completed</span>
                      )}
                    </td>
                    <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
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
            background: "rgba(7, 11, 20, 0.88)",
            backdropFilter: "blur(14px)",
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
              background: "#0F172A",
              border: "2px solid #00F5D4",
              borderRadius: "22px",
              padding: "1.75rem",
              maxWidth: "540px",
              width: "100%",
              color: "#F8FAFC",
              boxShadow: "0 25px 65px rgba(0,0,0,0.75)",
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FolderPlus size={20} color="#00F5D4" />
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900 }}>
                  Create New Class Presentation Deck
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
              style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.5fr",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#94A3B8",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Class Code Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                    placeholder="CLASS 05"
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "10px",
                      background: "#1E293B",
                      border: "1px solid #334155",
                      color: "#FFFFFF",
                      fontWeight: 800,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#94A3B8",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Curriculum Track
                  </label>
                  <select
                    value={newClassTrack}
                    onChange={(e) =>
                      setNewClassTrack(e.target.value as ClassTrackCategory)
                    }
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "10px",
                      background: "#1E293B",
                      border: "1px solid #334155",
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                  >
                    <option value="Foundation Track">Foundation Track</option>
                    <option value="Hardware & Sensors">
                      Hardware &amp; Sensors
                    </option>
                    <option value="Combat & Autonomous Bots">
                      Combat &amp; Autonomous Bots
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#94A3B8",
                    marginBottom: "0.3rem",
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
                    padding: "0.6rem 0.75rem",
                    borderRadius: "10px",
                    background: "#1E293B",
                    border: "1px solid #334155",
                    color: "#FFFFFF",
                    fontWeight: 700,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#94A3B8",
                    marginBottom: "0.3rem",
                  }}
                >
                  Subtitle / Workshop Promise
                </label>
                <textarea
                  rows={2}
                  value={newClassSubtitle}
                  onChange={(e) => setNewClassSubtitle(e.target.value)}
                  placeholder="What will students build, wire, and program in this session?"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "10px",
                    background: "#1E293B",
                    border: "1px solid #334155",
                    color: "#FFFFFF",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#94A3B8",
                    marginBottom: "0.3rem",
                  }}
                >
                  Cover Photo URL
                </label>
                <input
                  type="text"
                  value={newClassCover}
                  onChange={(e) => setNewClassCover(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "10px",
                    background: "#1E293B",
                    border: "1px solid #334155",
                    color: "#38BDF8",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.65rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: "0.6rem 1.1rem",
                    borderRadius: "10px",
                    border: "1px solid #334155",
                    background: "transparent",
                    color: "#CBD5E1",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #00F5D4, #38BDF8)",
                    color: "#090D16",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Create &amp; Open in Slide Studio ➔
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
