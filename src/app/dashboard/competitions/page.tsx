"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./competitions.module.css";

export default function CompetitionsPage() {
  const { user } = useAuth();
  
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);

  // Payment form state
  const [activePaymentCompId, setActivePaymentCompId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [paymentTxn, setPaymentTxn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch active competitions
    const compQ = query(collection(db, "competitions"));
    const unsubComp = onSnapshot(compQ, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // Filter out completed ones, or just show all but sort
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setCompetitions(data);
    });

    // Fetch my applications
    const appQ = query(collection(db, "competition_participants"));
    const unsubApp = onSnapshot(appQ, (snap) => {
      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(p => p.userId === user.uid);
      setMyApplications(data);
    });

    return () => {
      unsubComp();
      unsubApp();
    };
  }, [user]);

  const handleApply = async (compId: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "competition_participants"), {
        userId: user.uid,
        competitionId: compId,
        status: "pending_approval",
        paymentStatus: "unpaid",
        appliedAt: serverTimestamp(),
      });
      alert("Application submitted! Waiting for admin approval.");
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to apply.");
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent, applicationId: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "competition_participants", applicationId), {
        paymentStatus: "pending_verification",
        method: paymentMethod,
        txnId: paymentMethod === "bKash" ? paymentTxn : null,
      });
      alert("Payment info submitted! Waiting for verification.");
      setActivePaymentCompId(null);
      setPaymentTxn("");
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Competitions & Events</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Discover and register for upcoming robotics competitions.</p>
      </div>

      <div className={styles.grid}>
        {competitions.map(comp => {
          const myApp = myApplications.find(a => a.competitionId === comp.id);
          
          return (
            <div key={comp.id} className={`glass-panel ${styles.compCard}`}>
              <div className={styles.compHeader}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{comp.name}</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <span>📅 {comp.date}</span>
                  <span>📍 {comp.location}</span>
                  <span>👥 {comp.maxParticipants} slots total</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  Registration Fee: {comp.fee} BDT
                </div>
              </div>

              <div className={styles.actionArea}>
                {!myApp ? (
                  comp.status === "Upcoming" || comp.status === "Ongoing" ? (
                    <button onClick={() => handleApply(comp.id)} className={styles.applyBtn}>
                      Show Interest & Apply
                    </button>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Competition is {comp.status.toLowerCase()}</div>
                  )
                ) : (
                  <div className={styles.statusArea}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Your Application Status</h3>
                    
                    {/* Approval Status */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span className={styles.statusLabel}>Selection:</span>
                      <span className={`${styles.badge} ${myApp.status === 'approved' ? styles.badgeSuccess : myApp.status === 'rejected' ? styles.badgeDanger : styles.badgeWarning}`}>
                        {myApp.status === 'pending_approval' ? 'Waiting for Selection' : myApp.status}
                      </span>
                    </div>

                    {/* Payment Status (if approved) */}
                    {myApp.status === 'approved' && (
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <span className={styles.statusLabel}>Payment:</span>
                          <span className={`${styles.badge} ${myApp.paymentStatus === 'verified' ? styles.badgeSuccess : myApp.paymentStatus === 'unpaid' ? styles.badgeDanger : styles.badgeWarning}`}>
                            {myApp.paymentStatus.replace('_', ' ')}
                          </span>
                        </div>

                        {myApp.paymentStatus === 'unpaid' && activePaymentCompId !== comp.id && (
                          <button onClick={() => setActivePaymentCompId(comp.id)} className={styles.payBtn}>
                            Pay Registration Fee
                          </button>
                        )}

                        {activePaymentCompId === comp.id && (
                          <form onSubmit={(e) => handleSubmitPayment(e, myApp.id)} className={styles.paymentForm}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Submit Payment Details</h4>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Method</label>
                              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={styles.input}>
                                <option value="bKash">bKash (Send to 01902821018)</option>
                                <option value="Cash">Cash to Admin</option>
                              </select>
                            </div>
                            {paymentMethod === 'bKash' && (
                              <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Transaction ID</label>
                                <input type="text" required value={paymentTxn} onChange={e => setPaymentTxn(e.target.value)} className={styles.input} placeholder="e.g. 9X2B..." />
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                                {isSubmitting ? "Submitting..." : "Submit for Verification"}
                              </button>
                              <button type="button" onClick={() => setActivePaymentCompId(null)} className={styles.cancelBtn}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}

                        {myApp.paymentStatus === 'verified' && (
                          <div style={{ color: '#2ecc71', fontWeight: 'bold', marginTop: '0.5rem' }}>
                            ✅ You are officially enrolled in this competition!
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          );
        })}

        {competitions.length === 0 && (
          <div style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
            No competitions found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
