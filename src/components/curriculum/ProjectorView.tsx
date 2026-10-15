"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./projectorView.module.css";
import { RoboticsLesson } from "@/lib/curriculumData";
import { CurriculumSimulator } from "./CurriculumSimulator";
import { 
  Play, Pause, RotateCcw, Maximize, X, ArrowLeft, ArrowRight,
  Clock, Shield, CheckCircle, Code, Eye, HelpCircle, Phone, MapPin,
  Cpu, Wrench, AlertTriangle, Sparkles
} from "lucide-react";

interface ProjectorViewProps {
  lesson: RoboticsLesson;
  onClose: () => void;
}

export function ProjectorView({ lesson, onClose }: ProjectorViewProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 8;

  // Rhythm duration mode: 90m vs 60m
  const defaultDuration = lesson.durationMinutes || 60;
  const [isCompactMode, setIsCompactMode] = useState<boolean>(defaultDuration === 60);
  const [timerSeconds, setTimerSeconds] = useState<number>((isCompactMode ? 60 : defaultDuration) * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Exit Ticket reveal state for instructor
  const [revealedHints, setRevealedHints] = useState<{ [key: number]: boolean }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: number]: boolean }>({});

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
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
  }, [nextSlide, prevSlide, onClose]);

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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
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

  return (
    <div className={styles.projectorOverlay}>
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
              className={styles.actionBtn}
              style={{ background: isCompactMode ? '#6B0F24' : 'rgba(255,255,255,0.08)', color: '#fff' }}
              title="Toggle between 90-minute full and 60-minute compact rhythm"
            >
              <span>{isCompactMode ? '60m Compact' : '90m Full'}</span>
            </button>
          )}
        </div>

        {/* Projector Controls */}
        <div className={styles.controlsGroup}>
          <button onClick={toggleFullScreen} className={styles.actionBtn} title="Full Screen (F)">
            <Maximize size={15} />
            <span>Full Screen</span>
          </button>
          <button onClick={onClose} className={`${styles.actionBtn} ${styles.closeBtn}`} title="Exit (Esc)">
            <X size={16} />
            <span>Exit Projector</span>
          </button>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <main className={styles.slideCanvas}>
        <div className={styles.slideCard}>
          {/* SLIDE 1: TITLE & BANNER */}
          {currentSlide === 0 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • SLIDE 1 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>{lesson.title}</h1>
                <p className={styles.slideSubtitle}>{lesson.promise}</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F5B800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Audience: {lesson.proposedAudience}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', margin: '0.75rem 0 1rem 0' }}>
                      RoboBEE Innovators Academy
                    </div>
                    <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1.05rem' }}>
                      Motto: <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em><br />
                      In this hands-on engineering class, we explore real robotics principles,
                      test circuits and logic in simulations, and bring code to life on physical hardware!
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(245, 184, 0, 0.1)', border: '1px solid rgba(245, 184, 0, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#F5B800', fontWeight: 800, fontSize: '0.9rem' }}>⏱ LESSON DURATION</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>
                        {isCompactMode ? '60 Minutes (Compact)' : `${lesson.durationMinutes} Minutes (Full)`}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(107, 15, 36, 0.25)', border: '1px solid #6B0F24', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.9rem' }}>🛡 LAB SAFETY FIRST</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>
                        {lesson.safetyNotes[0] || 'Supervised low-voltage classroom activity.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 2: OBJECTIVES & TIME-BOXED RHYTHM */}
          {currentSlide === 1 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>LEARNING OUTCOMES & RHYTHM • SLIDE 2 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>What You Will Achieve & Class Rhythm</h1>
                <p className={styles.slideSubtitle}>Measurable student outcomes and time-boxed teacher/student actions.</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem' }}>
                  {/* Outcomes */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F5B800', marginBottom: '1.25rem' }}>
                      🎯 Measurable Learning Outcomes:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {lesson.outcomes.map((obj, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '1rem', color: '#f1f5f9', lineHeight: '1.5' }}>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rhythm Segments */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginBottom: '1.25rem' }}>
                      ⏳ Class Rhythm ({isCompactMode ? '60m' : `${lesson.durationMinutes}m`}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '360px', overflowY: 'auto' }}>
                      {lesson.classRhythm.map((seg, i) => (
                        <div key={i} style={{ background: '#1e293b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <strong style={{ color: '#F5B800' }}>{seg.segment}</strong>
                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{seg.minutes}m</span>
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}><strong>Teacher:</strong> {seg.teacherAction}</div>
                          <div style={{ color: '#f1f5f9', fontSize: '0.8rem', marginTop: '2px' }}><strong>Students:</strong> {seg.studentAction}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 3: CORE ROBOTICS CONCEPTS */}
          {currentSlide === 2 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>CORE ROBOTICS CONCEPTS • SLIDE 3 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>{lesson.concepts[0]?.title || lesson.title}</h1>
                <p className={styles.slideSubtitle}>Fundamental principles of hardware, software, and autonomous systems.</p>
              </div>
              <div className={styles.slideBody}>
                <div className={styles.flowStepGrid}>
                  {lesson.concepts.map((concept, idx) => (
                    <div key={idx} className={styles.flowStepCard}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: idx === 0 ? '#38bdf8' : idx === 1 ? '#F5B800' : '#34d399', textTransform: 'uppercase' }}>
                        Concept {idx + 1}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', margin: '0.5rem 0' }}>
                        {concept.title}
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {concept.explanation}
                      </p>
                      {concept.instructorNote && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#F5B800', background: 'rgba(245, 184, 0, 0.08)', padding: '0.5rem', borderRadius: '6px' }}>
                          💡 <em>Instructor Note:</em> {concept.instructorNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.goldenRuleBox}>
                  <div className={styles.goldenRuleTitle}>⚡ GOLDEN ENGINEERING SAFETY RULE:</div>
                  <div className={styles.goldenRuleText}>&ldquo;{lesson.safetyNotes[0] || 'Never modify powered wiring without instructor supervision.'}&rdquo;</div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 4: LIVE INTERACTIVE SIMULATOR */}
          {currentSlide === 3 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>LIVE CLASSROOM SIMULATION • SLIDE 4 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>Interactive Simulation & Virtual Testbed</h1>
                <p className={styles.slideSubtitle}>Test parameters live on the classroom smartboard before wiring physical hardware.</p>
              </div>
              <div className={styles.slideBody}>
                <CurriculumSimulator type={lesson.visualizerId} classNumber={lesson.sequence} />
              </div>
            </>
          )}

          {/* SLIDE 5: GUIDED CODE LAB WALKTHROUGH */}
          {currentSlide === 4 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>CODE LAB WALKTHROUGH • SLIDE 5 OF {totalSlides}</div>
                <h1 className={styles.slideTitle}>
                  {lesson.codeLab ? `${lesson.codeLab.language.toUpperCase()} Code Walkthrough` : 'Engineering Design & Flow'}
                </h1>
                <p className={styles.slideSubtitle}>Line-by-line inspection of instructions and pin mappings.</p>
              </div>
              <div className={styles.slideBody}>
                {lesson.codeLab ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
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
                  <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
                    <Wrench size={36} color="#F5B800" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>Design & Simulation Deliverable</div>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'center' }}>
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

            {/* Slide Dots */}
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
}
