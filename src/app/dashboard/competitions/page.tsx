"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./competitions.module.css";
import { Trophy, Calendar, MapPin, Users, CheckCircle2, AlertCircle } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  fee: number;
  maxParticipants: number;
  description?: string;
}

export default function CompetitionsPage() {
  const { user } = useAuth();
  
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<{ [compId: string]: string }>({});

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
      data.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
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

  const handleApply = async (comp: any) => {
    if (!user) return;

    const segments: Segment[] = Array.isArray(comp.segments) && comp.segments.length > 0
      ? comp.segments
      : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

    const selectedSegId = selectedSegments[comp.id] || segments[0]?.id;
    const selectedSeg = segments.find(s => s.id === selectedSegId) || segments[0];

    try {
      await addDoc(collection(db, "competition_participants"), {
        userId: user.uid,
        competitionId: comp.id,
        competitionName: comp.name,
        segmentId: selectedSeg.id,
        segmentName: selectedSeg.name,
        fee: selectedSeg.fee,
        status: "pending_approval",
        paymentStatus: "unpaid",
        appliedAt: serverTimestamp(),
      });
      alert(`Application submitted for "${selectedSeg.name}"! Waiting for admin approval.`);
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to apply. Please try again.");
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
      alert("Payment details submitted! Admin will verify your transaction.");
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={28} color="#F4B304" />
          <div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', margin: 0 }}>Competitions &amp; Events</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.92rem' }}>
              Select your preferred category, apply with one click, and enroll in upcoming robotics tournaments.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {competitions.map(comp => {
          const myApp = myApplications.find(a => a.competitionId === comp.id);
          const segments: Segment[] = Array.isArray(comp.segments) && comp.segments.length > 0 
            ? comp.segments 
            : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

          const currentChosenSegmentId = selectedSegments[comp.id] || segments[0]?.id;
          const chosenSegment = segments.find(s => s.id === currentChosenSegmentId) || segments[0];

          return (
            <div key={comp.id} className={styles.compCard}>
              <div className={styles.compHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', margin: 0 }}>{comp.name}</h2>
                  <span className={`${styles.badge} ${comp.status === 'Ongoing' ? styles.badgeSuccess : comp.status === 'Completed' ? styles.badgeDanger : styles.badgeWarning}`}>
                    {comp.status}
                  </span>
                </div>

                <div className={styles.compMeta}>
                  <span><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {comp.date || "TBD"}</span>
                  <span><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {comp.location || "Club Lab"}</span>
                </div>

                {comp.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.45', margin: '0.5rem 0' }}>
                    {comp.description}
                  </p>
                )}
              </div>

              {/* SEGMENT SELECTION (IF NOT YET APPLIED) */}
              {!myApp && (
                <div className={styles.segmentsSelectionSection}>
                  <div className={styles.segmentsSelectionTitle}>
                    Select Your Competition Category:
                  </div>

                  <div className={styles.segmentOptionsList}>
                    {segments.map((seg) => {
                      const isSelected = seg.id === currentChosenSegmentId;
                      return (
                        <label 
                          key={seg.id} 
                          className={`${styles.segmentRadioCard} ${isSelected ? styles.segmentRadioCardActive : ""}`}
                        >
                          <input
                            type="radio"
                            name={`seg_${comp.id}`}
                            value={seg.id}
                            checked={isSelected}
                            onChange={() => setSelectedSegments({ ...selectedSegments, [comp.id]: seg.id })}
                            className={styles.segmentRadioInput}
                          />
                          <div className={styles.segmentCardInfo}>
                            <div className={styles.segmentCardHeader}>
                              <span>{seg.name}</span>
                              <span className={styles.segmentCardFee}>{seg.fee} BDT</span>
                            </div>
                            <div className={styles.segmentCardDesc}>
                              Capacity: {seg.maxParticipants} slots {seg.description ? `• ${seg.description}` : ""}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTION / APPLICATION STATUS AREA */}
              <div className={styles.actionArea}>
                {!myApp ? (
                  comp.status === "Upcoming" || comp.status === "Ongoing" ? (
                    <button onClick={() => handleApply(comp)} className={styles.applyBtn}>
                      <Trophy size={16} />
                      Apply for {chosenSegment?.name || "Competition"} ({chosenSegment?.fee || 0} BDT)
                    </button>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                      Competition is {comp.status?.toLowerCase()}
                    </div>
                  )
                ) : (
                  <div className={styles.statusArea}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', background: 'rgba(244, 179, 4, 0.1)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(244, 179, 4, 0.2)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Registered Category</div>
                        <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>{myApp.segmentName || "General Contest"}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Category Fee</div>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{myApp.fee !== undefined ? myApp.fee : comp.fee} BDT</strong>
                      </div>
                    </div>
                    
                    {/* Approval Status */}
                    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className={styles.statusLabel}>Selection Status:</span>
                      <span className={`${styles.badge} ${myApp.status === 'approved' ? styles.badgeSuccess : myApp.status === 'rejected' ? styles.badgeDanger : styles.badgeWarning}`}>
                        {myApp.status === 'pending_approval' ? 'Waiting for Selection' : myApp.status}
                      </span>
                    </div>

                    {/* Payment Status (if approved) */}
                    {myApp.status === 'approved' && (
                      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className={styles.statusLabel}>Fee Status:</span>
                          <span className={`${styles.badge} ${myApp.paymentStatus === 'verified' ? styles.badgeSuccess : myApp.paymentStatus === 'unpaid' ? styles.badgeDanger : styles.badgeWarning}`}>
                            {myApp.paymentStatus?.replace('_', ' ')}
                          </span>
                        </div>

                        {myApp.paymentStatus === 'unpaid' && activePaymentCompId !== comp.id && (
                          <button onClick={() => setActivePaymentCompId(comp.id)} className={styles.payBtn}>
                            Pay Registration Fee ({myApp.fee !== undefined ? myApp.fee : comp.fee} BDT)
                          </button>
                        )}

                        {activePaymentCompId === comp.id && (
                          <form onSubmit={(e) => handleSubmitPayment(e, myApp.id)} className={styles.paymentForm}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                              Submit Payment of {myApp.fee !== undefined ? myApp.fee : comp.fee} BDT
                            </h4>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                Payment Method
                              </label>
                              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={styles.input}>
                                <option value="bKash">bKash (Send Money to 01902821018)</option>
                                <option value="Cash">Cash (Handover to Admin)</option>
                              </select>
                            </div>
                            {paymentMethod === 'bKash' && (
                              <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                  bKash Transaction ID (TrxID)
                                </label>
                                <input 
                                  type="text" 
                                  required 
                                  value={paymentTxn} 
                                  onChange={e => setPaymentTxn(e.target.value)} 
                                  className={styles.input} 
                                  placeholder="e.g. 9X2B..." 
                                />
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
                          <div style={{ color: '#2ecc71', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={16} />
                            Enrolled officially in {myApp.segmentName}!
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
          <div style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            No competitions found at the moment. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
