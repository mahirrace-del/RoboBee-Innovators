"use client";

import React, { useState } from "react";
import {
  ALL_ROBOTICS_LESSONS,
  COURSE_SPACES,
  CourseTier,
  RoboticsLesson,
  ClassStatus,
} from "@/lib/curriculumData";
import {
  EditableClassDeck,
  normalizeDeckToFreeform,
} from "@/lib/slideStudioStore";
import { PresentationMediaFrame } from "./Class1WorkshopDeck";
import {
  Tv,
  Edit3,
  Cpu,
  BookOpen,
  Lock,
  Unlock,
  Radio,
  MoreHorizontal,
  Copy,
  Download,
  Trash2,
  Clock,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";

interface ClassProgressionRoadmapProps {
  decks: EditableClassDeck[];
  courseFilter: "ALL" | CourseTier;
  classStatuses: Record<string, ClassStatus>;
  searchQuery: string;
  onOpenProjector: (deck: EditableClassDeck) => void;
  onOpenStudio: (deck: EditableClassDeck) => void;
  onOpenHardwareSim: (deck: EditableClassDeck) => void;
  onOpenLessonPlan: (deck: EditableClassDeck) => void;
  onToggleStatus: (deckId: string, newStatus: ClassStatus) => void;
  onDuplicateDeck: (deck: EditableClassDeck) => void;
  onExportDeck: (deck: EditableClassDeck) => void;
  onDeleteDeck: (deck: EditableClassDeck) => void;
}

export function ClassProgressionRoadmap({
  decks,
  courseFilter,
  classStatuses,
  searchQuery,
  onOpenProjector,
  onOpenStudio,
  onOpenHardwareSim,
  onOpenLessonPlan,
  onToggleStatus,
  onDuplicateDeck,
  onExportDeck,
  onDeleteDeck,
}: ClassProgressionRoadmapProps) {
  const [openMenuDeckId, setOpenMenuDeckId] = useState<string | null>(null);

  // Resolve courseId
  const resolveDeckCourseId = (deck: EditableClassDeck): CourseTier => {
    if (deck.courseId) return deck.courseId;
    if (deck.id.startsWith("exp-")) return "explorer";
    if (deck.id.startsWith("int-")) return "intermediate";
    if (deck.id.startsWith("adv-")) return "advanced";
    return "beginner";
  };

  // Resolve matching canonical lesson record
  const resolveLesson = (deck: EditableClassDeck): RoboticsLesson => {
    return (
      ALL_ROBOTICS_LESSONS.find((l) => l.id === deck.id) ||
      ALL_ROBOTICS_LESSONS[0]
    );
  };

  // Group decks by course tier
  const tiersToRender: CourseTier[] =
    courseFilter === "ALL"
      ? ["explorer", "beginner", "intermediate", "advanced"]
      : [courseFilter];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
      onClick={() => {
        if (openMenuDeckId) setOpenMenuDeckId(null);
      }}
    >
      {tiersToRender.map((tier) => {
        const space = COURSE_SPACES.find((c) => c.id === tier);
        if (!space) return null;

        // Filter decks belonging to this tier and matching search
        const tierDecks = decks.filter((d) => {
          const cId = resolveDeckCourseId(d);
          if (cId !== tier) return false;
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            d.classCode.toLowerCase().includes(q) ||
            d.title.toLowerCase().includes(q) ||
            d.subtitle.toLowerCase().includes(q)
          );
        });

        if (tierDecks.length === 0) return null;

        const totalInTrack = tierDecks.length;
        const unlockedCount = tierDecks.filter(
          (d) => (classStatuses[d.id] || d.status || "published") !== "locked"
        ).length;

        return (
          <div key={tier} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Pathway Section Header Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #1E2533 0%, #161B26 100%)",
                border: "1px solid #2E374B",
                borderLeft: `5px solid ${space.accentColor || "#F5B800"}`,
                borderRadius: "14px",
                padding: "1.1rem 1.4rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      background: "rgba(245, 184, 0, 0.15)",
                      border: "1px solid rgba(245, 184, 0, 0.35)",
                      color: space.accentColor || "#F5B800",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {space.codeName} PATHWAY
                  </span>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF" }}>
                    {space.title}
                  </h2>
                  <span
                    style={{
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      background: "#161B26",
                      border: "1px solid #2E374B",
                      color: "#94A3B8",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                    }}
                  >
                    {space.proposedBand}
                  </span>
                </div>
                <p style={{ margin: "0.35rem 0 0 0", color: "#94A3B8", fontSize: "0.84rem", maxWidth: "820px", lineHeight: 1.5 }}>
                  {space.description}
                </p>
              </div>

              {/* Pathway Stats Pill & Bulk Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    background: "#161B26",
                    border: "1px solid #2E374B",
                    borderRadius: "10px",
                    padding: "0.6rem 1rem",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
                      Track Sequence
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                      {totalInTrack} Progressive Classes
                    </div>
                  </div>
                  <div style={{ width: "1px", height: "30px", background: "#2E374B" }} />
                  <div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>
                      Access Status
                    </div>
                    <div
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 800,
                        color: unlockedCount === totalInTrack ? "#10B981" : "#F5B800",
                      }}
                    >
                      {unlockedCount} / {totalInTrack} Unlocked
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      tierDecks.forEach((d) => onToggleStatus(d.id, "published"));
                    }}
                    title="Unlock all classes in this pathway for student access"
                    style={{
                      padding: "0.45rem 0.75rem",
                      borderRadius: "8px",
                      background: "#161B26",
                      border: "1px solid #10B981",
                      color: "#10B981",
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Unlock size={13} /> Unlock All ({totalInTrack})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      tierDecks.forEach((d) => onToggleStatus(d.id, "locked"));
                    }}
                    title="Lock all classes in this pathway"
                    style={{
                      padding: "0.45rem 0.75rem",
                      borderRadius: "8px",
                      background: "#161B26",
                      border: "1px solid #EF4444",
                      color: "#F87171",
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Lock size={13} /> Lock All
                  </button>
                </div>
              </div>
            </div>

            {/* Sequential Roadmap Progression Chain */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {tierDecks.map((deck, idx) => {
                const status = classStatuses[deck.id] || deck.status || "published";
                const lesson = resolveLesson(deck);
                const stepNum = idx + 1;
                const isFirst = idx === 0;
                const isLast = idx === totalInTrack - 1;
                const nextDeck = !isLast ? tierDecks[idx + 1] : null;
                const prevDeck = !isFirst ? tierDecks[idx - 1] : null;
                const isMenuOpen = openMenuDeckId === deck.id;

                const outcomesList =
                  lesson.outcomes && lesson.outcomes.length > 0
                    ? lesson.outcomes.slice(0, 3)
                    : [
                        "Master foundational circuit principles and hardware interaction.",
                        "Program core C++ control logic and sensor data acquisition.",
                        "Debug real-world bench wiring and verify operation.",
                      ];

                const kitList =
                  deck.hardwareKit && deck.hardwareKit.length > 0
                    ? deck.hardwareKit
                    : lesson.verifiedMaterials && lesson.verifiedMaterials.length > 0
                    ? lesson.verifiedMaterials
                    : ["Arduino Uno R3", "Breadboard", "Jumper Wires"];

                return (
                  <div key={deck.id} style={{ display: "flex", flexDirection: "column" }}>
                    {/* Main Class Sequence Card */}
                    <div
                      style={{
                        background: "#1E2533",
                        border: `1px solid ${
                          status === "live_in_class"
                            ? "#F5B800"
                            : status === "locked"
                            ? "#EF4444"
                            : "#2E374B"
                        }`,
                        borderRadius: "16px",
                        padding: "1.3rem 1.5rem",
                        boxShadow:
                          status === "live_in_class"
                            ? "0 0 24px rgba(245, 184, 0, 0.15)"
                            : "0 10px 30px rgba(0, 0, 0, 0.35)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.1rem",
                        position: "relative",
                      }}
                    >
                      {/* Top Bar: Sequence Step + Class Code + Prerequisites + Status Tag */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "0.75rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                          {/* Step Badge */}
                          <div
                            style={{
                              background:
                                status === "locked"
                                  ? "#1F2937"
                                  : status === "live_in_class"
                                  ? "rgba(245, 184, 0, 0.25)"
                                  : "#6B0F24",
                              border: `1px solid ${
                                status === "locked"
                                  ? "#4B5563"
                                  : status === "live_in_class"
                                  ? "#F5B800"
                                  : "#F5B800"
                              }`,
                              color: status === "locked" ? "#9CA3AF" : "#F5B800",
                              borderRadius: "999px",
                              padding: "0.25rem 0.75rem",
                              fontSize: "0.75rem",
                              fontWeight: 900,
                              letterSpacing: "0.04em",
                            }}
                          >
                            STEP {String(stepNum).padStart(2, "0")} OF {String(totalInTrack).padStart(2, "0")}
                          </div>

                          {/* Class Code */}
                          <span
                            style={{
                              padding: "0.25rem 0.65rem",
                              borderRadius: "6px",
                              background: "rgba(245, 184, 0, 0.12)",
                              border: "1px solid rgba(245, 184, 0, 0.3)",
                              color: "#F5B800",
                              fontSize: "0.74rem",
                              fontWeight: 800,
                            }}
                          >
                            {deck.classCode}
                          </span>

                          {/* Sequence Dependency Tag */}
                          <span
                            style={{
                              padding: "0.22rem 0.6rem",
                              borderRadius: "6px",
                              background: "#161B26",
                              border: "1px solid #2E374B",
                              color: "#94A3B8",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {isFirst ? (
                              <>
                                <Sparkles size={12} color="#F5B800" /> Foundation Workshop (Entry Point)
                              </>
                            ) : (
                              <>
                                <ChevronRight size={12} color="#38BDF8" /> Follows: {prevDeck?.classCode}
                              </>
                            )}
                          </span>
                        </div>

                        {/* Interactive Status Toggle Button */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() =>
                              onToggleStatus(
                                deck.id,
                                status === "locked" ? "published" : "locked"
                              )
                            }
                            title="Click to toggle between Unlocked and Locked"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.32rem 0.8rem",
                              borderRadius: "999px",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              cursor: "pointer",
                              background:
                                status === "locked"
                                  ? "rgba(239, 68, 68, 0.15)"
                                  : status === "live_in_class"
                                  ? "rgba(245, 184, 0, 0.18)"
                                  : "rgba(16, 185, 129, 0.15)",
                              border: `1px solid ${
                                status === "locked"
                                  ? "#EF4444"
                                  : status === "live_in_class"
                                  ? "#F5B800"
                                  : "#10B981"
                              }`,
                              color:
                                status === "locked"
                                  ? "#F87171"
                                  : status === "live_in_class"
                                  ? "#F5B800"
                                  : "#34D399",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {status === "locked" ? (
                              <>
                                <Lock size={13} /> Locked (Click to Unlock)
                              </>
                            ) : status === "live_in_class" ? (
                              <>
                                <Radio size={13} /> Live in Classroom Lab
                              </>
                            ) : (
                              <>
                                <Unlock size={13} /> Unlocked &amp; Ready
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Middle Layout: Media Frame + Main Content (Fully Responsive Grid) */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                          gap: "1.25rem",
                          alignItems: "start",
                        }}
                      >
                        {/* Reference Thumbnail Frame */}
                        <div style={{ borderRadius: "10px", overflow: "hidden" }}>
                          <PresentationMediaFrame
                            src={deck.coverImage}
                            alt={deck.title}
                            caption={`Step ${stepNum} Reference • ${deck.slides.length} Slides`}
                            fallbackVariant={deck.id.startsWith("beg") ? "arduino" : "mcu"}
                            accentColor="#F5B800"
                            height="160px"
                          />
                        </div>

                        {/* Title, Subtitle, Outcomes & Hardware BOM */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                          <div>
                            <h3
                              style={{
                                margin: "0 0 0.3rem 0",
                                fontSize: "1.2rem",
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
                                fontSize: "0.85rem",
                                color: "#CBD5E1",
                                lineHeight: 1.5,
                              }}
                            >
                              {deck.subtitle}
                            </p>
                          </div>

                          {/* 3 Measurable Learning Outcomes Checklist */}
                          <div
                            style={{
                              background: "#161B26",
                              border: "1px solid #2E374B",
                              borderRadius: "10px",
                              padding: "0.75rem 0.9rem",
                              display: "grid",
                              gap: "0.35rem",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                                marginBottom: "0.15rem",
                              }}
                            >
                              Core Learning &amp; Engineering Outcomes:
                            </div>
                            {outcomesList.map((out, oIdx) => (
                              <div
                                key={oIdx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "0.45rem",
                                  fontSize: "0.76rem",
                                  color: "#E2E8F0",
                                  lineHeight: 1.4,
                                }}
                              >
                                <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                                <span>{out}</span>
                              </div>
                            ))}
                          </div>

                          {/* Hardware Kit Chips */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 700 }}>
                              Kit Requirements:
                            </span>
                            {kitList.slice(0, 4).map((kItem, kIdx) => (
                              <span
                                key={kIdx}
                                style={{
                                  padding: "0.18rem 0.5rem",
                                  borderRadius: "6px",
                                  background: "#161B26",
                                  border: "1px solid #2E374B",
                                  color: "#38BDF8",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                }}
                              >
                                {kItem}
                              </span>
                            ))}
                            {kitList.length > 4 && (
                              <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                                +{kitList.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Session Duration + Primary Action Buttons Bar */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid #2E374B",
                          paddingTop: "0.85rem",
                          flexWrap: "wrap",
                          gap: "0.75rem",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Session Metadata */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontSize: "0.75rem",
                              color: "#F5B800",
                              fontWeight: 700,
                            }}
                          >
                            <Clock size={13} /> 120m Standard (60m Compact)
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#94A3B8",
                              fontWeight: 600,
                            }}
                          >
                            📑 {deck.slides.length} Interactive Slides
                          </span>
                        </div>

                        {/* 4 Clear Primary Actions + ••• Overflow */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          {/* 1. Present Live (Projector) */}
                          <button
                            type="button"
                            onClick={() => onOpenProjector(deck)}
                            style={{
                              padding: "0.55rem 0.9rem",
                              borderRadius: "8px",
                              background: "#6B0F24",
                              border: "1px solid #F5B800",
                              color: "#FFFFFF",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <Tv size={14} color="#F5B800" /> Present Live
                          </button>

                          {/* 2. Edit Slides (Slide Studio) */}
                          <button
                            type="button"
                            onClick={() => onOpenStudio(deck)}
                            style={{
                              padding: "0.55rem 0.9rem",
                              borderRadius: "8px",
                              background: "#161B26",
                              border: "1px solid #2E374B",
                              color: "#E2E8F0",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <Edit3 size={14} color="#94A3B8" /> Edit Slides
                          </button>

                          {/* 3. Open Hardware Simulation */}
                          <button
                            type="button"
                            onClick={() => onOpenHardwareSim(deck)}
                            style={{
                              padding: "0.55rem 0.9rem",
                              borderRadius: "8px",
                              background: "rgba(0, 245, 212, 0.12)",
                              border: "1px solid #00F5D4",
                              color: "#00F5D4",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <Cpu size={14} /> Open Hardware Sim
                          </button>

                          {/* 4. View Lesson Plan */}
                          <button
                            type="button"
                            onClick={() => onOpenLessonPlan(deck)}
                            style={{
                              padding: "0.55rem 0.9rem",
                              borderRadius: "8px",
                              background: "#161B26",
                              border: "1px solid #2E374B",
                              color: "#94A3B8",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <BookOpen size={14} color="#F5B800" /> Lesson Plan
                          </button>

                          {/* 5. Overflow ••• Menu */}
                          <div style={{ position: "relative" }}>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuDeckId((prev) =>
                                  prev === deck.id ? null : deck.id
                                )
                              }
                              title="More options"
                              style={{
                                padding: "0.55rem 0.65rem",
                                borderRadius: "8px",
                                background: "#161B26",
                                border: "1px solid #2E374B",
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
                                  onClick={() => onToggleStatus(deck.id, "published")}
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
                                  onClick={() => onToggleStatus(deck.id, "live_in_class")}
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
                                  <Radio size={13} /> Set Live in Lab
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onToggleStatus(deck.id, "locked")}
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
                                  onClick={() => onDuplicateDeck(deck)}
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
                                  onClick={() => onExportDeck(deck)}
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
                                  onClick={() => onDeleteDeck(deck)}
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
                    </div>

                    {/* Sequential Connector Between Classes */}
                    {!isLast && nextDeck && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0.85rem 0",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            height: "36px",
                            width: "2px",
                            background: "linear-gradient(to bottom, #F5B800, #38BDF8)",
                            position: "relative",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            background: "#161B26",
                            border: "1px solid #2E374B",
                            borderRadius: "999px",
                            padding: "0.2rem 0.75rem",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            color: "#38BDF8",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                          }}
                        >
                          <ArrowDown size={12} color="#F5B800" />
                          <span>
                            Prerequisite for Next Step ➔{" "}
                            <strong style={{ color: "#FFFFFF" }}>{nextDeck.classCode}</strong>: {nextDeck.title}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
