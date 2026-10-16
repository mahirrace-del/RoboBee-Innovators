"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, query, onSnapshot, addDoc, updateDoc, doc, 
  serverTimestamp, orderBy, deleteDoc 
} from "firebase/firestore";
import { 
  ALL_ROBOTICS_LESSONS, 
  COURSE_SPACES, 
  RoboticsLesson, 
  CourseTier, 
  getLessonById 
} from "@/lib/curriculumData";
import { 
  ScheduledClassSession, 
  calculateScheduleProgression, 
  saveSessionAttendance, 
  getDefaultNextClassDate,
  getLessonForSession
} from "@/lib/scheduleAttendance";
import { ProjectorView } from "@/components/curriculum/ProjectorView";
import styles from "./admin-attendance.module.css";
import { 
  Calendar, CheckCircle, Clock, Users, Trash2, 
  Play, Radio, Tv, Search, Plus, Sparkles, BookOpen, AlertCircle, ArrowRight
} from "lucide-react";

export default function AdminAttendancePage() {
  const { role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_attendance");

  const [sessions, setSessions] = useState<ScheduledClassSession[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'sessions' | 'matrix'>('sessions');

  // Form State for Scheduling a Class
  const [selectedLessonId, setSelectedLessonId] = useState<string>("beg-01");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [newDate, setNewDate] = useState<string>(() => getDefaultNextClassDate().dateStr);
  const [newTime, setNewTime] = useState<string>(() => getDefaultNextClassDate().timeStr);
  const [location, setLocation] = useState<string>("RoboBEE Lab (Kids Den Int. Preschool)");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Active Session Attendance Taking
  const [activeAttendanceSession, setActiveAttendanceSession] = useState<ScheduledClassSession | null>(null);
  const [presentMemberIds, setPresentMemberIds] = useState<Set<string>>(new Set());
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>("");
  const [isSavingAttendance, setIsSavingAttendance] = useState<boolean>(false);

  // Projector View Modal
  const [projectorLesson, setProjectorLesson] = useState<RoboticsLesson | null>(null);

  // 1. Fetch Real-time Sessions
  useEffect(() => {
    if (!canAccess) return;

    const qSessions = query(collection(db, "sessions"), orderBy("date", "desc"));
    const unsubSessions = onSnapshot(qSessions, (snap) => {
      const loaded: ScheduledClassSession[] = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          lessonId: data.lessonId || "",
          lessonCode: data.lessonCode || "",
          title: data.title || "Robotics Class Session",
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
    });

    // 2. Fetch Active Members from users collection
    const qUsers = query(collection(db, "users"));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      const activeMembers = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((u: any) => u.role === "member" || u.role === "admin");
      setMembers(activeMembers);
    });

    return () => {
      unsubSessions();
      unsubUsers();
    };
  }, [canAccess]);

  // Compute Schedule Progression & Metrics
  const progression = useMemo(() => calculateScheduleProgression(sessions), [sessions]);

  // When progression updates, if selectedLessonId has not been chosen, default to suggestedNextLesson
  useEffect(() => {
    if (progression.suggestedNextLesson && !sessions.some(s => s.lessonId === selectedLessonId)) {
      setSelectedLessonId(progression.suggestedNextLesson.id);
    }
  }, [progression.suggestedNextLesson]);

  // Selected Lesson details for preview in form
  const currentSelectedLesson = useMemo(() => {
    return selectedLessonId === "custom" 
      ? null 
      : ALL_ROBOTICS_LESSONS.find(l => l.id === selectedLessonId);
  }, [selectedLessonId]);

  // Schedule a Class Session
  const handleScheduleClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    setIsCreating(true);

    try {
      let finalTitle = customTitle;
      let finalCode = "SPECIAL";
      let finalTier: CourseTier = "beginner";
      let duration = 60;

      if (currentSelectedLesson) {
        finalTitle = currentSelectedLesson.title;
        finalCode = currentSelectedLesson.code;
        finalTier = currentSelectedLesson.courseId;
        duration = currentSelectedLesson.durationMinutes;
      } else if (!finalTitle) {
        finalTitle = "Robotics Workshop Session";
      }

      await addDoc(collection(db, "sessions"), {
        lessonId: selectedLessonId === "custom" ? "" : selectedLessonId,
        lessonCode: finalCode,
        title: finalTitle,
        courseTier: finalTier,
        date: newDate,
        time: newTime,
        durationMinutes: duration,
        status: "upcoming",
        instructor: "RoboBEE Faculty",
        location: location,
        attendees: [],
        createdAt: serverTimestamp()
      });

      // Suggest the next lesson in sequence for the next form entry
      if (currentSelectedLesson) {
        const currIdx = ALL_ROBOTICS_LESSONS.findIndex(l => l.id === currentSelectedLesson.id);
        if (currIdx >= 0 && currIdx < ALL_ROBOTICS_LESSONS.length - 1) {
          setSelectedLessonId(ALL_ROBOTICS_LESSONS[currIdx + 1].id);
        }
      }
      setCustomTitle("");
      alert(`Successfully scheduled: ${finalTitle} on ${newDate}!`);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to schedule class session.");
    } finally {
      setIsCreating(false);
    }
  };

  // Quick Action: Auto-Schedule Next 4 Friday Classes
  const handleAutoScheduleNext4 = async () => {
    if (!confirm("Automatically schedule the next 4 Friday classes based on the curriculum sequence?")) return;

    try {
      const scheduledLessonIds = new Set(sessions.map(s => s.lessonId));
      const uncompletedLessons = ALL_ROBOTICS_LESSONS.filter(l => !scheduledLessonIds.has(l.id));

      if (uncompletedLessons.length === 0) {
        alert("All 36 curriculum classes are already scheduled!");
        return;
      }

      const classesToSchedule = uncompletedLessons.slice(0, 4);
      const baseDate = new Date();

      for (let i = 0; i < classesToSchedule.length; i++) {
        const lesson = classesToSchedule[i];
        const sessionDate = new Date();
        const day = sessionDate.getDay();
        const daysUntilFriday = (5 - day + 7) % 7 || 7;
        sessionDate.setDate(baseDate.getDate() + daysUntilFriday + (i * 7));

        const y = sessionDate.getFullYear();
        const m = String(sessionDate.getMonth() + 1).padStart(2, '0');
        const d = String(sessionDate.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        await addDoc(collection(db, "sessions"), {
          lessonId: lesson.id,
          lessonCode: lesson.code,
          title: lesson.title,
          courseTier: lesson.courseId,
          date: dateStr,
          time: "15:30",
          durationMinutes: lesson.durationMinutes,
          status: "upcoming",
          instructor: "RoboBEE Faculty",
          location: "RoboBEE Lab (Kids Den Int. Preschool)",
          attendees: [],
          createdAt: serverTimestamp()
        });
      }

      alert("Successfully scheduled the next 4 Friday classes!");
    } catch (err) {
      console.error("Auto-schedule error:", err);
      alert("Failed to auto-schedule sessions.");
    }
  };

  // Open Attendance Roster for a Session
  const handleOpenAttendance = (session: ScheduledClassSession) => {
    setActiveAttendanceSession(session);
    // Attendees can be stored as user IDs or emails; map to member IDs
    const presentIds = new Set<string>();
    (session.attendees || []).forEach(att => {
      // Find matching member by ID or by email
      const matched = members.find(m => m.id === att || (m.email && m.email.toLowerCase() === att.toLowerCase()));
      if (matched) presentIds.add(matched.id);
      else presentIds.add(att);
    });
    setPresentMemberIds(presentIds);
  };

  // Toggle Single Member Attendance
  const handleToggleMember = (memberId: string) => {
    setPresentMemberIds(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  // Mark All Present / Absent
  const handleMarkAll = (present: boolean) => {
    if (present) {
      setPresentMemberIds(new Set(members.map(m => m.id)));
    } else {
      setPresentMemberIds(new Set());
    }
  };

  // Save Attendance to Firestore
  const handleSaveAttendance = async () => {
    if (!activeAttendanceSession) return;
    setIsSavingAttendance(true);

    try {
      await saveSessionAttendance(
        activeAttendanceSession.id,
        {
          lessonId: activeAttendanceSession.lessonId,
          lessonCode: activeAttendanceSession.lessonCode,
          title: activeAttendanceSession.title,
          date: activeAttendanceSession.date
        },
        Array.from(presentMemberIds),
        members
      );

      alert(`Attendance saved: ${presentMemberIds.size} of ${members.length} members marked present.`);
      setActiveAttendanceSession(null);
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    } finally {
      setIsSavingAttendance(false);
    }
  };

  // Update Status of Session
  const handleUpdateStatus = async (sessionId: string, newStatus: 'upcoming' | 'active' | 'completed') => {
    try {
      await updateDoc(doc(db, "sessions", sessionId), { status: newStatus });
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  // Delete Session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this scheduled session? This will remove associated attendance records.")) return;
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
      if (activeAttendanceSession?.id === sessionId) setActiveAttendanceSession(null);
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  // Open Projector View for a Lesson
  const handleLaunchProjector = (lessonId?: string) => {
    if (!lessonId) return;
    const lesson = getLessonById(lessonId);
    if (lesson) setProjectorLesson(lesson);
  };

  if (!canAccess) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
        <h2>Permission Denied</h2>
        <p>You need Administrator or Attendance Management privileges to access this area.</p>
      </div>
    );
  }

  // Filter members in roster panel
  const filteredMembers = members.filter(m => {
    if (!memberSearchQuery) return true;
    const q = memberSearchQuery.toLowerCase();
    return (m.name && m.name.toLowerCase().includes(q)) || 
           (m.username && m.username.toLowerCase().includes(q)) ||
           (m.email && m.email.toLowerCase().includes(q));
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Calendar size={28} color="#F5B800" />
            Class Schedule &amp; Attendance Command
          </h1>
          <p className={styles.subtitle}>
            Seamlessly connect the RoboBEE 36-lesson curriculum with scheduled lab sessions.
            Track member attendance, monitor completed classes, and preview upcoming lessons.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleAutoScheduleNext4}
            className={styles.projectorBtn}
            title="Automatically schedule next 4 Friday classes"
          >
            <Sparkles size={16} color="#F5B800" />
            Auto-Schedule Next 4 Fridays
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`${styles.tabBtn} ${activeTab === 'sessions' ? styles.tabBtnActive : ''}`}
        >
          <Calendar size={16} />
          Class Schedule &amp; Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`${styles.tabBtn} ${activeTab === 'matrix' ? styles.tabBtnActive : ''}`}
        >
          <Users size={16} />
          Student Attendance Matrix ({members.length} Enrolled)
        </button>
      </div>

      {/* TAB 1: SCHEDULE & SESSIONS */}
      {activeTab === 'sessions' && (
        <>
          {/* Progression Spotlights: Live Session, Up Next, Completed Count */}
          <div className={styles.spotlightRow}>
            {/* 1. Live Class in Session */}
            {progression.activeSession ? (
              <div className={`${styles.spotlightCard} ${styles.spotlightActive}`}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className={styles.badgeLive}>
                      <span className={styles.livePulseDot} />
                      Class in Progress
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {progression.activeSession.time || '15:30'}
                    </span>
                  </div>
                  <div className={styles.lessonTag}>{progression.activeSession.lessonCode}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0 0.5rem 0' }}>
                    {progression.activeSession.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                    📍 {progression.activeSession.location}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleOpenAttendance(progression.activeSession!)}
                    className={styles.takeBtn}
                    style={{ flex: 1 }}
                  >
                    <Users size={16} />
                    Take Attendance ({progression.activeSession.attendees?.length || 0} / {members.length})
                  </button>
                  {progression.activeSession.lessonId && (
                    <button
                      onClick={() => handleLaunchProjector(progression.activeSession!.lessonId)}
                      className={styles.projectorBtn}
                    >
                      <Tv size={16} />
                      Projector
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateStatus(progression.activeSession!.id, 'completed')}
                    className={styles.statusToggleBtn}
                  >
                    End Session
                  </button>
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
                    No Active Class Currently Running
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                    Start an upcoming class session below when students enter the lab to enable live attendance check-ins.
                  </p>
                </div>
              </div>
            )}

            {/* 2. Up Next / Next Class Scheduled */}
            <div className={styles.spotlightCard}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={styles.badgeUpcoming}>
                    <Clock size={14} />
                    Next Scheduled Class
                  </span>
                  {progression.nextSession && (
                    <span style={{ fontSize: '0.8rem', color: '#F5B800', fontWeight: 700 }}>
                      📅 {progression.nextSession.date}
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
                      {getLessonForSession(progression.nextSession)?.promise || "Integrated robotics class session."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className={styles.lessonTag}>{progression.suggestedNextLesson.code}</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>
                      Next Up in Syllabus: {progression.suggestedNextLesson.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem', marginBottom: '1rem' }}>
                      No future session scheduled yet. Use the scheduler below to lock in the next class!
                    </p>
                  </>
                )}
              </div>

              {progression.nextSession && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleUpdateStatus(progression.nextSession!.id, 'active')}
                    className={styles.takeBtn}
                    style={{ flex: 1 }}
                  >
                    <Play size={14} />
                    Start Live Session
                  </button>
                  {progression.nextSession.lessonId && (
                    <button
                      onClick={() => handleLaunchProjector(progression.nextSession!.lessonId)}
                      className={styles.projectorBtn}
                    >
                      <Tv size={14} />
                      Slides
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3. Completed Classes Summary ("Taken Away") */}
            <div className={styles.spotlightCard}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <CheckCircle size={16} />
                  Curriculum Progress
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
                  {progression.completedSessions.length} / 36
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  Classes Conducted &amp; Attendance Recorded
                </div>
                {progression.lastCompletedSession && (
                  <div style={{ marginTop: '0.85rem', padding: '0.65rem 0.85rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <strong>Last Completed:</strong> {progression.lastCompletedSession.lessonCode} &bull; {progression.lastCompletedSession.date}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={activeAttendanceSession ? styles.layoutGridSplit : styles.layoutGrid}>
            {/* Left Column: Schedule New Class Form + Scheduled Sessions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Form: Schedule Class Linked to Curriculum */}
              <div className={styles.formCard}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} color="#F5B800" />
                  Schedule a Class from Curriculum
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Choose a lesson from the 36-class masterclass curriculum. Details and estimated duration will auto-populate.
                </p>

                <form onSubmit={handleScheduleClass}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Select Curriculum Lesson</label>
                    <select
                      value={selectedLessonId}
                      onChange={e => setSelectedLessonId(e.target.value)}
                      className={styles.inputField}
                    >
                      {COURSE_SPACES.map(cs => {
                        const tierLessons = ALL_ROBOTICS_LESSONS.filter(l => l.courseId === cs.id);
                        return (
                          <optgroup key={cs.id} label={`${cs.title} (${tierLessons.length} Classes)`}>
                            {tierLessons.map(lesson => (
                              <option key={lesson.id} value={lesson.id}>
                                {lesson.code}: {lesson.title} ({lesson.durationMinutes}m)
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                      <option value="custom">★ Custom Workshop / Hackathon / Special Session</option>
                    </select>
                  </div>

                  {/* If Custom Session */}
                  {selectedLessonId === "custom" && (
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Custom Session Title</label>
                      <input
                        type="text"
                        required
                        value={customTitle}
                        onChange={e => setCustomTitle(e.target.value)}
                        placeholder="e.g. National Robotics Olympiad Mock Tournament"
                        className={styles.inputField}
                      />
                    </div>
                  )}

                  {/* Selected Lesson Preview Pill */}
                  {currentSelectedLesson && (
                    <div style={{ padding: '0.85rem 1rem', background: 'rgba(107, 15, 36, 0.25)', border: '1px solid rgba(245, 184, 0, 0.3)', borderRadius: '8px', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, color: '#F5B800', fontSize: '0.85rem' }}>
                          {currentSelectedLesson.code} &bull; {currentSelectedLesson.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                          ⏱ {currentSelectedLesson.durationMinutes} Minutes
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0.25rem 0 0.5rem 0', lineHeight: '1.4' }}>
                        {currentSelectedLesson.promise}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Hardware Pack: {currentSelectedLesson.physicalBuildPack?.verifiedBoardAndModules.slice(0, 3).join(', ')}...
                      </div>
                    </div>
                  )}

                  {/* Date, Time, Location Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                      <label className={styles.inputLabel}>Date</label>
                      <input
                        type="date"
                        required
                        value={newDate}
                        onChange={e => setNewDate(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>

                    <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                      <label className={styles.inputLabel}>Time</label>
                      <input
                        type="time"
                        required
                        value={newTime}
                        onChange={e => setNewTime(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>

                    <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                      <label className={styles.inputLabel}>Location / Room</label>
                      <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className={styles.takeBtn}
                    style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem' }}
                  >
                    {isCreating ? "Scheduling Session..." : "+ Schedule Class Session"}
                  </button>
                </form>
              </div>

              {/* Scheduled Sessions List */}
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="#F5B800" />
                  All Scheduled Sessions ({sessions.length})
                </h2>

                {sessions.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: 'rgba(22, 27, 38, 0.5)', borderRadius: '12px' }}>
                    No sessions scheduled yet. Use the form above or click "Auto-Schedule Next 4 Fridays".
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sessions.map(session => {
                      const isActive = session.status === 'active';
                      const isCompleted = session.status === 'completed';
                      const isSelected = activeAttendanceSession?.id === session.id;
                      const attendanceCount = (session.attendees || []).length;

                      return (
                        <div
                          key={session.id}
                          className={`${styles.sessionCard} ${isActive ? styles.sessionActive : ''}`}
                          style={{
                            border: isSelected ? '1px solid #F5B800' : undefined
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span className={styles.lessonTag}>{session.lessonCode}</span>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: isActive ? 'rgba(239, 68, 68, 0.2)' : isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 184, 0, 0.15)',
                                color: isActive ? '#ef4444' : isCompleted ? '#10b981' : '#F5B800'
                              }}>
                                {session.status}
                              </span>
                            </div>

                            <div className={styles.sessionTitle}>{session.title}</div>
                            <div className={styles.sessionDate}>
                              <span>📅 {session.date}</span>
                              <span>&bull;</span>
                              <span>⏱ {session.time || '15:30'} ({session.durationMinutes}m)</span>
                              <span>&bull;</span>
                              <span style={{ color: attendanceCount > 0 ? '#10b981' : '#cbd5e1' }}>
                                👥 {attendanceCount} / {members.length} Present
                              </span>
                            </div>
                          </div>

                          <div className={styles.sessionActions}>
                            {/* Attendance Trigger */}
                            <button
                              onClick={() => handleOpenAttendance(session)}
                              className={styles.takeBtn}
                            >
                              <Users size={14} />
                              {attendanceCount > 0 ? 'Edit Attendance' : 'Take Attendance'}
                            </button>

                            {/* Projector Trigger */}
                            {session.lessonId && (
                              <button
                                onClick={() => handleLaunchProjector(session.lessonId)}
                                className={styles.projectorBtn}
                                title="Open Fullscreen Projector Slides"
                              >
                                <Tv size={14} />
                                Slides
                              </button>
                            )}

                            {/* Status Toggles */}
                            {session.status === 'upcoming' && (
                              <button
                                onClick={() => handleUpdateStatus(session.id, 'active')}
                                className={styles.statusToggleBtn}
                                title="Set class to live in session"
                              >
                                Start
                              </button>
                            )}
                            {session.status === 'active' && (
                              <button
                                onClick={() => handleUpdateStatus(session.id, 'completed')}
                                className={styles.statusToggleBtn}
                                style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                title="Mark class completed"
                              >
                                Complete
                              </button>
                            )}
                            {session.status === 'completed' && (
                              <button
                                onClick={() => handleUpdateStatus(session.id, 'upcoming')}
                                className={styles.statusToggleBtn}
                                title="Reopen session"
                              >
                                Reopen
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className={styles.delBtn}
                              title="Delete Session"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Attendance Roster Drawer (When taking attendance) */}
            {activeAttendanceSession && (
              <div className={styles.rosterPanel}>
                <div className={styles.rosterHeader}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className={styles.lessonTag}>{activeAttendanceSession.lessonCode}</span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{activeAttendanceSession.date}</span>
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                      {activeAttendanceSession.title}
                    </h2>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                      Present: <strong style={{ color: '#10b981' }}>{presentMemberIds.size}</strong> of {members.length} members
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveAttendanceSession(null)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
                  >
                    &times;
                  </button>
                </div>

                {/* Batch Actions & Search */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleMarkAll(true)}
                    style={{ flex: 1, padding: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => handleMarkAll(false)}
                    style={{ flex: 1, padding: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Mark All Absent
                  </button>
                </div>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Search enrolled member..."
                    value={memberSearchQuery}
                    onChange={e => setMemberSearchQuery(e.target.value)}
                    className={styles.inputField}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                  />
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                {/* Member Roster List */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingRight: '0.3rem' }}>
                  {filteredMembers.map(member => {
                    const isPresent = presentMemberIds.has(member.id);

                    return (
                      <div
                        key={member.id}
                        onClick={() => handleToggleMember(member.id)}
                        className={`${styles.memberRow} ${isPresent ? styles.memberRowPresent : styles.memberRowAbsent}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isPresent ? '#10b981' : '#334155',
                            color: '#ffffff',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem'
                          }}>
                            {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                              {member.name || member.email}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              @{member.username || member.email?.split('@')[0]}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isPresent ? (
                            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle size={14} /> Present
                            </span>
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Absent</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Save Footer */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <button
                    onClick={handleSaveAttendance}
                    disabled={isSavingAttendance}
                    className={styles.takeBtn}
                    style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
                  >
                    {isSavingAttendance ? "Saving Attendance..." : `Save Attendance (${presentMemberIds.size} Present)`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: STUDENT ATTENDANCE MATRIX */}
      {activeTab === 'matrix' && (
        <div className={styles.matrixTableWrapper}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Enrolled Student Participation Matrix
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Cross-sectional audit showing every student’s participation record across all completed and scheduled classes.
              </p>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Completed Sessions: <strong>{progression.completedSessions.length}</strong>
            </div>
          </div>

          {members.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
              No members enrolled yet.
            </div>
          ) : (
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th className={styles.matrixHeaderSticky}>Student Name</th>
                  <th>Attendance Rate</th>
                  <th>Total Classes</th>
                  {sessions.map(s => (
                    <th key={s.id} title={`${s.lessonCode}: ${s.title} (${s.date})`}>
                      <div style={{ fontSize: '0.7rem' }}>{s.lessonCode || 'CLASS'}</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{s.date.split('-').slice(1).join('/')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(member => {
                  // Calculate member attendance
                  let attendedCount = 0;
                  const totalSessions = sessions.length;

                  sessions.forEach(s => {
                    const attended = (s.attendees || []).some(
                      a => a === member.id || (member.email && a.toLowerCase() === member.email.toLowerCase())
                    );
                    if (attended) attendedCount++;
                  });

                  const pct = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 100;

                  return (
                    <tr key={member.id}>
                      <td className={styles.matrixHeaderSticky} style={{ fontWeight: 700, color: '#ffffff' }}>
                        <div>{member.name || member.email}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>@{member.username || 'user'}</div>
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 800,
                          color: pct >= 80 ? '#10b981' : pct >= 60 ? '#F5B800' : '#ef4444'
                        }}>
                          {pct}%
                        </span>
                      </td>
                      <td>
                        {attendedCount} / {totalSessions}
                      </td>
                      {sessions.map(s => {
                        const attended = (s.attendees || []).some(
                          a => a === member.id || (member.email && a.toLowerCase() === member.email.toLowerCase())
                        );
                        const isUpcoming = s.status === 'upcoming';

                        return (
                          <td key={s.id} style={{ textAlign: 'center' }}>
                            {attended ? (
                              <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                            ) : isUpcoming ? (
                              <span style={{ color: '#64748b' }}>-</span>
                            ) : (
                              <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

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
