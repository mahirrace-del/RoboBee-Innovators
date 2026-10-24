"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArduinoUnoPinout } from "@/components/curriculum/ArduinoUnoPinout";
import {
  X,
  BookOpen,
  Cpu,
  ShieldAlert,
  Layers,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Search,
  Zap,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";

export interface CustomFieldGuideEntry {
  id: string;
  title: string;
  category: "Safety Rule" | "Pinout Note" | "Sensor Tip" | "Code Snippet" | "Bench Protocol";
  content: string;
  codeSnippet?: string;
  author: string;
  updatedAt: string;
}

const DEFAULT_LAB_UPDATES: CustomFieldGuideEntry[] = [
  {
    id: "update-01",
    title: "HC-SR04 Echo Pin 5V-to-3.3V Voltage Divider Protection",
    category: "Pinout Note",
    content: "When interfacing HC-SR04 ultrasonic sensors with 3.3V microcontrollers (ESP32 / Raspberry Pi Pico), always use a 1kΩ / 2kΩ resistor divider on the Echo output pin to step down 5V return pulses to a safe 3.3V logic level.",
    codeSnippet: "// Voltage Divider Calculation:\n// Vout = Vin * (R2 / (R1 + R2)) = 5V * (2000 / (1000 + 2000)) = 3.33V",
    author: "RoboBEE Lead Instructor",
    updatedAt: "2026-10-22",
  },
  {
    id: "update-02",
    title: "L298N Dual Motor Driver Star-Ground Protocol",
    category: "Safety Rule",
    content: "Always tie the Arduino GND and motor battery GND to a common star point on the L298N terminal block. Disconnecting logic GND while motor power is applied causes floating inputs and uncontrolled motor runaway.",
    codeSnippet: "// Rule: Logic GND and Battery GND MUST be unified before connecting VMS (7-12V).",
    author: "RoboBEE Lead Instructor",
    updatedAt: "2026-10-23",
  },
  {
    id: "update-03",
    title: "Servo Inrush Current & Decoupling Capacitor Rule",
    category: "Bench Protocol",
    content: "SG90 servos draw up to 800mA stall current during rapid position sweeps. Place a 100µF–470µF electrolytic capacitor across 5V and GND rail on the servo power bus to prevent Arduino MCU brownouts.",
    codeSnippet: "// Brownout symptom: Microcontroller unexpectedly resets to setup() mid-sweep.",
    author: "RoboBEE Hardware Lab",
    updatedAt: "2026-10-24",
  },
];

interface FieldGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "pinout" | "safety" | "components" | "cheatsheet" | "updates";
}

export function FieldGuideModal({
  isOpen,
  onClose,
  initialTab = "pinout",
}: FieldGuideModalProps) {
  const [activeTab, setActiveTab] = useState<
    "pinout" | "safety" | "components" | "cheatsheet" | "updates"
  >(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  // Custom Field Guide Updates state with LocalStorage persistence
  const [customEntries, setCustomEntries] = useState<CustomFieldGuideEntry[]>(DEFAULT_LAB_UPDATES);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formCategory, setFormCategory] = useState<CustomFieldGuideEntry["category"]>("Bench Protocol");
  const [formContent, setFormContent] = useState<string>("");
  const [formCode, setFormCode] = useState<string>("");
  const [formAuthor, setFormAuthor] = useState<string>("RoboBEE Instructor");

  // Load custom entries from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("robobee_field_guide_custom_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomEntries(parsed);
        }
      }
    } catch {}
  }, []);

  const saveCustomEntries = (entries: CustomFieldGuideEntry[]) => {
    setCustomEntries(entries);
    try {
      localStorage.setItem("robobee_field_guide_custom_v1", JSON.stringify(entries));
    } catch {}
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingEntryId) {
      const updated = customEntries.map((item) =>
        item.id === editingEntryId
          ? {
              ...item,
              title: formTitle.trim(),
              category: formCategory,
              content: formContent.trim(),
              codeSnippet: formCode.trim() || undefined,
              author: formAuthor.trim() || "RoboBEE Instructor",
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : item
      );
      saveCustomEntries(updated);
      setEditingEntryId(null);
    } else {
      const newEntry: CustomFieldGuideEntry = {
        id: `fg-update-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        codeSnippet: formCode.trim() || undefined,
        author: formAuthor.trim() || "RoboBEE Instructor",
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      saveCustomEntries([newEntry, ...customEntries]);
    }

    setFormTitle("");
    setFormContent("");
    setFormCode("");
    setShowAddForm(false);
  };

  const handleEditEntry = (entry: CustomFieldGuideEntry) => {
    setEditingEntryId(entry.id);
    setFormTitle(entry.title);
    setFormCategory(entry.category);
    setFormContent(entry.content);
    setFormCode(entry.codeSnippet || "");
    setFormAuthor(entry.author);
    setShowAddForm(true);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = customEntries.filter((item) => item.id !== id);
    saveCustomEntries(updated);
  };

  // Ohm's law calculator state
  const [calcVoltage, setCalcVoltage] = useState<number>(5.0);
  const [calcVf, setCalcVf] = useState<number>(2.0);
  const [calcResistor, setCalcResistor] = useState<number>(220);

  const calcCurrentMa =
    calcResistor > 0 ? ((calcVoltage - calcVf) / calcResistor) * 1000 : 999;
  const isDangerCurrent = calcCurrentMa > 30;
  const isSafeCurrent = calcCurrentMa >= 8 && calcCurrentMa <= 22;

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 14, 23, 0.88)",
        backdropFilter: "blur(14px)",
        zIndex: 99992,
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
          maxWidth: "1180px",
          height: "90vh",
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
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(245, 184, 0, 0.15)",
                border: "1px solid #F5B800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={20} color="#F5B800" />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#F5B800",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                ROBOBEE BENCH REFERENCE &amp; FIELD GUIDE
              </div>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                Arduino Hardware &amp; Engineering Field Guide
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Link
              href="/dashboard/curriculum/reference"
              target="_blank"
              style={{
                padding: "0.45rem 0.8rem",
                borderRadius: "8px",
                background: "#1E2533",
                border: "1px solid #2E374B",
                color: "#E2E8F0",
                fontSize: "0.76rem",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Open Full Guide <ExternalLink size={13} color="#F5B800" />
            </Link>
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

        {/* 4 Interactive Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            background: "#161B26",
            borderBottom: "1px solid #2E374B",
            padding: "0.5rem 1.6rem",
            gap: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("pinout")}
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "pinout" ? "#F5B800" : "transparent"}`,
              background: activeTab === "pinout" ? "#1E2533" : "transparent",
              color: activeTab === "pinout" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <Cpu size={15} /> 1. Arduino Pinout Map
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("safety")}
            style={{
              padding: "0.6rem 0.8rem",
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
              gap: "0.4rem",
            }}
          >
            <ShieldAlert size={15} /> 2. Circuit Safety &amp; Ohm&apos;s Law
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("components")}
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "components" ? "#F5B800" : "transparent"}`,
              background: activeTab === "components" ? "#1E2533" : "transparent",
              color: activeTab === "components" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <Layers size={15} /> 3. Sensors &amp; Modules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cheatsheet")}
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "cheatsheet" ? "#F5B800" : "transparent"}`,
              background: activeTab === "cheatsheet" ? "#1E2533" : "transparent",
              color: activeTab === "cheatsheet" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <Code2 size={15} /> 4. Arduino C++ Cheatsheet
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("updates")}
            style={{
              padding: "0.6rem 0.8rem",
              borderRadius: "8px",
              border: `1px solid ${activeTab === "updates" ? "#F5B800" : "transparent"}`,
              background: activeTab === "updates" ? "#1E2533" : "transparent",
              color: activeTab === "updates" ? "#F5B800" : "#94A3B8",
              fontSize: "0.8rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <Edit3 size={15} /> 5. Lab Notes &amp; Updates ({customEntries.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.6rem" }}>
          {/* TAB 1: PINOUT MAP */}
          {activeTab === "pinout" && (
            <div>
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "12px",
                  padding: "0.9rem 1.2rem",
                  marginBottom: "1.2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <strong style={{ color: "#FFFFFF", fontSize: "0.92rem" }}>
                    ATmega328P Microcontroller Architecture
                  </strong>
                  <p style={{ margin: "0.2rem 0 0 0", color: "#94A3B8", fontSize: "0.78rem" }}>
                    Click any pin on the interactive board below to view voltage limits, PWM capabilities (~), and hardware precautions.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
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
                    14 Digital I/O (6 PWM)
                  </span>
                  <span
                    style={{
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38BDF8",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                    }}
                  >
                    6 Analog In (A0–A5)
                  </span>
                </div>
              </div>

              {/* Render Embed of ArduinoUnoPinout */}
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "14px",
                  padding: "1rem",
                }}
              >
                <ArduinoUnoPinout />
              </div>
            </div>
          )}

          {/* TAB 2: SAFETY & OHM'S LAW */}
          {activeTab === "safety" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Ohm's Law Live Calculator */}
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "14px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                  <Zap size={18} color="#F5B800" />
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800 }}>
                    Live LED Current &amp; Ohm&apos;s Law Calculator
                  </h3>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700, marginBottom: "0.3rem" }}>
                      Supply Voltage (Vcc): {calcVoltage.toFixed(1)}V
                    </label>
                    <input
                      type="range"
                      min="3.0"
                      max="12.0"
                      step="0.5"
                      value={calcVoltage}
                      onChange={(e) => setCalcVoltage(parseFloat(e.target.value))}
                      style={{ width: "100%", accentColor: "#F5B800" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700, marginBottom: "0.3rem" }}>
                      LED Forward Voltage (Vf)
                    </label>
                    <select
                      value={calcVf}
                      onChange={(e) => setCalcVf(parseFloat(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "6px",
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        color: "#FFFFFF",
                        fontSize: "0.8rem",
                      }}
                    >
                      <option value="2.0">Red LED (2.0V)</option>
                      <option value="2.1">Yellow / Amber LED (2.1V)</option>
                      <option value="2.2">Green LED (2.2V)</option>
                      <option value="3.2">Blue LED (3.2V)</option>
                      <option value="3.2">White LED (3.2V)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#94A3B8", fontWeight: 700, marginBottom: "0.3rem" }}>
                      Resistor: {calcResistor} Ω
                    </label>
                    <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.2rem" }}>
                      {[150, 220, 330, 470, 1000].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setCalcResistor(r)}
                          style={{
                            padding: "0.3rem 0.5rem",
                            borderRadius: "6px",
                            border: `1px solid ${calcResistor === r ? "#F5B800" : "#2E374B"}`,
                            background: calcResistor === r ? "rgba(245, 184, 0, 0.2)" : "#161B26",
                            color: calcResistor === r ? "#F5B800" : "#CBD5E1",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {r}Ω
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Formula Result Banner */}
                <div
                  style={{
                    background: isDangerCurrent
                      ? "rgba(239, 68, 68, 0.15)"
                      : isSafeCurrent
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(245, 184, 0, 0.15)",
                    border: `1px solid ${
                      isDangerCurrent ? "#EF4444" : isSafeCurrent ? "#10B981" : "#F5B800"
                    }`,
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 700 }}>
                      CALCULATED PIN CURRENT (I = (Vcc - Vf) / R)
                    </div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 900,
                        color: isDangerCurrent
                          ? "#EF4444"
                          : isSafeCurrent
                          ? "#10B981"
                          : "#F5B800",
                      }}
                    >
                      {calcCurrentMa.toFixed(1)} mA
                    </div>
                  </div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                    {isDangerCurrent ? (
                      <span style={{ color: "#EF4444", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <AlertTriangle size={15} /> DANGER: Exceeds 30mA! Risk of burning ATmega328P pin.
                      </span>
                    ) : isSafeCurrent ? (
                      <span style={{ color: "#10B981" }}>
                        ✓ OPTIMAL: Safe, bright, reliable operation (10–20mA).
                      </span>
                    ) : (
                      <span style={{ color: "#F5B800" }}>
                        Dim / Low Current ({calcCurrentMa.toFixed(1)}mA).
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5 Golden Engineering Safety Rules */}
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "14px",
                  padding: "1.25rem",
                }}
              >
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 800 }}>
                  5 Golden Rules of RoboBEE Circuit Safety
                </h3>

                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    {
                      num: "01",
                      title: "Always Use a Current Limiting Resistor for LEDs",
                      desc: "LEDs have negligible internal resistance when forward-biased. Connecting an LED directly between 5V and GND without a 220Ω resistor will cause an overcurrent cascade that destroys the LED and damages the microcontroller pin.",
                    },
                    {
                      num: "02",
                      title: "Never Connect 5V Directly to GND (Dead Short)",
                      desc: "A direct copper path between power and ground draws maximum current, tripping the USB polyfuse on your computer or frying the 5V onboard linear voltage regulator (AMS1117).",
                    },
                    {
                      num: "03",
                      title: "Maximum Current: 20mA Recommended (40mA Max)",
                      desc: "Each ATmega328P GPIO pin can source or sink up to 20mA safely. Total microcontroller current across all pins must not exceed 200mA.",
                    },
                    {
                      num: "04",
                      title: "Common Ground Reference (GND Tie)",
                      desc: "When powering high-current motors, servos, or sensors from an external battery pack, always connect the external battery ground (black) to the Arduino GND pin so signal logic shares a unified 0V reference.",
                    },
                    {
                      num: "05",
                      title: "Disconnect USB / Power Before Rewiring",
                      desc: "Never plug or pull jumper wires, chips, or motor leads while the Arduino board is powered. Unplug the USB cable, make circuit changes, verify wiring, and then reconnect.",
                    },
                  ].map((rule) => (
                    <div
                      key={rule.num}
                      style={{
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        borderRadius: "10px",
                        padding: "0.85rem 1rem",
                        display: "flex",
                        gap: "0.85rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(245, 184, 0, 0.15)",
                          color: "#F5B800",
                          borderRadius: "8px",
                          padding: "0.25rem 0.5rem",
                          fontWeight: 900,
                          fontSize: "0.8rem",
                        }}
                      >
                        {rule.num}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#FFFFFF" }}>
                          {rule.title}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.2rem", lineHeight: 1.45 }}>
                          {rule.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPONENTS & SENSORS */}
          {activeTab === "components" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
              {[
                {
                  name: "Solderless Breadboard (400 Tie-Points)",
                  role: "Prototyping Bus",
                  specs: "Vertical terminal strips (5 tied holes) + 2 horizontal power rails (+ / -)",
                  pins: "Power rails: Red (+5V), Blue/Black (GND). Center trench isolates dual-in-line IC pins.",
                  tip: "Never insert a wire across the center divider expecting it to connect—the divider separates left and right sides.",
                },
                {
                  name: "Ultrasonic Sonar Sensor (HC-SR04)",
                  role: "Distance / Range Finder",
                  specs: "2cm to 400cm range • 15° beam angle • 5V DC supply",
                  pins: "VCC -> 5V, GND -> GND, Trig -> Digital Pin (10µs pulse), Echo -> Digital Pin (pulseIn)",
                  tip: "Distance in cm = (pulse duration in microseconds * 0.0343) / 2.",
                },
                {
                  name: "L298N Dual H-Bridge Motor Driver",
                  role: "High-Power Actuation",
                  specs: "Up to 2A per channel • Operates up to 35V DC • Independent directional H-bridges",
                  pins: "12V & GND -> External Battery, IN1/IN2 -> Motor A Direction, ENA -> PWM Speed (Pin ~9)",
                  tip: "Remove 5V regulator jumper if supplying >12V to motor terminals.",
                },
                {
                  name: "TowerPro SG90 Micro Servo",
                  role: "Precision Angle Positioning",
                  specs: "0° to 180° rotation • 1.8 kg-cm torque • 50Hz PWM control",
                  pins: "Brown -> GND, Red -> 5V, Orange -> PWM Signal (Pin ~9 or ~10)",
                  tip: "Use the Servo.h library: myServo.attach(9); myServo.write(90);",
                },
                {
                  name: "TCRT5000 IR Reflectance Sensor",
                  role: "Line Tracking & Edge Detection",
                  specs: "Infrared LED + Phototransistor • Onboard LM393 comparator with sensitivity trimpot",
                  pins: "VCC -> 5V, GND -> GND, DO -> Digital Pin, AO -> Analog Pin (optional continuous read)",
                  tip: "White floor reflects IR (phototransistor turns on = LOW), black tape absorbs IR (HIGH).",
                },
                {
                  name: "10kΩ Rotary Potentiometer",
                  role: "Analog Sensor / Variable Voltage Divider",
                  specs: "10,000Ω total resistance • Linear taper • 0V to 5V analog sweep",
                  pins: "Pin 1 -> GND, Pin 2 (Wiper) -> Analog In (A0), Pin 3 -> 5V",
                  tip: "Arduino ADC converts 0V–5V into values from 0 to 1023 (10-bit resolution).",
                },
              ].map((comp, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    borderRadius: "12px",
                    padding: "1.1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#FFFFFF" }}>
                      {comp.name}
                    </div>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "6px",
                        background: "rgba(245, 184, 0, 0.15)",
                        color: "#F5B800",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                      }}
                    >
                      {comp.role}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                    <strong>Specs:</strong> {comp.specs}
                  </div>

                  <div
                    style={{
                      background: "#161B26",
                      borderRadius: "8px",
                      padding: "0.5rem 0.7rem",
                      fontSize: "0.75rem",
                      color: "#38BDF8",
                    }}
                  >
                    <strong>Pinout:</strong> {comp.pins}
                  </div>

                  <div style={{ fontSize: "0.75rem", color: "#CBD5E1", fontStyle: "italic" }}>
                    💡 <strong>Bench Tip:</strong> {comp.tip}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ARDUINO C++ CHEATSHEET */}
          {activeTab === "cheatsheet" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  key: "blink_millis",
                  title: "Non-Blocking Blinking (millis() Pattern)",
                  desc: "Avoid using delay() in real robotics! delay() freezes the CPU, preventing sonar or sensors from reading.",
                  code: `const int LED_PIN = 13;
unsigned long prevTime = 0;
const long INTERVAL = 500; // ms
bool ledState = LOW;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  unsigned long now = millis();
  if (now - prevTime >= INTERVAL) {
    prevTime = now;
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState);
  }
  // Other robot code can execute immediately here!
}`,
                },
                {
                  key: "sonar_read",
                  title: "Ultrasonic HC-SR04 Measurement Routine",
                  desc: "Sends a 10µs trigger pulse and measures round-trip sound echo duration.",
                  code: `const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  if (duration == 0) return 999.0; // Out of range
  return (duration * 0.0343) / 2.0;
}`,
                },
                {
                  key: "state_machine",
                  title: "Robotics Finite State Machine (FSM)",
                  desc: "The universal architecture for autonomous robots navigating mazes or following lines.",
                  code: `enum RobotState { IDLE, DRIVE_FORWARD, AVOID_OBSTACLE, REVERSE };
RobotState currentState = IDLE;

void loop() {
  float distance = readDistanceCm();

  switch (currentState) {
    case IDLE:
      if (startButtonPressed()) currentState = DRIVE_FORWARD;
      break;
    case DRIVE_FORWARD:
      if (distance < 15.0) currentState = AVOID_OBSTACLE;
      else setMotorSpeed(180, 180);
      break;
    case AVOID_OBSTACLE:
      spinRight();
      delay(350);
      currentState = DRIVE_FORWARD;
      break;
  }
}`,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    borderRadius: "12px",
                    padding: "1.1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#FFFFFF" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#94A3B8" }}>
                        {item.desc}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyCode(item.code, item.key)}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "6px",
                        background: copiedCodeKey === item.key ? "#10B981" : "#161B26",
                        border: "1px solid #2E374B",
                        color: copiedCodeKey === item.key ? "#090D16" : "#E2E8F0",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {copiedCodeKey === item.key ? (
                        <>
                          <Check size={13} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>

                  <pre
                    style={{
                      background: "#0F172A",
                      border: "1px solid #1E293B",
                      borderRadius: "8px",
                      padding: "0.85rem",
                      margin: 0,
                      color: "#FBBF24",
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      overflowX: "auto",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.code}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: LAB NOTES & CUSTOM UPDATES (EDIT & UPDATE FIELD GUIDE) */}
          {activeTab === "updates" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Top Action Bar */}
              <div
                style={{
                  background: "#1E2533",
                  border: "1px solid #2E374B",
                  borderRadius: "14px",
                  padding: "1.1rem 1.4rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.18rem 0.55rem",
                        borderRadius: "6px",
                        background: "rgba(245, 184, 0, 0.15)",
                        border: "1px solid rgba(245, 184, 0, 0.35)",
                        color: "#F5B800",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                      }}
                    >
                      LIVE CURRICULUM UPDATES
                    </span>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF" }}>
                      Lab Bench Notes &amp; Field Guide Updates
                    </h3>
                  </div>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#94A3B8", fontSize: "0.82rem" }}>
                    Add, edit, and maintain custom hardware pinouts, circuit safety memos, or sensor tips.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingEntryId(null);
                    setFormTitle("");
                    setFormCategory("Bench Protocol");
                    setFormContent("");
                    setFormCode("");
                    setShowAddForm((prev) => !prev);
                  }}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    background: "#6B0F24",
                    border: "1px solid #F5B800",
                    color: "#FFFFFF",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Plus size={15} color="#F5B800" />
                  {showAddForm ? "Cancel Form" : "Add Lab Update"}
                </button>
              </div>

              {/* Add / Edit Entry Form */}
              {showAddForm && (
                <form
                  onSubmit={handleSaveEntry}
                  style={{
                    background: "#1E2533",
                    border: "1px solid #F5B800",
                    borderRadius: "14px",
                    padding: "1.25rem 1.4rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.9rem",
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#F5B800" }}>
                    {editingEntryId ? "✏️ Edit Field Guide Entry" : "+ Create New Field Guide Entry"}
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.85rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                        Entry Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. L298N Motor Driver Star-Ground Rule"
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem",
                          borderRadius: "8px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#FFFFFF",
                          fontSize: "0.82rem",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                        Category
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem",
                          borderRadius: "8px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#FFFFFF",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                        }}
                      >
                        <option value="Pinout Note">Pinout Note</option>
                        <option value="Safety Rule">Safety Rule</option>
                        <option value="Sensor Tip">Sensor Tip</option>
                        <option value="Code Snippet">Code Snippet</option>
                        <option value="Bench Protocol">Bench Protocol</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                      Explanation &amp; Technical Detail *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Detailed engineering instruction, pin connections, or safety warnings..."
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        color: "#FFFFFF",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#CBD5E1", marginBottom: "0.3rem" }}>
                      Optional Code or Wiring Snippet
                    </label>
                    <textarea
                      rows={2}
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      placeholder="// C++ snippet, formula, or pin connection..."
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        color: "#FBBF24",
                        fontSize: "0.78rem",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ width: "240px" }}>
                      <label style={{ display: "block", fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.2rem" }}>
                        Author
                      </label>
                      <input
                        type="text"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="Instructor Name"
                        style={{
                          width: "100%",
                          padding: "0.45rem 0.65rem",
                          borderRadius: "6px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#CBD5E1",
                          fontSize: "0.78rem",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingEntryId(null);
                        }}
                        style={{
                          padding: "0.5rem 0.9rem",
                          borderRadius: "8px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#CBD5E1",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: "0.5rem 1.1rem",
                          borderRadius: "8px",
                          background: "#10B981",
                          border: "none",
                          color: "#090D16",
                          fontSize: "0.8rem",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        {editingEntryId ? "Save Changes" : "Publish Update"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Entries Grid */}
              <div style={{ display: "grid", gap: "0.85rem" }}>
                {customEntries
                  .filter((entry) => {
                    const q = searchQuery.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      entry.title.toLowerCase().includes(q) ||
                      entry.content.toLowerCase().includes(q) ||
                      entry.category.toLowerCase().includes(q)
                    );
                  })
                  .map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        background: "#1E2533",
                        border: "1px solid #2E374B",
                        borderLeft: "4px solid #F5B800",
                        borderRadius: "12px",
                        padding: "1.1rem 1.35rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.55rem",
                              borderRadius: "6px",
                              background: "rgba(245, 184, 0, 0.15)",
                              border: "1px solid rgba(245, 184, 0, 0.3)",
                              color: "#F5B800",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                            }}
                          >
                            {entry.category}
                          </span>
                          <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                            {entry.title}
                          </h4>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                          <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                            {entry.author} • {entry.updatedAt}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEditEntry(entry)}
                            title="Edit entry"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#94A3B8",
                              cursor: "pointer",
                              padding: "0.2rem",
                            }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEntry(entry.id)}
                            title="Delete entry"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#F87171",
                              cursor: "pointer",
                              padding: "0.2rem",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p style={{ margin: 0, fontSize: "0.84rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                        {entry.content}
                      </p>

                      {entry.codeSnippet && (
                        <div style={{ position: "relative" }}>
                          <pre
                            style={{
                              background: "#0F172A",
                              border: "1px solid #1E293B",
                              borderRadius: "8px",
                              padding: "0.75rem",
                              margin: 0,
                              color: "#FBBF24",
                              fontFamily: "monospace",
                              fontSize: "0.76rem",
                              overflowX: "auto",
                              lineHeight: 1.45,
                            }}
                          >
                            {entry.codeSnippet}
                          </pre>
                          <button
                            type="button"
                            onClick={() => copyCode(entry.codeSnippet!, entry.id)}
                            style={{
                              position: "absolute",
                              right: "8px",
                              top: "8px",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "6px",
                              background: "#1E2533",
                              border: "1px solid #2E374B",
                              color: "#E2E8F0",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            {copiedCodeKey === entry.id ? (
                              <>
                                <Check size={11} color="#10B981" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={11} /> Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
