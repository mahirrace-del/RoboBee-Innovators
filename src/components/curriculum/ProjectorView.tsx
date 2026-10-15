"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./projectorView.module.css";
import { ClassModule } from "@/lib/curriculumData";
import { CurriculumSimulator } from "./CurriculumSimulator";
import { 
  Play, Pause, RotateCcw, Maximize, X, ArrowLeft, ArrowRight,
  Clock, Shield, CheckCircle, Code, Eye, HelpCircle, Phone, MapPin
} from "lucide-react";

interface ProjectorViewProps {
  lesson: ClassModule;
  onClose: () => void;
}

export function ProjectorView({ lesson, onClose }: ProjectorViewProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 8;

  // 60-min timer (3600 seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(3600);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Exit Check reveal state for instructor
  const [revealedHints, setRevealedHints] = useState<{ [key: string]: boolean }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});

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
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(3600);
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

  // Determine current class rhythm phase based on elapsed seconds (3600 down to 0)
  const elapsed = 3600 - timerSeconds;
  const getRhythmPhase = () => {
    if (elapsed < 300) return 'Phase 1: Hook (5m)';
    if (elapsed < 900) return 'Phase 2: Concept (10m)';
    if (elapsed < 1800) return 'Phase 3: Live Demo (15m)';
    if (elapsed < 3300) return 'Phase 4: Build & Test (25m)';
    return 'Phase 5: Exit Check (5m)';
  };

  return (
    <div className={styles.projectorOverlay}>
      {/* Top Projector Toolbar */}
      <header className={styles.topBar}>
        <div className={styles.brandGroup}>
          <span className={styles.classCodeTag}>{lesson.code}</span>
          <span className={styles.classTitleText}>{lesson.title}</span>
        </div>

        {/* 60-Minute Classroom Rhythm Timer */}
        <div className={styles.timerWidget}>
          <Clock size={16} color="#f59e0b" />
          <span className={styles.timerClock}>{formatTimer(timerSeconds)}</span>
          <span className={styles.timerPhaseBadge}>{getRhythmPhase()}</span>
          <button onClick={toggleTimer} className={styles.actionBtn} title={timerRunning ? "Pause timer" : "Start timer"}>
            {timerRunning ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={resetTimer} className={styles.actionBtn} title="Reset to 60:00">
            <RotateCcw size={14} />
          </button>
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
                <div className={styles.slideNumberBadge}>ROBOBEE INNOVATORS ACADEMY • SLIDE 1 OF 8</div>
                <h1 className={styles.slideTitle}>{lesson.title}</h1>
                <p className={styles.slideSubtitle}>{lesson.subtitle}</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Level: {lesson.level}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', margin: '0.75rem 0 1rem 0' }}>
                      Smart Bee Robotics & Curriculum System
                    </div>
                    <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1.05rem' }}>
                      Welcome, young engineers! In this 60-minute hands-on module, we will explore 
                      real electronics, design algorithms, build circuits, and run live engineering tests.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>⏱ DURATION</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>60 Minutes</div>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.9rem' }}>🏆 REWARD</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>+100 RoboXP</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 2: OBJECTIVES & 60-MIN RHYTHM */}
          {currentSlide === 1 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>MISSION OBJECTIVES • SLIDE 2 OF 8</div>
                <h1 className={styles.slideTitle}>What You Will Learn & 60-Minute Rhythm</h1>
                <p className={styles.slideSubtitle}>Target learning outcomes and pacing breakdown.</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem' }}>
                  {/* Objectives */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '1.25rem' }}>
                      🎯 Learning Goals for Today:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {lesson.learningObjectives.map((obj, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '1.05rem', color: '#f1f5f9', lineHeight: '1.5' }}>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 60-Min Rhythm */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#06b6d4', marginBottom: '1.25rem' }}>
                      ⏳ 60-Minute Class Rhythm:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ background: '#1e293b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <strong style={{ color: '#f59e0b' }}>00-05m:</strong> {lesson.classRhythm.hook}
                      </div>
                      <div style={{ background: '#1e293b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <strong style={{ color: '#06b6d4' }}>05-15m:</strong> {lesson.classRhythm.concept}
                      </div>
                      <div style={{ background: '#1e293b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <strong style={{ color: '#10b981' }}>15-30m:</strong> {lesson.classRhythm.demo}
                      </div>
                      <div style={{ background: '#1e293b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <strong style={{ color: '#f43f5e' }}>30-55m:</strong> {lesson.classRhythm.buildTest}
                      </div>
                      <div style={{ background: '#1e293b', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <strong style={{ color: '#a855f7' }}>55-60m:</strong> {lesson.classRhythm.exitCheck}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 3: CORE CONCEPT & GOLDEN RULE */}
          {currentSlide === 2 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>CORE ROBOTICS CONCEPT • SLIDE 3 OF 8</div>
                <h1 className={styles.slideTitle}>{lesson.coreConcept.headline}</h1>
                <p className={styles.slideSubtitle}>{lesson.coreConcept.summary}</p>
              </div>
              <div className={styles.slideBody}>
                <div className={styles.flowStepGrid}>
                  {lesson.coreConcept.flowSteps.map((step, idx) => (
                    <div key={idx} className={styles.flowStepCard}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: idx === 0 ? '#38bdf8' : idx === 1 ? '#f59e0b' : '#34d399', textTransform: 'uppercase' }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0.5rem 0' }}>
                        {step.title}
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={styles.goldenRuleBox}>
                  <div className={styles.goldenRuleTitle}>⚡ GOLDEN ENGINEERING RULE:</div>
                  <div className={styles.goldenRuleText}>&ldquo;{lesson.coreConcept.safetyOrGoldenRule}&rdquo;</div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 4: LIVE INTERACTIVE SIMULATOR */}
          {currentSlide === 3 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>LIVE CLASSROOM SIMULATION • SLIDE 4 OF 8</div>
                <h1 className={styles.slideTitle}>Interactive Hardware & Logic Simulator</h1>
                <p className={styles.slideSubtitle}>Test parameters live on the smartboard before touching physical hardware.</p>
              </div>
              <div className={styles.slideBody}>
                <CurriculumSimulator type={lesson.interactiveVisualType} classNumber={lesson.classNumber} />
              </div>
            </>
          )}

          {/* SLIDE 5: GUIDED ARDUINO C++ CODE */}
          {currentSlide === 4 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>CODE LAB WALKTHROUGH • SLIDE 5 OF 8</div>
                <h1 className={styles.slideTitle}>{lesson.codeLab.title}</h1>
                <p className={styles.slideSubtitle}>Line-by-line inspection of microcontroller instructions.</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                  <pre className={styles.codeWalkthroughBox}>
                    <code>{lesson.codeLab.code}</code>
                  </pre>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        🔍 Key Lines to Watch:
                      </div>
                      <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {lesson.codeLab.watchForNotes.map((note, idx) => (
                          <li key={idx} style={{ marginBottom: '0.35rem' }}>{note}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                        💡 Tweak Tip to Try:
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {lesson.codeLab.tweakTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 6: 4-STEP HANDS-ON BUILD */}
          {currentSlide === 5 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>25-MINUTE HANDS-ON BUILD • SLIDE 6 OF 8</div>
                <h1 className={styles.slideTitle}>{lesson.handsOnActivity.title}</h1>
                <p className={styles.slideSubtitle}>{lesson.handsOnActivity.subtitle}</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                  {/* 4 Steps */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {lesson.handsOnActivity.steps.map((st, i) => (
                      <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                        <div style={{ background: '#f59e0b', color: '#0b0f19', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <div style={{ color: '#f1f5f9', fontSize: '0.95rem', lineHeight: '1.4' }}>{st}</div>
                      </div>
                    ))}
                  </div>

                  {/* Criteria & Pro Challenge */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        ✅ Success Looks Like:
                      </div>
                      <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {lesson.handsOnActivity.successCriteria.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                      <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                        🚀 Pro Challenge (Faster Learners):
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {lesson.handsOnActivity.tryNextAdvanced}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SLIDE 7: INTERACTIVE EXIT CHECK QUIZ */}
          {currentSlide === 6 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>5-MINUTE EXIT CHECK QUIZ • SLIDE 7 OF 8</div>
                <h1 className={styles.slideTitle}>Classroom Review Quiz (+100 RoboXP)</h1>
                <p className={styles.slideSubtitle}>Answer these 3 core questions together before leaving the lab.</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {lesson.exitCheckQuestions.map((q, idx) => (
                    <div key={q.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>
                          <span style={{ color: '#f59e0b', marginRight: '0.5rem' }}>Question {idx + 1}:</span>
                          {q.question}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setRevealedHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                            className={styles.actionBtn}
                          >
                            <HelpCircle size={14} />
                            <span>{revealedHints[q.id] ? 'Hide Hint' : 'Show Hint'}</span>
                          </button>
                          <button
                            onClick={() => setRevealedAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                            className={`${styles.actionBtn} ${revealedAnswers[q.id] ? styles.closeBtn : ''}`}
                          >
                            <CheckCircle size={14} />
                            <span>{revealedAnswers[q.id] ? 'Hide Answer' : 'Reveal Answer'}</span>
                          </button>
                        </div>
                      </div>

                      {revealedHints[q.id] && (
                        <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.85rem', background: 'rgba(6, 182, 212, 0.1)', borderLeft: '3px solid #06b6d4', borderRadius: '4px', fontSize: '0.9rem', color: '#38bdf8' }}>
                          💡 <strong>Hint:</strong> {q.hint}
                        </div>
                      )}

                      {revealedAnswers[q.id] && (
                        <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.85rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid #10b981', borderRadius: '4px', fontSize: '0.9rem', color: '#34d399' }}>
                          🎯 <strong>Model Answer:</strong> {q.sampleAnswer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SLIDE 8: NEXT CLASS TEASER & LAB CONTACT */}
          {currentSlide === 7 && (
            <>
              <div className={styles.slideHeader}>
                <div className={styles.slideNumberBadge}>CLASSROOM WRAP-UP • SLIDE 8 OF 8</div>
                <h1 className={styles.slideTitle}>Great Work, Engineers!</h1>
                <p className={styles.slideSubtitle}>Remember to log into your ROVI Member Portal to copy code and submit your quiz.</p>
              </div>
              <div className={styles.slideBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2rem', borderRadius: '16px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      UP NEXT IN THE ACADEMY
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', margin: '0.75rem 0' }}>
                      {lesson.nextClassTeaser}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      Make sure your kit is packed safely in its case with all jumper wires, motor cables, and battery disconnects secure.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '2rem', borderRadius: '16px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' }}>
                      RoboBEE Innovators Lab
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={16} color="#f59e0b" />
                        <span>+880 1902-821018</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <MapPin size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>Kids Den Int. Preschool, North Chashara, Narayanganj</span>
                      </div>
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
