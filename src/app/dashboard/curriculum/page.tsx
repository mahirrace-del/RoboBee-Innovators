"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./curriculum.module.css";
import { 
  ALL_ROBOTICS_LESSONS, 
  COURSE_SPACES, 
  RoboticsLesson, 
  CourseTier, 
  ClassStatus, 
  getLessonsByTier 
} from "@/lib/curriculumData";
import { CurriculumSimulator } from "@/components/curriculum/CurriculumSimulator";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { 
  Award, Lock, Unlock, CheckCircle, Clock, Copy, Check, Download, 
  HelpCircle, Eye, Zap, BookOpen, Layers, X, Tv, Shield, Radio, Sparkles, Code,
  Wrench, AlertTriangle, FileText, Activity, CheckSquare, Info, ArrowRight, ExternalLink
} from "lucide-react";

export default function MemberCurriculumPage() {
  const { user, userData } = useAuth();

  // Tier filter: 'all' or one of the 4 CourseTiers
  const [selectedTier, setSelectedTier] = useState<CourseTier | 'all'>('all');

  // Class status tracking (defaulting first 3 beginner and all 4 explorer classes to published for seamless exploration)
  const [classStatuses, setClassStatuses] = useState<{ [id: string]: ClassStatus }>({
    'exp-01': 'published',
    'exp-02': 'published',
    'exp-03': 'published',
    'exp-04': 'published',
    'beg-01': 'published',
    'beg-02': 'published',
    'beg-03': 'published',
  });

  // Selected lesson modal
  const [activeLesson, setActiveLesson] = useState<RoboticsLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'brief' | 'concept' | 'code' | 'buildpack' | 'sim' | 'troubleshoot'>('brief');

  // Completed classes tracking
  const [completedClasses, setCompletedClasses] = useState<{ [classId: string]: boolean }>({});
  const [userXp, setUserXp] = useState<number>(userData?.xp || 200);

  // Code copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Exit ticket submission state
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [revealedModelAnswers, setRevealedModelAnswers] = useState<{ [key: number]: boolean }>({});
  const [submittingQuiz, setSubmittingQuiz] = useState<boolean>(false);
  const [quizSuccess, setQuizSuccess] = useState<boolean>(false);

  // Projector preview
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
        console.warn("Firestore curriculum_status offline, using fallback state:", err);
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
        const completed: { [classId: string]: boolean } = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data && data.userId === user.uid && data.classId) {
            completed[data.classId] = true;
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
  const handleDownloadIno = (lesson: RoboticsLesson) => {
    if (!lesson.codeLab) return;
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
      const subId = `${user?.uid || 'anon'}_${activeLesson.id}_${Date.now()}`;
      await setDoc(doc(db, "curriculum_submissions", subId), {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'Student Pilot',
        classId: activeLesson.id,
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

      setCompletedClasses(prev => ({ ...prev, [activeLesson.id]: true }));
      setUserXp(prev => prev + 100);
      setQuizSuccess(true);
      setTimeout(() => setQuizSuccess(false), 4000);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      // Fallback local award
      setCompletedClasses(prev => ({ ...prev, [activeLesson.id]: true }));
      setUserXp(prev => prev + 100);
      setQuizSuccess(true);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Filter lessons based on active tier
  const visibleLessons = selectedTier === 'all'
    ? ALL_ROBOTICS_LESSONS
    : getLessonsByTier(selectedTier);

  const completedCount = Object.keys(completedClasses).length;

  return (
    <div className={styles.pageContainer}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className={styles.heroTopRow}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>RoboBEE Innovators Academy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard/curriculum/reference"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#6B0F24',
                border: '1px solid #F5B800',
                color: '#ffffff',
                padding: '0.4rem 0.95rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(107, 15, 36, 0.4)'
              }}
            >
              <BookOpen size={16} color="#F5B800" />
              <span>Arduino &amp; Robotics Field Guide ➔</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 1rem', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Award size={18} color="#F5B800" />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F5B800' }}>{userXp} RoboXP</span>
            </div>
          </div>
        </div>

        <h1 className={styles.heroTitle}>Robotics Academy &amp; Interactive Learning Journey</h1>
        <p className={styles.heroSubtitle}>
          <em>&ldquo;Dream. Invent. Experiment. Inspire.&rdquo;</em><br />
          Explore a 4-tier sequenced engineering progression: from your very first LED blink on the Arduino Uno
          to building obstacle-avoiding rovers, high-speed line followers, robotic pick-and-place grippers,
          and tournament-grade Mini-Sumo robots!
        </p>

        <div className={styles.heroStats}>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue}>{ALL_ROBOTICS_LESSONS.length} Classes</span>
            <span className={styles.heroStatLabel}>Total Academy Scope</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#10b981' }}>{completedCount}</span>
            <span className={styles.heroStatLabel}>Completed Badges</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#38bdf8' }}>4 Tracks</span>
            <span className={styles.heroStatLabel}>Explorer ➔ Advanced</span>
          </div>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatValue} style={{ color: '#F5B800' }}>Hardware + Sim</span>
            <span className={styles.heroStatLabel}>Zero-Lag Lab Mode</span>
          </div>
        </div>
      </div>

      {/* Course Tier Selector Navigation */}
      <div className={styles.tierNav}>
        <button
          onClick={() => setSelectedTier('all')}
          className={`${styles.tierTab} ${selectedTier === 'all' ? styles.tierTabActive : ''}`}
        >
          <span>All 36 Classes</span>
        </button>
        {COURSE_SPACES.map(cs => (
          <button
            key={cs.id}
            onClick={() => setSelectedTier(cs.id)}
            className={`${styles.tierTab} ${selectedTier === cs.id ? styles.tierTabActive : ''}`}
          >
            <span>{cs.title} ({cs.totalClasses})</span>
          </button>
        ))}
      </div>

      {/* Render Course Spaces */}
      {COURSE_SPACES.filter(cs => selectedTier === 'all' || selectedTier === cs.id).map(cs => {
        const spaceLessons = ALL_ROBOTICS_LESSONS.filter(l => l.courseId === cs.id);

        return (
          <section key={cs.id} className={styles.roadmapSection}>
            {/* Space Overview Card */}
            <div className={styles.spaceOverviewCard}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                  <span className={styles.spaceBadge}>{cs.badge}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{cs.proposedBand}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9' }}>
                  {cs.title}
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '750px', marginTop: '0.35rem', lineHeight: '1.5' }}>
                  {cs.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                  Hardware: <strong>{cs.recommendedHardware}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  {cs.statusNotice}
                </span>
              </div>
            </div>

            {/* Grid of Lessons */}
            <div className={styles.roadmapGrid}>
              {spaceLessons.map(lesson => {
                const status = classStatuses[lesson.id] || lesson.status;
                const isUnlocked = status === 'published' || status === 'live_in_class';
                const isCompleted = !!completedClasses[lesson.id];
                const isLive = status === 'live_in_class';

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setActiveLesson(lesson);
                        setActiveTab('brief');
                      }
                    }}
                    className={`${styles.roadmapCard} ${
                      isUnlocked ? styles.roadmapCardUnlocked : styles.roadmapCardLocked
                    } ${isLive ? styles.roadmapCardActive : ''}`}
                  >
                    <div>
                      <div className={styles.cardHeader}>
                        <span className={styles.cardClassCode}>{lesson.code}</span>
                        <span className={`${styles.cardStatusPill} ${
                          isLive ? styles.pillLive : isUnlocked ? styles.pillPublished : styles.pillLocked
                        }`}>
                          {isLive && <><Radio size={12} /> Live Now</>}
                          {!isLive && isUnlocked && <><Unlock size={12} /> Available</>}
                          {!isUnlocked && <><Lock size={12} /> Supervised</>}
                        </span>
                      </div>

                      <h3 className={styles.cardTitle}>{lesson.title}</h3>
                      <p className={styles.cardSubtitle}>{lesson.promise}</p>

                      <div style={{ marginTop: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.78rem' }}>
                        <span style={{ color: '#F5B800', fontWeight: 700 }}>Project: </span>
                        <span style={{ color: '#cbd5e1' }}>{lesson.project.name}</span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={13} color="#F5B800" />
                        <span>{lesson.durationMinutes} min</span>
                      </div>
                      <div>
                        {isCompleted ? (
                          <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle size={14} /> Completed
                          </span>
                        ) : isUnlocked ? (
                          <span style={{ color: '#38bdf8', fontWeight: 700 }}>Explore Lab ➔</span>
                        ) : (
                          <span style={{ color: '#64748b' }}>Instructor Supervised</span>
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

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <div className={styles.lessonModalOverlay} onClick={() => setActiveLesson(null)}>
          <div className={styles.lessonModal} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
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
                  style={{ background: '#6B0F24', color: '#ffffff', borderColor: '#F5B800' }}
                >
                  <Tv size={14} />
                  <span>Launch Live Projector</span>
                </button>
                <button
                  onClick={() => setActiveLesson(null)}
                  className={styles.closeModalBtn}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className={styles.lessonNavTabs}>
              <button
                onClick={() => setActiveTab('brief')}
                className={`${styles.lessonTabBtn} ${activeTab === 'brief' ? styles.lessonTabBtnActive : ''}`}
              >
                <BookOpen size={15} />
                <span>1. Overview &amp; Rhythm</span>
              </button>
              <button
                onClick={() => setActiveTab('concept')}
                className={`${styles.lessonTabBtn} ${activeTab === 'concept' ? styles.lessonTabBtnActive : ''}`}
              >
                <Layers size={15} />
                <span>2. Concepts &amp; Safety</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`${styles.lessonTabBtn} ${activeTab === 'code' ? styles.lessonTabBtnActive : ''}`}
              >
                <Code size={15} />
                <span>3. Code Lab</span>
              </button>
              <button
                onClick={() => setActiveTab('buildpack')}
                className={`${styles.lessonTabBtn} ${activeTab === 'buildpack' ? styles.lessonTabBtnActive : ''}`}
              >
                <Wrench size={15} />
                <span>4. Physical Build Pack</span>
              </button>
              <button
                onClick={() => setActiveTab('sim')}
                className={`${styles.lessonTabBtn} ${activeTab === 'sim' ? styles.lessonTabBtnActive : ''}`}
              >
                <Zap size={15} />
                <span>5. Interactive Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('troubleshoot')}
                className={`${styles.lessonTabBtn} ${activeTab === 'troubleshoot' ? styles.lessonTabBtnActive : ''}`}
              >
                <Award size={15} />
                <span>6. Debug &amp; Exit Ticket</span>
              </button>
            </div>

            {/* Modal Tab Body */}
            <div className={styles.lessonTabBody}>
              {/* TAB 1: OVERVIEW & RHYTHM */}
              {activeTab === 'brief' && (
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F5B800', marginBottom: '0.4rem' }}>
                    {activeLesson.title}
                  </h3>
                  <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                    {activeLesson.promise}
                  </p>

                  <div className={styles.twoColGrid}>
                    {/* Measurable Outcomes */}
                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                        🎯 Measurable Student Outcomes:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {activeLesson.outcomes.map((out, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.6rem' }}>
                            <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontSize: '0.88rem', color: '#f1f5f9' }}>{out}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Class Rhythm */}
                    <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                        ⏱ Time-Boxed Rhythm ({activeLesson.durationMinutes}m):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                        {activeLesson.classRhythm.map((seg, i) => (
                          <div key={i} style={{ background: '#090e18', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F5B800', fontWeight: 700 }}>
                              <span>{seg.segment}</span>
                              <span style={{ color: '#38bdf8' }}>{seg.minutes}m</span>
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>
                              Teacher: {seg.teacherAction}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vocabulary Table */}
                  <div style={{ background: '#111827', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
                    <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      📖 Key Technical Vocabulary:
                    </div>
                    <div className={styles.tableWrapper}>
                      <table className={styles.dataTable}>
                        <thead>
                          <tr>
                            <th>Term</th>
                            <th>Plain Language Meaning</th>
                            <th>Correct Technical Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeLesson.vocabulary.map((v, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 700, color: '#F5B800' }}>{v.term}</td>
                              <td style={{ color: '#cbd5e1' }}>{v.plainMeaning}</td>
                              <td style={{ color: '#38bdf8' }}>{v.technicalMeaning}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* FIELD GUIDE REFERENCE LINKS */}
                  {activeLesson.fieldGuideLinks && (
                    <div style={{ marginTop: '1.5rem', background: '#161B26', border: '1px solid #6B0F24', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ fontWeight: 800, color: '#F5B800', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <BookOpen size={18} />
                          <span>Arduino &amp; Robotics Field Guide References</span>
                        </div>
                        <Link
                          href="/dashboard/curriculum/reference"
                          style={{ fontSize: '0.82rem', color: '#F5B800', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                        >
                          <span>Open Full Library</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                        {/* Read Before Class */}
                        <div style={{ background: '#0b101b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            📘 Read Before Class
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {activeLesson.fieldGuideLinks.readBeforeClass.map(id => (
                              <Link
                                key={id}
                                href={`/dashboard/curriculum/reference?entry=${id}`}
                                style={{ fontSize: '0.82rem', color: '#f1f5f9', textDecoration: 'none', padding: '0.35rem 0.6rem', background: '#1e293b', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <span>{id.replace(/^fg-/, '').replace(/-/g, ' ')}</span>
                                <ArrowRight size={12} color="#F5B800" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Look Up While Building */}
                        <div style={{ background: '#0b101b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F5B800', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            🔍 Look Up While Building
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {activeLesson.fieldGuideLinks.lookUpWhileBuilding.map(id => (
                              <Link
                                key={id}
                                href={`/dashboard/curriculum/reference?entry=${id}`}
                                style={{ fontSize: '0.82rem', color: '#f1f5f9', textDecoration: 'none', padding: '0.35rem 0.6rem', background: '#1e293b', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <span>{id.replace(/^fg-/, '').replace(/-/g, ' ')}</span>
                                <ArrowRight size={12} color="#F5B800" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Go Deeper */}
                        <div style={{ background: '#0b101b', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            🚀 Go Deeper
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {activeLesson.fieldGuideLinks.goDeeper.map(id => (
                              <Link
                                key={id}
                                href={`/dashboard/curriculum/reference?entry=${id}`}
                                style={{ fontSize: '0.82rem', color: '#f1f5f9', textDecoration: 'none', padding: '0.35rem 0.6rem', background: '#1e293b', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              >
                                <span>{id.replace(/^fg-/, '').replace(/-/g, ' ')}</span>
                                <ArrowRight size={12} color="#F5B800" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CONCEPTS & SAFETY */}
              {activeTab === 'concept' && (
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' }}>
                    Core Engineering Concepts
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {activeLesson.concepts.map((concept, i) => (
                      <div key={i} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5B800', textTransform: 'uppercase' }}>
                          Concept {i + 1}
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f1f5f9', margin: '0.35rem 0 0.5rem 0' }}>
                          {concept.title}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>
                          {concept.explanation}
                        </p>
                        {concept.instructorNote && (
                          <div style={{ marginTop: '0.75rem', background: 'rgba(245, 184, 0, 0.08)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', color: '#F5B800' }}>
                            💡 <strong>Instructor Note:</strong> {concept.instructorNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(107, 15, 36, 0.25)', border: '1px solid #6B0F24', padding: '1.25rem', borderRadius: '12px' }}>
                    <div style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Shield size={16} />
                      <span>Lab Safety Checklist:</span>
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
                      {activeLesson.safetyNotes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: CODE LAB */}
              {activeTab === 'code' && (
                <div>
                  {activeLesson.codeLab ? (
                    <>
                      <div className={styles.codeHeaderRow}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                            {activeLesson.codeLab.language.toUpperCase()} Code Artifact
                          </span>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F5B800', marginTop: '2px' }}>
                            {activeLesson.project.name}
                          </h3>
                        </div>
                        <div className={styles.codeButtonsGroup}>
                          <button
                            onClick={() => handleCopyCode(activeLesson.codeLab!.code)}
                            className={styles.codeBtn}
                          >
                            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
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

                      <div className={styles.twoColGridEqual}>
                        {/* Pin Map */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <Activity size={16} />
                            <span>Microcontroller Pin Map</span>
                          </div>
                          <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                              <thead>
                                <tr>
                                  <th>Pin</th>
                                  <th>Connected Hardware</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(activeLesson.codeLab.pinMap).map(([pin, dev]) => (
                                  <tr key={pin}>
                                    <td style={{ fontWeight: 800, color: '#F5B800' }}>{pin}</td>
                                    <td style={{ color: '#cbd5e1' }}>{dev}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Setup & Upload Instructions */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <CheckSquare size={16} />
                            <span>Upload &amp; Verification Steps</span>
                          </div>
                          <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                            {activeLesson.codeLab.setupAndUpload.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* Code Explanations */}
                      <div className={styles.xrayCard}>
                        <div className={styles.xrayTitle}>
                          <Eye size={16} />
                          <span>Line-by-Line Code Explanations:</span>
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' }}>
                          {activeLesson.codeLab.explanations.map((exp, idx) => (
                            <li key={idx} style={{ marginBottom: '0.35rem' }}>{exp}</li>
                          ))}
                        </ul>
                      </div>

                      {activeLesson.codeLab.tweakTip && (
                        <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                          <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            💡 Student Tweak to Predict &amp; Test:
                          </div>
                          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.5' }}>
                            {activeLesson.codeLab.tweakTip}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <Wrench size={36} color="#F5B800" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>Design &amp; Systems Session</div>
                      <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto' }}>
                        This class focuses on mechanical design, CAD modeling, or simulation logic.
                        Check the Physical Build Pack and Simulator tabs for full deliverables!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PHYSICAL BUILD PACK */}
              {activeTab === 'buildpack' && (
                <div>
                  {activeLesson.physicalBuildPack ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Connection Diagram / Wiring Illustration */}
                      <div className={styles.buildPackCard}>
                        <div className={styles.buildPackTitle}>
                          <Info size={16} />
                          <span>Connection Diagram</span>
                        </div>
                        {activeLesson.physicalBuildPack.connectionPhotoOrClearlyLabeledIllustration ? (
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                              ⚠ Reference wiring illustration — verify against your exact board/module before applying power.
                              Instructor-developed. Proprietary — RoboBEE Innovators.
                            </div>
                            <img
                              src={activeLesson.physicalBuildPack.connectionPhotoOrClearlyLabeledIllustration}
                              alt={`Connection diagram for ${activeLesson.title}`}
                              style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', border: '1px solid #1e293b', background: '#090e18', display: 'block' }}
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div style={{ padding: '1rem', background: '#090e18', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                            No connection diagram available for this class. Use the wire table below.
                          </div>
                        )}
                      </div>

                      {/* Hardware BOM & Schematic */}
                      <div className={styles.buildPackGrid}>
                        {/* Component BOM */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <Wrench size={16} />
                            <span>Bill of Materials (Exact Hardware Variants)</span>
                          </div>
                          <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                              <thead>
                                <tr>
                                  <th>Component</th>
                                  <th>Exact Variant</th>
                                  <th>Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {activeLesson.physicalBuildPack.componentList.map((comp, idx) => (
                                  <tr key={idx}>
                                    <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{comp.name}</td>
                                    <td style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{comp.exactVariant}</td>
                                    <td style={{ color: '#F5B800', fontWeight: 800 }}>{comp.quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Schematic & Wiring Note */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <Activity size={16} />
                            <span>Circuit Schematic &amp; Layout</span>
                          </div>
                          <div style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                            <strong>Schematic Description:</strong><br />
                            {activeLesson.physicalBuildPack.schematic}
                          </div>
                          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                            <strong>Reference Board:</strong> {activeLesson.physicalBuildPack.verifiedBoardAndModules.join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Wire-by-Wire Connection Table */}
                      <div className={styles.buildPackCard}>
                        <div className={styles.buildPackTitle}>
                          <Activity size={16} />
                          <span>Pin-by-Pin &amp; Wire-by-Wire Connection Table</span>
                        </div>
                        <div className={styles.tableWrapper}>
                          <table className={styles.dataTable}>
                            <thead>
                              <tr>
                                <th>From (Source Pin)</th>
                                <th>To (Target Hardware)</th>
                                <th>Wire Color / Polarity Rule</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeLesson.physicalBuildPack.wireTable.map((wire, idx) => (
                                <tr key={idx}>
                                  <td style={{ fontWeight: 800, color: '#F5B800' }}>{wire.from}</td>
                                  <td style={{ color: '#38bdf8' }}>{wire.to}</td>
                                  <td style={{ color: '#cbd5e1' }}>{wire.wireOrPolarityNote || 'Standard Jumper Wire'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Assembly, Safety, and Test Cases */}
                      <div className={styles.buildPackGrid}>
                        {/* Assembly Checklist */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <CheckSquare size={16} />
                            <span>Numbered Assembly &amp; Power-Up Steps</span>
                          </div>
                          <ol style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                            {activeLesson.physicalBuildPack.assemblyAndPowerUpSteps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Test Cases */}
                        <div className={styles.buildPackCard}>
                          <div className={styles.buildPackTitle}>
                            <Zap size={16} />
                            <span>Required Test Cases &amp; Expected Results</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {activeLesson.physicalBuildPack.testCases.map((tc, idx) => (
                              <div key={idx} style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem', fontSize: '0.82rem' }}>
                                <div style={{ color: '#F5B800', fontWeight: 700 }}>Test Case {idx + 1}: {tc.action}</div>
                                <div style={{ color: '#10b981', marginTop: '2px' }}>➔ Expected: {tc.expectedResult}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <FileText size={36} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>Design &amp; Code-Only Module</div>
                      <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto' }}>
                        This class produces a digital model, CAD drawing, or simulation artifact rather than a physical circuit build.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: INTERACTIVE SIMULATOR */}
              {activeTab === 'sim' && (
                <div>
                  <CurriculumSimulator type={activeLesson.visualizerId} classNumber={activeLesson.sequence} />
                </div>
              )}

              {/* TAB 6: TROUBLESHOOTING & EXIT TICKET */}
              {activeTab === 'troubleshoot' && (
                <div>
                  {/* Troubleshooting Guide */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={18} />
                    <span>Calm Engineering Troubleshooting Guide</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                    {activeLesson.troubleshooting.map((tb, idx) => (
                      <div key={idx} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fca5a5' }}>
                          Symptom: {tb.symptom}
                        </div>
                        <div style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                          <strong>Checks in safe order:</strong> {tb.checks.join(' ➔ ')}
                        </div>
                        <div style={{ marginTop: '0.35rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                          <strong>Root Cause Explanation:</strong> {tb.explanation}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Exit Ticket Review Quiz */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F5B800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} />
                    <span>Exit Ticket &amp; Knowledge Reflection (+100 RoboXP)</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeLesson.exitTicket.map((ticket, idx) => (
                      <div key={idx} className={styles.exitCheckItem}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
                            <span style={{ color: '#F5B800', marginRight: '0.5rem' }}>Question {idx + 1}:</span>
                            {ticket.question}
                          </div>
                          <button
                            onClick={() => setRevealedModelAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className={styles.codeBtn}
                          >
                            <HelpCircle size={14} />
                            <span>{revealedModelAnswers[idx] ? 'Hide Rubric' : 'Reveal Model Reasoning'}</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Type your explanation or observation here..."
                          value={quizAnswers[idx] || ''}
                          onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: e.target.value })}
                          className={styles.quizInput}
                        />

                        {revealedModelAnswers[idx] && (
                          <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid #10b981', borderRadius: '4px', fontSize: '0.85rem', color: '#34d399' }}>
                            🎯 <strong>Model Reasoning:</strong> {ticket.rubricOrSampleReasoning}
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={handleQuizSubmit}
                        disabled={submittingQuiz}
                        className={styles.submitQuizBtn}
                      >
                        <Award size={18} />
                        <span>{submittingQuiz ? 'Submitting to Lab...' : 'Submit Exit Ticket (+100 RoboXP)'}</span>
                      </button>

                      {quizSuccess && (
                        <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle size={18} /> +100 RoboXP Awarded!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Projector View */}
      {projectorMode && activeLesson && (
        <ProjectorView
          lesson={activeLesson}
          onClose={() => setProjectorMode(false)}
        />
      )}
    </div>
  );
}
