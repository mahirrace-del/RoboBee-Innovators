import { ALL_ROBOTICS_LESSONS, RoboticsLesson, CourseTier, getLessonById } from "@/lib/curriculumData";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

export type SessionStatus = 'upcoming' | 'active' | 'completed';

export interface ScheduledClassSession {
  id: string;
  lessonId: string;       // e.g. 'beg-01', 'exp-01', 'int-04', etc.
  lessonCode: string;     // e.g. 'CLASS 01'
  title: string;          // e.g. 'Introduction to Robotics & Future Engineering'
  courseTier: CourseTier; // 'explorer' | 'beginner' | 'intermediate' | 'advanced'
  date: string;           // 'YYYY-MM-DD' or ISO string
  time?: string;          // e.g. '15:30' or '3:30 PM'
  durationMinutes?: number; // 60 or 90
  status: SessionStatus;  // 'upcoming' | 'active' | 'completed'
  instructor?: string;    // e.g. 'Lead Robotics Instructor'
  location?: string;      // e.g. 'RoboBEE Lab (Kids Den Int. Preschool)'
  attendees: string[];    // Array of unique canonical member IDs
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
 * Given a session's raw attendees array (which may contain legacy emails or duplicate IDs)
 * and the current list of enrolled members, resolves a strictly deduplicated array of
 * canonical member.id strings so 1 student = at most 1 present count.
 */
export function resolveUniquePresentMemberIds(
  attendees: string[] | undefined,
  members: Array<{ id: string; email?: string }>
): string[] {
  if (!Array.isArray(attendees) || attendees.length === 0) return [];

  // If members list hasn't loaded yet, deduplicate raw strings
  if (!members || members.length === 0) {
    return Array.from(new Set(attendees.filter(Boolean)));
  }

  const presentSet = new Set<string>();
  for (const raw of attendees) {
    if (!raw) continue;
    const normalized = String(raw).trim().toLowerCase();
    const matchedMember = members.find(
      (m) =>
        m.id === raw ||
        (m.email && m.email.trim().toLowerCase() === normalized)
    );
    if (matchedMember) {
      presentSet.add(matchedMember.id);
    }
  }

  return Array.from(presentSet);
}

/**
 * Checks whether a specific member (by uid and/or email) is marked present in a session.
 */
export function isMemberPresentInSession(
  attendees: string[] | undefined,
  memberId: string,
  memberEmail?: string
): boolean {
  if (!Array.isArray(attendees) || attendees.length === 0) return false;
  const emailLower = memberEmail ? memberEmail.trim().toLowerCase() : null;
  return attendees.some((a) => {
    if (!a) return false;
    if (a === memberId) return true;
    if (emailLower && String(a).trim().toLowerCase() === emailLower) return true;
    return false;
  });
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
  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

  // Fallback: If no upcoming session exists, suggest the next lesson after the last completed one
  let suggestedNextLesson: RoboticsLesson =
    ALL_ROBOTICS_LESSONS.find((l) => l.id === "beg-01") || ALL_ROBOTICS_LESSONS[0];
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
    const hasAttended = isMemberPresentInSession(session.attendees, userId, userEmail);

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
 * IMPORTANT: Stores ONLY unique canonical member IDs (1 entry per student) so the present count
 * never duplicates or exceeds the enrolled member count.
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
): Promise<string[]> {
  const sessionRef = doc(db, "sessions", sessionId);

  // Deduplicate and restrict strictly to canonical member IDs
  const canonicalIds = resolveUniquePresentMemberIds(presentMemberIds, allMembers);
  const canonicalSet = new Set(canonicalIds);

  // 1. Update the main session document with strictly 1 canonical ID per present member
  await updateDoc(sessionRef, {
    attendees: canonicalIds,
    updatedAt: serverTimestamp()
  });

  // 2. Sync individual records in the 'attendance' collection (add present, remove absent)
  try {
    for (const member of allMembers) {
      const attId = `${sessionId}_${member.id}`;
      const attRef = doc(db, "attendance", attId);
      if (canonicalSet.has(member.id)) {
        await setDoc(attRef, {
          userId: member.id,
          userEmail: member.email || "",
          sessionId,
          classId: sessionInfo.lessonId || sessionId,
          className: sessionInfo.title || "Robotics Class",
          date: sessionInfo.date,
          status: "present",
          verifiedAt: serverTimestamp()
        }, { merge: true });
      } else {
        await deleteDoc(attRef).catch(() => {});
      }
    }
  } catch (err) {
    console.warn("Could not sync secondary attendance subcollection:", err);
  }

  return canonicalIds;
}
