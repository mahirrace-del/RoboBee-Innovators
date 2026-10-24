"use client";

import React, { useState } from "react";
import { RoboticsLesson, ALL_ROBOTICS_LESSONS } from "@/lib/curriculumData";
import { EditableClassDeck } from "@/lib/slideStudioStore";
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Tv,
  Edit3,
  Layers,
  BookOpen,
  Sparkles,
  HelpCircle,
  Wrench,
} from "lucide-react";

interface LessonPlanModalProps {
  deck: EditableClassDeck | null;
  lesson: RoboticsLesson | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchProjector: () => void;
  onLaunchStudio: () => void;
  onLaunchHardwareSim: () => void;
}

export function LessonPlanModal({
  deck,
  lesson,
  isOpen,
  onClose,
  onLaunchProjector,
  onLaunchStudio,
  onLaunchHardwareSim,
}: LessonPlanModalProps) {
  const [activeTab, setActiveTab] = useState<
    "rhythm" | "outcomes" | "hardware" | "safety" | "exit_ticket"
  >("rhythm");

  if (!isOpen || !deck) return null;

  const resolvedLesson: RoboticsLesson =
    lesson ||
    ALL_ROBOTICS_LESSONS.find((l) => l.id === deck.id) ||
    ALL_ROBOTICS_LESSONS[0];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 14, 23, 0.88)",
        backdropFilter: "blur(14px)",
        zIndex: 99994,
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
          maxWidth: "1050px",
          height: "88vh",
          background: "#161B26",
          border: "1px solid #2E374B",
          borderRadius: "20px",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: "#FFFFFF",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.15rem 1.6rem",
            background: "linear-gradient(135deg, #1E2533 0%, #161B26 100%)",
            borderBottom: "1px solid #2E374B",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                padding: "0.28rem 0.65rem",
                borderRadius: "6px",
                background: "rgba(245, 184, 0, 0.15)",
                border: "1px solid #F5B800",
                color: "#F5B800",
                fontSize: "0.74rem",
                fontWeight: 900,
                letterSpacing: "0.04em",
              }}
            >
              {deck.classCode}
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
                {deck.title}
              </h2>
              <div style={{ fontSize: "0.76rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                {deck.proposedAudience} • 120m Standard Workshop Case (60m Compact)
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={onLaunchProjector}
              style={{
                padding: "0.48rem 0.85rem",
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

            <button
              type="button"
              onClick={onLaunchHardwareSim}
              style={{
                padding: "0.48rem 0.85rem",
                borderRadius: "8px",
                background: "#1E2533",
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
              <Cpu size={14} /> Hardware Sim
            </button>

            <button
              type="button"
              onClick={onLaunchStudio}
              style={{
                padding: "0.48rem 0.85rem",
                borderRadius: "8px",
                background: "#1E2533",
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

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "#94A3B8",
                borderRadius: "8px",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            background: "#161B26",
            borderBottom: "1px solid #2E374B",
            padding: "0.5rem 1.6rem",
            gap: "0.4rem",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("rhythm")}
            style={{
              padding: "0.55rem 0.75rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "rhythm" ? "#F5B800" : "transparent"}`,
              background: activeTab === "rhythm" ? "#1E2533" : "transparent",
              color: activeTab === "rhythm" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
            }}
          >
            <Clock size={14} /> 120m Session Rhythm
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("outcomes")}
            style={{
              padding: "0.55rem 0.75rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "outcomes" ? "#F5B800" : "transparent"}`,
              background: activeTab === "outcomes" ? "#1E2533" : "transparent",
              color: activeTab === "outcomes" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
            }}
          >
            <CheckCircle2 size={14} /> Outcomes &amp; Vocab
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hardware")}
            style={{
              padding: "0.55rem 0.75rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "hardware" ? "#F5B800" : "transparent"}`,
              background: activeTab === "hardware" ? "#1E2533" : "transparent",
              color: activeTab === "hardware" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
            }}
          >
            <Wrench size={14} /> Hardware BOM &amp; Kit
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("safety")}
            style={{
              padding: "0.55rem 0.75rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "safety" ? "#F5B800" : "transparent"}`,
              background: activeTab === "safety" ? "#1E2533" : "transparent",
              color: activeTab === "safety" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
            }}
          >
            <AlertTriangle size={14} /> Teacher Prep &amp; Safety
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("exit_ticket")}
            style={{
              padding: "0.55rem 0.75rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "exit_ticket" ? "#F5B800" : "transparent"}`,
              background: activeTab === "exit_ticket" ? "#1E2533" : "transparent",
              color: activeTab === "exit_ticket" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
            }}
          >
            <HelpCircle size={14} /> Exit Check Rubric
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.6rem" }}>
          {/* TAB 1: 120M RHYTHM */}
          {activeTab === "rhythm" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "12px",
                  padding: "0.9rem 1.1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <strong style={{ color: "#FFFFFF", fontSize: "0.95rem" }}>
                    Standard 120-Minute Hands-On Workshop Architecture
                  </strong>
                  <div style={{ color: "#94A3B8", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                    Structured pacing ensures equal attention to theory, physical wiring, programming, and student reflection.
                  </div>
                </div>
                <span
                  style={{
                    padding: "0.25rem 0.65rem",
                    borderRadius: "6px",
                    background: "rgba(245, 184, 0, 0.15)",
                    color: "#F5B800",
                    fontSize: "0.74rem",
                    fontWeight: 800,
                  }}
                >
                  Total: 120 Minutes
                </span>
              </div>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                {(resolvedLesson.classRhythm || []).map((seg, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#1E2533",
                      border: "1px solid #2E374B",
                      borderRadius: "10px",
                      padding: "1rem",
                      display: "grid",
                      gridTemplateColumns: "130px 1fr 1fr",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.55rem",
                          borderRadius: "6px",
                          background: "rgba(245, 184, 0, 0.15)",
                          color: "#F5B800",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                        }}
                      >
                        {seg.segment}
                      </span>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "0.3rem" }}>
                        ⏱️ {seg.minutes} Minutes
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#F5B800", fontWeight: 800, textTransform: "uppercase" }}>
                        Instructor Facilitation
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#E2E8F0", marginTop: "0.2rem", lineHeight: 1.45 }}>
                        {seg.teacherAction}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#38BDF8", fontWeight: 800, textTransform: "uppercase" }}>
                        Student Hands-On Action
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#CBD5E1", marginTop: "0.2rem", lineHeight: 1.45 }}>
                        {seg.studentAction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OUTCOMES & VOCABULARY */}
          {activeTab === "outcomes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "12px",
                  padding: "1.2rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.8rem 0", fontSize: "1rem", fontWeight: 800 }}>
                  Measurable Student Learning Outcomes
                </h3>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {(resolvedLesson.outcomes || []).map((out, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        fontSize: "0.82rem",
                        color: "#E2E8F0",
                        lineHeight: 1.5,
                      }}
                    >
                      <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(resolvedLesson.vocabulary || []).length > 0 && (
                <div
                  style={{
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    borderRadius: "12px",
                    padding: "1.2rem",
                  }}
                >
                  <h3 style={{ margin: "0 0 0.8rem 0", fontSize: "1rem", fontWeight: 800 }}>
                    Key Engineering Vocabulary
                  </h3>
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    {resolvedLesson.vocabulary.map((voc, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          borderRadius: "8px",
                          padding: "0.75rem 0.9rem",
                        }}
                      >
                        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#F5B800" }}>
                          {voc.term}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#E2E8F0", marginTop: "0.2rem" }}>
                          <strong>Plain meaning:</strong> {voc.plainMeaning}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.15rem" }}>
                          <strong>Technical specification:</strong> {voc.technicalMeaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HARDWARE BOM & KIT */}
          {activeTab === "hardware" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "12px",
                  padding: "1.2rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.8rem 0", fontSize: "1rem", fontWeight: 800 }}>
                  Hardware Bill of Materials (BOM) &amp; Lab Kit
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {(deck.hardwareKit || resolvedLesson.verifiedMaterials || []).map((mat, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "8px",
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        color: "#38BDF8",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Cpu size={13} /> {mat}
                    </span>
                  ))}
                </div>
              </div>

              {resolvedLesson.physicalBuildPack?.wireTable && (
                <div
                  style={{
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    borderRadius: "12px",
                    padding: "1.2rem",
                  }}
                >
                  <h3 style={{ margin: "0 0 0.8rem 0", fontSize: "1rem", fontWeight: 800 }}>
                    Pin Connection &amp; Wire Table
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #2E374B", textAlign: "left", color: "#94A3B8" }}>
                        <th style={{ padding: "0.5rem" }}>From Terminal</th>
                        <th style={{ padding: "0.5rem" }}>To Terminal</th>
                        <th style={{ padding: "0.5rem" }}>Wire / Polarity Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resolvedLesson.physicalBuildPack.wireTable.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "0.5rem", color: "#F5B800", fontWeight: 700 }}>
                            {row.from}
                          </td>
                          <td style={{ padding: "0.5rem", color: "#38BDF8", fontWeight: 700 }}>
                            {row.to}
                          </td>
                          <td style={{ padding: "0.5rem", color: "#CBD5E1" }}>
                            {row.wireOrPolarityNote || "Standard jumper connection"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TEACHER PREP & SAFETY */}
          {activeTab === "safety" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "12px",
                  padding: "1.2rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.8rem 0", fontSize: "1rem", fontWeight: 800 }}>
                  Teacher Preparation Checklist (Before Students Arrive)
                </h3>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {(resolvedLesson.teacherPrep || []).map((prep, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        fontSize: "0.82rem",
                        color: "#E2E8F0",
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(245, 184, 0, 0.2)",
                          color: "#F5B800",
                          borderRadius: "4px",
                          padding: "0.1rem 0.35rem",
                          fontWeight: 800,
                          fontSize: "0.7rem",
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span>{prep}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid #EF4444",
                  borderRadius: "12px",
                  padding: "1.2rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.8rem 0", fontSize: "1rem", fontWeight: 800, color: "#F87171" }}>
                  Critical Safety &amp; Circuit Warnings
                </h3>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {(resolvedLesson.safetyNotes || []).map((safe, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        fontSize: "0.82rem",
                        color: "#FECACA",
                      }}
                    >
                      <AlertTriangle size={15} color="#EF4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{safe}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXIT TICKET RUBRIC */}
          {activeTab === "exit_ticket" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "12px",
                  padding: "1.2rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.8rem 0", fontSize: "1rem", fontWeight: 800 }}>
                  4-Question Student Exit Check Reflection Rubrics
                </h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {(resolvedLesson.exitTicket || []).map((ticket, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        borderRadius: "10px",
                        padding: "1rem",
                      }}
                    >
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#F5B800" }}>
                        Question {idx + 1}: {ticket.question}
                      </div>
                      <div
                        style={{
                          background: "#0F172A",
                          borderRadius: "8px",
                          padding: "0.6rem 0.8rem",
                          fontSize: "0.78rem",
                          color: "#10B981",
                          marginTop: "0.5rem",
                        }}
                      >
                        <strong>Scoring Rubric &amp; Desired Reasoning:</strong> {ticket.rubricOrSampleReasoning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
