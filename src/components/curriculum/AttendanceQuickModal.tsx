"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ALL_ROBOTICS_LESSONS,
  COURSE_SPACES,
  RoboticsLesson,
} from "@/lib/curriculumData";
import { EditableClassDeck } from "@/lib/slideStudioStore";
import {
  ScheduledClassSession,
  resolveUniquePresentMemberIds,
  getDefaultNextClassDate,
} from "@/lib/scheduleAttendance";
import {
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  UserCheck,
  UserX,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface AttendanceQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: EditableClassDeck[];
}

const DEFAULT_STUDENT_ROSTER = [
  { id: "stu-01", displayName: "Aarav Sharma", email: "aarav.s@kidsden.edu", role: "member" },
  { id: "stu-02", displayName: "Zunaira Rahman", email: "zunaira.r@kidsden.edu", role: "member" },
  { id: "stu-03", displayName: "Tasmia Islam", email: "tasmia.i@kidsden.edu", role: "member" },
  { id: "stu-04", displayName: "Rayan Ahmed", email: "rayan.a@kidsden.edu", role: "member" },
  { id: "stu-05", displayName: "Siddharth Verma", email: "siddharth.v@kidsden.edu", role: "member" },
  { id: "stu-06", displayName: "Ananya Sen", email: "ananya.s@kidsden.edu", role: "member" },
  { id: "stu-07", displayName: "Farhan Kazi", email: "farhan.k@kidsden.edu", role: "member" },
  { id: "stu-08", displayName: "Meherun Nisa", email: "meherun.n@kidsden.edu", role: "member" },
];

const DEFAULT_ACTIVE_SESSION: ScheduledClassSession = {
  id: "session-canonical-01",
  lessonId: "beg-01",
  lessonCode: "BEGINNER 01",
  title: "Welcome to Robotics: Meet Arduino, Then Make an LED Blink",
  courseTier: "beginner",
  date: new Date().toISOString().slice(0, 10),
  time: "15:30",
  durationMinutes: 120,
  status: "active",
  instructor: "RoboBEE Faculty Lead",
  location: "RoboBEE Hardware Lab (Kids Den)",
  attendees: ["stu-01", "stu-02", "stu-03", "stu-04"],
  notes: "120-minute canonical beginner workshop session",
};

export function AttendanceQuickModal({
  isOpen,
  onClose,
  decks,
}: AttendanceQuickModalProps) {
  const [sessions, setSessions] = useState<ScheduledClassSession[]>([DEFAULT_ACTIVE_SESSION]);
  const [members, setMembers] = useState<any[]>(DEFAULT_STUDENT_ROSTER);
  const [activeTab, setActiveTab] = useState<"take_attendance" | "schedule">("take_attendance");
  const [selectedSessionId, setSelectedSessionId] = useState<string>("session-canonical-01");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savingAttendance, setSavingAttendance] = useState<boolean>(false);

  // Quick enroll student form state
  const [showEnrollForm, setShowEnrollForm] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>("");
  const [newStudentEmail, setNewStudentEmail] = useState<string>("");

  // New session form state
  const [selectedLessonId, setSelectedLessonId] = useState<string>("beg-01");
  const [newDate, setNewDate] = useState<string>(() => getDefaultNextClassDate().dateStr);
  const [newTime, setNewTime] = useState<string>(() => getDefaultNextClassDate().timeStr);
  const [location, setLocation] = useState<string>("RoboBEE Lab (Kids Den Int. Preschool)");
  const [instructor, setInstructor] = useState<string>("RoboBEE Faculty");
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);

  const saveLocalSessions = (updated: ScheduledClassSession[]) => {
    try {
      localStorage.setItem("robobee_local_sessions_v1", JSON.stringify(updated));
    } catch {}
  };

  // 1. Fetch sessions from Firestore with local storage fallback
  useEffect(() => {
    if (!isOpen) return;

    try {
      const saved = localStorage.getItem("robobee_local_sessions_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setSelectedSessionId(parsed[0].id);
        }
      }
    } catch {}

    try {
      const qSessions = query(collection(db, "sessions"), orderBy("date", "desc"));
      const unsub = onSnapshot(
        qSessions,
        (snap) => {
          if (!snap.empty) {
            const loaded: ScheduledClassSession[] = snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                lessonId: data.lessonId || "",
                lessonCode: data.lessonCode || "",
                title: data.title || "Robotics Class Session",
                courseTier: data.courseTier || "beginner",
                date: data.date || "",
                time: data.time || "15:30",
                durationMinutes: data.durationMinutes || 120,
                status: data.status || "upcoming",
                instructor: data.instructor || "RoboBEE Faculty",
                location: data.location || "RoboBEE Lab",
                attendees: Array.isArray(data.attendees) ? data.attendees : [],
                notes: data.notes || "",
              };
            });
            setSessions(loaded);
            saveLocalSessions(loaded);
            if (loaded.length > 0) {
              setSelectedSessionId((prev) => (prev && loaded.some((s) => s.id === prev) ? prev : loaded[0].id));
            }
          }
        },
        (error) => {
          console.warn("Firestore sessions listener error (using local fallback):", error);
        }
      );
      return () => unsub();
    } catch {}
  }, [isOpen]);

  // 2. Fetch active members with local storage fallback
  useEffect(() => {
    if (!isOpen) return;

    try {
      const savedMembers = localStorage.getItem("robobee_enrolled_members_v1");
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
        }
      }
    } catch {}

    try {
      const qUsers = query(collection(db, "users"));
      const unsub = onSnapshot(
        qUsers,
        (snap) => {
          if (!snap.empty) {
            const activeMembers = snap.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((u: any) => u.role === "member" || u.role === "admin" || !u.role);
            if (activeMembers.length > 0) {
              setMembers(activeMembers);
              try {
                localStorage.setItem("robobee_enrolled_members_v1", JSON.stringify(activeMembers));
              } catch {}
            }
          }
        },
        (error) => {
          console.warn("Firestore users listener error (using local roster):", error);
        }
      );
      return () => unsub();
    } catch {}
  }, [isOpen]);

  const activeSession = useMemo(() => {
    return (
      sessions.find((s) => s.id === selectedSessionId) ||
      sessions[0] ||
      DEFAULT_ACTIVE_SESSION
    );
  }, [sessions, selectedSessionId]);

  const presentMemberIds = useMemo(() => {
    if (!activeSession) return new Set<string>();
    const clean = resolveUniquePresentMemberIds(activeSession.attendees, members);
    return new Set<string>(clean);
  }, [activeSession, members]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        (m.displayName && m.displayName.toLowerCase().includes(q)) ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q))
    );
  }, [members, searchQuery]);

  // Toggle single member attendance with immediate local state update
  const handleToggleMember = async (memberId: string) => {
    if (!activeSession) return;
    setSavingAttendance(true);
    const newSet = new Set(presentMemberIds);
    if (newSet.has(memberId)) {
      newSet.delete(memberId);
    } else {
      newSet.add(memberId);
    }
    const updatedAttendees = Array.from(newSet);
    const updatedSessions = sessions.map((s) =>
      s.id === activeSession.id ? { ...s, attendees: updatedAttendees } : s
    );
    setSessions(updatedSessions);
    saveLocalSessions(updatedSessions);

    try {
      await updateDoc(doc(db, "sessions", activeSession.id), {
        attendees: updatedAttendees,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Saved attendance locally (Firestore error):", err);
    } finally {
      setSavingAttendance(false);
    }
  };

  // Mark all present / absent with immediate local state update
  const handleBatchToggle = async (markAll: boolean) => {
    if (!activeSession || members.length === 0) return;
    setSavingAttendance(true);
    const updatedAttendees = markAll ? members.map((m) => m.id) : [];
    const updatedSessions = sessions.map((s) =>
      s.id === activeSession.id ? { ...s, attendees: updatedAttendees } : s
    );
    setSessions(updatedSessions);
    saveLocalSessions(updatedSessions);

    try {
      await updateDoc(doc(db, "sessions", activeSession.id), {
        attendees: updatedAttendees,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Saved batch attendance locally (Firestore error):", err);
    } finally {
      setSavingAttendance(false);
    }
  };

  // Quick enroll student to class roster
  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const newMember = {
      id: `stu-custom-${Date.now()}`,
      displayName: newStudentName.trim(),
      name: newStudentName.trim(),
      email: newStudentEmail.trim() || `${newStudentName.toLowerCase().replace(/\s+/g, ".")}@robobee.academy`,
      role: "member",
    };
    const updatedMembers = [newMember, ...members];
    setMembers(updatedMembers);
    try {
      localStorage.setItem("robobee_enrolled_members_v1", JSON.stringify(updatedMembers));
      addDoc(collection(db, "users"), newMember).catch(() => {});
    } catch {}
    setNewStudentName("");
    setNewStudentEmail("");
    setShowEnrollForm(false);
  };

  // Export CSV attendance report
  const handleExportAttendanceCsv = () => {
    if (!activeSession) return;
    const rows = [
      ["RoboBEE Classroom Studio - Class Attendance Report"],
      ["Class Session", activeSession.lessonCode, activeSession.title],
      ["Date & Time", `${activeSession.date} at ${activeSession.time}`],
      ["Location", activeSession.location],
      ["Instructor", activeSession.instructor],
      ["Present Count", `${presentMemberIds.size} / ${members.length}`],
      [],
      ["Student Name", "Email", "Status"],
      ...members.map((m) => [
        `"${m.displayName || m.name || "Student"}"`,
        `"${m.email || ""}"`,
        presentMemberIds.has(m.id) ? "PRESENT" : "ABSENT",
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Attendance_${activeSession.lessonCode.replace(/\s+/g, "_")}_${activeSession.date}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Schedule a new class session
  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    setIsScheduling(true);
    setScheduleSuccess(null);

    // Look up in custom decks first, then fallback to canonical lessons
    const matchedDeck = decks.find((d) => d.id === selectedLessonId);
    const matchedLesson =
      ALL_ROBOTICS_LESSONS.find((l) => l.id === selectedLessonId) ||
      ALL_ROBOTICS_LESSONS[0];

    const code = matchedDeck ? matchedDeck.classCode : matchedLesson.code;
    const title = matchedDeck ? matchedDeck.title : matchedLesson.title;
    const tier = matchedDeck ? (matchedDeck.courseId || "beginner") : matchedLesson.courseId;

    const newSessionItem: ScheduledClassSession = {
      id: `session-${Date.now()}`,
      lessonId: selectedLessonId,
      lessonCode: code,
      title: title,
      courseTier: tier,
      date: newDate,
      time: newTime,
      durationMinutes: 120,
      status: "upcoming",
      instructor: instructor.trim() || "RoboBEE Faculty",
      location: location.trim() || "RoboBEE Lab",
      attendees: [],
    };

    try {
      const docRef = await addDoc(collection(db, "sessions"), {
        ...newSessionItem,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      newSessionItem.id = docRef.id;
    } catch (err) {
      console.warn("Saved session locally (Firestore error):", err);
    }

    const nextSessions = [newSessionItem, ...sessions];
    setSessions(nextSessions);
    saveLocalSessions(nextSessions);
    setSelectedSessionId(newSessionItem.id);
    setScheduleSuccess(`Scheduled "${code}: ${title}" for ${newDate} at ${newTime}!`);
    setIsScheduling(false);
    setActiveTab("take_attendance");
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 14, 23, 0.86)",
        backdropFilter: "blur(12px)",
        zIndex: 99990,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "880px",
          maxHeight: "90vh",
          background: "#161B26",
          border: "1px solid #2E374B",
          borderRadius: "20px",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: "#FFFFFF",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.6rem",
            background: "linear-gradient(135deg, #1E2533 0%, #161B26 100%)",
            borderBottom: "1px solid #2E374B",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(245, 184, 0, 0.15)",
                border: "1px solid #F5B800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Calendar size={20} color="#F5B800" />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#F5B800",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                CLASSROOM STUDIO • RAPID ATTENDANCE
              </div>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                Class Attendance Manager
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <button
              type="button"
              onClick={handleExportAttendanceCsv}
              style={{
                padding: "0.45rem 0.8rem",
                borderRadius: "8px",
                background: "#1E2533",
                border: "1px solid #2E374B",
                color: "#F5B800",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Export CSV
            </button>
            <Link
              href="/dashboard/admin/attendance"
              target="_blank"
              style={{
                padding: "0.45rem 0.8rem",
                borderRadius: "8px",
                background: "#1E2533",
                border: "1px solid #2E374B",
                color: "#E2E8F0",
                fontSize: "0.76rem",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Full Workspace <ExternalLink size={13} color="#F5B800" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "#94A3B8",
                borderRadius: "8px",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            padding: "0.75rem 1.6rem 0 1.6rem",
            background: "#161B26",
            borderBottom: "1px solid #2E374B",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("take_attendance")}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px 8px 0 0",
              border: "1px solid",
              borderColor: activeTab === "take_attendance" ? "#2E374B" : "transparent",
              borderBottom: activeTab === "take_attendance" ? "2px solid #F5B800" : "none",
              background: activeTab === "take_attendance" ? "#1E2533" : "transparent",
              color: activeTab === "take_attendance" ? "#F5B800" : "#94A3B8",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Users size={14} /> Mark Attendance ({members.length} Enrolled)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px 8px 0 0",
              border: "1px solid",
              borderColor: activeTab === "schedule" ? "#2E374B" : "transparent",
              borderBottom: activeTab === "schedule" ? "2px solid #F5B800" : "none",
              background: activeTab === "schedule" ? "#1E2533" : "transparent",
              color: activeTab === "schedule" ? "#F5B800" : "#94A3B8",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Plus size={14} /> Schedule New Session
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.6rem" }}>
          {scheduleSuccess && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10B981",
                color: "#10B981",
                fontSize: "0.82rem",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CheckCircle2 size={16} /> {scheduleSuccess}
            </div>
          )}

          {activeTab === "take_attendance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {/* Session Selector Strip */}
              {sessions.length > 0 ? (
                <div
                  style={{
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    borderRadius: "12px",
                    padding: "0.9rem 1.1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ flex: "1 1 320px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#94A3B8",
                        marginBottom: "0.3rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Active Classroom Session:
                    </label>
                    <select
                      value={selectedSessionId}
                      onChange={(e) => setSelectedSessionId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        color: "#FFFFFF",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                      }}
                    >
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.lessonCode}: {s.title} ({s.date} • {s.time})
                        </option>
                      ))}
                    </select>
                  </div>

                  {activeSession && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        background: "#161B26",
                        border: "1px solid #2E374B",
                        borderRadius: "10px",
                        padding: "0.55rem 0.9rem",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 700 }}>
                          PRESENT RATIO
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>
                          {presentMemberIds.size} / {members.length}
                        </div>
                      </div>
                      <div
                        style={{
                          height: "28px",
                          width: "1px",
                          background: "#2E374B",
                        }}
                      />
                      <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                        <div>Date: <strong style={{ color: "#FFFFFF" }}>{activeSession.date}</strong></div>
                        <div>Duration: <strong style={{ color: "#F5B800" }}>{activeSession.durationMinutes || 120}m</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#94A3B8", margin: "0 0 0.75rem 0" }}>
                    No class sessions have been scheduled yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("schedule")}
                    style={{
                      padding: "0.55rem 1rem",
                      borderRadius: "8px",
                      background: "#6B0F24",
                      border: "1px solid #F5B800",
                      color: "#FFFFFF",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Plus size={14} color="#F5B800" /> Schedule First Session
                  </button>
                </div>
              )}

              {/* Student Search & Quick Batch Buttons */}
              {activeSession && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ position: "relative", flex: "1 1 240px" }}>
                      <Search
                        size={14}
                        color="#94A3B8"
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search student by name or email..."
                        style={{
                          width: "100%",
                          padding: "0.48rem 0.75rem 0.48rem 2rem",
                          borderRadius: "8px",
                          background: "#1E2533",
                          border: "1px solid #2E374B",
                          color: "#FFFFFF",
                          fontSize: "0.8rem",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => handleBatchToggle(true)}
                        disabled={savingAttendance}
                        style={{
                          padding: "0.45rem 0.75rem",
                          borderRadius: "6px",
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid #10B981",
                          color: "#10B981",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <UserCheck size={13} /> Mark All Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchToggle(false)}
                        disabled={savingAttendance}
                        style={{
                          padding: "0.45rem 0.75rem",
                          borderRadius: "6px",
                          background: "rgba(239, 68, 68, 0.12)",
                          border: "1px solid #EF4444",
                          color: "#F87171",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <UserX size={13} /> Clear All
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEnrollForm((prev) => !prev)}
                        style={{
                          padding: "0.45rem 0.75rem",
                          borderRadius: "6px",
                          background: "#6B0F24",
                          border: "1px solid #F5B800",
                          color: "#FFFFFF",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Plus size={13} color="#F5B800" />
                        {showEnrollForm ? "Cancel" : "Add Student"}
                      </button>
                    </div>
                  </div>

                  {/* Inline Student Quick Enrollment Form */}
                  {showEnrollForm && (
                    <form
                      onSubmit={handleEnrollStudent}
                      style={{
                        background: "#1E2533",
                        border: "1px solid #F5B800",
                        borderRadius: "10px",
                        padding: "0.85rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "0.85rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Student Full Name (e.g. Maya Lin)"
                        style={{
                          flex: 1,
                          minWidth: "180px",
                          padding: "0.48rem 0.7rem",
                          borderRadius: "6px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#FFFFFF",
                          fontSize: "0.8rem",
                        }}
                      />
                      <input
                        type="email"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        placeholder="Optional email (e.g. maya@kidsden.edu)"
                        style={{
                          flex: 1,
                          minWidth: "180px",
                          padding: "0.48rem 0.7rem",
                          borderRadius: "6px",
                          background: "#161B26",
                          border: "1px solid #2E374B",
                          color: "#FFFFFF",
                          fontSize: "0.8rem",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "0.48rem 0.95rem",
                          borderRadius: "6px",
                          background: "#10B981",
                          border: "none",
                          color: "#090D16",
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Enroll Student
                      </button>
                    </form>
                  )}

                  {/* Student Cards List */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                      gap: "0.65rem",
                      maxHeight: "360px",
                      overflowY: "auto",
                      paddingRight: "4px",
                    }}
                  >
                    {filteredMembers.length === 0 ? (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          padding: "1.5rem",
                          textAlign: "center",
                          color: "#94A3B8",
                          background: "#1E2533",
                          borderRadius: "10px",
                        }}
                      >
                        No enrolled students matching &quot;{searchQuery}&quot;.
                      </div>
                    ) : (
                      filteredMembers.map((member) => {
                        const isPresent = presentMemberIds.has(member.id);
                        return (
                          <div
                            key={member.id}
                            onClick={() => handleToggleMember(member.id)}
                            style={{
                              background: isPresent
                                ? "rgba(16, 185, 129, 0.12)"
                                : "#1E2533",
                              border: `1px solid ${
                                isPresent ? "#10B981" : "#2E374B"
                              }`,
                              borderRadius: "10px",
                              padding: "0.75rem 0.9rem",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "0.82rem",
                                  fontWeight: 800,
                                  color: isPresent ? "#FFFFFF" : "#E2E8F0",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {member.displayName || member.name || "Student"}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: "#94A3B8",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {member.email || "No email registered"}
                              </div>
                            </div>

                            <span
                              style={{
                                padding: "0.25rem 0.6rem",
                                borderRadius: "6px",
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                background: isPresent
                                  ? "#10B981"
                                  : "rgba(255, 255, 255, 0.06)",
                                color: isPresent ? "#090D16" : "#94A3B8",
                                border: isPresent
                                  ? "none"
                                  : "1px solid #2E374B",
                              }}
                            >
                              {isPresent ? "✓ PRESENT" : "ABSENT"}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "schedule" && (
            <form
              onSubmit={handleScheduleSession}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "#94A3B8",
                    marginBottom: "0.3rem",
                  }}
                >
                  Curriculum Class Module
                </label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    background: "#1E2533",
                    border: "1px solid #2E374B",
                    color: "#FFFFFF",
                    fontWeight: 700,
                  }}
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.classCode}: {d.title} ({d.durationMinutes || 120}m)
                    </option>
                  ))}
                  {ALL_ROBOTICS_LESSONS.filter((l) => !decks.some((d) => d.id === l.id)).map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.code}: {l.title} ({l.durationMinutes || 120}m)
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Session Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      background: "#1E2533",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      background: "#1E2533",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.85rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Lead Instructor
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="RoboBEE Faculty"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      background: "#1E2533",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      color: "#94A3B8",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Workshop Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="RoboBEE Lab (Kids Den Int. Preschool)"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      background: "#1E2533",
                      border: "1px solid #2E374B",
                      color: "#FFFFFF",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.6rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("take_attendance")}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid #2E374B",
                    color: "#94A3B8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  style={{
                    padding: "0.55rem 1.25rem",
                    borderRadius: "8px",
                    background: "#6B0F24",
                    border: "1px solid #F5B800",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Plus size={15} color="#F5B800" />
                  {isScheduling ? "Scheduling..." : "Schedule 120-Minute Session"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
