"use client";

import React, { useState, useEffect } from "react";
import styles from "./curriculum.module.css";
import { CURRICULUM_CLASSES, CURRICULUM_STATS, ClassModule, ClassStatus } from "@/lib/curriculumData";
import { CurriculumSimulator } from "@/components/curriculum/CurriculumSimulator";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { 
  Award, Lock, Unlock, CheckCircle, Clock, Copy, Check, Download, 
  HelpCircle, Eye, Zap, BookOpen, Layers, X, Tv, Shield, Radio, Sparkles, Code
} from "lucide-react";

export default function MemberCurriculumPage() {
  const { user, userData } = useAuth();
  const [classStatuses, setClassStatuses] = useState<{ [id: string]: ClassStatus }>({
    'class-01': 'published',
    'class-02': 'published',
    'class-03': 'locked',
    'class-04': 'locked',
    'class-05': 'locked',
    'class-06': 'locked',
    'class-07': 'locked',
    'class-08': 'locked',
    'class-09': 'locked',
    'class-10': 'locked',
    'class-11': 'locked',
    'class-12': 'locked',
    'class-13': 'locked',
    'class-14': 'locked',
  });

  // Selected lesson modal
  const [activeLesson, setActiveLesson] = useState<ClassModule | null>(null);
  const [activeTab, setActiveTab] = useState<'brief' | 'concept' | 'code' | 'build' | 'sim' | 'quiz'>('brief');

  // Completed classes tracking
  const [completedClasses, setCompletedClasses] = useState<{ [classNumber: number]: boolean }>({});
  const [userXp, setUserXp] = useState<number>(userData?.xp || 200);

  // Code copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Checkbox state for 4 build steps
  const [buildStepsCompleted, setBuildStepsCompleted] = useState<{ [key: string]: boolean }>({});

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizHints, setQuizHints] = useState<{ [key: string]: boolean }>({});
  const [submittingQuiz, setSubmittingQuiz] = useState<boolean>(false);
  const [quizSuccess, setQuizSuccess] = useState<boolean>(false);

  // Projector preview for student/instructor
  const [projectorMode, setProjectorMode] = useState<boolean>(false);

  // Listen to Firestore class status updates
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "curriculum_status"), (snapshot) => {
        const updates: { [id: string]: ClassStatus } = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data && data.status) {
            updates[doc.id] = data.status;
          }
        });
        setClassStatuses(prev => ({ ...prev, ...updates }));
      }, (err) => {
        console.warn("Firestore curriculum_status offline, using local state:", err);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Error subscribing to curriculum_status:", e);
    }
  }, []);

  // Listen to user's completed quizzes in Firestore
  useEffect(() => {
    if (!user) return;
    try {
      const unsub = onSnapshot(collection(db, "curriculum_submissions"), (snapshot) => {
        const completed: { [classNum: number]: boolean } = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data && data.userId === user.uid && data.classNumber) {
            completed[data.classNumber] = true;
          }
        });
        setCompletedClasses(completed);
      }, (err) => {
        console.warn("Error reading submissions:", err);
      });
      return () => unsub();
    } catch (e) {}
  }, [user]);

  // Copy code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .ino file
  const handleDownloadIno = (lesson: ClassModule) => {
    const filename = `RoboBEE_${lesson.code.replace(' ', '_')}.ino`;
    const blob = new Blob([lesson.codeLab.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Submit exit check quiz
  const handleQuizSubmit = async () => {
    if (!activeLesson) return;
    setSubmittingQuiz(true);

    try {
      const subId = `${user?.uid || 'anon'}_class_${activeLesson.classNumber}_${Date.now()}`;
      await setDoc(doc(db, "curriculum_submissions", subId), {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'Student Pilot',
        classNumber: activeLesson.classNumber,
        classCode: activeLesson.code,
        classTitle: activeLesson.title,
        answers: quizAnswers,
        xpAwarded: 100,
        submittedAt: new Date().toISOString()
      });

      // Update user XP in Firestore if logged in
      if (user) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            xp: increment(100)
          });
        } catch (e) {}
      }

      setCompletedClasses(prev => ({ ...prev, [activeLesson.classNumber]: true }));
      setUserXp(prev => prev + 100);
      setQuizSuccess(true);
      setTimeout(() => {
        setQuizSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      // Fallback local award
      setCompletedClasses(prev => ({ ...prev, [activeLesson.classNumber]: true }));
      setUserXp(prev => prev + 100);
      setQuizSuccess(true);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const unlockedCount = Object.values(classStatuses).filter(s => s === 'published' || s === 'live_in_class').length;
  const completedCount = Object.keys(completedClasses).length;

  return (
    <div className={styles.pageContainer}>
      {/* Hero Banner */}
      <div className={styles.heroHeader}>
        <div className={styles.heroTopRow}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>ROVI Robotics Academy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 1rem', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Award size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>{userXp} RoboXP</span>
          </div>
        </div>

        <h1 className={styles.heroTitle}>My Robotics Journey & Interactive LMS</h1>
        <p className={styles.heroSubtitle}>
          Progress from foundational circuit physics and C++ code logic to building autonomous 
          obstacle-avoiding Smart Bees, high-speed line followers, robotic arms, and tournament Mini-Sumo robots!
        </p>

        <div className={styles.heroStats}>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue}>{unlockedCount} / 14</span>
            <span className={styles.heroStatLabel}>Classes Unlocked</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#10b981' }}>{completedCount}</span>
            <span className={styles.heroStatLabel}>Quizzes Completed</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#06b6d4' }}>{completedCount * 60} Mins</span>
            <span className={styles.heroStatLabel}>Lab Time Mastered</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#c084fc' }}>Level {completedCount < 4 ? '1 (Foundations)' : completedCount < 8 ? '2 (Motion & CAD)' : '3 (Advanced)'}</span>
            <span className={styles.heroStatLabel}>Engineering Rank</span>
          </div>
        </div>
      </div>

      {/* Gamified Roadmap by Levels */}
      {CURRICULUM_STATS.levels.map((lvl) => {
        const levelClasses = CURRICULUM_CLASSES.filter(c => c.level === lvl.name);

        return (
          <section key={lvl.name} className={styles.roadmapSection}>
            <div className={styles.roadmapHeader}>
              <div className={styles.roadmapTitle}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: lvl.color }} />
                <span>{lvl.name}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {lvl.description}
              </div>
            </div>

            <div className={styles.roadmapGrid}>
              {levelClasses.map((cls) => {
                const status = classStatuses[cls.id] || cls.status;
                const isUnlocked = status === 'published' || status === 'live_in_class';
                const isCompleted = !!completedClasses[cls.classNumber];
                const isLive = status === 'live_in_class';

                return (
                  <div
                    key={cls.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setActiveLesson(cls);
                        setActiveTab('brief');
                      }
                    }}
                    className={`${styles.roadmapCard} ${
                      isUnlocked ? styles.roadmapCardUnlocked : styles.roadmapCardLocked
                    } ${isLive ? styles.roadmapCardActive : ''}`}
                  >
                    <div>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardClassCode}>{cls.code}</span>
                        <span className={`${styles.cardStatusPill} ${
                          isLive ? styles.pillLive : isUnlocked ? styles.pillPublished : styles.pillLocked
                        }`}>
                          {isLive && <><Radio size={12} /> Live Now</>}
                          {!isLive && isUnlocked && <><Unlock size={12} /> Unlocked</>}
                          {!isUnlocked && <><Lock size={12} /> Locked</>}
                        </span>
                      </div>

                      <h3 className={styles.cardTitle}>{cls.title}</h3>
                      <p className={styles.cardSubtitle}>{cls.subtitle}</p>
                    </div>

                    <div className={styles.cardFooter}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={13} color="#f59e0b" />
                        <span>{cls.durationMinutes} min</span>
                      </div>
                      <div>
                        {isCompleted ? (
                          <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={14} /> Completed
                          </span>
                        ) : isUnlocked ? (
                          <span style={{ color: '#06b6d4', fontWeight: 700 }}>Open Lesson ➔</span>
                        ) : (
                          <span style={{ color: '#64748b' }}>Complete Class {cls.classNumber - 1}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Interactive Lesson View Modal */}
      {activeLesson && (
        <div className={styles.lessonModalOverlay} onClick={() => setActiveLesson(null)}>
          <div className={styles.lessonModal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.lessonModalHeader}>
              <div className={styles.lessonModalTitleGroup}>
                <span className={styles.cardClassCode} style={{ fontSize: '0.9rem' }}>
                  {activeLesson.code}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9' }}>
                  {activeLesson.title}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => setProjectorMode(true)}
                  className={styles.codeBtn}
                  style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderColor: '#f59e0b' }}
                >
                  <Tv size={14} />
                  <span>Projector Mode</span>
                </button>
                <button
                  onClick={() => setActiveLesson(null)}
                  className={styles.closeModalBtn}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs (6 Sections) */}
            <div className={styles.lessonNavTabs}>
              <button
                onClick={() => setActiveTab('brief')}
                className={`${styles.lessonTabBtn} ${activeTab === 'brief' ? styles.lessonTabBtnActive : ''}`}
              >
                <BookOpen size={15} />
                <span>1. Mission Brief & Rhythm</span>
              </button>
              <button
                onClick={() => setActiveTab('concept')}
                className={`${styles.lessonTabBtn} ${activeTab === 'concept' ? styles.lessonTabBtnActive : ''}`}
              >
                <Layers size={15} />
                <span>2. Concept & Golden Rule</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`${styles.lessonTabBtn} ${activeTab === 'code' ? styles.lessonTabBtnActive : ''}`}
              >
                <Code size={15} />
                <span>3. Arduino C++ Code Lab</span>
              </button>
              <button
                onClick={() => setActiveTab('build')}
                className={`${styles.lessonTabBtn} ${activeTab === 'build' ? styles.lessonTabBtnActive : ''}`}
              >
                <CheckCircle size={15} />
                <span>4. Hands-On Build Steps</span>
              </button>
              <button
                onClick={() => setActiveTab('sim')}
                className={`${styles.lessonTabBtn} ${activeTab === 'sim' ? styles.lessonTabBtnActive : ''}`}
              >
                <Zap size={15} />
                <span>5. Interactive Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`${styles.lessonTabBtn} ${activeTab === 'quiz' ? styles.lessonTabBtnActive : ''}`}
              >
                <Award size={15} />
                <span>6. Exit Check Quiz (+100 XP)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.lessonTabBody}>
              {/* TAB 1: MISSION BRIEF */}
              {activeTab === 'brief' && (
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>
                    Mission Brief: {activeLesson.title}
                  </h3>
                  <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '1.75rem' }}>
                    {activeLesson.subtitle}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                    {/* Objectives */}
                    <div style={{ background: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem', marginBottom: '1rem' }}>
                        🎯 What You Will Master:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {activeLesson.learningObjectives.map((obj, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.65rem' }}>
                            <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '0.95rem', color: '#f1f5f9' }}>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Class Rhythm */}
                    <div style={{ background: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#06b6d4', fontSize: '1rem', marginBottom: '1rem' }}>
                        ⏱ 60-Minute Class Rhythm:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <div style={{ background: '#0b0f19', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                          <strong style={{ color: '#f59e0b' }}>00-05m:</strong> {activeLesson.classRhythm.hook}
                        </div>
                        <div style={{ background: '#0b0f19', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                          <strong style={{ color: '#06b6d4' }}>05-15m:</strong> {activeLesson.classRhythm.concept}
                        </div>
                        <div style={{ background: '#0b0f19', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                          <strong style={{ color: '#10b981' }}>15-30m:</strong> {activeLesson.classRhythm.demo}
                        </div>
                        <div style={{ background: '#0b0f19', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                          <strong style={{ color: '#f43f5e' }}>30-55m:</strong> {activeLesson.classRhythm.buildTest}
                        </div>
                        <div style={{ background: '#0b0f19', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                          <strong style={{ color: '#a855f7' }}>55-60m:</strong> {activeLesson.classRhythm.exitCheck}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONCEPT & GOLDEN RULE */}
              {activeTab === 'concept' && (
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                    {activeLesson.coreConcept.headline}
                  </h3>
                  <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {activeLesson.coreConcept.summary}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                    {activeLesson.coreConcept.flowSteps.map((st, i) => (
                      <div key={i} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: i === 0 ? '#38bdf8' : i === 1 ? '#f59e0b' : '#34d399', textTransform: 'uppercase' }}>
                          {st.label}
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f1f5f9', margin: '0.35rem 0 0.5rem 0' }}>
                          {st.title}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.5' }}>
                          {st.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderLeft: '5px solid #f59e0b', padding: '1.25rem', borderRadius: '10px' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      ⚡ Golden Engineering Rule:
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fef3c7', marginTop: '0.35rem' }}>
                      &ldquo;{activeLesson.coreConcept.safetyOrGoldenRule}&rdquo;
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ARDUINO C++ CODE LAB */}
              {activeTab === 'code' && (
                <div>
                  <div className={styles.codeHeaderRow}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
                      {activeLesson.codeLab.title}
                    </h3>
                    <div className={styles.codeButtonsGroup}>
                      <button
                        onClick={() => handleCopyCode(activeLesson.codeLab.code)}
                        className={styles.codeBtn}
                      >
                        {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        <span>{copied ? 'Copied to Clipboard!' : 'Copy Arduino Code'}</span>
                      </button>
                      <button
                        onClick={() => handleDownloadIno(activeLesson)}
                        className={styles.codeBtn}
                      >
                        <Download size={14} />
                        <span>Download .ino Sketch</span>
                      </button>
                    </div>
                  </div>

                  <pre className={styles.codeEditorBox}>
                    <code>{activeLesson.codeLab.code}</code>
                  </pre>

                  {/* Line-by-Line X-Ray */}
                  <div className={styles.xrayCard}>
                    <div className={styles.xrayTitle}>
                      <Eye size={16} />
                      <span>Line-by-Line X-Ray &amp; Watch Notes:</span>
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                      {activeLesson.codeLab.watchForNotes.map((note, idx) => (
                        <li key={idx} style={{ marginBottom: '0.35rem' }}>{note}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tweak Tip */}
                  <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                    <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      💡 What Happens If? (Tweak Challenge):
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {activeLesson.codeLab.tweakTip}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: HANDS-ON BUILD STEPS */}
              {activeTab === 'build' && (
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.35rem' }}>
                    {activeLesson.handsOnActivity.title}
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    {activeLesson.handsOnActivity.subtitle}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                    {/* Interactive 4 Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {activeLesson.handsOnActivity.steps.map((st, i) => {
                        const stepKey = `${activeLesson.id}_step_${i}`;
                        const isDone = !!buildStepsCompleted[stepKey];

                        return (
                          <div
                            key={i}
                            onClick={() => setBuildStepsCompleted(prev => ({ ...prev, [stepKey]: !prev[stepKey] }))}
                            style={{
                              background: isDone ? 'rgba(16, 185, 129, 0.12)' : '#111827',
                              border: `1px solid ${isDone ? '#10b981' : '#1e293b'}`,
                              borderRadius: '10px',
                              padding: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.85rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: isDone ? '#10b981' : '#1e293b',
                              border: `2px solid ${isDone ? '#10b981' : '#475569'}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isDone ? '#0b0f19' : '#94a3b8',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}>
                              {isDone ? '✓' : i + 1}
                            </div>
                            <span style={{ fontSize: '0.95rem', color: isDone ? '#34d399' : '#f1f5f9', lineHeight: '1.4' }}>
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Success Criteria & Pro Challenge */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          ✅ Success Looks Like:
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.6' }}>
                          {activeLesson.handsOnActivity.successCriteria.map((sc, i) => (
                            <li key={i}>{sc}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                          🚀 Pro Level Challenge (Try Next):
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                          {activeLesson.handsOnActivity.tryNextAdvanced}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: INTERACTIVE SIMULATOR */}
              {activeTab === 'sim' && (
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.35rem' }}>
                    Virtual Circuit &amp; Logic Simulation
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    Interact with virtual pins, sliders, and signal flows before assembling the physical robot.
                  </p>
                  <CurriculumSimulator type={activeLesson.interactiveVisualType} classNumber={activeLesson.classNumber} />
                </div>
              )}

              {/* TAB 6: EXIT CHECK QUIZ */}
              {activeTab === 'quiz' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9' }}>
                        Class {activeLesson.classNumber} Exit Check (3 Questions)
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Answer the 3 review questions in your own words to verify your skills and claim +100 RoboXP!
                      </p>
                    </div>
                    {completedClasses[activeLesson.classNumber] && (
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid #10b981', padding: '0.35rem 0.85rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle size={16} /> Completed (+100 XP Claimed)
                      </span>
                    )}
                  </div>

                  {quizSuccess && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '10px', padding: '1rem', color: '#34d399', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={20} />
                      <span>Congratulations! +100 RoboXP has been awarded to your account!</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {activeLesson.exitCheckQuestions.map((q, idx) => (
                      <div key={q.id} className={styles.exitCheckItem}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
                            <span style={{ color: '#f59e0b', marginRight: '0.5rem' }}>Question {idx + 1}:</span>
                            {q.question}
                          </div>
                          <button
                            onClick={() => setQuizHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                            style={{ background: 'transparent', border: 'none', color: '#06b6d4', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <HelpCircle size={14} />
                            <span>{quizHints[q.id] ? 'Hide Hint' : 'Hint'}</span>
                          </button>
                        </div>

                        {quizHints[q.id] && (
                          <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', background: 'rgba(6, 182, 212, 0.1)', borderLeft: '3px solid #06b6d4', borderRadius: '4px', fontSize: '0.85rem', color: '#38bdf8' }}>
                            💡 {q.hint}
                          </div>
                        )}

                        <textarea
                          rows={2}
                          placeholder="Type your explanation in your own words..."
                          value={quizAnswers[q.id] || ''}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className={styles.quizInput}
                        />
                      </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        onClick={handleQuizSubmit}
                        disabled={submittingQuiz}
                        className={styles.submitQuizBtn}
                      >
                        <Award size={18} />
                        <span>{submittingQuiz ? 'Submitting...' : 'Submit Exit Check & Claim +100 RoboXP'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Classroom Projector Mode Modal */}
      {projectorMode && activeLesson && (
        <ProjectorView
          lesson={activeLesson}
          onClose={() => setProjectorMode(false)}
        />
      )}
    </div>
  );
}
