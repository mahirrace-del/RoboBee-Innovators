"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./projectorView.module.css";
import { RoboticsLesson } from "@/lib/curriculumData";
import { CurriculumSimulator } from "./CurriculumSimulator";
import { 
  Play, Pause, RotateCcw, Maximize, X, ArrowLeft, ArrowRight,
  Clock, Shield, CheckCircle, Code, Eye, HelpCircle, Phone, MapPin,
  Cpu, Wrench, Zap, ChevronLeft, ChevronRight, Sparkles, BookOpen, Layers
} from "lucide-react";

interface ProjectorViewProps {
  lesson: RoboticsLesson;
  onClose: () => void;
}

export function ProjectorView({ lesson, onClose }: ProjectorViewProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 8;

  // Active concept index for Slide 3
  const [activeConceptIndex, setActiveConceptIndex] = useState<number>(0);
  // Rhythm table toggle for Slide 2
  const [showRhythmTable, setShowRhythmTable] = useState<boolean>(false);
  // Code Lab view tab: 'code' or 'missions'
  const [codeLabTab, setCodeLabTab] = useState<'code' | 'missions'>('code');
  // Slide 1 Intro sub-tabs
  const [introTab, setIntroTab] = useState<'pillars' | 'applications' | 'microcontrollers' | 'motors' | 'careers'>('pillars');

  // Rhythm duration mode: 90m vs 60m
  const defaultDuration = lesson.durationMinutes || 60;
  const [isCompactMode, setIsCompactMode] = useState<boolean>(defaultDuration === 60);
  const [timerSeconds, setTimerSeconds] = useState<number>((isCompactMode ? 60 : defaultDuration) * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Exit Ticket reveal state for instructor
  const [revealedHints, setRevealedHints] = useState<{ [key: number]: boolean }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setMounted(true);
    // Lock background scroll while projector view is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key.toLowerCase() === "f") {
        toggleFullScreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, onClose, toggleFullScreen]);

  // Rhythm timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const toggleTimer = () => setTimerRunning(r => !r);
  
  const resetTimer = (durationMins?: number) => {
    setTimerRunning(false);
    const mins = durationMins !== undefined ? durationMins : (isCompactMode ? 60 : defaultDuration);
    setTimerSeconds(mins * 60);
  };

  const handleToggleCompact = () => {
    const nextMode = !isCompactMode;
    setIsCompactMode(nextMode);
    resetTimer(nextMode ? 60 : 90);
  };

  // Format timer into MM:SS
  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate current active rhythm phase from lesson.classRhythm
  const totalDurationSec = (isCompactMode ? 60 : defaultDuration) * 60;
  const elapsedSec = totalDurationSec - timerSeconds;
  const elapsedMins = elapsedSec / 60;

  const getActiveRhythmSegment = () => {
    if (!lesson.classRhythm || lesson.classRhythm.length === 0) return 'Class Session';
    let cumulative = 0;
    for (const seg of lesson.classRhythm) {
      cumulative += seg.minutes;
      if (elapsedMins <= cumulative) {
        return seg.segment;
      }
    }
    return lesson.classRhythm[lesson.classRhythm.length - 1].segment;
  };

  if (!mounted) return null;

  const modalContent = (
    <div className={styles.projectorOverlay} style={{ background: '#070b14', zIndex: 999999 }}>
      {/* Top Projector Toolbar */}
      <header className={styles.topBar}>
        <div className={styles.brandGroup}>
          <span className={styles.classCodeTag}>{lesson.code}</span>
          <span className={styles.classTitleText}>{lesson.title}</span>
        </div>

        {/* Classroom Rhythm Timer with 90m / 60m Toggle */}
        <div className={styles.timerWidget}>
          <Clock size={16} color="#F5B800" />
          <span className={styles.timerClock}>{formatTimer(timerSeconds)}</span>
          <span className={styles.timerPhaseBadge}>{getActiveRhythmSegment()}</span>
          
          <button onClick={toggleTimer} className={styles.actionBtn} title={timerRunning ? "Pause timer" : "Start timer"}>
            {timerRunning ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={() => resetTimer()} className={styles.actionBtn} title="Reset timer">
            <RotateCcw size={14} />
          </button>

          {lesson.compactDurationMinutes && (
            <button 
              onClick={handleToggleCompact}
              className={`${styles.actionBtn} ${styles.compactToggleBtn}`}
              style={{ background: isCompactMode ? '#6B0F24' : 'rgba(255,255,255,0.08)', color: '#fff' }}
              title="Toggle between 90-minute full and 60-minute compact rhythm"
            >
              <span>{isCompactMode ? '60m' : '90m'}</span>
            </button>
          )}
        </div>

        {/* Projector Controls */}
        <div className={styles.controlsGroup}>
          <button onClick={toggleFullScreen} className={`${styles.actionBtn} ${styles.fullscreenBtn}`} title="Full Screen (F)">
            <Maximize size={15} />
            <span>Full Screen</span>
          </button>
          <button onClick={onClose} className={`${styles.actionBtn} ${styles.closeBtn}`} title="Exit (Esc)">
            <X size={16} />
            <span className={styles.exitBtnText}>Exit</span>
          </button>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <main className={styles.slideCanvas}>
        <div className={styles.slideCard}>
          {/* SLIDE 1: EPIC ROBOTICS MASTERCLASS TITLE */}
          {currentSlide === 0 && (
            <>
              <div className={styles.slideHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div className={styles.slideNumberBadge}>
                    ROBOBEE INNOVATORS ACADEMY • SLIDE 1 OF {totalSlides}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ background: 'rgba(245, 184, 0, 0.15)', color: '#F5B800', border: '1px solid rgba(245, 184, 0, 0.35)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                      {lesson.proposedAudience}
                    </span>
                    <span style={{ background: 'rgba(107, 15, 36, 0.3)', color: '#fca5a5', border: '1px solid #6B0F24', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                      ⏱ {isCompactMode ? '60m Compact' : `${lesson.durationMinutes}m Full`}
                    </span>
                  </div>
                </div>
                <h1 className={styles.slideTitle} style={{ color: '#ffffff' }}>{lesson.title}</h1>
                <p className={styles.slideSubtitle} style={{ color: '#F5B800', fontSize: '1.15rem', fontWeight: 600 }}>{lesson.promise}</p>
              </div>

              <div className={styles.slideBody}>
                {/* Slide 1 Navigation Tabs */}
                <div className={styles.conceptTabsBar} style={{ marginBottom: '1rem' }}>
                  <button
                    onClick={() => setIntroTab('pillars')}
                    className={`${styles.conceptTabPill} ${introTab === 'pillars' ? styles.conceptTabPillActive : ''}`}
                  >
                    <span>🏛 4 Subsystem Pillars</span>
                  </button>
                  <button
                    onClick={() => setIntroTab('applications')}
                    className={`${styles.conceptTabPill} ${introTab === 'applications' ? styles.conceptTabPillActive : ''}`}
                  >
                    <span>🌍 Real-World Applications</span>
                  </button>
                  <button
                    onClick={() => setIntroTab('microcontrollers')}
                    className={`${styles.conceptTabPill} ${introTab === 'microcontrollers' ? styles.conceptTabPillActive : ''}`}
                  >
                    <span>⚡ Microcontroller Spectrum</span>
                  </button>
                  <button
                    onClick={() => setIntroTab('motors')}
                    className={`${styles.conceptTabPill} ${introTab === 'motors' ? styles.conceptTabPillActive : ''}`}
                  >
                    <span>⚙ Motors &amp; Drivers</span>
                  </button>
                  <button
                    onClick={() => setIntroTab('careers')}
                    className={`${styles.conceptTabPill} ${introTab === 'careers' ? styles.conceptTabPillActive : ''}`}
                  >
                    <span>🚀 Robotics Careers</span>
                  </button>
                </div>

                {/* TAB 1: 4 PILLARS & ACADEMY HOOK */}
                {introTab === 'pillars' && (
                  <>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                        🤖 The Four Universal Subsystems of Every Autonomous Robot:
                      </div>
                      <div className={styles.pillarGrid}>
                        <div className={styles.pillarCard}>
                          <div className={styles.pillarIconRow}>
                            <Wrench size={20} color="#F5B800" />
                            <span className={styles.pillarTitle}>1. Mechanical Structure</span>
                          </div>
                          <p className={styles.pillarDesc}>
                            Chassis, wheels, linkages, gears, and brackets that give the robot physical form, payload capacity, and degrees of freedom.
                          </p>
                        </div>

                        <div className={styles.pillarCard}>
                          <div className={styles.pillarIconRow}>
                            <Zap size={20} color="#eab308" />
                            <span className={styles.pillarTitle}>2. Electrical Power</span>
                          </div>
                          <p className={styles.pillarDesc}>
                            Batteries, voltage regulators, and ground return loops delivering isolated, stable 5V logic power and motor current.
                          </p>
                        </div>

                        <div className={styles.pillarCard}>
                          <div className={styles.pillarIconRow}>
                            <Eye size={20} color="#06b6d4" />
                            <span className={styles.pillarTitle}>3. Sensory Perception</span>
                          </div>
                          <p className={styles.pillarDesc}>
                            Ultrasonic sonars, infrared line sensors, gyroscopes, and encoders that convert physical world phenomena into electrical signals.
                          </p>
                        </div>

                        <div className={styles.pillarCard}>
                          <div className={styles.pillarIconRow}>
                            <Cpu size={20} color="#a855f7" />
                            <span className={styles.pillarTitle}>4. Silicon Brain</span>
                          </div>
                          <p className={styles.pillarDesc}>
                            The microcontroller executing program code at 16,000,000 instructions per second in an infinite Sense-Decide-Act loop.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Lab Safety & Mission Hook */}
                    <div className={styles.twoColGrid}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F5B800', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Academy Motto
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>
                          &ldquo;Dream. Invent. Experiment. Inspire.&rdquo;
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.35rem', lineHeight: '1.5' }}>
                          You transition from someone who merely consumes consumer tech into an engineer who designs, codes, and controls intelligent physical machines!
                        </p>
                      </div>

                      <div style={{ background: 'rgba(107, 15, 36, 0.25)', border: '1px solid #6B0F24', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                        <div style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                          <Shield size={16} />
                          <span>Golden Lab Safety Rule</span>
                        </div>
                        <p style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: 600, lineHeight: '1.5' }}>
                          &ldquo;{lesson.safetyNotes[0] || 'Never connect or modify wires while USB or battery power is plugged in!'}&rdquo;
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2: REAL-WORLD APPLICATIONS */}
                {introTab === 'applications' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F5B800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                      🌍 Where Robotics Powers Our World Today:
                    </div>
                    <div className={styles.pillarGrid}>
                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🏭</span>
                          <span className={styles.pillarTitle}>Industrial Manufacturing</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          Articulated 6-axis arms (KUKA, ABB, Fanuc) weld car chassis, paint body panels, and place tiny microchips with 0.02mm repeatability in Tesla and BMW factories.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🏥</span>
                          <span className={styles.pillarTitle}>Surgical Nanorobotics</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          The da Vinci surgical system scales down doctor hand motions into microscopic internal wrist tools, canceling tremors and enabling minimally invasive heart and prostate surgeries.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🪐</span>
                          <span className={styles.pillarTitle}>Space Exploration</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          NASA&apos;s Perseverance rover navigates Mars autonomously using stereo machine vision and obstacle avoidance algorithms, operating under a 20-minute signal delay from Earth.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>📦</span>
                          <span className={styles.pillarTitle}>Autonomous Warehouses</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          Amazon Robotics fleets (Kiva AMRs) navigate grid matrices via floor optical sensors, autonomously lifting 1,000kg inventory pods and dispatching orders in seconds.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: THE MICROCONTROLLER SPECTRUM */}
                {introTab === 'microcontrollers' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                      ⚡ The Global Silicon Brain Landscape — Why Arduino &amp; What Comes Next:
                    </div>
                    <div className={styles.pillarGrid}>
                      <div className={styles.pillarCard} style={{ border: '2px solid #F5B800' }}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🟢</span>
                          <span className={styles.pillarTitle}>Arduino Uno R3 (ATmega328P)</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          <strong>16 MHz • 5V Logic • 32KB Flash • 2KB SRAM</strong><br />
                          <strong>Why We Start Here:</strong> Indestructible DIP socket, 5V noise immunity, and pure deterministic real-time hardware execution without OS lag.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🔵</span>
                          <span className={styles.pillarTitle}>ESP32 (Espressif IoT)</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          <strong>240 MHz Dual-Core • 3.3V • 520KB SRAM • WiFi &amp; BLE</strong><br />
                          <strong>When to Use:</strong> Remote telemetry, web dashboards, drone command links, and cloud robotics over MQTT and WebSockets.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🟣</span>
                          <span className={styles.pillarTitle}>Raspberry Pi Pico (RP2040)</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          <strong>133 MHz Dual Cortex-M0+ • 3.3V • 264KB SRAM</strong><br />
                          <strong>When to Use:</strong> Programmable I/O (PIO) state machines that generate custom communication protocols without bogging down the main CPU.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🟡</span>
                          <span className={styles.pillarTitle}>Single-Board Computers (Pi 5 / Jetson)</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          <strong>2.4 GHz Quad 64-bit • Linux OS • 8GB RAM</strong><br />
                          <strong>When to Use:</strong> Full ROS 2, SLAM LiDAR mapping, and real-time YOLO neural network vision sending high-level commands to Arduino motor boards.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: MOTORS & MOTOR DRIVERS */}
                {introTab === 'motors' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                      ⚙ Actuators, Motor Drivers &amp; The Universal Electrical Bridge:
                    </div>
                    <div className={styles.pillarGrid}>
                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🔄</span>
                          <span className={styles.pillarTitle}>DC Gearmotors</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          High-RPM motors equipped with spur gearboxes to multiply torque. Continuous rotation for rover wheels. Draws 150mA running, up to 1,500mA–3,000mA at stall!
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>📐</span>
                          <span className={styles.pillarTitle}>Servomotors (SG90 / MG996R)</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          DC motor + internal reduction gears + feedback potentiometer. Precision angular control between 0° and 180° driven by 50Hz PWM pulses (1ms–2ms).
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>📏</span>
                          <span className={styles.pillarTitle}>Stepper Motors (NEMA 17)</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          Electromagnetic coils rotate rotor in discrete steps (1.8° = 200 steps/rev). Delivers precise positioning without encoders for 3D printers and CNC arms.
                        </p>
                      </div>

                      <div className={styles.pillarCard} style={{ background: 'rgba(107, 15, 36, 0.3)', border: '1px solid #6B0F24' }}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🛡</span>
                          <span className={styles.pillarTitle}>The H-Bridge Rule (TB6612FNG)</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          <strong>NEVER connect a motor directly to Arduino!</strong> Arduino pins output max 20mA. Motors pull 1000mA+. The H-Bridge acts as an electrical dam, routing battery power safely!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: ROBOTICS CAREERS */}
                {introTab === 'careers' && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                      🚀 Future Engineering Careers Unlocked by Robotics:
                    </div>
                    <div className={styles.pillarGrid}>
                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>💻</span>
                          <span className={styles.pillarTitle}>Embedded Firmware Engineer</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          Writes low-level real-time C++ and Rust drivers controlling hardware registers, interrupts, and communication buses (I2C/SPI/CAN) for electric vehicles and rockets.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🦾</span>
                          <span className={styles.pillarTitle}>Mechatronics Systems Architect</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          Integrates 3D CAD mechanical kinematics, stress analysis, motor torque calculations, and electrical schematics into physical autonomous products.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>🗺</span>
                          <span className={styles.pillarTitle}>Autonomous Navigation (ROS) Engineer</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          Builds 2D/3D SLAM maps, obstacle costmaps, and pathfinding algorithms (A*, Dijkstra) for self-driving cars, delivery rovers, and planetary probes.
                        </p>
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarIconRow}>
                          <span style={{ fontSize: '1.3rem' }}>👁</span>
                          <span className={styles.pillarTitle}>Computer Vision &amp; AI Specialist</span>
                        </div>
                        <p className={styles.pillarDesc}>
                          Trains neural networks for real-time camera perception, robotic arm object picking, depth estimation, and human-robot collaborative safety zones.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* SLIDE 2: MISSION ROADMAP & UNLOCKED SKILLS */}
          {currentSlide === 1 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>ENGINEERING FLIGHT PLAN • SLIDE 2 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>Today’s Robotics Mission & Flight Plan</h1>
                <p className={styles.slideSubtitle}>Hands-on project deliverables and measurable engineering superpowers unlocked today.</p>
              </div>

              <div className={styles.slideBody}>
                <div className={styles.twoColGrid} style={{ alignItems: 'start' }}>
                  {/* Left: Project Deliverable & Outcomes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(245, 184, 0, 0.08)', border: '1px solid rgba(245, 184, 0, 0.3)', borderRadius: '14px', padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5B800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' }}>
                        🛠 TODAY’S HANDS-ON BUILD
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                        {lesson.project.name}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ background: '#1e293b', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                          Deliverable: {lesson.project.deliverableType.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ marginTop: '0.75rem', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.5' }}>
                        <strong>Proof of Success:</strong> {lesson.project.successEvidence[0]}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                        🎯 Engineering Skills You Unlock Today:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '220px', overflowY: 'auto' }}>
                        {lesson.outcomes.map((outcome, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                            <span style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.4' }}>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: 4-Stage Lab Flight Plan */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        🚀 4-Stage Lab Flight Plan:
                      </div>
                      <button
                        onClick={() => setShowRhythmTable(prev => !prev)}
                        style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#F5B800', borderRadius: '6px', fontSize: '0.75rem', padding: '0.25rem 0.5rem', cursor: 'pointer', fontWeight: 700 }}
                      >
                        {showRhythmTable ? 'Show Overview' : 'View Teacher Timetable'}
                      </button>
                    </div>

                    {!showRhythmTable ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ background: '#0b101b', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F5B800', color: '#161B26', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>1</div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>System Model &amp; Physics Deep Dive</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Explore what makes a robot, the ATmega328P brain, and Ohm’s law.</div>
                          </div>
                        </div>

                        <div style={{ background: '#0b101b', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#06b6d4', color: '#161B26', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>2</div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>Virtual Simulator Workbench</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Test timing delays and inspect pin voltages on the interactive board simulator.</div>
                          </div>
                        </div>

                        <div style={{ background: '#0b101b', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#161B26', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>3</div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>Physical Hardware Inspection &amp; Wiring</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Connect USB, inspect pins, and perform pre-power safety verification.</div>
                          </div>
                        </div>

                        <div style={{ background: '#0b101b', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#a855f7', color: '#ffffff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem' }}>4</div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>Embedded C++ Upload &amp; Creative Missions</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Flash code to chip, customize rhythms, and master Heartbeat and SOS signals.</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {lesson.classRhythm.map((seg, i) => (
                          <div key={i} style={{ background: '#090e18', border: '1px solid #1e293b', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F5B800', fontWeight: 700 }}>
                              <span>{seg.segment}</span>
                              <span style={{ color: '#38bdf8' }}>{seg.minutes}m</span>
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}><strong>Teacher:</strong> {seg.teacherAction}</div>
                            <div style={{ color: '#cbd5e1', fontSize: '0.75rem', marginTop: '2px' }}><strong>Students:</strong> {seg.studentAction}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 3: INTERACTIVE CONCEPT EXPLORER */}
          {currentSlide === 2 && (
            <>
              <div className={styles.slideHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div className={styles.slideNumberBadge}>
                    CORE ROBOTICS CONCEPTS • SLIDE 3 OF {totalSlides}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                      Concept {activeConceptIndex + 1} of {lesson.concepts.length}
                    </span>
                    <button
                      onClick={() => setActiveConceptIndex(prev => (prev > 0 ? prev - 1 : lesson.concepts.length - 1))}
                      className={styles.actionBtn}
                      style={{ padding: '0.2rem 0.5rem' }}
                      title="Previous Concept"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setActiveConceptIndex(prev => (prev < lesson.concepts.length - 1 ? prev + 1 : 0))}
                      className={styles.actionBtn}
                      style={{ padding: '0.2rem 0.5rem' }}
                      title="Next Concept"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <h1 className={styles.slideTitle}>
                  {lesson.concepts[activeConceptIndex]?.title || lesson.title}
                </h1>
                <p className={styles.slideSubtitle}>
                  Fundamental engineering principles of hardware, silicon logic, and autonomous machines.
                </p>
              </div>

              <div className={styles.slideBody}>
                {/* Horizontal Concept Tabs */}
                <div className={styles.conceptTabsBar}>
                  {lesson.concepts.map((concept, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveConceptIndex(idx)}
                      className={`${styles.conceptTabPill} ${activeConceptIndex === idx ? styles.conceptTabPillActive : ''}`}
                    >
                      <span>{idx + 1}. {concept.title.split(':')[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Concept Detailed Display */}
                <div className={styles.conceptDetailContainer}>
                  <div className={styles.conceptHeaderRow}>
                    <span className={styles.conceptBadge}>
                      Concept Module {activeConceptIndex + 1}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
                      RoboBEE Core Engineering Knowledge
                    </span>
                  </div>

                  <div className={styles.conceptText}>
                    {lesson.concepts[activeConceptIndex]?.explanation}
                  </div>

                  {lesson.concepts[activeConceptIndex]?.instructorNote && (
                    <div className={styles.conceptSubBox}>
                      <div className={styles.conceptSubTitle}>💡 Pro Engineering Tip &amp; Instructor Insight</div>
                      <div style={{ color: '#fef3c7', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {lesson.concepts[activeConceptIndex]?.instructorNote}
                      </div>
                    </div>
                  )}
                </div>

                {/* Safety Rule Footer */}
                <div className={styles.goldenRuleBox} style={{ marginTop: '1rem', padding: '0.85rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={18} color="#F5B800" />
                      <strong style={{ color: '#F5B800', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        Hardware Golden Rule:
                      </strong>
                    </div>
                    <span style={{ color: '#fef3c7', fontSize: '0.92rem', fontWeight: 600 }}>
                      &ldquo;{lesson.safetyNotes[0] || 'Supervised low-voltage classroom activity.'}&rdquo;
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 4: LIVE INTERACTIVE SIMULATOR */}
          {currentSlide === 3 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>LIVE CLASSROOM SIMULATION • SLIDE 4 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>Interactive Simulation &amp; Virtual Testbed</h1>
                <p className={styles.slideSubtitle}>Test parameters live on the classroom smartboard before wiring physical hardware.</p>
              </div>
              <div className={styles.slideBody}>
                <CurriculumSimulator type={lesson.visualizerId} classNumber={lesson.sequence} />
              </div>
            </>
          )}

          {/* SLIDE 5: GUIDED CODE LAB & CREATIVE MISSIONS */}
          {currentSlide === 4 && (
            <>
              <div className={styles.slideHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <div className={styles.slideNumberBadge}>CODE LAB WALKTHROUGH • SLIDE 5 OF {totalSlides}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setCodeLabTab('code')}
                      className={`${styles.conceptTabPill} ${codeLabTab === 'code' ? styles.conceptTabPillActive : ''}`}
                    >
                      <Code size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      <span>Standard C++ Sketch</span>
                    </button>
                    <button
                      onClick={() => setCodeLabTab('missions')}
                      className={`${styles.conceptTabPill} ${codeLabTab === 'missions' ? styles.conceptTabPillActive : ''}`}
                    >
                      <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      <span>Creative Coding Missions</span>
                    </button>
                  </div>
                </div>
                <h1 className={styles.slideTitle}>
                  {lesson.codeLab ? `${lesson.codeLab.language.toUpperCase()} Code Walkthrough` : 'Engineering Design & Flow'}
                </h1>
                <p className={styles.slideSubtitle}>Line-by-line inspection of instructions, hardware registers, and timing.</p>
              </div>
              <div className={styles.slideBody}>
                {lesson.codeLab ? (
                  codeLabTab === 'code' ? (
                    <div className={styles.twoColGrid}>
                      <pre className={styles.codeWalkthroughBox}>
                        <code>{lesson.codeLab.code}</code>
                      </pre>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'rgba(245, 184, 0, 0.08)', border: '1px solid rgba(245, 184, 0, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                          <div style={{ color: '#F5B800', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            🔍 Code Explanations:
                          </div>
                          <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {lesson.codeLab.explanations.map((exp, idx) => (
                              <li key={idx} style={{ marginBottom: '0.35rem' }}>{exp}</li>
                            ))}
                          </ul>
                        </div>

                        {lesson.codeLab.tweakTip && (
                          <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                            <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                              💡 Student Tweak to Try:
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                              {lesson.codeLab.tweakTip}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.threeColGrid}>
                      {/* Mission 1 */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.25rem' }}>
                        <div style={{ color: '#ec4899', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          Mission 1
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                          💓 The Human Heartbeat
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                          Program a realistic double-pulse lub-dub rhythm followed by a resting pause!
                        </p>
                        <pre style={{ background: '#020617', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#38bdf8', overflowX: 'auto', lineHeight: '1.4' }}>
{`digitalWrite(ledPin, HIGH); delay(100);
digitalWrite(ledPin, LOW);  delay(100);
digitalWrite(ledPin, HIGH); delay(100);
digitalWrite(ledPin, LOW);  delay(700);`}
                        </pre>
                      </div>

                      {/* Mission 2 */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.25rem' }}>
                        <div style={{ color: '#F5B800', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          Mission 2
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                          🚨 S.O.S. Distress Beacon
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                          The maritime Morse code emergency distress signal: 3 short, 3 long, 3 short.
                        </p>
                        <pre style={{ background: '#020617', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#F5B800', overflowX: 'auto', lineHeight: '1.4' }}>
{`// 3 Short (... )
flash(150); flash(150); flash(150);
// 3 Long (---)
flash(500); flash(500); flash(500);
// 3 Short (... )
flash(150); flash(150); flash(150);`}
                        </pre>
                      </div>

                      {/* Mission 3 */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.25rem' }}>
                        <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          Mission 3
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                          ⚡ Strobe &amp; Persistence of Vision
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                          Drop delays down to 50ms. Observe where your eyes stop seeing blinks and perceive smooth light!
                        </p>
                        <pre style={{ background: '#020617', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#06b6d4', overflowX: 'auto', lineHeight: '1.4' }}>
{`digitalWrite(ledPin, HIGH);
delay(50); // 50ms strobe
digitalWrite(ledPin, LOW);
delay(50); // Rapid blink`}
                        </pre>
                      </div>
                    </div>
                  )
                ) : (
                  <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
                    <Wrench size={36} color="#F5B800" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>Design &amp; Simulation Deliverable</div>
                    <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto', lineHeight: '1.6' }}>
                      This session focuses on systems architecture, CAD modeling, or simulation logic.
                      Follow the hands-on project steps on the next slide!
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* SLIDE 6: HANDS-ON BUILD & PHYSICAL BUILD PACK */}
          {currentSlide === 5 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>HANDS-ON BUILD • SLIDE 6 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>{lesson.activity.title}</h1>
                <p className={styles.slideSubtitle}>Project: {lesson.project.name} ({lesson.project.deliverableType.replace('_', ' ')})</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Connection Diagram for projector */}
                  {lesson.physicalBuildPack?.connectionPhotoOrClearlyLabeledIllustration && (
                    <div style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '12px', padding: '0.85rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                        ⚠ Reference wiring illustration — verify against your exact board/module before applying power. Instructor-developed. Proprietary — RoboBEE Innovators.
                      </div>
                      <img
                        src={lesson.physicalBuildPack.connectionPhotoOrClearlyLabeledIllustration}
                        alt={`Connection diagram for ${lesson.title}`}
                        style={{ width: '100%', maxWidth: '700px', borderRadius: '8px', border: '1px solid #1e293b', background: '#090e18', display: 'block', margin: '0 auto' }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className={styles.twoColGrid}>
                    {/* Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {lesson.activity.steps.map((st, i) => (
                      <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                        <div style={{ background: '#F5B800', color: '#161B26', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <div style={{ color: '#f1f5f9', fontSize: '0.95rem', lineHeight: '1.4' }}>{st}</div>
                      </div>
                    ))}
                  </div>

                  {/* Criteria & Physical Build Pack Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        ✅ What Success Looks Like:
                      </div>
                      <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {lesson.activity.successCriteria.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    {lesson.physicalBuildPack && (
                      <div style={{ background: 'rgba(107, 15, 36, 0.25)', border: '1px solid #6B0F24', padding: '1.25rem', borderRadius: '12px' }}>
                        <div style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Shield size={16} />
                          <span>Pre-Power Safety Check:</span>
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                          {lesson.physicalBuildPack.powerAndSafetyChecks[0] || 'Inspect all connections with your lab partner before turning on battery power.'}
                        </p>
                      </div>
                    )}

                    {lesson.activity.extension && (
                      <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                        <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                          🚀 Pro Extension (Try This Next):
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          {lesson.activity.extension}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
          )}

          {/* SLIDE 7: FORMATIVE EXIT TICKET */}
          {currentSlide === 6 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>FORMATIVE EXIT CHECK • SLIDE 7 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>Classroom Review & Exit Ticket</h1>
                <p className={styles.slideSubtitle}>Reflect on concepts, explain findings, and defend reasoning.</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '380px', overflowY: 'auto' }}>
                  {lesson.exitTicket.map((ticket, idx) => (
                    <div key={idx} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>
                          <span style={{ color: '#F5B800', marginRight: '0.5rem' }}>Check {idx + 1}:</span>
                          {ticket.question}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {ticket.hint && (
                            <button
                              onClick={() => setRevealedHints(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              className={styles.actionBtn}
                            >
                              <HelpCircle size={14} />
                              <span>{revealedHints[idx] ? 'Hide Hint' : 'Show Hint'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => setRevealedAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className={`${styles.actionBtn} ${revealedAnswers[idx] ? styles.closeBtn : ''}`}
                          >
                            <CheckCircle size={14} />
                            <span>{revealedAnswers[idx] ? 'Hide Model Reasoning' : 'Reveal Model Reasoning'}</span>
                          </button>
                        </div>
                      </div>

                      {revealedHints[idx] && ticket.hint && (
                        <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.85rem', background: 'rgba(6, 182, 212, 0.1)', borderLeft: '3px solid #06b6d4', borderRadius: '4px', fontSize: '0.9rem', color: '#38bdf8' }}>
                          💡 <strong>Instructor Hint:</strong> {ticket.hint}
                        </div>
                      )}

                      {revealedAnswers[idx] && (
                        <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.85rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid #10b981', borderRadius: '4px', fontSize: '0.9rem', color: '#34d399' }}>
                          🎯 <strong>Model Reasoning / Rubric:</strong> {ticket.rubricOrSampleReasoning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SLIDE 8: WRAP-UP & NEXT LESSON TEASER */}
          {currentSlide === 7 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>CLASSROOM WRAP-UP • SLIDE 8 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>Great Work, Young Engineers!</h1>
                <p className={styles.slideSubtitle}>Remember to store your parts safely in your kit box before dismissal.</p>
              </div>
              <div className={styles.slideBody}>
                <div className={styles.twoColGrid} style={{ alignItems: 'center' }}>
                  <div style={{ background: 'rgba(245, 184, 0, 0.08)', border: '1px solid rgba(245, 184, 0, 0.3)', padding: '2rem', borderRadius: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F5B800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      UP NEXT IN THE ACADEMY
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0.75rem 0' }}>
                      {lesson.nextLessonTeaser}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
                      Clean up workstations, return tools to their designated bins, and verify your battery clips are disconnected.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '2rem', borderRadius: '16px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' }}>
                      RoboBEE Innovators Lab
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={16} color="#F5B800" />
                        <span>+880 1902-821018</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <MapPin size={16} color="#F5B800" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>Kids Den Int. Preschool (Penny Bee Solutions), Flat 2, 75 North Chashara (Uttar Chashara), Narayanganj, Bangladesh 1400</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#64748b' }}>
                      {lesson.ipNotice}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Slide Navigation Bar */}
          <footer className={styles.bottomBar}>
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={styles.navArrowBtn}
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            {/* Slide Dots for Desktop */}
            <div className={styles.dotsContainer}>
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`${styles.dot} ${idx === currentSlide ? styles.dotActive : ''}`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Mobile Slide Indicator */}
            <div className={styles.mobileSlideIndicator}>
              Slide {currentSlide + 1} of {totalSlides}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={styles.navArrowBtn}
            >
              <span>Next</span>
              <ArrowRight size={16} />
            </button>
          </footer>
        </div>
      </main>
    </div>
  );

  return createPortal(modalContent, document.body);
}
