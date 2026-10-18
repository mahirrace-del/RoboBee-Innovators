"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./curriculum.module.css";
import {
  ALL_ROBOTICS_LESSONS,
  RoboticsLesson,
  ClassStatus,
} from "@/lib/curriculumData";
import {
  ScheduledClassSession,
  calculateScheduleProgression,
} from "@/lib/scheduleAttendance";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import {
  THEME_PALETTE_CONFIG,
  PresentationMediaFrame,
} from "@/components/curriculum/Class1WorkshopDeck";
import {
  EditableClassDeck,
  ClassTrackCategory,
  loadDecksFromStorage,
  syncDecksFromFirestore,
} from "@/lib/slideStudioStore";
import { HardwareLabDrawer } from "@/components/curriculum/HardwareLabDrawer";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Award,
  Lock,
  CheckCircle,
  Clock,
  Eye,
  BookOpen,
  Tv,
  Radio,
  Sparkles,
  Calendar,
  Play,
  Compass,
  Cpu,
  Search,
  Filter,
} from "lucide-react";

export default function MemberCurriculumPage() {
  const { user, userData } = useAuth();

  // Multi-Class Deck Store (Class 01, Class 02, Class 03, Class 04 + Custom Decks)
  const [decks, setDecks] = useState<EditableClassDeck[]>([]);
  const [selectedPreviewDeckId, setSelectedPreviewDeckId] =
    useState<string>("beg-01");

  // Search & Track Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [trackFilter, setTrackFilter] = useState<"ALL" | ClassTrackCategory>(
    "ALL"
  );

  // Class status tracking
  const [classStatuses, setClassStatuses] = useState<{
    [id: string]: ClassStatus;
  }>({
    "beg-01": "published",
    "beg-02": "published",
    "beg-03": "published",
    "beg-04": "published",
  });

  // Completed classes tracking
  const [completedClasses, setCompletedClasses] = useState<{
    [classId: string]: boolean;
  }>({});
  const [userXp, setUserXp] = useState<number>(userData?.xp || 200);

  // Active Projector & Hardware Lab Drawer states
  const [projectorDeck, setProjectorDeck] = useState<EditableClassDeck | null>(
    null
  );
  const [projectorInitialSlide, setProjectorInitialSlide] = useState<number>(0);
  const [hardwareLabDeck, setHardwareLabDeck] =
    useState<EditableClassDeck | null>(null);

  // Load decks from LocalStorage & sync from Firestore
  useEffect(() => {
    const initial = loadDecksFromStorage();
    setDecks(initial);
    syncDecksFromFirestore().then((synced) => {
      setDecks(synced);
    });
  }, []);

  // Listen to Firestore class status updates
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

  // Listen to user's completed quizzes in Firestore
  useEffect(() => {
    if (!user) return;
    try {
      const unsub = onSnapshot(
        collection(db, "curriculum_submissions"),
        (snapshot) => {
          const completed: { [classId: string]: boolean } = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.userId === user.uid && data.classId) {
              completed[data.classId] = true;
            }
          });
          setCompletedClasses(completed);
        }
      );
      return () => unsub();
    } catch {}
  }, [user]);

  // Listen to scheduled sessions to sync with Class Schedule & Attendance
  const [scheduledSessions, setScheduledSessions] = useState<
    ScheduledClassSession[]
  >([]);
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "sessions"), (snapshot) => {
        const list: ScheduledClassSession[] = snapshot.docs.map(
          (d) =>
            ({
              id: d.id,
              ...d.data(),
            } as ScheduledClassSession)
        );
        setScheduledSessions(list);
      });
      return () => unsub();
    } catch {}
  }, []);

  const progression = useMemo(
    () => calculateScheduleProgression(scheduledSessions),
    [scheduledSessions]
  );

  const resolveLessonForDeck = (deck: EditableClassDeck): RoboticsLesson => {
    return (
      ALL_ROBOTICS_LESSONS.find((l) => l.id === deck.id) ||
      ALL_ROBOTICS_LESSONS[0]
    );
  };

  const completedCount = Object.keys(completedClasses).length;
  const totalSlidesAcrossAllClasses = decks.reduce(
    (acc, d) => acc + d.slides.length,
    0
  );

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

  return (
    <div className={styles.pageContainer}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className={styles.heroTopRow}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>RoboBEE Innovators Academy</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard/curriculum/reference"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "#6B0F24",
                border: "1px solid #F5B800",
                color: "#ffffff",
                padding: "0.4rem 0.95rem",
                borderRadius: "30px",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 6px rgba(107, 15, 36, 0.4)",
              }}
            >
              <BookOpen size={16} color="#F5B800" />
              <span>Arduino &amp; Robotics Field Guide ➔</span>
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                background: "rgba(255, 255, 255, 0.05)",
                padding: "0.4rem 1rem",
                borderRadius: "30px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Award size={18} color="#F5B800" />
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: "#F5B800",
                }}
              >
                {userXp} RoboXP
              </span>
            </div>
          </div>
        </div>

        <h1 className={styles.heroTitle}>
          Interactive Curriculum Hub &amp; Hardware Simulator Lab
        </h1>
        <p className={styles.heroSubtitle}>
          <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em>
          <br />
          Explore all interactive workshop decks — including{" "}
          <strong>
            Class 01: Introduction to Robotics &amp; Future Engineering
          </strong>{" "}
          and{" "}
          <strong>
            Class 02: Basic Electronics, Breadboards, LEDs &amp; Ohm&apos;s Law
          </strong>{" "}
          — complete with live Keynote slides, Virtual Breadboard &amp; Ohm&apos;s
          Law simulators, C++ code labs, and exit checks!
        </p>

        <div className={styles.heroStats}>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue}>{decks.length} Classes</span>
            <span className={styles.heroStatLabel}>Curriculum Library</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: "#38bdf8" }}>
              {totalSlidesAcrossAllClasses} Slides
            </span>
            <span className={styles.heroStatLabel}>
              Interactive Presentations
            </span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: "#10b981" }}>
              {completedCount}
            </span>
            <span className={styles.heroStatLabel}>Completed Badges</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: "#F5B800" }}>
              4 Palettes
            </span>
            <span className={styles.heroStatLabel}>Dynamic Keynote Themes</span>
          </div>
        </div>
      </div>

      {/* Schedule Progression Live Banner */}
      {(progression.activeSession || progression.nextSession) && (
        <div
          style={{
            background: progression.activeSession
              ? "linear-gradient(135deg, rgba(107, 15, 36, 0.55), rgba(22, 27, 38, 0.95))"
              : "rgba(22, 27, 38, 0.85)",
            border: "1px solid",
            borderColor: progression.activeSession
              ? "#F5B800"
              : "rgba(255, 255, 255, 0.1)",
            borderRadius: "14px",
            padding: "1.15rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.35rem",
              }}
            >
              {progression.activeSession ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: "rgba(239, 68, 68, 0.2)",
                    color: "#ef4444",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  <Radio size={12} /> Class Currently in Session
                </span>
              ) : (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: "rgba(245, 184, 0, 0.15)",
                    color: "#F5B800",
                    border: "1px solid rgba(245, 184, 0, 0.3)",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  <Calendar size={12} /> Next Scheduled Class
                </span>
              )}
              <span style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                📅 {(progression.activeSession || progression.nextSession)?.date}{" "}
                &bull;{" "}
                {(progression.activeSession || progression.nextSession)?.time ||
                  "15:30"}
              </span>
            </div>
            <div
              style={{ fontWeight: 800, fontSize: "1.15rem", color: "#ffffff" }}
            >
              {
                (progression.activeSession || progression.nextSession)
                  ?.lessonCode
              }
              : {(progression.activeSession || progression.nextSession)?.title}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#94a3b8",
                marginTop: "0.2rem",
              }}
            >
              📍{" "}
              {(progression.activeSession || progression.nextSession)
                ?.location || "RoboBEE Lab"}
            </div>
          </div>

          <Link
            href="/dashboard/attendance"
            style={{
              background: "#F5B800",
              color: "#161B26",
              padding: "0.65rem 1.25rem",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              textDecoration: "none",
            }}
          >
            {progression.activeSession
              ? "Check In to Active Class ➔"
              : "View Schedule & Attendance ➔"}
          </Link>
        </div>
      )}

      {/* Search & Track Filter Bar */}
      <div
        style={{
          background: "#0B1120",
          border: "1px solid #1E293B",
          borderRadius: "18px",
          padding: "1rem 1.25rem",
          marginBottom: "1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div
          style={{
            position: "relative",
            minWidth: "240px",
            flex: "1 1 280px",
            maxWidth: "380px",
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
              fontSize: "0.85rem",
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

      {/* MULTI-CLASS LIBRARY GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "1.4rem",
          marginBottom: "2.25rem",
        }}
      >
        {filteredDecks.map((deck) => {
          const status = classStatuses[deck.id] || deck.status || "published";
          const isLocked = status === "locked";
          const isCompleted = !!completedClasses[deck.id];
          const isSelectedForPreview = activePreviewDeck?.id === deck.id;

          return (
            <div
              key={deck.id}
              style={{
                background:
                  "linear-gradient(160deg, #111827 0%, #0F172A 55%, #1E1B4B 100%)",
                border: `2px solid ${
                  isSelectedForPreview
                    ? "#00F5D4"
                    : "rgba(56, 189, 248, 0.28)"
                }`,
                borderRadius: "22px",
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
                opacity: isLocked ? 0.65 : 1,
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
                {/* Badges Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.45rem",
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
                        padding: "0.25rem 0.65rem",
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

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
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
                    {isCompleted && (
                      <span
                        style={{
                          padding: "0.25rem 0.65rem",
                          borderRadius: "999px",
                          background: "rgba(16, 185, 129, 0.2)",
                          border: "1px solid #10B981",
                          color: "#34D399",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <CheckCircle size={12} /> Done
                      </span>
                    )}
                  </div>
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

                {/* Meta Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.76rem",
                    color: "#94A3B8",
                    paddingTop: "0.25rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Clock size={13} color="#00F5D4" /> {deck.durationMinutes}{" "}
                    Mins
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: "#FBBF24",
                      fontWeight: 800,
                    }}
                  >
                    <Award size={13} /> +{deck.xpReward || 100} RoboXP
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                }}
              >
                {isLocked ? (
                  <button
                    type="button"
                    disabled
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#64748B",
                      fontWeight: 800,
                      cursor: "not-allowed",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Lock size={15} /> Locked by Instructor
                  </button>
                ) : (
                  <>
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
                      <Tv size={16} /> Launch Live Projector (
                      {deck.slides.length} Slides)
                    </button>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setHardwareLabDeck(deck)}
                        style={{
                          padding: "0.65rem 0.75rem",
                          borderRadius: "10px",
                          border: "1px solid #10B981",
                          background: "rgba(16, 185, 129, 0.15)",
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
                        <Cpu size={14} /> Open Hardware Lab
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPreviewDeckId(deck.id)}
                        style={{
                          padding: "0.65rem 0.75rem",
                          borderRadius: "10px",
                          border: "1px solid rgba(56, 189, 248, 0.4)",
                          background: isSelectedForPreview
                            ? "rgba(56, 189, 248, 0.22)"
                            : "rgba(255,255,255,0.05)",
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
                        <Eye size={14} /> Browse {deck.slides.length} Slides
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE SLIDE DECK PREVIEW FOR THE SELECTED CLASS */}
      {activePreviewDeck && (
        <section style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.15rem",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Compass size={20} color="#00F5D4" />
                {activePreviewDeck.classCode}: {activePreviewDeck.title} (
                {activePreviewDeck.slides.length} Interactive Slides)
              </h3>
              <p
                style={{
                  margin: "0.25rem 0 0 0",
                  fontSize: "0.86rem",
                  color: "#94A3B8",
                }}
              >
                Click any slide below to launch the full-screen interactive
                presentation directly at that topic, or open the{" "}
                <strong>Hardware Lab &amp; Simulator</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setHardwareLabDeck(activePreviewDeck)}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "10px",
                border: "1px solid #10B981",
                background: "rgba(16, 185, 129, 0.16)",
                color: "#34D399",
                fontWeight: 800,
                fontSize: "0.84rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Cpu size={15} /> Open {activePreviewDeck.classCode} Hardware Lab
              &amp; Simulator
            </button>
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
                        fallbackVariant={s.fallbackVariant || "arduino"}
                        accentColor={palette.accentPrimary}
                        height="160px"
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
      )}

      {/* CLEAN NON-OVERLAPPING HARDWARE LAB & CIRCUIT SIMULATOR DRAWER */}
      {hardwareLabDeck && (
        <HardwareLabDrawer
          deck={hardwareLabDeck}
          lesson={resolveLessonForDeck(hardwareLabDeck)}
          onClose={() => setHardwareLabDeck(null)}
        />
      )}

      {/* FULL-SCREEN PROJECTOR PRESENTATION VIEW */}
      {projectorDeck && (
        <ProjectorView
          lesson={resolveLessonForDeck(projectorDeck)}
          customDeck={projectorDeck}
          initialSlide={projectorInitialSlide}
          onClose={() => setProjectorDeck(null)}
        />
      )}
    </div>
  );
}
