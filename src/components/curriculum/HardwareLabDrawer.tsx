"use client";

import React, { useState } from "react";
import { RoboticsLesson, ALL_ROBOTICS_LESSONS } from "@/lib/curriculumData";
import { EditableClassDeck } from "@/lib/slideStudioStore";
import { CurriculumSimulator } from "@/components/curriculum/CurriculumSimulator";
import {
  X,
  Cpu,
  Zap,
  Code2,
  Award,
  Copy,
  Check,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Tv,
  Sparkles,
  Wrench,
} from "lucide-react";

interface HardwareLabDrawerProps {
  deck: EditableClassDeck;
  lesson?: RoboticsLesson;
  onClose: () => void;
  onLaunchProjector?: () => void;
  onSubmitExitTicket?: (
    answers: Record<number, string>,
    meta?: { studentName: string; studentEmail: string }
  ) => Promise<void>;
}

export function HardwareLabDrawer({
  deck,
  lesson: propLesson,
  onClose,
  onLaunchProjector,
  onSubmitExitTicket,
}: HardwareLabDrawerProps) {
  const matchedLesson: RoboticsLesson =
    propLesson ||
    ALL_ROBOTICS_LESSONS.find((l) => l.id === deck.id) ||
    ALL_ROBOTICS_LESSONS.find((l) => l.id === "beg-01") ||
    ALL_ROBOTICS_LESSONS[0];

  const [activeTab, setActiveTab] = useState<"simulator" | "wiring" | "code" | "kit_quiz">(
    "simulator"
  );

  // Interactive Ohm's Law & LED Current Calculator State
  const [supplyVoltage, setSupplyVoltage] = useState<number>(5.0);
  const [ledType, setLedType] = useState<{ name: string; vf: number; hex: string }>({
    name: "Red 5mm LED (2.0V)",
    vf: 2.0,
    hex: "#EF4444",
  });
  const [resistorOhms, setResistorOhms] = useState<number>(220);

  // Checkable wiring steps
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  // Code copy feedback
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Exit check state
  const [studentName, setStudentName] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [revealedRubric, setRevealedRubric] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Calculate Ohm's Law live metrics
  const voltageAcrossResistor = Math.max(0, supplyVoltage - ledType.vf);
  const currentMa = resistorOhms > 0 ? (voltageAcrossResistor / resistorOhms) * 1000 : 999;
  const isDangerOvercurrent = currentMa > 30;
  const isOptimalCurrent = currentMa >= 8 && currentMa <= 22;

  const handleCopyCode = () => {
    const codeStr =
      matchedLesson.codeLab?.code ||
      `const int LED_PIN = 8;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_PIN, HIGH);\n  delay(500);\n  digitalWrite(LED_PIN, LOW);\n  delay(500);\n}`;
    navigator.clipboard.writeText(codeStr);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadIno = () => {
    const codeStr =
      matchedLesson.codeLab?.code ||
      `const int LED_PIN = 8;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_PIN, HIGH);\n  delay(500);\n  digitalWrite(LED_PIN, LOW);\n  delay(500);\n}`;
    const filename = `RoboBEE_${deck.classCode.replace(/\s+/g, "_")}.ino`;
    const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 94000,
        background: "rgba(5, 8, 17, 0.88)",
        backdropFilter: "blur(14px)",
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
          maxWidth: "1260px",
          height: "90vh",
          background: "#0B1120",
          border: "1px solid #1E293B",
          borderRadius: "24px",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ================================================================= */}
        {/* CLEAN NON-OVERLAPPING TOP HEADER */}
        {/* ================================================================= */}
        <div
          style={{
            padding: "1.15rem 1.6rem",
            background: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
            borderBottom: "1px solid #1E293B",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(0, 245, 212, 0.16)",
                border: "1px solid #00F5D4",
                color: "#00F5D4",
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.76rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
              }}
            >
              {deck.classCode} • HARDWARE LAB &amp; SIMULATOR
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 900,
                color: "#FFFFFF",
              }}
            >
              {deck.title}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <button
              type="button"
              onClick={onLaunchProjector}
              style={{
                background: "linear-gradient(135deg, #00F5D4 0%, #38BDF8 100%)",
                color: "#090D16",
                border: "none",
                borderRadius: "10px",
                padding: "0.55rem 1rem",
                fontSize: "0.82rem",
                fontWeight: 900,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Tv size={15} /> Launch Slide Projector
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#E2E8F0",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                borderRadius: "10px",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Close Hardware Lab"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4 CLEAN VISUAL NAVIGATION TABS (NO HORIZONTAL SCROLLBAR COLLISION) */}
        {/* ================================================================= */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            background: "#0F172A",
            borderBottom: "1px solid #1E293B",
            padding: "0.5rem 1.25rem",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            style={{
              background: activeTab === "simulator" ? "#1E293B" : "transparent",
              color: activeTab === "simulator" ? "#00F5D4" : "#94A3B8",
              border: `1px solid ${activeTab === "simulator" ? "#00F5D4" : "transparent"}`,
              borderRadius: "10px",
              padding: "0.65rem 0.9rem",
              fontSize: "0.84rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
            }}
          >
            <Cpu size={16} /> 1. Virtual Circuit &amp; Ohm&apos;s Law Sim
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wiring")}
            style={{
              background: activeTab === "wiring" ? "#1E293B" : "transparent",
              color: activeTab === "wiring" ? "#38BDF8" : "#94A3B8",
              border: `1px solid ${activeTab === "wiring" ? "#38BDF8" : "transparent"}`,
              borderRadius: "10px",
              padding: "0.65rem 0.9rem",
              fontSize: "0.84rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
            }}
          >
            <Wrench size={16} /> 2. Breadboard Wiring &amp; Pin Map
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            style={{
              background: activeTab === "code" ? "#1E293B" : "transparent",
              color: activeTab === "code" ? "#FBBF24" : "#94A3B8",
              border: `1px solid ${activeTab === "code" ? "#FBBF24" : "transparent"}`,
              borderRadius: "10px",
              padding: "0.65rem 0.9rem",
              fontSize: "0.84rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
            }}
          >
            <Code2 size={16} /> 3. Arduino C++ Code Lab (.ino)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("kit_quiz")}
            style={{
              background: activeTab === "kit_quiz" ? "#1E293B" : "transparent",
              color: activeTab === "kit_quiz" ? "#34D399" : "#94A3B8",
              border: `1px solid ${activeTab === "kit_quiz" ? "#34D399" : "transparent"}`,
              borderRadius: "10px",
              padding: "0.65rem 0.9rem",
              fontSize: "0.84rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
            }}
          >
            <Award size={16} /> 4. Kit BOM &amp; Exit Check (+100 XP)
          </button>
        </div>

        {/* ================================================================= */}
        {/* SINGLE CLEAN SCROLLABLE BODY */}
        {/* ================================================================= */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.65rem" }}>
          {/* TAB 1: VIRTUAL CIRCUIT & OHM'S LAW SIMULATOR */}
          {activeTab === "simulator" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
              {/* Interactive Ohm's Law & LED Current Sandbox */}
              <div
                style={{
                  background: "linear-gradient(135deg, #042F2E 0%, #0F172A 100%)",
                  border: "1px solid #2DD4BF",
                  borderRadius: "20px",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.74rem", fontWeight: 900, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      INTERACTIVE PHYSICS SANDBOX • OHM&apos;S LAW (I = V / R)
                    </span>
                    <h3 style={{ margin: "0.2rem 0 0 0", fontSize: "1.25rem", fontWeight: 900, color: "#FFFFFF" }}>
                      Live LED &amp; Series Resistor Current Simulator
                    </h3>
                  </div>

                  <div
                    style={{
                      padding: "0.4rem 0.95rem",
                      borderRadius: "999px",
                      fontWeight: 900,
                      fontSize: "0.82rem",
                      background: isDangerOvercurrent
                        ? "rgba(244, 63, 94, 0.2)"
                        : isOptimalCurrent
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(251, 191, 36, 0.2)",
                      border: `1px solid ${
                        isDangerOvercurrent ? "#F43F5E" : isOptimalCurrent ? "#10B981" : "#FBBF24"
                      }`,
                      color: isDangerOvercurrent ? "#FDA4AF" : isOptimalCurrent ? "#34D399" : "#FDE68A",
                    }}
                  >
                    {isDangerOvercurrent
                      ? "⚠️ OVERCURRENT DANGER (> 30 mA) — LED WILL BURN!"
                      : isOptimalCurrent
                      ? "✓ OPTIMAL SAFE CURRENT (8–22 mA)"
                      : "ℹ️ LOW CURRENT (< 8 mA) — DIM GLOW"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.25rem",
                    alignItems: "center",
                  }}
                >
                  {/* Controls */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                        1. Supply Voltage (Vs): <strong style={{ color: "#2DD4BF" }}>{supplyVoltage.toFixed(1)} V</strong>
                      </label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {[3.3, 5.0, 9.0].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setSupplyVoltage(v)}
                            style={{
                              flex: 1,
                              padding: "0.45rem",
                              borderRadius: "8px",
                              border: `1px solid ${supplyVoltage === v ? "#2DD4BF" : "#334155"}`,
                              background: supplyVoltage === v ? "rgba(45, 212, 191, 0.2)" : "#0F172A",
                              color: "#FFFFFF",
                              fontWeight: 800,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            {v}V {v === 5.0 ? "(Uno Pin)" : v === 3.3 ? "(ESP32)" : "(Battery)"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                        2. LED Color &amp; Forward Voltage (Vf):
                      </label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {[
                          { name: "Red (2.0V)", vf: 2.0, hex: "#EF4444" },
                          { name: "Green (2.2V)", vf: 2.2, hex: "#10B981" },
                          { name: "Blue/White (3.0V)", vf: 3.0, hex: "#38BDF8" },
                        ].map((led) => (
                          <button
                            key={led.name}
                            type="button"
                            onClick={() => setLedType(led)}
                            style={{
                              flex: 1,
                              padding: "0.45rem",
                              borderRadius: "8px",
                              border: `1px solid ${ledType.name === led.name ? led.hex : "#334155"}`,
                              background: ledType.name === led.name ? `${led.hex}33` : "#0F172A",
                              color: "#FFFFFF",
                              fontWeight: 800,
                              fontSize: "0.76rem",
                              cursor: "pointer",
                            }}
                          >
                            {led.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                        3. Series Resistor (R): <strong style={{ color: "#FBBF24" }}>{resistorOhms} Ω</strong>
                      </label>
                      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                        {[47, 100, 220, 330, 1000, 10000].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setResistorOhms(r)}
                            style={{
                              padding: "0.42rem 0.7rem",
                              borderRadius: "8px",
                              border: `1px solid ${resistorOhms === r ? "#FBBF24" : "#334155"}`,
                              background: resistorOhms === r ? "rgba(251, 191, 36, 0.2)" : "#0F172A",
                              color: "#FFFFFF",
                              fontWeight: 800,
                              fontSize: "0.78rem",
                              cursor: "pointer",
                            }}
                          >
                            {r >= 1000 ? `${r / 1000} kΩ` : `${r} Ω`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Visual Readout & Glowing Virtual LED */}
                  <div
                    style={{
                      background: "#090D16",
                      border: "1px solid #1E293B",
                      borderRadius: "16px",
                      padding: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "68px",
                          height: "68px",
                          borderRadius: "50%",
                          margin: "0 auto 0.6rem auto",
                          background: isDangerOvercurrent
                            ? "#F43F5E"
                            : ledType.hex,
                          opacity: Math.max(0.2, Math.min(1, currentMa / 18)),
                          boxShadow: `0 0 ${Math.min(45, Math.round(currentMa * 2))}px ${ledType.hex}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "3px solid #FFFFFF",
                        }}
                      >
                        <Zap size={28} color="#090D16" />
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#CBD5E1" }}>
                        {isDangerOvercurrent ? "THERMAL OVERLOAD!" : "Virtual 5mm LED"}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                        Resistor Voltage Drop: <strong style={{ color: "#F8FAFC" }}>{voltageAcrossResistor.toFixed(1)} V</strong>
                      </div>
                      <div style={{ fontSize: "1.55rem", fontWeight: 900, color: isDangerOvercurrent ? "#F43F5E" : "#00F5D4" }}>
                        I = {currentMa.toFixed(1)} mA
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontFamily: "var(--font-mono)" }}>
                        I = ({supplyVoltage.toFixed(1)}V - {ledType.vf.toFixed(1)}V) / {resistorOhms}Ω
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Interactive Hardware Board / Circuit Simulator */}
              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #1E293B",
                  borderRadius: "20px",
                  padding: "1.35rem",
                }}
              >
                <CurriculumSimulator
                  type={deck.hardwareSimType || matchedLesson.visualizerId}
                  classNumber={matchedLesson.sequence}
                  lessonTitle={deck.title}
                />
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP BREADBOARD WIRING & PIN MAP */}
          {activeTab === "wiring" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
              {/* Left: Pin-to-Pin Wire Table */}
              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.35rem" }}>
                <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "1.1rem", fontWeight: 900, color: "#38BDF8", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <Layers size={18} /> Hardware Wire Connection Table
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {(matchedLesson.physicalBuildPack?.wireTable || [
                    { from: "Arduino Pin D8", to: "Breadboard Row 10 (220Ω Resistor Leg 1)", wireOrPolarityNote: "Yellow Signal Jumper" },
                    { from: "220Ω Resistor Leg 2 (Row 14)", to: "Red LED Anode (+) Long Leg (Row 14)", wireOrPolarityNote: "Shared 5-Hole Strip" },
                    { from: "Red LED Cathode (-) Short Leg", to: "Breadboard Blue (-) Ground Rail", wireOrPolarityNote: "Flat rim side to GND" },
                    { from: "Breadboard Blue (-) Ground Rail", to: "Arduino GND Pin", wireOrPolarityNote: "Black Ground Return Wire" },
                  ]).map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#090D16",
                        border: "1px solid #1E293B",
                        borderLeft: "4px solid #38BDF8",
                        borderRadius: "10px",
                        padding: "0.85rem 1rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", fontSize: "0.88rem", fontWeight: 800, color: "#F8FAFC" }}>
                        <span style={{ color: "#00F5D4" }}>{row.from}</span>
                        <span style={{ color: "#64748B" }}>➔</span>
                        <span style={{ color: "#FBBF24" }}>{row.to}</span>
                      </div>
                      {row.wireOrPolarityNote && (
                        <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.3rem" }}>
                          📌 {row.wireOrPolarityNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Interactive Checkable Build Steps */}
              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.35rem" }}>
                <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "1.1rem", fontWeight: 900, color: "#00F5D4", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <CheckCircle2 size={18} /> Step-by-Step Lab Assembly Checklist
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {(matchedLesson.physicalBuildPack?.assemblyAndPowerUpSteps || matchedLesson.activity.steps).map(
                    (step, sIdx) => {
                      const isDone = !!checkedSteps[sIdx];
                      return (
                        <div
                          key={sIdx}
                          onClick={() =>
                            setCheckedSteps((prev) => ({ ...prev, [sIdx]: !prev[sIdx] }))
                          }
                          style={{
                            background: isDone ? "rgba(16, 185, 129, 0.12)" : "#090D16",
                            border: `1px solid ${isDone ? "#10B981" : "#1E293B"}`,
                            borderRadius: "10px",
                            padding: "0.8rem 1rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}}
                            style={{ marginTop: "0.2rem", accentColor: "#10B981" }}
                          />
                          <span
                            style={{
                              fontSize: "0.86rem",
                              color: isDone ? "#34D399" : "#E2E8F0",
                              lineHeight: 1.5,
                              textDecoration: isDone ? "line-through" : "none",
                            }}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARDUINO C++ CODE LAB */}
          {activeTab === "code" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
              {/* Code Editor Block */}
              <div style={{ background: "#090D16", border: "1px solid #1E293B", borderRadius: "18px", overflow: "hidden" }}>
                <div
                  style={{
                    background: "#0F172A",
                    padding: "0.85rem 1.15rem",
                    borderBottom: "1px solid #1E293B",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.82rem", fontWeight: 900, color: "#FBBF24", fontFamily: "var(--font-mono)" }}>
                    RoboBEE_{deck.classCode.replace(/\s+/g, "_")}.ino
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      style={{
                        background: "#1E293B",
                        color: copiedCode ? "#10B981" : "#E2E8F0",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        padding: "0.38rem 0.75rem",
                        fontSize: "0.76rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                      {copiedCode ? "Copied!" : "Copy C++"}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadIno}
                      style={{
                        background: "#00F5D4",
                        color: "#090D16",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.38rem 0.75rem",
                        fontSize: "0.76rem",
                        fontWeight: 900,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Download size={13} /> Download .ino
                    </button>
                  </div>
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: "1.25rem",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    color: "#38BDF8",
                    fontFamily: "var(--font-mono, monospace)",
                    overflowX: "auto",
                  }}
                >
                  <code>
                    {matchedLesson.codeLab?.code ||
                      `// RoboBEE Innovators — ${deck.classCode}: ${deck.title}\nconst int LED_PIN = 8;\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_PIN, HIGH); // 5V ON\n  delay(500);                  // Wait 500ms\n  digitalWrite(LED_PIN, LOW);  // 0V OFF\n  delay(500);                  // Wait 500ms\n}`}
                  </code>
                </pre>
              </div>

              {/* Line-by-Line Code Explanations */}
              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.35rem" }}>
                <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "1.08rem", fontWeight: 900, color: "#FBBF24" }}>
                  Line-by-Line C++ Engineering Breakdown
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {(matchedLesson.codeLab?.explanations || [
                    "const int LED_PIN = 8; — Declares a named constant so Digital Pin 8 is easy to read and update.",
                    "void setup() — Runs once at boot or reset to configure pin directions.",
                    "pinMode(LED_PIN, OUTPUT); — Enables Pin 8's output driver transistor to supply 5V current.",
                    "void loop() — Repeats continuously for as long as the Arduino is powered.",
                    "digitalWrite(LED_PIN, HIGH / LOW); — Switches the pin between 5V (ON) and 0V (OFF).",
                  ]).map((exp, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#090D16",
                        border: "1px solid #1E293B",
                        borderRadius: "10px",
                        padding: "0.8rem 1rem",
                        fontSize: "0.84rem",
                        color: "#CBD5E1",
                        lineHeight: 1.5,
                      }}
                    >
                      {exp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KIT BOM & EXIT CHECK */}
          {activeTab === "kit_quiz" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {/* Kit Bill of Materials */}
              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.35rem" }}>
                <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "1.08rem", fontWeight: 900, color: "#00F5D4" }}>
                  Required Hardware Kit Components ({deck.kitComponents.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {deck.kitComponents.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#090D16",
                        border: "1px solid #1E293B",
                        borderRadius: "10px",
                        padding: "0.8rem 1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#FFFFFF" }}>{item.name}</div>
                        <div style={{ fontSize: "0.76rem", color: "#94A3B8" }}>{item.spec}</div>
                      </div>
                      <span
                        style={{
                          background: "rgba(0, 245, 212, 0.15)",
                          color: "#00F5D4",
                          border: "1px solid #00F5D4",
                          borderRadius: "999px",
                          padding: "0.2rem 0.65rem",
                          fontSize: "0.76rem",
                          fontWeight: 900,
                        }}
                      >
                        Qty: {item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exit Check Reflection */}
              <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "18px", padding: "1.35rem" }}>
                <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "1.08rem", fontWeight: 900, color: "#FBBF24" }}>
                  Class Exit Check &amp; Reflection (+100 RoboXP)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {matchedLesson.exitTicket.map((ticket, qIdx) => (
                    <div
                      key={qIdx}
                      style={{
                        background: "#090D16",
                        border: "1px solid #1E293B",
                        borderRadius: "12px",
                        padding: "0.9rem",
                      }}
                    >
                      <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#F8FAFC", marginBottom: "0.5rem" }}>
                        <span style={{ color: "#FBBF24", marginRight: "0.4rem" }}>Q{qIdx + 1}:</span>
                        {ticket.question}
                      </div>
                      <input
                        type="text"
                        value={quizAnswers[qIdx] || ""}
                        onChange={(e) =>
                          setQuizAnswers((prev) => ({ ...prev, [qIdx]: e.target.value }))
                        }
                        placeholder="Write your engineering explanation..."
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem",
                          borderRadius: "8px",
                          background: "#0F172A",
                          border: "1px solid #334155",
                          color: "#FFFFFF",
                          fontSize: "0.82rem",
                        }}
                      />
                      <div style={{ marginTop: "0.45rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedRubric((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#38BDF8",
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          {revealedRubric[qIdx] ? "Hide Sample Reasoning" : "Show Model Reasoning"}
                        </button>
                      </div>
                      {revealedRubric[qIdx] && (
                        <div
                          style={{
                            marginTop: "0.45rem",
                            padding: "0.55rem 0.75rem",
                            background: "rgba(16, 185, 129, 0.12)",
                            borderLeft: "3px solid #10B981",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            color: "#34D399",
                          }}
                        >
                          {ticket.rubricOrSampleReasoning}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Student Attribution & Submit Action */}
                  <div
                    style={{
                      background: "#090D16",
                      border: "1px solid #1E293B",
                      borderRadius: "14px",
                      padding: "1.1rem 1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                          Student Name / Call-Sign
                        </label>
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          style={{
                            width: "100%",
                            padding: "0.55rem 0.75rem",
                            borderRadius: "8px",
                            background: "#0F172A",
                            border: "1px solid #334155",
                            color: "#FFFFFF",
                            fontSize: "0.82rem",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 800, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                          Student Email / ID
                        </label>
                        <input
                          type="email"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="e.g. student@robobee.academy"
                          style={{
                            width: "100%",
                            padding: "0.55rem 0.75rem",
                            borderRadius: "8px",
                            background: "#0F172A",
                            border: "1px solid #334155",
                            color: "#FFFFFF",
                            fontSize: "0.82rem",
                          }}
                        />
                      </div>
                    </div>

                    {submittedSuccess ? (
                      <div
                        style={{
                          padding: "0.9rem 1.1rem",
                          borderRadius: "10px",
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid #10B981",
                          color: "#34D399",
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.75rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <CheckCircle2 size={18} color="#10B981" />
                          <span>
                            Exit Check Submitted Successfully (+100 RoboXP)! Reflection logged for{" "}
                            <strong>{studentName || "Student"}</strong>.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSubmittedSuccess(false)}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            background: "#0F172A",
                            border: "1px solid #10B981",
                            color: "#FFFFFF",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Submit Another
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true);
                          try {
                            if (onSubmitExitTicket) {
                              await onSubmitExitTicket(quizAnswers, {
                                studentName: studentName.trim() || "Student Member",
                                studentEmail: studentEmail.trim() || "student@robobee.academy",
                              });
                            } else {
                              // Local storage fallback
                              const newSub = {
                                id: `sub-local-${Date.now()}`,
                                classCode: deck.classCode,
                                lessonId: deck.id,
                                userId: studentName.trim() || "Student Member",
                                userEmail: studentEmail.trim() || "student@robobee.academy",
                                answers: quizAnswers,
                                submittedAt: new Date().toISOString(),
                              };
                              try {
                                const stored = JSON.parse(
                                  localStorage.getItem("robobee_curriculum_submissions_v1") || "[]"
                                );
                                localStorage.setItem(
                                  "robobee_curriculum_submissions_v1",
                                  JSON.stringify([newSub, ...stored])
                                );
                              } catch {}
                            }
                            setSubmittedSuccess(true);
                          } catch (err) {
                            console.error("Failed to submit exit ticket:", err);
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        style={{
                          background: "linear-gradient(135deg, #F5B800 0%, #D97706 100%)",
                          color: "#090D16",
                          border: "none",
                          borderRadius: "12px",
                          padding: "0.8rem 1.4rem",
                          fontSize: "0.92rem",
                          fontWeight: 900,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          boxShadow: "0 4px 15px rgba(245, 184, 0, 0.3)",
                        }}
                      >
                        <Sparkles size={16} />
                        {submitting ? "Submitting Reflection..." : "Submit Student Exit Check (+100 RoboXP)"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
