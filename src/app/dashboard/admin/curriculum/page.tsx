"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./adminCurriculum.module.css";
import { 
  ALL_ROBOTICS_LESSONS, 
  COURSE_SPACES, 
  RoboticsLesson, 
  CourseTier, 
  ClassStatus, 
  getLessonsByTier 
} from "@/lib/curriculumData";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { 
  Tv, Lock, Unlock, Eye, Clock, 
  Users, Award, Radio, BookOpen, Calendar, PlusCircle, Trash2, Layers
} from "lucide-react";
import { CustomSlideBlock, SlideBlockType } from "@/lib/portalRelations";

export default function AdminCurriculumPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'classes' | 'builder' | 'submissions'>('classes');
  const [selectedTier, setSelectedTier] = useState<CourseTier | 'all'>('all');

  const [classStatuses, setClassStatuses] = useState<{ [id: string]: ClassStatus }>({
    'exp-01': 'published',
    'exp-02': 'published',
    'exp-03': 'published',
    'exp-04': 'published',
    'beg-01': 'published',
    'beg-02': 'published',
    'beg-03': 'published',
  });

  // Projector modal
  const [projectorClass, setProjectorClass] = useState<RoboticsLesson | null>(null);

  // Submissions list from Firestore
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);

  // Slide Block Builder (Admin CMS) state
  const [customBlocks, setCustomBlocks] = useState<CustomSlideBlock[]>([]);
  const [builderLessonId, setBuilderLessonId] = useState<string>("beg-01");
  const [blockType, setBlockType] = useState<SlideBlockType>("text");
  const [blockTitle, setBlockTitle] = useState<string>("");
  const [blockContent, setBlockContent] = useState<string>("");
  const [blockCodeLang, setBlockCodeLang] = useState<"cpp" | "python">("cpp");
  const [blockMediaUrl, setBlockMediaUrl] = useState<string>("");
  const [savingBlock, setSavingBlock] = useState<boolean>(false);

  // Load real-time class status overrides from Firestore
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
      console.warn("Firestore onSnapshot error:", e);
    }
  }, []);

  // Load submissions & custom slide blocks from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "curriculum_submissions"), orderBy("submittedAt", "desc"), limit(50));
      const unsubSubs = onSnapshot(q, (snapshot) => {
        const subs: any[] = [];
        snapshot.forEach((doc) => {
          subs.push({ id: doc.id, ...doc.data() });
        });
        setSubmissions(subs);
        setLoadingSubs(false);
      }, (err) => {
        console.warn("Could not load curriculum submissions:", err);
        setLoadingSubs(false);
      });

      const unsubBlocks = onSnapshot(collection(db, "curriculum_custom_blocks"), (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomSlideBlock));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCustomBlocks(list);
      });

      return () => {
        unsubSubs();
        unsubBlocks();
      };
    } catch {
      setLoadingSubs(false);
    }
  }, []);

  // Update status in Firestore & local state
  const updateStatus = async (classId: string, newStatus: ClassStatus) => {
    setClassStatuses(prev => ({ ...prev, [classId]: newStatus }));
    try {
      await setDoc(doc(db, "curriculum_status", classId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to sync status to Firestore:", err);
    }
  };

  // Quick action: Publish tier
  const publishTier = async (tier: CourseTier | 'all') => {
    const targetLessons = tier === 'all' 
      ? ALL_ROBOTICS_LESSONS 
      : getLessonsByTier(tier);

    if (!confirm(`Publish all ${targetLessons.length} classes to members?`)) return;

    const newStatuses: { [id: string]: ClassStatus } = { ...classStatuses };
    for (const c of targetLessons) {
      newStatuses[c.id] = 'published';
      try {
        await setDoc(doc(db, "curriculum_status", c.id), {
          status: 'published',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {}
    }
    setClassStatuses(newStatuses);
  };

  const handleAddSlideBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim() || !blockContent.trim()) return;
    setSavingBlock(true);
    const existingForLesson = customBlocks.filter(b => b.lessonId === builderLessonId);
    try {
      await addDoc(collection(db, "curriculum_custom_blocks"), {
        lessonId: builderLessonId,
        blockType,
        title: blockTitle.trim(),
        content: blockContent.trim(),
        codeLang: blockType === "code" ? blockCodeLang : null,
        mediaUrl: blockMediaUrl.trim() || null,
        order: existingForLesson.length + 1,
        createdBy: user?.email || "Instructor",
        updatedAt: new Date().toISOString(),
      });
      setBlockTitle("");
      setBlockContent("");
      setBlockMediaUrl("");
      alert("Modular Slide Block added to Lesson Deck!");
    } catch (err) {
      console.error("Failed to add slide block:", err);
      alert("Error saving custom slide block.");
    } finally {
      setSavingBlock(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Remove this custom slide block?")) return;
    try {
      await deleteDoc(doc(db, "curriculum_custom_blocks", blockId));
    } catch (err) {
      console.error("Error deleting block:", err);
    }
  };

  const publishedCount = Object.values(classStatuses).filter(s => s === 'published').length;
  const liveCount = Object.values(classStatuses).filter(s => s === 'live_in_class').length;

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <Radio size={28} color="#F5B800" />
            Curriculum &amp; Classroom Command Center
          </h1>
          <p>
            RoboBEE Innovators Academy Master Portal: Launch full-screen live projector slides,
            author modular slide blocks in the CMS, publish build packs, and evaluate student exit tickets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard/admin/attendance"
            className={styles.statusBtn}
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', background: '#111827', color: '#10b981', borderColor: '#10b981', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <Calendar size={14} style={{ marginRight: '6px' }} />
            Class Schedule &amp; Attendance
          </Link>
          <Link
            href="/dashboard/curriculum/reference"
            className={styles.statusBtn}
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', background: '#111827', color: '#F5B800', borderColor: '#F5B800', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          >
            <BookOpen size={14} style={{ marginRight: '6px' }} />
            Open Field Guide
          </Link>
          <button 
            onClick={() => publishTier(selectedTier)} 
            className={styles.statusBtn} 
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', background: '#6B0F24', color: '#fff', borderColor: '#F5B800' }}
          >
            <Unlock size={14} style={{ marginRight: '6px' }} />
            Publish Active Track
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Academy Scope</span>
          <span className={styles.statValue}>{ALL_ROBOTICS_LESSONS.length} Classes</span>
          <span className={styles.statSub}>4 Tiered Engineering Tracks</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Published to Members</span>
          <span className={styles.statValue} style={{ color: '#10b981' }}>{publishedCount} Unlocked</span>
          <span className={styles.statSub}>{((publishedCount / ALL_ROBOTICS_LESSONS.length) * 100).toFixed(0)}% available online</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Live Sessions</span>
          <span className={styles.statValue} style={{ color: '#06b6d4' }}>{liveCount} Live</span>
          <span className={styles.statSub}>Projector in lab</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Exit Check Submissions</span>
          <span className={styles.statValue} style={{ color: '#F5B800' }}>{submissions.length}</span>
          <span className={styles.statSub}>Knowledge reflections evaluated</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button
          onClick={() => setActiveTab('classes')}
          className={`${styles.tabBtn} ${activeTab === 'classes' ? styles.tabBtnActive : ''}`}
        >
          Curriculum Classes ({ALL_ROBOTICS_LESSONS.length})
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`${styles.tabBtn} ${activeTab === 'builder' ? styles.tabBtnActive : ''}`}
        >
          Slide Block Builder CMS ({customBlocks.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`${styles.tabBtn} ${activeTab === 'submissions' ? styles.tabBtnActive : ''}`}
        >
          Exit Check Submissions ({submissions.length})
        </button>
      </div>

      {/* TAB 1: CURRICULUM CLASSES */}
      {activeTab === 'classes' && (
        <>
          {/* Tier Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <button
              onClick={() => setSelectedTier('all')}
              style={{
                background: selectedTier === 'all' ? '#6B0F24' : '#111827',
                border: '1px solid',
                borderColor: selectedTier === 'all' ? '#F5B800' : '#1e293b',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              All 36 Classes
            </button>
            {COURSE_SPACES.map(cs => (
              <button
                key={cs.id}
                onClick={() => setSelectedTier(cs.id)}
                style={{
                  background: selectedTier === cs.id ? '#6B0F24' : '#111827',
                  border: '1px solid',
                  borderColor: selectedTier === cs.id ? '#F5B800' : '#1e293b',
                  color: selectedTier === cs.id ? '#fff' : '#94a3b8',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {cs.title} ({cs.totalClasses})
              </button>
            ))}
          </div>

          {COURSE_SPACES.filter(cs => selectedTier === 'all' || selectedTier === cs.id).map((cs) => {
            const levelClasses = ALL_ROBOTICS_LESSONS.filter(c => c.courseId === cs.id);

            return (
              <section key={cs.id} className={styles.levelSection}>
                <div className={styles.levelHeader}>
                  <div className={styles.levelDot} style={{ background: cs.accentColor }} />
                  <h2 className={styles.levelTitle}>{cs.title}</h2>
                  <span className={styles.levelSubtitle}>• {cs.proposedBand} • {cs.description}</span>
                </div>

                <div className={styles.cardsGrid}>
                  {levelClasses.map((cls) => {
                    const status = classStatuses[cls.id] || cls.status;
                    const completionCount = submissions.filter(s => s.classId === cls.id).length;

                    return (
                      <div key={cls.id} className={styles.classCard}>
                        <div>
                          <div className={styles.cardTop}>
                            <span className={styles.codeTag}>{cls.code}</span>
                            <span className={`${styles.badge} ${
                              status === 'published' ? styles.badgePublished : 
                              status === 'live_in_class' ? styles.badgeLive : 
                              styles.badgeLocked
                            }`}>
                              {status === 'published' && <><Eye size={12} /> Published</>}
                              {status === 'live_in_class' && <><Radio size={12} /> Live Class</>}
                              {status === 'locked' && <><Lock size={12} /> Locked</>}
                            </span>
                          </div>

                          <h3 className={styles.cardTitle}>{cls.title}</h3>
                          <p className={styles.cardSubtitle}>{cls.promise}</p>

                          <div className={styles.cardMetaRow}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Clock size={14} color="#F5B800" />
                              <span>{cls.durationMinutes} Mins</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Users size={14} color="#06b6d4" />
                              <span>{completionCount} Submissions</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Award size={14} color="#10b981" />
                              <span>+100 XP</span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          {/* Launch Projector Mode */}
                          <button
                            onClick={() => setProjectorClass(cls)}
                            className={styles.projectorBtn}
                          >
                            <Tv size={16} />
                            <span>Launch Live Projector</span>
                          </button>

                          {/* Status Toggle Buttons */}
                          <div className={styles.statusGroup}>
                            <button
                              onClick={() => updateStatus(cls.id, 'published')}
                              className={`${styles.statusBtn} ${status === 'published' ? styles.statusBtnActive : ''}`}
                              title="Make available to all logged-in students"
                            >
                              <Unlock size={14} />
                              <span>Unlock</span>
                            </button>
                            <button
                              onClick={() => updateStatus(cls.id, 'live_in_class')}
                              className={`${styles.statusBtn} ${status === 'live_in_class' ? styles.statusBtnLive : ''}`}
                              title="Mark as currently active in physical lab"
                            >
                              <Radio size={14} />
                              <span>Live</span>
                            </button>
                            <button
                              onClick={() => updateStatus(cls.id, 'locked')}
                              className={`${styles.statusBtn} ${status === 'locked' ? styles.statusBtnLocked : ''}`}
                              title="Lock class until students reach this milestone"
                            >
                              <Lock size={14} />
                              <span>Lock</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </>
      )}

      {/* TAB 2: SLIDE BLOCK BUILDER (ADMIN CMS) */}
      {activeTab === 'builder' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <div className={styles.submissionsCard}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} color="#F5B800" /> Modular Slide Block Builder (Admin CMS)
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Author supplemental modular content blocks (Concept Text, Pinout Diagram, Code Block, Safety Warning, Quiz Check, or Video) for any of the 36 classes.
            </p>
            <form onSubmit={handleAddSlideBlock} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 700 }}>
                  Target Curriculum Lesson
                </label>
                <select
                  value={builderLessonId}
                  onChange={(e) => setBuilderLessonId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#090e18', border: '1px solid #1e293b', color: '#f1f5f9' }}
                >
                  {ALL_ROBOTICS_LESSONS.map(l => (
                    <option key={l.id} value={l.id}>{l.code}: {l.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 700 }}>
                    Block Type
                  </label>
                  <select
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value as SlideBlockType)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#090e18', border: '1px solid #1e293b', color: '#f1f5f9' }}
                  >
                    <option value="text">Concept Text &amp; Bullet</option>
                    <option value="diagram">Circuit / Pinout Diagram</option>
                    <option value="code">Code Lab Block (C++ / Python)</option>
                    <option value="warning">Hardware Safety Alert</option>
                    <option value="quiz">Interactive Knowledge Check</option>
                    <option value="video">Lab Demonstration Video</option>
                  </select>
                </div>
                {blockType === 'code' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 700 }}>
                      Code Language
                    </label>
                    <select
                      value={blockCodeLang}
                      onChange={(e) => setBlockCodeLang(e.target.value as "cpp" | "python")}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#090e18', border: '1px solid #1e293b', color: '#f1f5f9' }}
                    >
                      <option value="cpp">Arduino C++ (.ino)</option>
                      <option value="python">MicroPython / ROS2 (.py)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 700 }}>
                  Slide Block Heading
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why Common Ground Between L298N and Arduino is Mandatory"
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#090e18', border: '1px solid #1e293b', color: '#f1f5f9' }}
                />
              </div>

              {(blockType === 'diagram' || blockType === 'video') && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 700 }}>
                    SVG Illustration Path or Video URL
                  </label>
                  <input
                    type="text"
                    placeholder="/illustrations/class1-breadboard-led-circuit.svg"
                    value={blockMediaUrl}
                    onChange={(e) => setBlockMediaUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#090e18', border: '1px solid #1e293b', color: '#f1f5f9' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 700 }}>
                  {blockType === 'code' ? 'Source Code Snippet' : 'Teaching Content / Speaker Notes'}
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder={blockType === 'code' ? 'void setup() {\n  pinMode(13, OUTPUT);\n}' : 'Enter detailed explanation or safety checklist items...'}
                  value={blockContent}
                  onChange={(e) => setBlockContent(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', background: '#090e18', border: '1px solid #1e293b', color: '#f1f5f9', fontFamily: blockType === 'code' ? 'var(--font-mono)' : 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={savingBlock}
                className={styles.projectorBtn}
                style={{ justifyContent: 'center', marginTop: '0.25rem' }}
              >
                <Layers size={16} />
                <span>{savingBlock ? 'Saving Block...' : 'Add Modular Block to Lesson'}</span>
              </button>
            </form>
          </div>

          <div className={styles.submissionsCard}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.85rem' }}>
              Published Custom Blocks for {ALL_ROBOTICS_LESSONS.find(l => l.id === builderLessonId)?.code}
            </h2>
            {customBlocks.filter(b => b.lessonId === builderLessonId).length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.86rem' }}>
                No custom blocks added to this lesson yet. All standard built-in slides and diagrams are active.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {customBlocks.filter(b => b.lessonId === builderLessonId).map((block) => (
                  <div key={block.id} style={{ background: '#090e18', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#F5B800', textTransform: 'uppercase', marginRight: '0.5rem' }}>
                          [{block.blockType}]
                        </span>
                        <strong style={{ color: '#f1f5f9', fontSize: '0.94rem' }}>{block.title}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(block.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete Block"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', fontFamily: block.blockType === 'code' ? 'var(--font-mono)' : 'inherit' }}>
                      {block.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SUBMISSIONS LOG */}
      {activeTab === 'submissions' && (
        <div className={styles.submissionsCard}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem' }}>
            Recent Exit Ticket Knowledge Reflections
          </h2>

          {loadingSubs ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              No student exit tickets submitted yet. When students complete a class quiz, their responses will appear here in real time!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map((sub) => (
                <div key={sub.id} style={{ background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5B800' }}>{sub.classCode || sub.classId}</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginLeft: '0.5rem' }}>{sub.classTitle}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                    Student: <strong>{sub.userEmail}</strong> • Awarded: <strong>+{sub.xpAwarded} RoboXP</strong>
                  </div>

                  <div style={{ background: '#111827', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>Answers Submitted:</div>
                    {sub.answers && typeof sub.answers === 'object' ? (
                      Object.entries(sub.answers).map(([qKey, ans]) => (
                        <div key={qKey} style={{ marginTop: '0.35rem' }}>
                          <span style={{ color: '#F5B800' }}>Q{Number(qKey) + 1}: </span>
                          <span style={{ color: '#cbd5e1' }}>{String(ans)}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#64748b' }}>No answer payload</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full-Screen Projector Slide Deck */}
      {projectorClass && (
        <ProjectorView
          lesson={projectorClass}
          onClose={() => setProjectorClass(null)}
        />
      )}
    </div>
  );
}
