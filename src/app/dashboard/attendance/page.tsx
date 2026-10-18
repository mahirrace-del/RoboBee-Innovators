"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, setDoc, serverTimestamp 
} from "firebase/firestore";
import { 
  ALL_ROBOTICS_LESSONS, 
  RoboticsLesson, 
  getLessonById 
} from "@/lib/curriculumData";
import { 
  ScheduledClassSession, 
  calculateScheduleProgression, 
  getLessonForSession,
  getMemberAttendanceRecord 
} from "@/lib/scheduleAttendance";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import styles from "./attendance.module.css";
import { 
  Calendar, CheckCircle, Clock, Users, BookOpen, 
  Award, Tv, ArrowRight, Shield, AlertCircle, Sparkles, Check
} from "lucide-react";

export default function AttendancePage() {
  const { user, userData, role } = useAuth();
  const isAdmin = role === 'admin';

  const [sessions, setSessions] = useState<ScheduledClassSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [projectorLesson, setProjectorLesson] = useState<RoboticsLesson | null>(null);

  // Subscribe to real-time sessions
  useEffect(() => {
    const qSessions = query(collection(db, "sessions"), orderBy("date", "desc"));
    const unsub = onSnapshot(qSessions, (snap) => {
      const loaded: ScheduledClassSession[] = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          lessonId: data.lessonId || "",
          lessonCode: data.lessonCode || "",
          title: data.title || "Robotics Class",
          courseTier: data.courseTier || "beginner",
          date: data.date || "",
          time: data.time || "15:30",
          durationMinutes: data.durationMinutes || 60,
          status: data.status || "upcoming",
          instructor: data.instructor || "RoboBEE Faculty",
          location: data.location || "RoboBEE Lab",
          attendees: Array.isArray(data.attendees) ? data.attendees : [],
          notes: data.notes || ""
        };
      });
      setSessions(loaded);
      setLoading(false);
    }, (err) => {
      console.warn("Could not subscribe to sessions:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Compute Progression (Active, Next, Completed)
  const progression = useMemo(() => calculateScheduleProgression(sessions), [sessions]);

  // Compute Current User's Attendance History & Stats
  const userStats = useMemo(() => {
    if (!user) return { attendedCount: 0, totalHeld: 0, percentage: 100, history: [] };
    return getMemberAttendanceRecord(sessions, user.uid, user.email || undefined);
  }, [sessions, user]);

  // Handle Member Self Check-In for Live Session
  const handleCheckIn = async (sessionId: string, session: ScheduledClassSession) => {
    if (!user) return;
    try {
      // 1. Update session attendees array with strictly the student's unique UID
      await updateDoc(doc(db, "sessions", sessionId), {
        attendees: arrayUnion(user.uid),
        updatedAt: serverTimestamp()
      });

      // 2. Write attendance record in attendance collection for dedication score
      const attId = `${sessionId}_${user.uid}`;
      await setDoc(doc(db, "attendance", attId), {
        userId: user.uid,
        userEmail: user.email || "",
        sessionId: sessionId,
        classId: session.lessonId || sessionId,
        className: session.title,
        date: session.date,
        status: "present",
        verifiedAt: serverTimestamp()
      }, { merge: true });

      alert("Successfully checked in to today's live robotics session! 🎉");
    } catch (error) {
      console.error("Check-in error:", error);
      alert("Failed to check in. Please notify your lab instructor.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className={styles.title}>
              <Calendar size={28} color="#F5B800" />
              Class Schedule &amp; Attendance
            </h1>
            <p className={styles.subtitle}>
              Track your robotics class progression, check into active lab sessions, and review what was taught in past classes.
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/dashboard/admin/attendance"
              className={styles.actionBtn}
              style={{ background: '#6B0F24', borderColor: '#F5B800', color: '#ffffff' }}
            >
              <Shield size={16} color="#F5B800" />
              Instructor Attendance Command
            </Link>
          )}
        </div>
      </div>

      {/* Member Attendance Overview Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>My Attendance Rate</span>
          <span className={styles.statValue} style={{ color: userStats.percentage >= 80 ? '#10b981' : '#F5B800' }}>
            {userStats.percentage}%
          </span>
          <span className={styles.statSub}>
            {userStats.attendedCount} of {userStats.totalHeld} completed lab sessions attended
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Academy Scope</span>
          <span className={styles.statValue}>
            {progression.completedSessions.length} / 36
          </span>
          <span className={styles.statSub}>
            Classes conducted across 4 Engineering Tracks
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Dedication Tier</span>
          <span className={styles.statValue} style={{ color: '#F5B800', fontSize: '1.4rem' }}>
            {userStats.percentage >= 90 ? 'Master Innovator' : userStats.percentage >= 75 ? 'Active Engineer' : 'Apprentice'}
          </span>
          <span className={styles.statSub}>
            Earn 10 Dedication XP per attended class
          </span>
        </div>
      </div>

      {/* Spotlight Row: Live Session + Next Class Up */}
      <div className={styles.spotlightRow}>
        {/* 1. Live Class Spotlight */}
        {progression.activeSession ? (
          <div className={`${styles.spotlightCard} ${styles.spotlightActive}`}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className={styles.badgeLive}>
                  <span className={styles.livePulseDot} />
                  Class Currently in Session
                </span>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {progression.activeSession.time || '15:30'}
                </span>
              </div>

              <div className={styles.lessonTag}>{progression.activeSession.lessonCode}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0 0.5rem 0' }}>
                {progression.activeSession.title}
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                {getLessonForSession(progression.activeSession)?.promise || "Active laboratory build sprint."}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                📍 {progression.activeSession.location}
              </div>
            </div>

            <div>
              {/* Check-In Button for Member */}
              {(() => {
                const isCheckedIn = (progression.activeSession.attendees || []).some(
                  a => a === user?.uid || (user?.email && a.toLowerCase() === user.email.toLowerCase())
                );

                if (isCheckedIn) {
                  return (
                    <div className={`${styles.checkInBtn} ${styles.checkInBtnDisabled}`}>
                      <CheckCircle size={18} />
                      You Are Checked In ✓
                    </div>
                  );
                }

                return (
                  <button
                    onClick={() => handleCheckIn(progression.activeSession!.id, progression.activeSession!)}
                    className={styles.checkInBtn}
                  >
                    <Check size={18} />
                    Check In Now (I am in Lab)
                  </button>
                );
              })()}

              {progression.activeSession.lessonId && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      const l = getLessonById(progression.activeSession!.lessonId);
                      if (l) setProjectorLesson(l);
                    }}
                    className={styles.actionBtn}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Tv size={14} />
                    Follow Along on Slides
                  </button>
                  <Link
                    href={`/dashboard/curriculum`}
                    className={styles.actionBtn}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <BookOpen size={14} />
                    View Code Lab
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.spotlightCard}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <Clock size={16} />
                Lab Status
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                No Active Class Today
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                Check-in buttons activate automatically when the instructor starts a laboratory session.
              </p>
            </div>
          </div>
        )}

        {/* 2. Up Next: Next Scheduled Class */}
        <div className={styles.spotlightCard}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className={styles.badgeUpcoming}>
                <Clock size={14} />
                Up Next in Schedule
              </span>
              {progression.nextSession && (
                <span style={{ fontSize: '0.8rem', color: '#F5B800', fontWeight: 700 }}>
                  📅 {progression.nextSession.date} &bull; {progression.nextSession.time || '15:30'}
                </span>
              )}
            </div>

            {progression.nextSession ? (
              <>
                <div className={styles.lessonTag}>{progression.nextSession.lessonCode}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0 0.5rem 0' }}>
                  {progression.nextSession.title}
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                  {getLessonForSession(progression.nextSession)?.promise || "Upcoming hands-on robotics session."}
                </p>

                {/* Pre-Class Reading Hook */}
                {(() => {
                  const lesson = getLessonForSession(progression.nextSession);
                  if (lesson?.fieldGuideLinks?.readBeforeClass?.length) {
                    return (
                      <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(245, 184, 0, 0.1)', border: '1px solid rgba(245, 184, 0, 0.25)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem', color: '#F5B800' }}>
                        📖 <strong>Pre-Class Reading:</strong> Review the Field Guide before coming to the lab!
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            ) : (
              <>
                <div className={styles.lessonTag}>{progression.suggestedNextLesson.code}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: '0.2rem 0 0.5rem 0' }}>
                  Next in Syllabus: {progression.suggestedNextLesson.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  The instructor will publish the next session date shortly. Read ahead in the curriculum!
                </p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/dashboard/curriculum"
              className={styles.actionBtn}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <BookOpen size={14} />
              Preview Lesson Material
            </Link>
            <Link
              href="/dashboard/curriculum/reference"
              className={styles.actionBtn}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Sparkles size={14} />
              Open Field Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Classes Taken / Participation History ("Taken Away") */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={20} color="#10b981" />
          Classes Taken &amp; My Attendance Record ({userStats.history.length})
        </h2>

        {userStats.history.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(22, 27, 38, 0.5)', borderRadius: '12px' }}>
            No completed classes recorded yet. Once classes are conducted in the lab, your personal attendance record will appear here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userStats.history.map(({ session, lesson, attended }) => {
              return (
                <div
                  key={session.id}
                  className={`${styles.historyCard} ${attended ? styles.historyCardAttended : styles.historyCardMissed}`}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className={styles.lessonTag}>{session.lessonCode}</span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        📅 {session.date} &bull; {session.time || '15:30'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                      {session.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', maxWidth: '750px', lineHeight: '1.4' }}>
                      {lesson?.promise || "Completed robotics laboratory session."}
                    </p>
                  </div>

                  <div className={styles.historyActions}>
                    {/* Status Badge */}
                    <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
                      {attended ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 800
                        }}>
                          <CheckCircle size={14} />
                          Attended ✓ (+10 XP)
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 700
                        }}>
                          <AlertCircle size={14} />
                          Missed Class
                        </span>
                      )}
                    </div>

                    {/* Quick Access to Class Material */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {lesson && (
                        <button
                          onClick={() => setProjectorLesson(lesson)}
                          className={styles.actionBtn}
                        >
                          <Tv size={14} />
                          Review Slides
                        </button>
                      )}
                      <Link
                        href="/dashboard/curriculum"
                        className={styles.actionBtn}
                      >
                        <BookOpen size={14} />
                        View Notes &amp; Code
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Projector View Modal */}
      {projectorLesson && (
        <ProjectorView
          lesson={projectorLesson}
          onClose={() => setProjectorLesson(null)}
        />
      )}
    </div>
  );
}
