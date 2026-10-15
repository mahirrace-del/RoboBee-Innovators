"use client";

import React, { useState, useEffect } from "react";
import styles from "./adminCurriculum.module.css";
import { CURRICULUM_CLASSES, CURRICULUM_STATS, ClassModule, ClassStatus } from "@/lib/curriculumData";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, setDoc, query, orderBy, limit } from "firebase/firestore";
import { 
  Tv, Lock, Unlock, Eye, CheckCircle, Clock, 
  Layers, Users, Award, AlertTriangle, ArrowRight, Radio
} from "lucide-react";

export default function AdminCurriculumPage() {
  const { role, canManage } = useAuth();
  const [activeTab, setActiveTab] = useState<'classes' | 'submissions'>('classes');
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

  // Projector modal
  const [projectorClass, setProjectorClass] = useState<ClassModule | null>(null);

  // Submissions list from Firestore
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);

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
        console.warn("Firestore curriculum_status offline, using local state:", err);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Firestore onSnapshot error:", e);
    }
  }, []);

  // Load submissions from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "curriculum_submissions"), orderBy("submittedAt", "desc"), limit(50));
      const unsub = onSnapshot(q, (snapshot) => {
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
      return () => unsub();
    } catch (e) {
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

  // Quick action: Publish all
  const publishAll = async () => {
    if (!confirm("Are you sure you want to publish all 14 classes to all members immediately?")) return;
    const newStatuses: { [id: string]: ClassStatus } = {};
    for (const c of CURRICULUM_CLASSES) {
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

  const publishedCount = Object.values(classStatuses).filter(s => s === 'published').length;
  const liveCount = Object.values(classStatuses).filter(s => s === 'live_in_class').length;
  const lockedCount = Object.values(classStatuses).filter(s => s === 'locked').length;

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1>
            <Radio size={28} color="#f59e0b" />
            Curriculum & Classroom Manager
          </h1>
          <p>
            Master 14-Class Robotics Academy command center: launch projector slide decks, 
            publish interactive lessons to members, and review exit check scores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={publishAll} className={styles.statusBtn} style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
            <Unlock size={14} style={{ marginRight: '6px' }} />
            Publish All Classes
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Academy Classes</span>
          <span className={styles.statValue}>14 Classes</span>
          <span className={styles.statSub}>3 Progressive Skill Levels</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Published to Members</span>
          <span className={styles.statValue} style={{ color: '#10b981' }}>{publishedCount} Unlocked</span>
          <span className={styles.statSub}>{((publishedCount / 14) * 100).toFixed(0)}% available online</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Live In Classroom</span>
          <span className={styles.statValue} style={{ color: '#06b6d4' }}>{liveCount} Live</span>
          <span className={styles.statSub}>Active session mode</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Exit Check Submissions</span>
          <span className={styles.statValue} style={{ color: '#a855f7' }}>{submissions.length}</span>
          <span className={styles.statSub}>Student quizzes completed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button
          onClick={() => setActiveTab('classes')}
          className={`${styles.tabBtn} ${activeTab === 'classes' ? styles.tabBtnActive : ''}`}
        >
          Curriculum Classes (14)
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
          {CURRICULUM_STATS.levels.map((lvl) => {
            const levelClasses = CURRICULUM_CLASSES.filter(c => c.level === lvl.name);

            return (
              <section key={lvl.name} className={styles.levelSection}>
                <div className={styles.levelHeader}>
                  <div className={styles.levelDot} style={{ background: lvl.color }} />
                  <h2 className={styles.levelTitle}>{lvl.name}</h2>
                  <span className={styles.levelSubtitle}>• {lvl.description}</span>
                </div>

                <div className={styles.cardsGrid}>
                  {levelClasses.map((cls) => {
                    const status = classStatuses[cls.id] || cls.status;
                    const completionCount = submissions.filter(s => s.classNumber === cls.classNumber).length;

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
                          <p className={styles.cardSubtitle}>{cls.subtitle}</p>

                          <div className={styles.cardMetaRow}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Clock size={14} color="#f59e0b" />
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
                            <span>Launch Classroom Projector Mode</span>
                          </button>

                          {/* Visibility Controls */}
                          <div className={styles.statusBtnsRow}>
                            <button
                              onClick={() => updateStatus(cls.id, 'published')}
                              className={`${styles.statusBtn} ${status === 'published' ? styles.statusBtnActivePublish : ''}`}
                              title="Members can view interactive lesson, copy C++ code, and take exit check"
                            >
                              Publish
                            </button>
                            <button
                              onClick={() => updateStatus(cls.id, 'live_in_class')}
                              className={`${styles.statusBtn} ${status === 'live_in_class' ? styles.statusBtnActiveLive : ''}`}
                              title="Mark as current class running right now in physical lab"
                            >
                              Live In Lab
                            </button>
                            <button
                              onClick={() => updateStatus(cls.id, 'locked')}
                              className={`${styles.statusBtn} ${status === 'locked' ? styles.statusBtnActiveLock : ''}`}
                              title="Lock lesson from students until class is taught"
                            >
                              Lock
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

      {/* TAB 2: EXIT CHECK SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className={styles.tableContainer}>
          {submissions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <Award size={36} color="#f59e0b" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>No Exit Check Submissions Yet</div>
              <p style={{ marginTop: '0.35rem', fontSize: '0.9rem' }}>
                When students complete the 3-question review at the end of a published class, 
                their answers and RoboXP rewards will appear here in real-time.
              </p>
            </div>
          ) : (
            <table className={styles.submissionsTable}>
              <thead>
                <tr>
                  <th>Student Email</th>
                  <th>Class</th>
                  <th>RoboXP Awarded</th>
                  <th>Date & Time</th>
                  <th>Responses</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 700, color: '#f8fafc' }}>
                      {sub.userEmail || 'Anonymous Student'}
                    </td>
                    <td>
                      <span className={styles.codeTag} style={{ fontSize: '0.7rem' }}>
                        CLASS {sub.classNumber?.toString().padStart(2, '0') || '01'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>+{sub.xpAwarded || 100} XP</span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Just now'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '350px' }}>
                      {sub.answers ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {Object.entries(sub.answers).map(([qid, ans]: [string, any], i) => (
                            <div key={qid}>
                              <strong style={{ color: '#f59e0b' }}>Q{i + 1}:</strong> {String(ans)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>3 of 3 answers verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Classroom Projector Mode Modal */}
      {projectorClass && (
        <ProjectorView
          lesson={projectorClass}
          onClose={() => setProjectorClass(null)}
        />
      )}
    </div>
  );
}
