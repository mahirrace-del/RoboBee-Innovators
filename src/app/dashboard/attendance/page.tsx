"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./attendance.module.css";

export default function AttendancePage() {
  const { user, role } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  
  // Admin Form
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "classes"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !date) return;
    setIsCreating(true);

    try {
      await addDoc(collection(db, "classes"), {
        topic,
        date,
        status: "upcoming", // upcoming, active, completed
        attendees: [],
      });
      setTopic("");
      setDate("");
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const updateClassStatus = async (classId: string, status: string) => {
    await updateDoc(doc(db, "classes", classId), { status });
  };

  const handleCheckIn = async (classId: string) => {
    if (!user?.email) return;
    try {
      await updateDoc(doc(db, "classes", classId), {
        attendees: arrayUnion(user.email)
      });
      alert("Successfully checked in!");
    } catch (error) {
      console.error("Error checking in:", error);
      alert("Failed to check in");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Attendance & Classes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {role === 'admin' ? "Manage classes and track member attendance." : "View upcoming classes and check-in to active sessions."}
        </p>
      </div>

      <div className={styles.grid}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Class Schedule</h2>
          {classes.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No classes scheduled yet.
            </div>
          ) : (
            classes.map(cls => (
              <div key={cls.id} className={`glass-panel ${styles.classCard}`}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className={styles.classTitle}>{cls.topic}</div>
                    <div className={styles.classDate}>📅 {new Date(cls.date).toLocaleString()}</div>
                  </div>
                  <div className={`${styles.statusBadge} ${
                    cls.status === 'active' ? styles.statusActive : 
                    cls.status === 'upcoming' ? styles.statusUpcoming : styles.statusCompleted
                  }`}>
                    {cls.status}
                  </div>
                </div>

                {role === "admin" && (
                  <div className={styles.attendeesList}>
                    <strong>Attendees ({cls.attendees?.length || 0}):</strong>
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {cls.attendees?.map((email: string, i: number) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Member Check In */}
                {role === "member" && cls.status === "active" && (
                  <button 
                    className={styles.checkInBtn}
                    onClick={() => handleCheckIn(cls.id)}
                    disabled={cls.attendees?.includes(user?.email)}
                  >
                    {cls.attendees?.includes(user?.email) ? "Checked In ✓" : "Check In Now"}
                  </button>
                )}

                {/* Admin Controls */}
                {role === "admin" && (
                  <div className={styles.adminControls}>
                    {cls.status === "upcoming" && (
                      <button onClick={() => updateClassStatus(cls.id, 'active')} className={`${styles.adminBtn} ${styles.startBtn}`}>
                        Start Session
                      </button>
                    )}
                    {cls.status === "active" && (
                      <button onClick={() => updateClassStatus(cls.id, 'completed')} className={`${styles.adminBtn} ${styles.endBtn}`}>
                        End Session
                      </button>
                    )}
                  </div>
                )}

              </div>
            ))
          )}
        </div>

        {/* Admin Create Class Form */}
        {role === "admin" && (
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Schedule New Class</h2>
            <form onSubmit={handleCreateClass} className={`glass-panel ${styles.formCard}`}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Class Topic / Title</label>
                <input 
                  type="text" 
                  required 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Intro to ROS 2"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Date & Time</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className={styles.input}
                />
              </div>
              <button type="submit" disabled={isCreating} className={styles.submitBtn}>
                {isCreating ? 'Scheduling...' : 'Schedule Class'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
