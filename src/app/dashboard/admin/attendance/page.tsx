"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, orderBy, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./admin-attendance.module.css"; 

export default function AttendancePage() {
  const { role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_attendance");
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  
  // Session Creation State
  const isFriday = new Date().getDay() === 5;
  const [newTitle, setNewTitle] = useState(isFriday ? "Regular Friday Class" : "Custom Class Session");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCreating, setIsCreating] = useState(false);

  // Active Session Tracking (for taking attendance)
  const [activeSession, setActiveSession] = useState<any>(null);
  const [presentMemberIds, setPresentMemberIds] = useState<Set<string>>(new Set());
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  useEffect(() => {
    if (!canAccess) return;

    // Fetch Sessions
    const qSessions = query(collection(db, "sessions"), orderBy("date", "desc"));
    const unsubSessions = onSnapshot(qSessions, (snap) => {
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Active Members (excluding pending and declined)
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

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    setIsCreating(true);

    try {
      await addDoc(collection(db, "sessions"), {
        title: newTitle,
        date: newDate,
        attendees: [],
        createdAt: serverTimestamp()
      });
      setNewTitle("Custom Class Session");
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenSession = (session: any) => {
    setActiveSession(session);
    setPresentMemberIds(new Set(session.attendees || []));
  };

  const handleToggleAttendance = (memberId: string) => {
    setPresentMemberIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const handleMarkAllPresent = () => {
    const allIds = members.map(m => m.id);
    setPresentMemberIds(new Set(allIds));
  };

  const handleMarkAllAbsent = () => {
    setPresentMemberIds(new Set());
  };

  const handleSaveAttendance = async () => {
    if (!activeSession) return;
    setIsSavingAttendance(true);

    try {
      await updateDoc(doc(db, "sessions", activeSession.id), {
        attendees: Array.from(presentMemberIds)
      });
      alert("Attendance saved successfully!");
      setActiveSession(null);
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session? This will remove attendance records for it.")) return;
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
      if (activeSession?.id === sessionId) setActiveSession(null);
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  if (!canAccess) return <div style={{ color: '#ff5555', padding: '2rem' }}>Permission Denied. Attendance Management or Admin privileges required.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attendance Tracking</h1>
        <p className={styles.subtitle}>Schedule classes and track member attendance.</p>
      </div>

      <div className={activeSession ? styles.layoutGridSplit : styles.layoutGrid}>
        
        {/* Sessions List & Creation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Create New Class Session</h2>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Class Title</label>
                <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Date</label>
                <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)} style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--text-primary)' }} />
              </div>
              <button type="submit" disabled={isCreating} className={styles.takeBtn} style={{ padding: '0.65rem 1.25rem', height: '42px' }}>
                {isCreating ? "Adding..." : "+ Add Session"}
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Past & Upcoming Sessions</h2>
            {sessions.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>No sessions scheduled yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sessions.map(session => {
                  const attendanceCount = (session.attendees || []).length;
                  const isActive = activeSession?.id === session.id;
                  
                  return (
                    <div key={session.id} className={styles.sessionCard} style={{ 
                      background: isActive ? 'rgba(0, 210, 255, 0.1)' : 'rgba(0,0,0,0.2)', 
                      border: isActive ? '1px solid #00d2ff' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isActive ? '#00d2ff' : 'var(--text-primary)' }}>{session.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {new Date(session.date).toLocaleDateString()} &bull; {attendanceCount} / {members.length} Present
                        </div>
                      </div>
                      <div className={styles.sessionActions}>
                        <button onClick={() => handleOpenSession(session)} className={styles.takeBtn}>
                          Take Attendance
                        </button>
                        <button onClick={() => handleDeleteSession(session.id)} className={styles.delBtn}>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Active Session Attendance Roster */}
        {activeSession && (
          <div className={`glass-panel ${styles.rosterPanel}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#00d2ff' }}>{activeSession.title}</h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(activeSession.date).toLocaleDateString()}</div>
              </div>
              <button onClick={() => setActiveSession(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', padding: '0 0.5rem' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <button onClick={handleMarkAllPresent} style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Mark All Present</button>
              <button onClick={handleMarkAllAbsent} style={{ background: 'rgba(255, 85, 85, 0.2)', color: '#ff5555', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Mark All Absent</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.5rem' }}>
              {members.map(member => {
                const isPresent = presentMemberIds.has(member.id);
                return (
                  <div key={member.id} onClick={() => handleToggleAttendance(member.id)} className={styles.memberRow} style={{
                    background: isPresent ? 'rgba(46, 204, 113, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isPresent ? '#2ecc71' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{member.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{member.username || 'unknown'}</div>
                    </div>
                    <div>
                      {isPresent ? (
                        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Present &check;</span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>Absent</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={handleSaveAttendance} disabled={isSavingAttendance} className={styles.takeBtn} style={{ width: '100%', fontSize: '1rem', padding: '0.85rem' }}>
                {isSavingAttendance ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
