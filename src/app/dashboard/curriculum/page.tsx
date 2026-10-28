"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./curriculum.module.css";
import {
  ALL_ROBOTICS_LESSONS,
  COURSE_SPACES,
  CourseTier,
  RoboticsLesson,
  ClassStatus,
} from "@/lib/curriculumData";
import {
  ScheduledClassSession,
  calculateScheduleProgression,
} from "@/lib/scheduleAttendance";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import { PresentationMediaFrame } from "@/components/curriculum/Class1WorkshopDeck";
import {
  EditableClassDeck,
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
  BookOpen,
  Tv,
  Radio,
  Calendar,
  Play,
  Cpu,
  Search,
  Cloud,
  HardDrive,
  X,
  Wrench,
  Code2,
} from "lucide-react";

export default function MemberCurriculumPage() {
  const { user, userData } = useAuth();

  // All 36 Canonical Lessons + Any Custom Instructor Decks
  const [decks, setDecks] = useState<EditableClassDeck[]>([]);

  // Course Pathway Filter ('beginner' default so students immediately see Beginner 01–10, or switch across all 4 courses)
  const [courseFilter, setCourseFilter] = useState<"ALL" | CourseTier>("beginner");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Class status tracking
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

  // Completed classes tracking
  const [completedClasses, setCompletedClasses] = useState<{
    [classId: string]: boolean;
  }>({});
  const userXp = userData?.xp || 200;

  // Active Student Lesson Workbench Modal, Slide Deck, and Hardware Simulator Drawer
  const [activeLessonDeck, setActiveLessonDeck] =
    useState<EditableClassDeck | null>(null);
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

  const resolveDeckCourseId = (deck: EditableClassDeck): CourseTier => {
    if (deck.courseId) return deck.courseId;
    if (deck.id.startsWith("exp-")) return "explorer";
    if (deck.id.startsWith("int-")) return "intermediate";
    if (deck.id.startsWith("adv-")) return "advanced";
    return "beginner";
  };

  const completedCount = Object.keys(completedClasses).length;

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

  const activeLessonRecord = activeLessonDeck
    ? resolveLessonForDeck(activeLessonDeck)
    : null;

  return (
    <div
      className={styles.pageContainer}
      style={{
        background: "#161B26",
        color: "#FFFFFF",
        minHeight: "100vh",
        padding: "1.75rem",
      }}
    >
      {/* Editorial Engineering Student Header */}
      <div
        style={{
          background: "#1E2533",
          border: "1px solid #2E374B",
          borderRadius: "14px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span
              style={{
                padding: "0.25rem 0.7rem",
                borderRadius: "6px",
                background: "rgba(107, 15, 36, 0.45)",
                border: "1px solid #6B0F24",
                color: "#9c6f18",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ROBOBEE INNOVATORS ACADEMY • STUDENT PORTAL
            </span>

            {/* Honest Cloud vs Local State Persistence Badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "6px",
                background: "#161B26",
                border: "1px solid #2E374B",
                color: user ? "#10B981" : "#9c6f18",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              {user ? <Cloud size={13} /> : <HardDrive size={13} />}
              {user
                ? "Saved to Account (Cloud)"
                : "Saved Locally in Browser — Sign in to sync progress"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
            <Link
              href="/dashboard/curriculum/reference"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "#161B26",
                border: "1px solid #2E374B",
                color: "#E2E8F0",
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <BookOpen size={15} color="#9c6f18" />
              <span>Arduino &amp; Robotics Field Guide</span>
            </Link>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "#161B26",
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid #2E374B",
              }}
            >
              <Award size={16} color="#9c6f18" />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#9c6f18" }}>
                {userXp} RoboXP
              </span>
            </div>
          </div>
        </div>

        <h1 style={{ margin: "0 0 0.4rem 0", fontSize: "1.65rem", fontWeight: 800, color: "#FFFFFF" }}>
          Robotics &amp; Engineering Curriculum Hub
        </h1>
        <p style={{ margin: "0 0 1.15rem 0", color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.55, maxWidth: "820px" }}>
          <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em> — Explore 38 proposed 120-minute (2-hour) hands-on lessons across 4 progressive courses. Click <strong style={{ color: "#FFFFFF" }}>Start Lesson</strong> on any unlocked class to open its 12-slide presentation, wiring guide, C++ code lab, interactive circuit simulator, and 4-question Exit Check.
        </p>

        {/* Accurate 38-Lesson Student Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.85rem",
          }}
        >
          <div style={{ background: "#161B26", border: "1px solid #2E374B", borderRadius: "10px", padding: "0.8rem 1rem" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF" }}>38 Total Lessons</div>
            <div style={{ fontSize: "0.74rem", color: "#94A3B8" }}>4 Comprehensive Courses (4 + 12 + 10 + 12)</div>
          </div>
          <div style={{ background: "#161B26", border: "1px solid #2E374B", borderRadius: "10px", padding: "0.8rem 1rem" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#9c6f18" }}>120 Min / Class</div>
            <div style={{ fontSize: "0.74rem", color: "#94A3B8" }}>2-Hour Workshop Standard (76h Total)</div>
          </div>
          <div style={{ background: "#161B26", border: "1px solid #2E374B", borderRadius: "10px", padding: "0.8rem 1rem" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10B981" }}>{completedCount} Completed</div>
            <div style={{ fontSize: "0.74rem", color: "#94A3B8" }}>Exit Checks Submitted</div>
          </div>
        </div>
      </div>

      {/* Schedule Progression Live Banner */}
      {(progression.activeSession || progression.nextSession) && (
        <div
          style={{
            background: "#1E2533",
            border: "1px solid",
            borderColor: progression.activeSession ? "#9c6f18" : "#2E374B",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.3rem",
              }}
            >
              {progression.activeSession ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: "rgba(239, 68, 68, 0.18)",
                    color: "#EF4444",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
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
                    background: "rgba(245, 184, 0, 0.14)",
                    color: "#9c6f18",
                    border: "1px solid rgba(245, 184, 0, 0.3)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                  }}
                >
                  <Calendar size={12} /> Next Scheduled Class
                </span>
              )}
              <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                {(progression.activeSession || progression.nextSession)?.date} &bull;{" "}
                {(progression.activeSession || progression.nextSession)?.time || "15:30"}
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#FFFFFF" }}>
              {(progression.activeSession || progression.nextSession)?.lessonCode}:{" "}
              {(progression.activeSession || progression.nextSession)?.title}
            </div>
          </div>

          <Link
            href="/dashboard/attendance"
            style={{
              background: "#6B0F24",
              border: "1px solid #9c6f18",
              color: "#FFFFFF",
              padding: "0.55rem 1rem",
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.82rem",
              textDecoration: "none",
            }}
          >
            {progression.activeSession
              ? "Check In to Active Class"
              : "View Schedule & Attendance"}
          </Link>
        </div>
      )}

      {/* 4 Course Pathway Tabs + Search Bar */}
      <div
        style={{
          background: "#1E2533",
          border: "1px solid #2E374B",
          borderRadius: "12px",
          padding: "0.85rem 1rem",
          marginBottom: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.85rem",
        }}
      >
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
                  border: `1px solid ${isSelected ? "#9c6f18" : "#2E374B"}`,
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
                    color: isSelected ? "#9c6f18" : "#94A3B8",
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
              border: `1px solid ${courseFilter === "ALL" ? "#9c6f18" : "#2E374B"}`,
              background: courseFilter === "ALL" ? "#6B0F24" : "#161B26",
              color: courseFilter === "ALL" ? "#FFFFFF" : "#94A3B8",
              fontSize: "0.78rem",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            All 38 Classes
          </button>
        </div>

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

      {/* Selected Course Pathway Description Banner */}
      {courseFilter !== "ALL" && (() => {
        const activeSpace = COURSE_SPACES.find((c) => c.id === courseFilter);
        if (!activeSpace) return null;
        return (
          <div
            style={{
              background: "#1E2533",
              border: "1px solid #2E374B",
              borderLeft: "4px solid #9c6f18",
              borderRadius: "10px",
              padding: "0.9rem 1.15rem",
              marginBottom: "1.25rem",
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
                    color: "#9c6f18",
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
              Recommended Hardware: <span style={{ color: "#CBD5E1", fontWeight: 500 }}>{activeSpace.recommendedHardware}</span>
            </div>
          </div>
        );
      })()}

      {/* DE-CLUTTERED 3-COLUMN STUDENT CLASS CARDS GRID (NO AUTOMATIC BOTTOM SLIDE DUMP) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {filteredDecks.map((deck) => {
          const status = classStatuses[deck.id] || deck.status || "published";
          const isLocked = status === "locked";
          const isCompleted = !!completedClasses[deck.id];
          const cId = resolveDeckCourseId(deck);
          const space = COURSE_SPACES.find((c) => c.id === cId);
          const proposedLabel = deck.proposedAudience || space?.badge || "Proposed • Classes 5–8";

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
                opacity: isLocked ? 0.68 : 1,
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
                      color: "#9c6f18",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {deck.classCode}
                  </span>

                  {isCompleted ? (
                    <span
                      style={{
                        padding: "0.24rem 0.65rem",
                        borderRadius: "6px",
                        background: "rgba(16, 185, 129, 0.16)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        color: "#10B981",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <CheckCircle size={12} /> Completed
                    </span>
                  ) : (
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
                  )}
                </div>

                {/* Clean Reference Illustration Thumbnail */}
                <PresentationMediaFrame
                  src={deck.coverImage}
                  alt={deck.title}
                  caption={`Reference Illustration • ${deck.slides.length} Slides`}
                  fallbackVariant={deck.id === "beg-02" ? "mcu" : "arduino"}
                  accentColor="#9c6f18"
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

                {/* Meta Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.74rem",
                    color: "#94A3B8",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid #2E374B",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={13} color="#9c6f18" /> 120 Mins (2-Hour Session)
                  </span>
                  <span style={{ color: "#9c6f18", fontWeight: 700 }}>
                    +{deck.xpReward || 250} XP
                  </span>
                </div>
              </div>

              {/* 1.3.1 Member View: 1 Primary Button (Start Lesson if unlocked; disabled Locked by Instructor if locked) */}
              {isLocked ? (
                <button
                  type="button"
                  disabled
                  style={{
                    width: "100%",
                    padding: "0.65rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #2E374B",
                    background: "#161B26",
                    color: "#64748B",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    cursor: "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Lock size={14} /> Locked by Instructor
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveLessonDeck(deck)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #9c6f18",
                    background: "#6B0F24",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.45rem",
                  }}
                >
                  <Play size={14} color="#9c6f18" /> Start Lesson
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* STUDENT LESSON & HARDWARE WORKBENCH MODAL (Opens ONLY when student clicks "Start Lesson") */}
      {activeLessonDeck && activeLessonRecord && (
        <div
          onClick={() => setActiveLessonDeck(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(22, 27, 38, 0.90)",
            backdropFilter: "blur(12px)",
            zIndex: 99990,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1E2533",
              border: "1px solid #2E374B",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "1040px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.65)",
            }}
          >
            {/* Modal Top Bar */}
            <div
              style={{
                padding: "1rem 1.4rem",
                background: "#161B26",
                borderBottom: "1px solid #2E374B",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: "6px",
                      background: "rgba(245, 184, 0, 0.15)",
                      color: "#9c6f18",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                    }}
                  >
                    {activeLessonDeck.classCode}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700 }}>
                    120-Minute Student Lesson &amp; Hardware Guide
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>
                  {activeLessonDeck.title}
                </h2>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => {
                    setProjectorInitialSlide(0);
                    setProjectorDeck(activeLessonDeck);
                  }}
                  style={{
                    padding: "0.52rem 0.95rem",
                    borderRadius: "8px",
                    border: "1px solid #9c6f18",
                    background: "#6B0F24",
                    color: "#FFFFFF",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Tv size={14} color="#9c6f18" /> Open 12-Slide Presentation
                </button>

                <button
                  type="button"
                  onClick={() => setHardwareLabDeck(activeLessonDeck)}
                  style={{
                    padding: "0.52rem 0.95rem",
                    borderRadius: "8px",
                    border: "1px solid #2E374B",
                    background: "#1E2533",
                    color: "#E2E8F0",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Cpu size={14} color="#9c6f18" /> Interactive Circuit Simulator &amp; Exit Check
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLessonDeck(null)}
                  style={{
                    padding: "0.45rem",
                    borderRadius: "8px",
                    border: "1px solid #2E374B",
                    background: "transparent",
                    color: "#94A3B8",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: "1.4rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Promise & 5-Segment 120-Minute Session Rhythm */}
              <div style={{ background: "#161B26", border: "1px solid #2E374B", borderRadius: "12px", padding: "1.1rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#9c6f18", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                  Today&apos;s Big Promise
                </div>
                <p style={{ margin: "0 0 0.9rem 0", fontSize: "0.92rem", color: "#E2E8F0", lineHeight: 1.55 }}>
                  {activeLessonRecord.promise}
                </p>

                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  120-Minute (2-Hour) Workshop Timeline
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: "0.6rem" }}>
                  {activeLessonRecord.classRhythm.map((seg, i) => (
                    <div key={i} style={{ background: "#1E2533", border: "1px solid #2E374B", borderRadius: "8px", padding: "0.65rem" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#9c6f18" }}>
                        Segment {i + 1} • {seg.minutes}m
                      </div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FFFFFF", marginTop: "0.15rem" }}>
                        {seg.segment}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#94A3B8", marginTop: "0.25rem", lineHeight: 1.4 }}>
                        {seg.studentAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wiring Diagram & Point-to-Point Wire Table */}
              {activeLessonRecord.physicalBuildPack && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
                  <div style={{ background: "#161B26", border: "1px solid #2E374B", borderRadius: "12px", padding: "1rem" }}>
                    <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#9c6f18", textTransform: "uppercase", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Wrench size={14} /> Reference Wiring Illustration
                    </div>
                    <PresentationMediaFrame
                      src={activeLessonRecord.physicalBuildPack.connectionPhotoOrClearlyLabeledIllustration}
                      alt={activeLessonRecord.title}
                      caption={`Reference Illustration • ${activeLessonRecord.physicalBuildPack.schematic}`}
                      fallbackVariant="arduino"
                      accentColor="#9c6f18"
                      height="210px"
                    />
                  </div>

                  <div style={{ background: "#161B26", border: "1px solid #2E374B", borderRadius: "12px", padding: "1rem" }}>
                    <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#9c6f18", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                      Point-to-Point Wire Table (Wire with Power OFF)
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      {activeLessonRecord.physicalBuildPack.wireTable.map((w, idx) => (
                        <div key={idx} style={{ background: "#1E2533", border: "1px solid #2E374B", borderRadius: "8px", padding: "0.55rem 0.7rem" }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FFFFFF", fontFamily: "monospace" }}>
                            {w.from} &rarr; {w.to}
                          </div>
                          {w.wireOrPolarityNote && (
                            <div style={{ fontSize: "0.73rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                              {w.wireOrPolarityNote}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Code Lab Preview */}
              {activeLessonRecord.codeLab && (
                <div style={{ background: "#161B26", border: "1px solid #2E374B", borderRadius: "12px", padding: "1rem" }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#9c6f18", textTransform: "uppercase", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Code2 size={14} /> Complete Workshop Code ({activeLessonRecord.codeLab.language.toUpperCase()})
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: "0.9rem",
                      borderRadius: "8px",
                      background: "#0F141D",
                      border: "1px solid #2E374B",
                      color: "#E2E8F0",
                      fontSize: "0.78rem",
                      fontFamily: "monospace",
                      overflowX: "auto",
                      lineHeight: 1.5,
                    }}
                  >
                    {activeLessonRecord.codeLab.code}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
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
