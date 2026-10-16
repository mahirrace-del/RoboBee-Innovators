"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./projectorView.module.css";
import { RoboticsLesson } from "@/lib/curriculumData";
import { ArduinoUnoPinout } from "./ArduinoUnoPinout";
import { 
  CheckCircle, Shield, AlertTriangle, Cpu, Zap, 
  Eye, Award, BookOpen, ChevronDown, ChevronUp, CheckSquare, 
  Activity, ExternalLink, Sparkles, Target
} from "lucide-react";

interface Class1WorkshopDeckProps {
  lesson: RoboticsLesson;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  fontScale: number;
}

export function Class1WorkshopDeck({
  lesson,
  currentSlide,
  setCurrentSlide,
  fontScale
}: Class1WorkshopDeckProps) {
  // ---------------------------------------------------------------------------
  // SLIDE 2: Real-World Domains State
  // ---------------------------------------------------------------------------
  const [selectedDomainIdx, setSelectedDomainIdx] = useState<number>(0);

  // ---------------------------------------------------------------------------
  // SLIDE 3: Robot or Not? State
  // ---------------------------------------------------------------------------
  const [revealedVerdicts, setRevealedVerdicts] = useState<{ [key: number]: boolean }>({});
  const [userGuesses, setUserGuesses] = useState<{ [key: number]: "robot" | "not" }>({});

  const toggleVerdict = (idx: number) => {
    setRevealedVerdicts(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const setGuess = (idx: number, guess: "robot" | "not") => {
    setUserGuesses(prev => ({ ...prev, [idx]: guess }));
  };

  // ---------------------------------------------------------------------------
  // SLIDE 4: Sense-Decide-Act Stage Selector
  // ---------------------------------------------------------------------------
  const [activeStage, setActiveStage] = useState<"all" | "sense" | "decide" | "act" | "feedback">("all");

  // ---------------------------------------------------------------------------
  // SLIDE 5: Kit Gallery Filter
  // ---------------------------------------------------------------------------
  const [galleryFilter, setGalleryFilter] = useState<string>("ALL");
  const [selectedPartIdx, setSelectedPartIdx] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // SLIDE 6: Board Tour Zone Selector
  // ---------------------------------------------------------------------------
  const [activeBoardZone, setActiveBoardZone] = useState<number>(4); // default ATmega328P

  // ---------------------------------------------------------------------------
  // SLIDE 7: Breadboard & LED Anatomy View Mode
  // ---------------------------------------------------------------------------
  const [breadboardView, setBreadboardView] = useState<"surface" | "xray">("surface");

  // ---------------------------------------------------------------------------
  // SLIDE 9: Partner Pre-Power Safety Checklist
  // ---------------------------------------------------------------------------
  const [safetyChecks, setSafetyChecks] = useState<boolean[]>([false, false, false, false]);

  const toggleSafetyCheck = (idx: number) => {
    setSafetyChecks(prev => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  const allSafetyChecked = safetyChecks.every(Boolean);

  // ---------------------------------------------------------------------------
  // SLIDE 10: Code Walkthrough Active Block
  // ---------------------------------------------------------------------------
  const [activeCodeBlockIdx, setActiveCodeBlockIdx] = useState<number>(0);

  // ---------------------------------------------------------------------------
  // SLIDE 11: Live Timing Simulator State
  // ---------------------------------------------------------------------------
  const [simOnTime, setSimOnTime] = useState<number>(1000);
  const [simOffTime, setSimOffTime] = useState<number>(1000);
  const [simRunning, setSimRunning] = useState<boolean>(true);
  const [simLedState, setSimLedState] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>("Standard Blink (1000/1000ms)");

  // Synchronized simulation timer
  useEffect(() => {
    if (!simRunning) return;
    let timeout: NodeJS.Timeout;

    if (activePreset === "Cardiac Rhythm / Heartbeat (Double Pulse)") {
      // Custom double pulse sequence: 150ms ON, 150ms OFF, 150ms ON, 550ms OFF
      const seq = [
        { on: true, ms: 150 },
        { on: false, ms: 150 },
        { on: true, ms: 150 },
        { on: false, ms: 550 }
      ];
      let step = 0;
      const runPulse = () => {
        setSimLedState(seq[step].on);
        const curMs = seq[step].ms;
        step = (step + 1) % seq.length;
        timeout = setTimeout(runPulse, curMs);
      };
      runPulse();
      return () => clearTimeout(timeout);
    } else {
      const currentDelay = simLedState ? simOnTime : simOffTime;
      timeout = setTimeout(() => {
        setSimLedState(prev => !prev);
      }, Math.max(10, currentDelay));
      return () => clearTimeout(timeout);
    }
  }, [simRunning, simLedState, simOnTime, simOffTime, activePreset]);

  const applyPreset = (presetName: string, onMs: number, offMs: number) => {
    setActivePreset(presetName);
    setSimOnTime(onMs);
    setSimOffTime(offMs);
  };

  // ---------------------------------------------------------------------------
  // SLIDE 12: Troubleshooting, Quiz & Exit State
  // ---------------------------------------------------------------------------
  const [slide12Tab, setSlide12Tab] = useState<"troubleshoot" | "quiz" | "exit">("troubleshoot");
  const [expandedTroubleIdx, setExpandedTroubleIdx] = useState<number | null>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  // 5 Multiple-Choice Mastery Questions
  const class1QuizQuestions = [
    {
      id: "q1",
      prompt: "Why is a standard remote-controlled (RC) toy car NOT classified as an autonomous robot?",
      options: [
        "It uses DC batteries instead of AC wall power",
        "It lacks onboard environmental sensors and programmed decision logic—a human makes all decisions",
        "Its wheels move too quickly to be safely programmed",
        "It does not contain any moving mechanical parts"
      ],
      correctOptionIndex: 1,
      explanation: "A machine is only an autonomous robot if it Senses its environment, Decides using code, and Acts physically. A basic RC car relies 100% on a human holding the joystick to steer."
    },
    {
      id: "q2",
      prompt: "On a solderless breadboard, how are the holes in row 15 (columns 15a to 15e) connected underneath?",
      options: [
        "They are completely isolated from each other with zero electrical connection",
        "They are connected vertically to row 16a-16e",
        "They share a single horizontal spring metal clip beneath the plastic, but are separated from 15f-15j by the center trench",
        "They connect directly to the +5V power rail at all times"
      ],
      correctOptionIndex: 2,
      explanation: "Each 5-hole group (a-e and f-j) shares a 5-point metal spring clip. The center 0.3-inch DIP ravine separates the left and right halves."
    },
    {
      id: "q3",
      prompt: "What will happen if you connect an external 5mm red LED directly between Pin 13 and GND without a 220 Ω resistor?",
      options: [
        "The LED will blink at twice the normal speed",
        "The LED will illuminate normally and stay cool indefinitely",
        "Excessive current (>80 mA) will flow, quickly burning out the LED junction and risking microcontroller pin damage",
        "The Arduino will automatically step down the voltage without needing a resistor"
      ],
      correctOptionIndex: 2,
      explanation: "Diodes have near-zero resistance once forward-biased. Without a 220 Ω current-limiting resistor to drop 3V, current surges beyond the 40 mA pin limit, destroying the component."
    },
    {
      id: "q4",
      prompt: "In Arduino C++, what is the consequence of omitting the second delay(1000); after digitalWrite(LED_PIN, LOW)?",
      options: [
        "The sketch fails to compile with a syntax error",
        "The LED stays OFF permanently",
        "The LED appears solidly ON to human eyes because loop() immediately jumps back to HIGH in less than a microsecond",
        "The USB cable automatically disconnects"
      ],
      correctOptionIndex: 2,
      explanation: "Because loop() repeats instantly, the pin stays LOW for only ~62.5 nanoseconds before turning HIGH again. Human persistence of vision sees the light as constantly illuminated."
    },
    {
      id: "q5",
      prompt: "If your sketch sets ON_TIME_MS = 250 and OFF_TIME_MS = 250, what is the frequency and duty cycle of the blink?",
      options: [
        "Period = 250 ms, Frequency = 4 Hz, Duty Cycle = 25%",
        "Period = 500 ms, Frequency = 2 Hz, Duty Cycle = 50%",
        "Period = 1000 ms, Frequency = 1 Hz, Duty Cycle = 100%",
        "Period = 50 ms, Frequency = 20 Hz, Duty Cycle = 50%"
      ],
      correctOptionIndex: 1,
      explanation: "Total Period T = 250ms + 250ms = 500ms (0.5s). Frequency f = 1 / 0.5s = 2 Hz (2 complete cycles per second). Duty cycle = (250 / 500) * 100% = 50%."
    }
  ];

  // 12-Part Hardware Kit Data
  const kitItems = [
    {
      id: "uno",
      name: "Arduino Uno R3",
      category: "DECIDE",
      role: "Microcontroller Brain",
      specs: "ATmega328P, 16 MHz, 5V Logic, 32KB Flash, 14 Digital I/O, 6 Analog Inputs",
      safety: "Handle by PCB edges; avoid touching IC pins; store in anti-static ESD bag."
    },
    {
      id: "breadboard",
      name: "Half-Size Solderless Breadboard",
      category: "PROTOTYPE",
      role: "Circuit Prototyping Platform",
      specs: "400 tie points, 30 rows of 5-pin clips (a-e, f-j), 4 power rails (+/-), center DIP ravine",
      safety: "Never force thick component leads into clips; keep center ravine free for IC straddling."
    },
    {
      id: "led",
      name: "5mm Red Diffused LED",
      category: "ACT",
      role: "Visual Light Actuator",
      specs: "Forward Voltage: 2.0V, Max Continuous Current: 20mA, Viewing Angle: 60°",
      safety: "Strict polarity required! Anode (+) is long leg; Cathode (-) is short leg with flat rim. NEVER connect without 220Ω resistor."
    },
    {
      id: "resistor",
      name: "220 Ω Carbon Film Resistor",
      category: "PROTOTYPE",
      role: "Current-Limiting Bodyguard",
      specs: "220 Ω ±5%, 1/4 Watt, Color Code: Red-Red-Brown-Gold",
      safety: "No polarity (works in either orientation). Absorbs 3.0V drop to limit current to safe 13.6 mA."
    },
    {
      id: "jumpers",
      name: "Male-to-Male Jumper Wires",
      category: "PROTOTYPE",
      role: "Signal & Power Interconnects",
      specs: "24 AWG solid tinned core, molded flexible boots, 10cm–20cm lengths",
      safety: "Follow color coding: Red = 5V Power, Black = GND Ground, Green/Yellow = Digital Signal."
    },
    {
      id: "usb",
      name: "USB 2.0 A-to-B Data Cable",
      category: "DECIDE",
      role: "Programming & Power Link",
      specs: "Standard USB Type-A to Type-B, shielded twisted pair, 500mA @ 5V power delivery",
      safety: "Use data-capable cable (not charge-only). Unplug from PC before touching any breadboard wiring."
    },
    {
      id: "ultrasonic",
      name: "HC-SR04 Ultrasonic Sensor",
      category: "SENSE",
      role: "Echo Distance Measurement",
      specs: "Operating Voltage: 5V, Range: 2cm–400cm, Resolution: 0.3cm, 40 kHz acoustic burst",
      safety: "Keep transducer grilles clean; do not apply >5.5V to VCC pin."
    },
    {
      id: "ir",
      name: "IR Obstacle Avoidance Sensor",
      category: "SENSE",
      role: "Reflective Proximity Detection",
      specs: "Infrared emitter + photodiode pair, LM393 comparator, onboard trimmer pot, 2cm–30cm range",
      safety: "Sensitive to direct sunlight and dark absorptive surfaces; calibrate trimmer screw gently."
    },
    {
      id: "servo",
      name: "TowerPro SG90 9g Micro Servo",
      category: "ACT",
      role: "Precision Angular Positioning",
      specs: "Operating Voltage: 4.8V–6.0V, Torque: 1.8 kg-cm @ 4.8V, Rotation: 0°–180°, 50Hz PWM",
      safety: "Never manually force motor horn while powered; power from external 5V supply if driving multiple servos."
    },
    {
      id: "buzzer",
      name: "Active 5V Piezoelectric Buzzer",
      category: "ACT",
      role: "Acoustic Alert & Signal Sound",
      specs: "Operating Voltage: 4V–8V, Internal 2.3 kHz oscillating circuit, SPL: ≥85dB @ 10cm",
      safety: "Observe (+) polarity marking; remove protective sticker over sound port after unboxing."
    },
    {
      id: "battery",
      name: "9V Battery Snap with DC Barrel Jack",
      category: "POWER",
      role: "Tetherless Field Power",
      specs: "Standard 9V PP3 snap to 2.1mm center-positive barrel plug, feeds onboard 5V regulator",
      safety: "Never short 9V battery terminals; unplug barrel jack when Arduino is stored in kit box."
    },
    {
      id: "buttons",
      name: "Tactile Pushbuttons & 10kΩ Resistors",
      category: "SENSE",
      role: "User Digital Touch Input",
      specs: "6x6mm 4-pin momentary tact switch, 10kΩ pull-down resistor (Brown-Black-Orange)",
      safety: "Always use pull-down or pull-up resistor to prevent floating CMOS input pin states."
    }
  ];

  const filteredKit = galleryFilter === "ALL" 
    ? kitItems 
    : kitItems.filter(i => i.category === galleryFilter);

  // 12-Zone Board Tour Data
  const boardZones = [
    {
      title: "1. USB 2.0 Type-B Port",
      tag: "COMMUNICATION & POWER",
      desc: "Delivers regulated 5V power from your PC (up to 500mA) and carries serial UART data for flashing compiled C++ hex machine code into the ATmega328P flash memory."
    },
    {
      title: "2. 7–12V DC Barrel Jack",
      tag: "EXTERNAL POWER INPUT",
      desc: "Allows autonomous, computer-free field operation using a 9V battery or 9V-12V AC/DC wall adapter. Feeds the onboard linear voltage regulator."
    },
    {
      title: "3. 5V & 3.3V Voltage Regulators",
      tag: "POWER REGULATION",
      desc: "Low-dropout voltage regulators step down 7-12V input to a clean, stable 5.0V for the microcontroller and sensors, and 3.3V for delicate wireless/sensor modules."
    },
    {
      title: "4. 16 MHz Quartz Crystal Oscillator",
      tag: "SYSTEM HEARTBEAT",
      desc: "The precision clock that paces the microcontroller. It oscillates exactly 16,000,000 times per second, allowing deterministic instruction execution and microsecond delay accuracy."
    },
    {
      title: "5. ATmega328P 8-Bit RISC Microcontroller",
      tag: "THE ROBOT BRAIN",
      desc: "High-performance AVR 8-bit chip with 32KB ISP flash memory, 2KB SRAM, and 1KB EEPROM. Executes your compiled C++ instructions in an infinite loop."
    },
    {
      title: "6. Tactile Reset Pushbutton",
      tag: "MANUAL RESTART",
      desc: "Pulls the active-low RESET pin to GND (0V), restarting program execution from the beginning of setup() without unplugging the USB cable."
    },
    {
      title: "7. 14 Digital I/O Pins (D0–D13)",
      tag: "DIGITAL CONTROL",
      desc: "Bi-directional GPIO pins configured via pinMode(). Each can supply or sink up to 20mA (40mA absolute maximum). Pins 3, 5, 6, 9, 10, and 11 support hardware PWM output."
    },
    {
      title: "8. 6 Analog Input Pins (A0–A5)",
      tag: "ANALOG SENSING",
      desc: "Connect to the onboard 10-bit Successive Approximation ADC, converting 0V–5V continuous voltages into digital values from 0 to 1023 (4.88 mV per unit step)."
    },
    {
      title: "9. Power & Ground Rail Header",
      tag: "POWER DISTRIBUTION",
      desc: "Provides 5V, 3.3V, multiple common GND pins, and VIN (unregulated input). All circuits must return their current to one of these GND pins."
    },
    {
      title: "10. Onboard Pin 13 'L' LED",
      tag: "BUILT-IN VISUAL INDICATOR",
      desc: "A surface-mount yellow/orange LED internally hardwired through a buffer amplifier to Digital Pin 13. Flashes automatically whenever Pin 13 is driven HIGH."
    },
    {
      title: "11. TX & RX Serial Communication LEDs",
      tag: "TELEMETRY STATUS",
      desc: "Transmit (TX) and Receive (RX) LEDs flash furiously during code upload and Serial Monitor data exchange, confirming active hardware communication."
    },
    {
      title: "12. ICSP (In-Circuit Serial Programming) Header",
      tag: "LOW-LEVEL PROGRAMMING",
      desc: "A 6-pin SPI interface used for burning the Arduino bootloader directly to the ATmega328P chip using an external programmer."
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      {/* =====================================================================
          SLIDE 1: WELCOME TO ROBOBEE INNOVATORS & TODAY'S MISSION
          ===================================================================== */}
      {currentSlide === 0 && (
        <>
          <div className={styles.slideHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div className={styles.slideNumberBadge}>
                ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 1 OF 12
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ background: "rgba(245, 184, 0, 0.15)", color: "#F5B800", border: "1px solid rgba(245, 184, 0, 0.35)", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 800 }}>
                  Proposed for Classes 5–8
                </span>
                <span style={{ background: "rgba(107, 15, 36, 0.35)", color: "#fca5a5", border: "1px solid #6B0F24", padding: "0.25rem 0.75rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 800 }}>
                  ⏱ 90m Workshop Masterclass
                </span>
              </div>
            </div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>{lesson.title}</h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem", fontWeight: 600 }}>
              {lesson.promise}
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            {/* Top Row: Mission & Organization Profile */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F5B800", fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.75rem" }}>
                  <Target size={18} />
                  <span>5 Measurable Workshop Outcomes</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(lesson.outcomes || []).map((outcome, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.85rem", color: "#cbd5e1" }}>
                      <span style={{ background: "rgba(245, 184, 0, 0.2)", color: "#F5B800", borderRadius: "50%", minWidth: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800 }}>
                        {idx + 1}
                      </span>
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization Profile & Motto */}
              <div style={{ background: "linear-gradient(135deg, rgba(107, 15, 36, 0.25), rgba(11, 15, 25, 0.6))", border: "1px solid rgba(107, 15, 36, 0.5)", borderRadius: "14px", padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: "#F5B800", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                    RoboBEE Innovators Academy
                  </div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#ffffff", marginTop: "0.25rem", fontStyle: "italic" }}>
                    &ldquo;Dream. Invent. Experiment. Inspire.&rdquo;
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.5rem", lineHeight: "1.5" }}>
                    Dedicated to providing student-centered, practical STEM, coding, and robotics education. Today you build your very first physical cyber-physical control loop.
                  </p>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.75rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                  <div>📞 Hotline: <strong style={{ color: "#F5B800" }}>+880 1902-821018</strong></div>
                  <div>📍 Narayanganj Campus: Kids Den Int. Preschool, Flat 2, 75 North Chashara</div>
                </div>
              </div>
            </div>

            {/* Bottom Row: 4 Laboratory Safety Ground Rules */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(245, 184, 0, 0.2)", borderRadius: "14px", padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F5B800", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.6rem" }}>
                <Shield size={16} />
                <span>4 Mandatory Laboratory Safety &amp; Engineering Protocols</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.85rem" }}>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "8px", borderLeft: "3px solid #ef4444" }}>
                  <div style={{ color: "#fca5a5", fontWeight: 700, fontSize: "0.78rem", marginBottom: "0.25rem" }}>1. Unplug Before Wiring</div>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.4", margin: 0 }}>
                    NEVER rewire an active breadboard circuit while USB is plugged in. Always disconnect power first.
                  </p>
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "8px", borderLeft: "3px solid #F5B800" }}>
                  <div style={{ color: "#fde047", fontWeight: 700, fontSize: "0.78rem", marginBottom: "0.25rem" }}>2. Resistor Bodyguard</div>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.4", margin: 0 }}>
                    NEVER connect an LED directly to 5V. A 220 Ω resistor must absorb voltage to prevent thermal runaway.
                  </p>
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "8px", borderLeft: "3px solid #3b82f6" }}>
                  <div style={{ color: "#93c5fd", fontWeight: 700, fontSize: "0.78rem", marginBottom: "0.25rem" }}>3. Static &amp; IC Care</div>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.4", margin: 0 }}>
                    Handle the Arduino by fiberglass edges. Protect semiconductor pins from electrostatic discharge.
                  </p>
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "8px", borderLeft: "3px solid #10b981" }}>
                  <div style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "0.78rem", marginBottom: "0.25rem" }}>4. Partner Verification</div>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.4", margin: 0 }}>
                    Your bench partner must trace the circuit from Pin 13 to GND before you are cleared to connect USB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 2: WHY ROBOTICS MATTERS IN THE REAL WORLD (7 DOMAINS)
          ===================================================================== */}
      {currentSlide === 1 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 2 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Why Robotics Matters in the Real World
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Robots are not just science fiction—they solve urgent human problems across 7 vital societal sectors.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            {/* Domain Selector Pills */}
            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.4rem" }}>
              {(lesson.realWorldDomains || []).map((domain, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDomainIdx(idx)}
                  style={{
                    background: selectedDomainIdx === idx ? "#6B0F24" : "rgba(255,255,255,0.04)",
                    color: selectedDomainIdx === idx ? "#ffffff" : "#cbd5e1",
                    border: selectedDomainIdx === idx ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    padding: "0.45rem 0.85rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <span>{domain.domain}</span>
                </button>
              ))}
            </div>

            {/* Selected Domain Interactive Showcase */}
            {lesson.realWorldDomains && lesson.realWorldDomains[selectedDomainIdx] && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" }}>
                {/* Left: Domain Context & Machine Example */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ background: "rgba(245, 184, 0, 0.15)", color: "#F5B800", border: "1px solid rgba(245, 184, 0, 0.35)", padding: "0.25rem 0.65rem", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                      Sector {selectedDomainIdx + 1}: {lesson.realWorldDomains[selectedDomainIdx].domain}
                    </span>
                    <h2 style={{ fontSize: "1.45rem", color: "#ffffff", fontWeight: 800, margin: "0.6rem 0 0.35rem 0" }}>
                      {lesson.realWorldDomains[selectedDomainIdx].title}
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "#cbd5e1", lineHeight: "1.6" }}>
                      {lesson.realWorldDomains[selectedDomainIdx].description}
                    </p>
                  </div>

                  <div style={{ background: "rgba(107, 15, 36, 0.2)", border: "1px solid rgba(107, 15, 36, 0.5)", borderRadius: "10px", padding: "0.85rem", marginTop: "1rem" }}>
                    <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Sparkles size={14} /> RoboBEE Curriculum Connection
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#f1f5f9", marginTop: "0.3rem" }}>
                      Understanding the Sense-Decide-Act foundation of simple LED feedback teaches the exact control loop powering this autonomous system.
                    </div>
                  </div>
                </div>

                {/* Right: The 3 Pillars in Action for this Domain */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                    How This Machine Implements the Robotics Loop
                  </div>

                  {/* SENSE */}
                  <div style={{ background: "rgba(245, 184, 0, 0.06)", borderLeft: "4px solid #F5B800", borderRadius: "8px", padding: "0.85rem" }}>
                    <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Eye size={15} /> 1. SENSE (Physical Input)
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#e2e8f0", marginTop: "0.25rem", lineHeight: "1.5" }}>
                      {lesson.realWorldDomains[selectedDomainIdx].sense}
                    </div>
                  </div>

                  {/* DECIDE */}
                  <div style={{ background: "rgba(107, 15, 36, 0.15)", borderLeft: "4px solid #6B0F24", borderRadius: "8px", padding: "0.85rem" }}>
                    <div style={{ color: "#fca5a5", fontWeight: 800, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Cpu size={15} /> 2. DECIDE (Processing &amp; Algorithms)
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#e2e8f0", marginTop: "0.25rem", lineHeight: "1.5" }}>
                      {lesson.realWorldDomains[selectedDomainIdx].decide}
                    </div>
                  </div>

                  {/* ACT */}
                  <div style={{ background: "rgba(16, 185, 129, 0.08)", borderLeft: "4px solid #10b981", borderRadius: "8px", padding: "0.85rem" }}>
                    <div style={{ color: "#6ee7b7", fontWeight: 800, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Zap size={15} /> 3. ACT (Physical Output &amp; Motion)
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#e2e8f0", marginTop: "0.25rem", lineHeight: "1.5" }}>
                      {lesson.realWorldDomains[selectedDomainIdx].act}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 3: INTERACTIVE CLASS GAME: "ROBOT OR NOT?"
          ===================================================================== */}
      {currentSlide === 2 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 3 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Interactive Class Debate: &ldquo;Robot or Not?&rdquo;
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              A machine is only a robot if it performs ALL THREE: Sense physical environment + Decide autonomously + Act physically!
            </p>
          </div>

          <div className={styles.slideBody}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.85rem", maxHeight: "480px", overflowY: "auto", paddingRight: "0.25rem" }}>
              {(lesson.robotOrNotChallenge || []).map((card, idx) => {
                const isRevealed = revealedVerdicts[idx];
                const guess = userGuesses[idx];
                const isCorrect = guess && (
                  (guess === "robot" && card.isRobot) ||
                  (guess === "not" && !card.isRobot)
                );

                return (
                  <div 
                    key={idx}
                    style={{
                      background: isRevealed 
                        ? (card.isRobot ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)")
                        : "rgba(255,255,255,0.03)",
                      border: isRevealed
                        ? (card.isRobot ? "1px solid #10b981" : "1px solid #ef4444")
                        : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>
                          Item #{idx + 1}
                        </span>
                        {isRevealed && (
                          <span style={{
                            background: card.isRobot ? "#10b981" : "#ef4444",
                            color: "#ffffff",
                            fontSize: "0.68rem",
                            fontWeight: 900,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "10px",
                            letterSpacing: "0.5px"
                          }}>
                            {card.isRobot ? "TRUE ROBOT" : "NOT A ROBOT"}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", marginTop: "0.3rem" }}>
                        {card.item}
                      </div>
                    </div>

                    <div style={{ marginTop: "0.75rem" }}>
                      {!isRevealed ? (
                        <div>
                          <div style={{ fontSize: "0.72rem", color: "#F5B800", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Class Vote:
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem" }}>
                            <button
                              onClick={() => setGuess(idx, "robot")}
                              style={{
                                background: guess === "robot" ? "#10b981" : "rgba(255,255,255,0.06)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "0.35rem 0.5rem",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              🤖 Robot
                            </button>
                            <button
                              onClick={() => setGuess(idx, "not")}
                              style={{
                                background: guess === "not" ? "#ef4444" : "rgba(255,255,255,0.06)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "0.35rem 0.5rem",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              ⚙️ Not
                            </button>
                          </div>
                          <button
                            onClick={() => toggleVerdict(idx)}
                            style={{
                              width: "100%",
                              marginTop: "0.45rem",
                              background: "rgba(245, 184, 0, 0.15)",
                              color: "#F5B800",
                              border: "1px solid rgba(245, 184, 0, 0.3)",
                              borderRadius: "6px",
                              padding: "0.35rem 0.5rem",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              cursor: "pointer"
                            }}
                          >
                            Reveal Verdict ➔
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: "0.72rem", color: "#cbd5e1", background: "rgba(0,0,0,0.3)", padding: "0.6rem", borderRadius: "6px", lineHeight: "1.4" }}>
                          <div style={{ marginBottom: "0.35rem", color: "#F5B800", fontWeight: 700 }}>
                            {isCorrect ? "🎯 Class Prediction Correct!" : "💡 Engineering Analysis:"}
                          </div>
                          <div><strong>S:</strong> {card.senses}</div>
                          <div><strong>D:</strong> {card.decides}</div>
                          <div><strong>A:</strong> {card.acts}</div>
                          <div style={{ marginTop: "0.35rem", fontStyle: "italic", color: "#94a3b8" }}>
                            {card.verdict}
                          </div>
                          <button
                            onClick={() => toggleVerdict(idx)}
                            style={{
                              marginTop: "0.35rem",
                              background: "transparent",
                              border: "none",
                              color: "#94a3b8",
                              fontSize: "0.65rem",
                              cursor: "pointer",
                              textDecoration: "underline"
                            }}
                          >
                            Hide Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 4: THE CORE LAW OF ROBOTICS (SENSE → DECIDE → ACT)
          ===================================================================== */}
      {currentSlide === 3 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 4 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              The Universal Law of Robotics: Sense ➔ Decide ➔ Act
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Every autonomous machine on Earth and beyond executes this closed-loop feedback cycle continuously.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            {/* Interactive Stage Filter Tabs */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { id: "all", label: "Full 3-Stage Diagram" },
                { id: "sense", label: "Stage 1: SENSE (Inputs)" },
                { id: "decide", label: "Stage 2: DECIDE (Controller)" },
                { id: "act", label: "Stage 3: ACT (Outputs)" },
                { id: "feedback", label: "Closed-Loop Feedback" }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(st.id as any)}
                  style={{
                    background: activeStage === st.id ? "#6B0F24" : "rgba(255,255,255,0.04)",
                    color: activeStage === st.id ? "#ffffff" : "#cbd5e1",
                    border: activeStage === st.id ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* SVG Visual Presentation */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.25rem", alignItems: "center" }}>
              <div style={{ background: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Image
                  src="/illustrations/class1-sense-decide-act.svg"
                  alt="Sense Decide Act Engineering Architecture"
                  width={680}
                  height={380}
                  style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                />
                <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "#F5B800", fontWeight: 700 }}>
                  RoboBEE Reference Illustration — Verify Hardware Before Powering
                </div>
              </div>

              {/* Stage Context Breakdown Card */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {activeStage === "all" && (
                  <div>
                    <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "1rem", marginBottom: "0.4rem" }}>
                      The Complete Closed Feedback Loop
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: "1.6" }}>
                      A robot does not simply execute static steps like a kitchen toaster. It samples environmental energy (light, ultrasound, pressure) through sensors, computes the error between its current state and target state using the microcontroller, and drives physical actuators. The environment changes, and the loop repeats immediately!
                    </p>
                    <div style={{ marginTop: "0.75rem", background: "rgba(245, 184, 0, 0.08)", padding: "0.75rem", borderRadius: "8px", borderLeft: "3px solid #F5B800", fontSize: "0.8rem", color: "#fef3c7" }}>
                      <strong>Today&apos;s Lab Loop:</strong> You become the intelligent programmer configuring the DECIDE stage (Arduino Pin 13) to command the ACT stage (LED light emissions)!
                    </div>
                  </div>
                )}

                {activeStage === "sense" && (
                  <div>
                    <span style={{ background: "rgba(245, 184, 0, 0.15)", color: "#F5B800", padding: "0.2rem 0.5rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 800 }}>
                      STAGE 1: SENSE
                    </span>
                    <h3 style={{ fontSize: "1.15rem", color: "#ffffff", margin: "0.4rem 0" }}>Sensory Transduction</h3>
                    <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                      Sensors convert non-electrical physical phenomena into proportional electrical voltages:
                    </p>
                    <ul style={{ paddingLeft: "1.1rem", fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.6", marginTop: "0.3rem" }}>
                      <li><strong>Ultrasonic (HC-SR04):</strong> Echo time-of-flight to distance (cm)</li>
                      <li><strong>Infrared Photodiode:</strong> Reflected photons to binary LOW/HIGH</li>
                      <li><strong>Tactile Pushbutton:</strong> Mechanical spring closure to 0V/5V logic</li>
                    </ul>
                  </div>
                )}

                {activeStage === "decide" && (
                  <div>
                    <span style={{ background: "rgba(107, 15, 36, 0.3)", color: "#fca5a5", padding: "0.2rem 0.5rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 800 }}>
                      STAGE 2: DECIDE
                    </span>
                    <h3 style={{ fontSize: "1.15rem", color: "#ffffff", margin: "0.4rem 0" }}>Microcontroller Computation</h3>
                    <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                      The ATmega328P 8-bit RISC chip evaluates sensor inputs against programmatic rules stored in flash memory:
                    </p>
                    <ul style={{ paddingLeft: "1.1rem", fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.6", marginTop: "0.3rem" }}>
                      <li>Clock speed: 16,000,000 instructions per second</li>
                      <li>Executes <code>if / else</code> threshold comparison in real-time</li>
                      <li>Writes digital register values to drive GPIO pin states</li>
                    </ul>
                  </div>
                )}

                {activeStage === "act" && (
                  <div>
                    <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#6ee7b7", padding: "0.2rem 0.5rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 800 }}>
                      STAGE 3: ACT
                    </span>
                    <h3 style={{ fontSize: "1.15rem", color: "#ffffff", margin: "0.4rem 0" }}>Physical Actuation</h3>
                    <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                      Actuators convert electrical energy into physical changes in the real world:
                    </p>
                    <ul style={{ paddingLeft: "1.1rem", fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.6", marginTop: "0.3rem" }}>
                      <li><strong>LED:</strong> Electron recombination emits visible light photons</li>
                      <li><strong>DC Motor:</strong> Magnetic fields create torque and wheel rotation</li>
                      <li><strong>Servo:</strong> PWM signals hold precise angular positions (0°–180°)</li>
                      <li><strong>Buzzer:</strong> Piezoelectric crystal vibration creates sound pressure</li>
                    </ul>
                  </div>
                )}

                {activeStage === "feedback" && (
                  <div>
                    <span style={{ background: "rgba(6, 182, 212, 0.15)", color: "#67e8f9", padding: "0.2rem 0.5rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 800 }}>
                      CLOSED-LOOP FEEDBACK
                    </span>
                    <h3 style={{ fontSize: "1.15rem", color: "#ffffff", margin: "0.4rem 0" }}>Environment Response</h3>
                    <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.5" }}>
                      When actuators alter the environment (the robot moves 10 cm forward), the sensors immediately detect the new distance on the very next clock cycle. This creates a perpetual, adaptive self-correcting system!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 5: INSIDE YOUR ROBOTICS KIT (12-PART HARDWARE GALLERY)
          ===================================================================== */}
      {currentSlide === 4 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 5 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Inside Your Robotics Kit: 12-Part Hardware Inventory
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Every component on your lab bench serves an essential role in either sensing, deciding, actuating, or protecting.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "0.75rem" }}>
            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>Filter by Role:</span>
              {["ALL", "DECIDE", "SENSE", "ACT", "PROTOTYPE", "POWER"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  style={{
                    background: galleryFilter === cat ? "#6B0F24" : "rgba(255,255,255,0.04)",
                    color: galleryFilter === cat ? "#ffffff" : "#cbd5e1",
                    border: galleryFilter === cat ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "0.25rem 0.65rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 12-Item Interactive Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", maxHeight: "430px", overflowY: "auto", paddingRight: "0.25rem" }}>
              {filteredKit.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPartIdx(selectedPartIdx === idx ? null : idx)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: selectedPartIdx === idx ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <span style={{
                        background: item.category === "DECIDE" ? "rgba(107, 15, 36, 0.4)" :
                                   item.category === "SENSE" ? "rgba(245, 184, 0, 0.2)" :
                                   item.category === "ACT" ? "rgba(16, 185, 129, 0.2)" :
                                   item.category === "POWER" ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)",
                        color: item.category === "DECIDE" ? "#fca5a5" :
                               item.category === "SENSE" ? "#F5B800" :
                               item.category === "ACT" ? "#6ee7b7" :
                               item.category === "POWER" ? "#fca5a5" : "#93c5fd",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.45rem",
                        borderRadius: "8px"
                      }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#64748b" }}>#{idx + 1}</span>
                    </div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#ffffff" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#F5B800", marginTop: "0.15rem" }}>
                      {item.role}
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.35rem", lineHeight: "1.4" }}>
                      {item.specs}
                    </p>
                  </div>

                  <div style={{ marginTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.4rem" }}>
                    <div style={{ fontSize: "0.68rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <AlertTriangle size={12} />
                      <span>{item.safety}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 6: MEET THE BRAIN: INTERACTIVE ARDUINO UNO R3 BOARD TOUR
          ===================================================================== */}
      {currentSlide === 5 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 6 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Meet the Brain: Interactive Arduino Uno R3 Board Tour
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Explore the 12 functional zones of the ATmega328P microcontroller development board.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.25rem" }}>
              {/* Left: Embedded Clickable Pinout Visualizer */}
              <div style={{ background: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "0.75rem", overflow: "hidden" }}>
                <ArduinoUnoPinout />
              </div>

              {/* Right: 12-Zone Inspection Tabs & Critical Pin 13 Highlight */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "480px", overflowY: "auto" }}>
                <div style={{ background: "linear-gradient(135deg, rgba(245, 184, 0, 0.15), rgba(11, 15, 25, 0.8))", border: "1px solid #F5B800", borderRadius: "12px", padding: "0.85rem" }}>
                  <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Sparkles size={16} /> Key Revelation: Onboard Pin 13 &apos;L&apos; LED
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "#fef3c7", marginTop: "0.3rem", lineHeight: "1.4", margin: 0 }}>
                    Notice the tiny orange surface-mount LED labeled <strong>&apos;L&apos;</strong> near the digital header. It is internally hardwired through a buffer to <strong>Digital Pin 13</strong>! This allows you to verify your code logic without wiring a single breadboard component!
                  </p>
                </div>

                {/* 12-Zone Selector Tabs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {boardZones.map((z, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveBoardZone(idx)}
                      style={{
                        background: activeBoardZone === idx ? "rgba(107, 15, 36, 0.25)" : "rgba(255,255,255,0.02)",
                        border: activeBoardZone === idx ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        padding: "0.6rem 0.8rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 800, color: activeBoardZone === idx ? "#F5B800" : "#ffffff" }}>
                          {z.title}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 700 }}>
                          {z.tag}
                        </span>
                      </div>
                      {activeBoardZone === idx && (
                        <p style={{ fontSize: "0.75rem", color: "#cbd5e1", marginTop: "0.35rem", lineHeight: "1.4", margin: 0 }}>
                          {z.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 7: HOW BREADBOARDS, LEDS & RESISTORS WORK (OHM'S LAW)
          ===================================================================== */}
      {currentSlide === 6 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 7 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              How Breadboards, LEDs &amp; Resistors Work
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Master internal spring metal clip architecture, LED polarity, and Ohm&apos;s Law current limiting.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            {/* View Mode Toggle */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                onClick={() => setBreadboardView("surface")}
                style={{
                  background: breadboardView === "surface" ? "#6B0F24" : "rgba(255,255,255,0.04)",
                  color: breadboardView === "surface" ? "#ffffff" : "#cbd5e1",
                  border: breadboardView === "surface" ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                1. Breadboard Internal Clips (X-Ray View)
              </button>
              <button
                onClick={() => setBreadboardView("xray")}
                style={{
                  background: breadboardView === "xray" ? "#6B0F24" : "rgba(255,255,255,0.04)",
                  color: breadboardView === "xray" ? "#ffffff" : "#cbd5e1",
                  border: breadboardView === "xray" ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                2. LED Anatomy &amp; Ohm&apos;s Law Math
              </button>
            </div>

            {/* Display Diagram & Step-by-Step Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem", alignItems: "center" }}>
              <div style={{ background: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Image
                  src={breadboardView === "surface" ? "/illustrations/class1-breadboard-anatomy.svg" : "/illustrations/class1-led-polarity-resistor.svg"}
                  alt="Breadboard and LED Anatomy"
                  width={680}
                  height={380}
                  style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                />
                <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "#F5B800", fontWeight: 700 }}>
                  RoboBEE Reference Illustration — Verify Hardware Before Powering
                </div>
              </div>

              {/* Explanatory Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {breadboardView === "surface" ? (
                  <>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem" }}>
                      <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                        Horizontal 5-Hole Terminal Strips
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.5", margin: 0 }}>
                        Beneath columns <code>a-b-c-d-e</code> and <code>f-g-h-i-j</code>, spring-loaded metal clips connect all 5 holes in a row together. Any components inserted into holes in the same 5-hole group are electrically connected!
                      </p>
                    </div>

                    <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", padding: "1rem" }}>
                      <div style={{ color: "#fca5a5", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                        ⚠️ The Center DIP Isolation Ravine
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.5", margin: 0 }}>
                        Notice the trench running down the middle. It creates an electrical barrier between columns <code>e</code> and <code>f</code> so you can straddle ICs or components without shorting their opposite pins together!
                      </p>
                    </div>

                    <div style={{ background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "12px", padding: "1rem" }}>
                      <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                        Continuous Vertical Power Rails (+ / -)
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.5", margin: 0 }}>
                        The outer red (<code>+</code>) and blue (<code>-</code>) tracks run vertically along the edges, distributing 5V and GND along the entire board length for easy access.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem" }}>
                      <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                        LED Polarity: Anode (+) vs Cathode (-)
                      </div>
                      <ul style={{ paddingLeft: "1.1rem", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: "1.6", margin: 0 }}>
                        <li><strong>Anode (+):</strong> Longer lead wire. Connects toward Pin 13 (5V).</li>
                        <li><strong>Cathode (-):</strong> Shorter lead wire + flat collar edge. Connects toward GND (0V).</li>
                        <li><em>Reversed LED? It won&apos;t explode, but current cannot flow and it stays dark.</em></li>
                      </ul>
                    </div>

                    <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(11, 15, 25, 0.8))", border: "1px solid #10b981", borderRadius: "12px", padding: "1rem" }}>
                      <div style={{ color: "#6ee7b7", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                        Ohm&apos;s Law Current Limiting Calculation
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#ffffff", lineHeight: "1.6" }}>
                        <div>V_supply = 5.0V (Pin 13 HIGH)</div>
                        <div>V_LED = 2.0V (Red LED forward drop)</div>
                        <div>V_resistor = 5.0V - 2.0V = <strong>3.0V</strong></div>
                        <div>Target Current I = 13.6 mA = 0.0136 A</div>
                        <div style={{ color: "#F5B800", fontWeight: 800, marginTop: "0.2rem" }}>
                          R = 3.0V / 0.0136A ≈ 220.5 Ω ➔ 220 Ω (Red-Red-Brown)
                        </div>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#fca5a5", marginTop: "0.4rem", margin: 0 }}>
                        ⚠️ Without this resistor, current exceeds 80mA, instantly burning the LED junction and damaging ATmega328P output transistors!
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 8: LAB PART A: FIRST LIGHT WITH LED_BUILTIN
          ===================================================================== */}
      {currentSlide === 7 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 8 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Lab Part A: First Light with <code>LED_BUILTIN</code>
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Zero wiring required! Test your development toolchain and celebrate your first uploaded C++ program.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem" }}>
              {/* Step-by-Step Visual Workflow */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.25rem" }}>
                <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.95rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <CheckSquare size={18} /> Step-by-Step First Flash Sequence
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {[
                    { step: 1, title: "Bench Inspection", desc: "Ensure desk is clear of loose wire clippings and conductive metal shavings before setting down the board." },
                    { step: 2, title: "Connect USB Cable", desc: "Firmly insert USB Type-B plug into the Arduino. The green 'ON' power LED will illuminate steadily." },
                    { step: 3, title: "Select Board & Port", desc: "In Arduino IDE: Tools ➔ Board ➔ 'Arduino Uno', then Tools ➔ Port ➔ select 'COMx' (Windows) or '/dev/cu.usbmodem...' (Mac)." },
                    { step: 4, title: "Open RoboBEE Blink", desc: "Open File ➔ Examples ➔ 01.Basics ➔ Blink, or paste the certified RoboBEE Stage A sketch." },
                    { step: 5, title: "Click Upload (➔)", desc: "Click the Right Arrow upload button. Observe the TX and RX LEDs flashing furiously during memory write." },
                    { step: 6, title: "Verify 'L' Pulse", desc: "Look at the orange 'L' LED. It should now pulse: 1 second ON, 1 second OFF!" }
                  ].map(s => (
                    <div key={s.step} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "rgba(0,0,0,0.25)", padding: "0.65rem", borderRadius: "8px" }}>
                      <span style={{ background: "#F5B800", color: "#161B26", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 900, minWidth: "22px" }}>
                        {s.step}
                      </span>
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#ffffff" }}>{s.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.15rem", lineHeight: "1.4" }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Troubleshooting Callout Card for Part A */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ background: "rgba(107, 15, 36, 0.2)", border: "1px solid rgba(107, 15, 36, 0.5)", borderRadius: "14px", padding: "1.25rem" }}>
                  <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <AlertTriangle size={16} /> Port Greyed Out in Arduino IDE?
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "#fca5a5", marginTop: "0.35rem", lineHeight: "1.5" }}>
                    The #1 rookie workshop trap: Using a <strong>charge-only USB cable</strong> from a phone or toy. Charge cables lack the internal D+ and D- data conductors. Swap to the blue RoboBEE certified USB 2.0 data cable!
                  </p>
                </div>

                <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "14px", padding: "1.25rem" }}>
                  <div style={{ color: "#6ee7b7", fontWeight: 800, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <CheckCircle size={16} /> Stage A Sign-Off Criteria
                  </div>
                  <ul style={{ paddingLeft: "1.1rem", fontSize: "0.78rem", color: "#cbd5e1", lineHeight: "1.6", marginTop: "0.35rem", margin: 0 }}>
                    <li>Green <strong>ON</strong> LED is steady and bright.</li>
                    <li>Orange <strong>L</strong> LED blinks with exact 1-second cadence.</li>
                    <li>Arduino IDE bottom console reports: <em>&ldquo;Done uploading. Global variables use 9 bytes...&rdquo;</em></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 9: LAB PART B: EXTERNAL BREADBOARD LED CIRCUIT BUILD
          ===================================================================== */}
      {currentSlide === 8 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 9 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Lab Part B: External Breadboard Circuit Build
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Unplug USB! Wire Pin 13 ➔ 220 Ω Resistor ➔ LED Anode ➔ Cathode ➔ GND, then complete peer safety checklist.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "1.25rem" }}>
              {/* Wiring SVG Diagram */}
              <div style={{ background: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Image
                  src="/illustrations/class1-external-blink-wiring.svg"
                  alt="External Blink Breadboard Wiring"
                  width={680}
                  height={380}
                  style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                />
                <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "#F5B800", fontWeight: 700 }}>
                  RoboBEE Reference Illustration — Verify Hardware Before Powering
                </div>
              </div>

              {/* Wire Table & Interactive Safety Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* 6-Row Wire Table */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "0.85rem" }}>
                  <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                    Wire-by-Wire Connection Table
                  </div>
                  <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse", color: "#cbd5e1" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left", color: "#94a3b8" }}>
                        <th style={{ padding: "0.3rem" }}>#</th>
                        <th style={{ padding: "0.3rem" }}>From</th>
                        <th style={{ padding: "0.3rem" }}>To</th>
                        <th style={{ padding: "0.3rem" }}>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(lesson.physicalBuildPack?.wireTable || []).map((w, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "0.35rem", color: "#F5B800", fontWeight: 800 }}>{idx + 1}</td>
                          <td style={{ padding: "0.35rem", fontFamily: "monospace" }}>{w.from}</td>
                          <td style={{ padding: "0.35rem", fontFamily: "monospace" }}>{w.to}</td>
                          <td style={{ padding: "0.35rem", fontSize: "0.7rem", color: "#94a3b8" }}>{w.wireOrPolarityNote}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Partner Pre-Power Safety Checklist */}
                <div style={{ background: allSafetyChecked ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 184, 0, 0.08)", border: allSafetyChecked ? "1px solid #10b981" : "1px solid rgba(245, 184, 0, 0.3)", borderRadius: "12px", padding: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ color: allSafetyChecked ? "#10b981" : "#F5B800", fontWeight: 800, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Shield size={15} /> Partner Pre-Power Safety Checklist
                    </span>
                    <span style={{ fontSize: "0.72rem", color: allSafetyChecked ? "#34d399" : "#F5B800", fontWeight: 800 }}>
                      {allSafetyChecked ? "✅ Safe to Connect USB Power!" : "⚠️ Check All 4 Before USB Plug"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {[
                      "USB cable was completely disconnected during all component wiring.",
                      "220 Ω resistor bridges Row 10 to Row 15 (never plugged into the same row).",
                      "LED Anode (long leg) is in Row 15; LED Cathode (short leg) is in Row 16.",
                      "Black jumper wire connects Row 16 directly to an Arduino GND pin."
                    ].map((text, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleSafetyCheck(idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.75rem",
                          color: safetyChecks[idx] ? "#6ee7b7" : "#cbd5e1",
                          cursor: "pointer"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={safetyChecks[idx]}
                          onChange={() => {}}
                          style={{ cursor: "pointer", accentColor: "#10b981" }}
                        />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 10: INSIDE THE CODE: LINE-BY-LINE C++ WALKTHROUGH
          ===================================================================== */}
      {currentSlide === 9 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 10 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Inside the Code: Line-by-Line C++ Engineering Walkthrough
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Every single line of C++ has a precise hardware consequence on the silicon gates of the ATmega328P.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "1.25rem" }}>
              {/* Left: Syntax Highlighted C++ Code Box */}
              <div style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "14px", padding: "1.25rem", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: "0.82rem", lineHeight: "1.7", overflowY: "auto", maxHeight: "460px" }}>
                <div style={{ color: "#64748b", fontStyle: "italic", marginBottom: "0.5rem" }}>
                  // RoboBEE Certified Stage B External Blink Sketch
                </div>
                {[
                  { line: 1, text: "const int LED_PIN = 13;", block: 0 },
                  { line: 2, text: "const int ON_TIME_MS = 1000;", block: 1 },
                  { line: 3, text: "const int OFF_TIME_MS = 1000;", block: 1 },
                  { line: 4, text: "", block: -1 },
                  { line: 5, text: "void setup() {", block: 2 },
                  { line: 6, text: "  pinMode(LED_PIN, OUTPUT);", block: 3 },
                  { line: 7, text: "}", block: 2 },
                  { line: 8, text: "", block: -1 },
                  { line: 9, text: "void loop() {", block: 4 },
                  { line: 10, text: "  digitalWrite(LED_PIN, HIGH);", block: 5 },
                  { line: 11, text: "  delay(ON_TIME_MS);", block: 6 },
                  { line: 12, text: "  digitalWrite(LED_PIN, LOW);", block: 7 },
                  { line: 13, text: "  delay(OFF_TIME_MS);", block: 6 },
                  { line: 14, text: "}", block: 4 }
                ].map((l, idx) => {
                  const isActive = l.block === activeCodeBlockIdx;
                  return (
                    <div 
                      key={idx}
                      onClick={() => l.block >= 0 && setActiveCodeBlockIdx(l.block)}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        background: isActive ? "rgba(245, 184, 0, 0.15)" : "transparent",
                        borderLeft: isActive ? "3px solid #F5B800" : "3px solid transparent",
                        cursor: l.block >= 0 ? "pointer" : "default"
                      }}
                    >
                      <span style={{ color: "#475569", width: "22px", textAlign: "right", userSelect: "none" }}>{l.line}</span>
                      <span style={{ color: l.text.includes("void") ? "#c084fc" : l.text.includes("const") ? "#38bdf8" : l.text.includes("HIGH") || l.text.includes("LOW") ? "#F5B800" : "#f1f5f9" }}>
                        {l.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right: Clickable 8-Block Engineering Explanations */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "460px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {[
                  { id: 0, title: "1. const int LED_PIN = 13;", subtitle: "Pin Constant Alias", desc: "Replaces magic numbers with meaningful names. Stored in flash memory with zero runtime RAM consumption. If you move your wire from Pin 13 to Pin 9, you only modify this one line!" },
                  { id: 1, title: "2. const int ON_TIME_MS / OFF_TIME_MS;", subtitle: "Timing Parameters", desc: "Defines blink duration in milliseconds. Separating ON and OFF parameters unlocks asymmetric duty cycles (like emergency beacons and lighthouse strobes)." },
                  { id: 2, title: "3. void setup() { ... }", subtitle: "One-Time Initialization", desc: "Runs exactly once when the ATmega328P powers on or after the reset button is pressed. Used to configure pin modes, initialize serial communications, and setup peripherals." },
                  { id: 3, title: "4. pinMode(LED_PIN, OUTPUT);", subtitle: "Tri-State Register Configuration", desc: "Configures the internal Data Direction Register (DDRB) for Pin 13. Lowers output impedance so the pin can source up to 20mA to drive external circuits." },
                  { id: 4, title: "5. void loop() { ... }", subtitle: "Infinite Execution Loop", desc: "Runs continuously for as long as power is connected. As soon as the CPU finishes the last line inside the closing brace, it wraps back to the top in less than a microsecond." },
                  { id: 5, title: "6. digitalWrite(LED_PIN, HIGH);", subtitle: "Applying 5V Output Potential", desc: "Connects Pin 13 internally to the 5V power bus via a low-resistance MOSFET. Electric potential pushes current through the 220 Ω resistor and LED to illuminate photons." },
                  { id: 6, title: "7. delay(ON_TIME_MS);", subtitle: "Millisecond CPU Hardware Pause", desc: "Halts sketch execution for specified milliseconds (1000ms = 1 sec). The CPU cycles through 16,000,000 idle ticks per second while the LED maintains its illumination state." },
                  { id: 7, title: "8. digitalWrite(LED_PIN, LOW);", subtitle: "Collapsing Potential to 0V (GND)", desc: "Pulls Pin 13 internally to 0V ground potential. The voltage difference across the LED drops to zero, terminating current flow and extinguishing the light." }
                ].map(block => (
                  <div
                    key={block.id}
                    onClick={() => setActiveCodeBlockIdx(block.id)}
                    style={{
                      background: activeCodeBlockIdx === block.id ? "rgba(107, 15, 36, 0.25)" : "rgba(255,255,255,0.02)",
                      border: activeCodeBlockIdx === block.id ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "10px",
                      padding: "0.65rem 0.85rem",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 800, color: activeCodeBlockIdx === block.id ? "#F5B800" : "#ffffff" }}>
                        {block.title}
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700 }}>
                        {block.subtitle}
                      </span>
                    </div>
                    {activeCodeBlockIdx === block.id && (
                      <p style={{ fontSize: "0.78rem", color: "#cbd5e1", marginTop: "0.35rem", lineHeight: "1.4", margin: 0 }}>
                        {block.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 11: LIVE SYNCHRONIZED BLINK SIMULATOR & TIMING LAB
          ===================================================================== */}
      {currentSlide === 10 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 11 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Live Synchronized Blink Simulator &amp; Timing Lab
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Experiment with timing variables in-browser before modifying your physical Arduino sketch.
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "1rem" }}>
            {/* Top Software Simulator Badge */}
            <div style={{ background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "8px", padding: "0.4rem 0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#67e8f9", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Activity size={14} /> RoboBEE Virtual Hardware Simulator — Test In-Browser Before Flashing Board
              </span>
              <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                Synchronized with Physical Pin 13 Logic
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem" }}>
              {/* Left: Interactive Simulated Board & Breadboard */}
              <div style={{ background: "#0b0f19", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                {/* Visual LED Hardware Rendering */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: "100%", padding: "1rem 0" }}>
                  {/* Onboard Pin 13 LED */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "6px",
                      background: simLedState ? "#f59e0b" : "#451a03",
                      boxShadow: simLedState ? "0 0 25px #f59e0b, 0 0 45px rgba(245, 158, 11, 0.6)" : "none",
                      border: "2px solid #78350f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: "0.85rem",
                      transition: "all 0.05s ease"
                    }}>
                      L
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700 }}>
                      Onboard Pin 13 &apos;L&apos; LED
                    </span>
                  </div>

                  {/* External 5mm Red LED on Breadboard */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: simLedState ? "radial-gradient(circle, #ff4d4d 0%, #cc0000 70%, #660000 100%)" : "#3b0707",
                      boxShadow: simLedState ? "0 0 40px #ff3333, 0 0 70px rgba(255, 51, 51, 0.7)" : "none",
                      border: "2px solid #550505",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      transition: "all 0.05s ease"
                    }}>
                      <Zap size={22} color={simLedState ? "#ffffff" : "#660000"} />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: simLedState ? "#ff6b6b" : "#94a3b8", fontWeight: 800 }}>
                      External Red 5mm LED ({simLedState ? "HIGH (5V)" : "LOW (0V)"})
                    </span>
                  </div>
                </div>

                {/* Real-Time Duty Cycle & Frequency Calculations */}
                <div style={{ width: "100%", background: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "0.85rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase" }}>Total Period (T)</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", fontFamily: "monospace" }}>
                      {simOnTime + simOffTime} ms
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase" }}>Frequency (f)</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F5B800", fontFamily: "monospace" }}>
                      {(1000 / (simOnTime + simOffTime)).toFixed(2)} Hz
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase" }}>Duty Cycle</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10b981", fontFamily: "monospace" }}>
                      {((simOnTime / (simOnTime + simOffTime)) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sliders & 4 Experiment Presets */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {/* 4 One-Click Presets */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem" }}>
                  <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.6rem" }}>
                    4 Predict ➔ Modify ➔ Test Experiments
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <button
                      onClick={() => applyPreset("Fast Strobe (200/200ms)", 200, 200)}
                      style={{
                        background: activePreset === "Fast Strobe (200/200ms)" ? "#6B0F24" : "rgba(255,255,255,0.04)",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div>⚡ 1. Fast Strobe</div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>200ms ON / 200ms OFF</div>
                    </button>

                    <button
                      onClick={() => applyPreset("Lighthouse Beacon (100/900ms)", 100, 900)}
                      style={{
                        background: activePreset === "Lighthouse Beacon (100/900ms)" ? "#6B0F24" : "rgba(255,255,255,0.04)",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div>🚨 2. Lighthouse Beacon</div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>100ms ON / 900ms OFF (10%)</div>
                    </button>

                    <button
                      onClick={() => applyPreset("Cardiac Rhythm / Heartbeat (Double Pulse)", 150, 150)}
                      style={{
                        background: activePreset === "Cardiac Rhythm / Heartbeat (Double Pulse)" ? "#6B0F24" : "rgba(255,255,255,0.04)",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div>💓 3. Cardiac Heartbeat</div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Double pulse Lub-Dub</div>
                    </button>

                    <button
                      onClick={() => applyPreset("Persistence of Vision (10/10ms)", 10, 10)}
                      style={{
                        background: activePreset === "Persistence of Vision (10/10ms)" ? "#6B0F24" : "rgba(255,255,255,0.04)",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div>👁️ 4. Optical POV Trick</div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>10ms ON / 10ms OFF (50Hz)</div>
                    </button>
                  </div>
                </div>

                {/* Timing Sliders */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" }}>
                      <span>ON_TIME_MS (High Pulse):</span>
                      <span style={{ color: "#F5B800", fontFamily: "monospace" }}>{simOnTime} ms</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={2500}
                      step={10}
                      value={simOnTime}
                      onChange={(e) => {
                        setActivePreset("Custom Timing");
                        setSimOnTime(Number(e.target.value));
                      }}
                      style={{ width: "100%", accentColor: "#F5B800" }}
                    />
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" }}>
                      <span>OFF_TIME_MS (Low Pause):</span>
                      <span style={{ color: "#38bdf8", fontFamily: "monospace" }}>{simOffTime} ms</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={2500}
                      step={10}
                      value={simOffTime}
                      onChange={(e) => {
                        setActivePreset("Custom Timing");
                        setSimOffTime(Number(e.target.value));
                      }}
                      style={{ width: "100%", accentColor: "#38bdf8" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          SLIDE 12: TROUBLESHOOTING, CLASS QUIZ & EXIT TICKET
          ===================================================================== */}
      {currentSlide === 11 && (
        <>
          <div className={styles.slideHeader}>
            <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • WORKSHOP SLIDE 12 OF 12</div>
            <h1 className={styles.slideTitle} style={{ color: "#ffffff", fontSize: "2.1rem" }}>
              Troubleshooting Matrix, Class Quiz &amp; Exit Mastery
            </h1>
            <p className={styles.slideSubtitle} style={{ color: "#F5B800", fontSize: "1.05rem" }}>
              Debugging is 80% of real engineering. Verify your understanding and prepare for Class 2!
            </p>
          </div>

          <div className={styles.slideBody} style={{ gap: "0.85rem" }}>
            {/* Slide 12 Sub-Tabs */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { id: "troubleshoot", label: "🔧 Field Troubleshooting Matrix (6 Cases)" },
                { id: "quiz", label: "🎯 5-Question Interactive Class Quiz" },
                { id: "exit", label: "📋 4-Part Exit Ticket & Class 2 Teaser" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSlide12Tab(t.id as any)}
                  style={{
                    background: slide12Tab === t.id ? "#6B0F24" : "rgba(255,255,255,0.04)",
                    color: slide12Tab === t.id ? "#ffffff" : "#cbd5e1",
                    border: slide12Tab === t.id ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    padding: "0.4rem 0.85rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Troubleshooting Accordion */}
            {slide12Tab === "troubleshoot" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", maxHeight: "440px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {(lesson.troubleshooting || []).map((t, idx) => {
                  const isExpanded = expandedTroubleIdx === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: isExpanded ? "1px solid #F5B800" : "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "10px",
                        padding: "0.75rem 1rem",
                        cursor: "pointer"
                      }}
                      onClick={() => setExpandedTroubleIdx(isExpanded ? null : idx)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ color: "#ef4444", fontWeight: 800, fontSize: "0.8rem" }}>Case {idx + 1}:</span>
                          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.88rem" }}>{t.symptom}</span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} color="#F5B800" /> : <ChevronDown size={16} color="#94a3b8" />}
                      </div>

                      {isExpanded && (
                        <div style={{ marginTop: "0.6rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.6rem", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1rem" }}>
                          <div>
                            <div style={{ color: "#fca5a5", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>Diagnostic Checks</div>
                            <ul style={{ paddingLeft: "1.1rem", fontSize: "0.78rem", color: "#cbd5e1", margin: "0.2rem 0 0 0", lineHeight: "1.4" }}>
                              {t.checks.map((c, cIdx) => (
                                <li key={cIdx}>{c}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>Engineering Explanation</div>
                            <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginTop: "0.2rem", lineHeight: "1.4" }}>{t.explanation}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Interactive Class Quiz */}
            {slide12Tab === "quiz" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "440px", overflowY: "auto", paddingRight: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "#F5B800", fontWeight: 800 }}>
                    5 Multiple-Choice Mastery Questions
                  </span>
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    style={{
                      background: "#6B0F24",
                      color: "#ffffff",
                      border: "1px solid #F5B800",
                      borderRadius: "8px",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    Reveal Class Answers ➔
                  </button>
                </div>

                {class1QuizQuestions.map((q, qIdx) => {
                  const selectedOpt = quizAnswers[qIdx];
                  const isCorrect = selectedOpt === q.correctOptionIndex;

                  return (
                    <div key={q.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "0.85rem" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
                        {qIdx + 1}. {q.prompt}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                        {q.options.map((opt, optIdx) => {
                          let optBg = "rgba(255,255,255,0.04)";
                          let optBorder = "1px solid rgba(255,255,255,0.1)";

                          if (quizSubmitted) {
                            if (optIdx === q.correctOptionIndex) {
                              optBg = "rgba(16, 185, 129, 0.25)";
                              optBorder = "1px solid #10b981";
                            } else if (selectedOpt === optIdx) {
                              optBg = "rgba(239, 68, 68, 0.25)";
                              optBorder = "1px solid #ef4444";
                            }
                          } else if (selectedOpt === optIdx) {
                            optBg = "rgba(245, 184, 0, 0.2)";
                            optBorder = "1px solid #F5B800";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                              style={{
                                background: optBg,
                                border: optBorder,
                                color: "#ffffff",
                                borderRadius: "6px",
                                padding: "0.45rem 0.65rem",
                                fontSize: "0.75rem",
                                textAlign: "left",
                                cursor: "pointer"
                              }}
                            >
                              <span style={{ fontWeight: 800, marginRight: "0.35rem", color: "#F5B800" }}>
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: isCorrect ? "#6ee7b7" : "#cbd5e1", background: "rgba(0,0,0,0.3)", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                          <strong>Engineering Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: 4-Part Exit Ticket & Class 2 Teaser */}
            {slide12Tab === "exit" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem", maxHeight: "440px", overflowY: "auto" }}>
                {/* 4-Part Exit Ticket Reflections */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "1.25rem" }}>
                  <div style={{ color: "#F5B800", fontWeight: 800, fontSize: "0.92rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <BookOpen size={16} /> 4-Question Mastery Exit Ticket
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {(lesson.exitTicket || []).map((ticket, idx) => (
                      <div key={idx} style={{ background: "rgba(0,0,0,0.25)", padding: "0.65rem 0.85rem", borderRadius: "8px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#ffffff" }}>
                          {idx + 1}. {ticket.question}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                          💡 <em>Rubric:</em> {ticket.rubricOrSampleReasoning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Teaser for Class 2 & Official Reference Sources */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {/* Next Class Teaser */}
                  <div style={{ background: "linear-gradient(135deg, rgba(107, 15, 36, 0.3), rgba(11, 15, 25, 0.8))", border: "1px solid #6B0F24", borderRadius: "14px", padding: "1.25rem" }}>
                    <span style={{ background: "rgba(245, 184, 0, 0.2)", color: "#F5B800", padding: "0.2rem 0.5rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 800 }}>
                      NEXT WORKSHOP TEASER
                    </span>
                    <h3 style={{ fontSize: "1.2rem", color: "#ffffff", fontWeight: 800, margin: "0.5rem 0 0.3rem 0" }}>
                      Class 2 (beg-02): Multiple LEDs &amp; Traffic Light Sequencer
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: "1.5", margin: 0 }}>
                      Next session we scale from 1 LED to 3 synchronized LEDs (Red, Yellow, Green) and write deterministic state machine timing loops modeling a real city traffic intersection!
                    </p>
                  </div>

                  {/* Primary Reference Links */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "1rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "#F5B800", fontWeight: 800, marginBottom: "0.4rem" }}>
                      Official Engineering Documentation
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.75rem" }}>
                      {(lesson.sources || []).slice(0, 4).map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#38bdf8", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <ExternalLink size={12} />
                          <span>{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
