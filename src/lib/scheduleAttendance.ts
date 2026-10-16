import { ALL_ROBOTICS_LESSONS, RoboticsLesson, CourseTier, getLessonById } from "@/lib/curriculumData";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch, setDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

export type SessionStatus = 'upcoming' | 'active' | 'completed';

export interface ScheduledClassSession {
  id: string;
  lessonId: string;       // e.g. 'beg-01', 'exp-01', 'int-04', etc.
  lessonCode: string;     // e.g. 'BEGINNER 01'
  title: string;          // e.g. 'Blink to Morse Code: Hardware Hello World'
  courseTier: CourseTier; // 'explorer' | 'beginner' | 'intermediate' | 'advanced'
  date: string;           // 'YYYY-MM-DD' or ISO string
  time?: string;          // e.g. '15:30' or '3:30 PM'
  durationMinutes?: number; // 60 or 90
  status: SessionStatus;  // 'upcoming' | 'active' | 'completed'
  instructor?: string;    // e.g. 'Lead Robotics Instructor'
  location?: string;      // e.g. 'RoboBEE Lab (Kids Den Int. Preschool)'
  attendees: string[];    // Array of member IDs and/or emails
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface MemberAttendanceSummary {
  userId: string;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  attendedSessionsCount: number;
  totalCompletedSessionsCount: number;
  attendancePercentage: number;
  attendedClassIds: string[]; // lessonIds attended
  missedClassIds: string[];   // lessonIds missed from completed sessions
}

/**
 * Given a session, returns the full curriculum lesson object if found.
 */
export function getLessonForSession(session: { lessonId?: string }): RoboticsLesson | undefined {
  if (!session.lessonId) return undefined;
  return getLessonById(session.lessonId);
}

/**
 * Calculates schedule metrics:
 * - activeSession: session currently marked 'active'
 * - completedSessions: sessions marked 'completed' or past
 * - upcomingSessions: sessions marked 'upcoming'
 * - nextSession: immediate next upcoming session, or auto-suggested next sequential lesson
 * - lastCompletedSession: the most recent completed class
 */
export function calculateScheduleProgression(sessions: ScheduledClassSession[]) {
  // Sort sessions chronologically
  const sorted = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const activeSession = sorted.find(s => s.status === 'active') || null;
  const completedSessions = sorted.filter(s => s.status === 'completed');
  const upcomingSessions = sorted.filter(s => s.status === 'upcoming');

  // Most recent completed session
  const lastCompletedSession = completedSessions.length > 0 
    ? completedSessions[completedSessions.length - 1] 
    : null;

  // Immediate next upcoming session
  let nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

  // Fallback: If no upcoming session exists, suggest the next lesson after the last completed one
  let suggestedNextLesson: RoboticsLesson = ALL_ROBOTICS_LESSONS[0]; // defaults to exp-01 or beg-01
  if (lastCompletedSession?.lessonId) {
    const lastIdx = ALL_ROBOTICS_LESSONS.findIndex(l => l.id === lastCompletedSession.lessonId);
    if (lastIdx >= 0 && lastIdx < ALL_ROBOTICS_LESSONS.length - 1) {
      suggestedNextLesson = ALL_ROBOTICS_LESSONS[lastIdx + 1];
    }
  } else if (completedSessions.length > 0) {
    // Find first uncompleted lesson
    const completedLessonIds = new Set(completedSessions.map(s => s.lessonId));
    const firstUncompleted = ALL_ROBOTICS_LESSONS.find(l => !completedLessonIds.has(l.id));
    if (firstUncompleted) suggestedNextLesson = firstUncompleted;
  }

  return {
    sorted,
    activeSession,
    completedSessions,
    upcomingSessions,
    nextSession,
    lastCompletedSession,
    suggestedNextLesson
  };
}

/**
 * Calculates a specific member's attendance records across all completed or active sessions.
 */
export function getMemberAttendanceRecord(
  sessions: ScheduledClassSession[], 
  userId: string, 
  userEmail?: string
): {
  attendedCount: number;
  totalHeld: number;
  percentage: number;
  history: Array<{
    session: ScheduledClassSession;
    lesson?: RoboticsLesson;
    attended: boolean;
  }>;
} {
  // Filter sessions that have been held or are currently active
  const relevantSessions = sessions.filter(s => s.status === 'completed' || s.status === 'active');
  let attendedCount = 0;

  const history = relevantSessions.map(session => {
    const hasAttended = (session.attendees || []).some(
      a => a === userId || (userEmail && a.toLowerCase() === userEmail.toLowerCase())
    );

    if (hasAttended) attendedCount++;

    return {
      session,
      lesson: getLessonForSession(session),
      attended: hasAttended
    };
  });

  const totalHeld = relevantSessions.length;
  const percentage = totalHeld > 0 ? Math.round((attendedCount / totalHeld) * 100) : 100;

  return {
    attendedCount,
    totalHeld,
    percentage,
    history
  };
}

/**
 * Returns default date string for the upcoming Friday at 15:30 (RoboBEE physical schedule)
 */
export function getDefaultNextClassDate(): { dateStr: string; timeStr: string; dateTimeLocal: string } {
  const d = new Date();
  const day = d.getDay(); // 0 is Sunday, 5 is Friday
  const daysUntilFriday = (5 - day + 7) % 7 || 7; // if today is Friday, schedule next Friday
  d.setDate(d.getDate() + daysUntilFriday);
  d.setHours(15, 30, 0, 0);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${date}`;
  const timeStr = "15:30";
  const dateTimeLocal = `${dateStr}T${timeStr}`;

  return { dateStr, timeStr, dateTimeLocal };
}

/**
 * Saves attendance for a session, updating both 'sessions' and individual 'attendance' records
 * to keep user profiles and dashboard score counter fully in sync.
 */
export async function saveSessionAttendance(
  sessionId: string,
  sessionInfo: {
    lessonId?: string;
    lessonCode?: string;
    title?: string;
    date: string;
  },
  presentMemberIds: string[],
  allMembers: Array<{ id: string; email?: string; name?: string }>
): Promise<void> {
  const sessionRef = doc(db, "sessions", sessionId);
  
  // Create an expanded list of attendee identifiers containing both member ID and email
  const attendeeIdentifiers: string[] = [];
  presentMemberIds.forEach(id => {
    attendeeIdentifiers.push(id);
    const m = allMembers.find(mem => mem.id === id);
    if (m?.email) attendeeIdentifiers.push(m.email);
  });

  // 1. Update the main session document
  await updateDoc(sessionRef, {
    attendees: attendeeIdentifiers,
    updatedAt: serverTimestamp()
  });

  // 2. Sync individual records in the 'attendance' collection for backward compatibility
  // (so dashboard dedication score and user records update immediately)
  try {
    for (const memberId of presentMemberIds) {
      const attId = `${sessionId}_${memberId}`;
      const attRef = doc(db, "attendance", attId);
      await setDoc(attRef, {
        userId: memberId,
        sessionId,
        classId: sessionInfo.lessonId || sessionId,
        className: sessionInfo.title || "Robotics Class",
        date: sessionInfo.date,
        status: "present",
        verifiedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Could not sync secondary attendance subcollection:", err);
  }
}
