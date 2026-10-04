"use client";

import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./admin-competitions.module.css";
import { useAuth } from "@/context/AuthContext";

export default function AdminCompetitionsPage() {
  const { user } = useAuth();
  
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newComp, setNewComp] = useState({
    name: "",
    date: "",
    location: "",
    fee: 0,
    maxParticipants: 0,
  });

  useEffect(() => {
    // Fetch competitions
    const compQ = query(collection(db, "competitions"));
    const unsubComp = onSnapshot(compQ, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCompetitions(data);
    });

    // Fetch participants
    const partQ = query(collection(db, "competition_participants"));
    const unsubPart = onSnapshot(partQ, async (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // We might want to attach user emails or usernames. For now, rely on userId or we can fetch them.
      // Fetching all users could be heavy, let's just use what's there and maybe fetch emails later.
      
      const userIds = [...new Set(data.map(p => p.userId))];
      let userMap: any = {};
      if (userIds.length > 0) {
        // Simple fetch of all users (if not too many)
        const userQ = query(collection(db, "users"));
        const userSnap = await getDocs(userQ);
        userSnap.docs.forEach(uDoc => {
          userMap[uDoc.id] = uDoc.data().email || uDoc.id;
        });
      }

      data.forEach(p => p.userEmail = userMap[p.userId] || p.userId);
      setParticipants(data);
    });

    return () => {
      unsubComp();
      unsubPart();
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await addDoc(collection(db, "competitions"), {
        ...newComp,
        status: "Upcoming",
        createdAt: serverTimestamp(),
      });
      alert("Competition created successfully!");
      setNewComp({ name: "", date: "", location: "", fee: 0, maxParticipants: 0 });
    } catch (error) {
      console.error("Error creating competition:", error);
      alert("Failed to create competition.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateCompetitionStatus = async (compId: string, status: string) => {
    try {
      await updateDoc(doc(db, "competitions", compId), { status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleParticipantAction = async (partId: string, action: string, updateData: any) => {
    try {
      await updateDoc(doc(db, "competition_participants", partId), updateData);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Failed to ${action} participant.`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Manage Competitions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create competitions and manage participants.</p>
      </div>

      <div className={`glass-panel ${styles.panel}`} style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Launch New Competition</h2>
        <form onSubmit={handleCreate} className={styles.formGrid}>
          <div>
            <label>Competition Name</label>
            <input type="text" required value={newComp.name} onChange={e => setNewComp({...newComp, name: e.target.value})} className={styles.input} />
          </div>
          <div>
            <label>Date</label>
            <input type="date" required value={newComp.date} onChange={e => setNewComp({...newComp, date: e.target.value})} className={styles.input} />
          </div>
          <div>
            <label>Location</label>
            <input type="text" required value={newComp.location} onChange={e => setNewComp({...newComp, location: e.target.value})} className={styles.input} />
          </div>
          <div>
            <label>Registration Fee (BDT)</label>
            <input type="number" required value={newComp.fee} onChange={e => setNewComp({...newComp, fee: Number(e.target.value)})} className={styles.input} />
          </div>
          <div>
            <label>Max Participants</label>
            <input type="number" required value={newComp.maxParticipants} onChange={e => setNewComp({...newComp, maxParticipants: Number(e.target.value)})} className={styles.input} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" disabled={isCreating} className={styles.submitBtn}>
              {isCreating ? "Launching..." : "Launch Competition"}
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {competitions.map(comp => {
          const compParts = participants.filter(p => p.competitionId === comp.id);
          
          return (
            <div key={comp.id} className={`glass-panel ${styles.compCard}`}>
              <div className={styles.compHeader}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)' }}>{comp.name}</h2>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    📅 {comp.date} | 📍 {comp.location} | 💰 {comp.fee} BDT | 👥 {compParts.filter(p => p.status === 'approved').length}/{comp.maxParticipants} slots filled
                  </div>
                </div>
                <div>
                  <select 
                    value={comp.status} 
                    onChange={(e) => updateCompetitionStatus(comp.id, e.target.value)}
                    className={styles.input}
                    style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Participants</h3>
                
                {compParts.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No participants yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Member Email</th>
                          <th>Application Status</th>
                          <th>Payment Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compParts.map(part => (
                          <tr key={part.id}>
                            <td>{part.userEmail}</td>
                            <td>
                              <span className={`${styles.badge} ${part.status === 'approved' ? styles.badgeSuccess : part.status === 'rejected' ? styles.badgeDanger : styles.badgeWarning}`}>
                                {part.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span className={`${styles.badge} ${part.paymentStatus === 'verified' ? styles.badgeSuccess : part.paymentStatus === 'pending_verification' ? styles.badgeWarning : styles.badgeDanger}`}>
                                  {part.paymentStatus.replace('_', ' ')}
                                </span>
                                {part.method && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{part.method} {part.txnId ? `(${part.txnId})` : ''}</span>}
                              </div>
                            </td>
                            <td>
                              <div className={styles.actionGroup}>
                                {/* Application Actions */}
                                {part.status === 'pending_approval' && (
                                  <>
                                    <button onClick={() => handleParticipantAction(part.id, 'approve', { status: 'approved' })} className={`${styles.actionBtn} ${styles.btnSuccess}`}>Approve</button>
                                    <button onClick={() => handleParticipantAction(part.id, 'reject', { status: 'rejected' })} className={`${styles.actionBtn} ${styles.btnDanger}`}>Reject</button>
                                  </>
                                )}
                                
                                {/* Payment Actions */}
                                {part.status === 'approved' && part.paymentStatus !== 'verified' && (
                                  <button onClick={() => handleParticipantAction(part.id, 'verify payment', { paymentStatus: 'verified' })} className={`${styles.actionBtn} ${styles.btnPrimary}`}>
                                    Verify Payment
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
