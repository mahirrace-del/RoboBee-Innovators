"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./finance.module.css";

export default function FinancePage() {
  const { user, role } = useAuth();
  
  const [dues, setDues] = useState<number>(0);
  const [payments, setPayments] = useState<any[]>([]);
  
  // Payment Form
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch User Profile to get Dues
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setDues(docSnap.data().dues || 0);
      }
    });

    // Fetch User Payment History
    const q = query(
      collection(db, "payments"), 
      where("uid", "==", user.uid)
    );
    
    const unsubPayments = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // Sort client-side if missing index
      data.sort((a, b) => {
        const tA = a.submittedAt?.toMillis() || 0;
        const tB = b.submittedAt?.toMillis() || 0;
        return tB - tA;
      });
      setPayments(data);
    });

    return () => {
      unsubUser();
      unsubPayments();
    };
  }, [user]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !trxId || !user) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "payments"), {
        uid: user.uid,
        email: user.email,
        amount: Number(amount),
        trxId,
        status: "pending",
        submittedAt: serverTimestamp()
      });
      setAmount("");
      setTrxId("");
      alert("Payment submitted for admin review!");
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
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Finance & Dues</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Check your outstanding dues and submit payments via bKash.</p>
      </div>

      <div className={styles.grid}>
        
        {/* Left Column: Dues & Payment Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className={`glass-panel ${styles.card}`}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Total Outstanding Dues</h2>
            <div className={`${styles.dueAmount} ${dues === 0 ? styles.zero : ''}`}>
              ৳ {dues.toLocaleString()}
            </div>
            {dues === 0 && <p style={{ color: '#2ecc71', fontWeight: '500' }}>You are all caught up!</p>}
          </div>

          <div className={styles.bkashBox}>
            <div className={styles.bkashTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#e2136f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16L16 12L12 8" stroke="#e2136f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="#e2136f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Pay via bKash
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Send money to <strong>017XX-XXXXXX</strong> (Personal), then enter the amount and Transaction ID below.
            </p>
            
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem' }}>Amount Sent (৳)</label>
                <input 
                  type="number" 
                  className={styles.input}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem' }}>Transaction ID (TrxID)</label>
                <input 
                  type="text" 
                  className={styles.input}
                  value={trxId}
                  onChange={e => setTrxId(e.target.value)}
                  required
                  placeholder="e.g. 9F3G8X2P"
                />
              </div>
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Payment History */}
        <div className={`glass-panel ${styles.card}`}>
          <h2 style={{ fontSize: '1.4rem' }}>Payment History</h2>
          
          {payments.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No payment records found.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>TrxID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.submittedAt ? new Date(payment.submittedAt.toMillis()).toLocaleDateString() : 'Just now'}</td>
                      <td style={{ fontWeight: '600' }}>৳ {payment.amount}</td>
                      <td style={{ fontFamily: 'monospace' }}>{payment.trxId}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          payment.status === 'approved' ? styles.statusApproved : 
                          payment.status === 'rejected' ? styles.statusRejected : styles.statusPending
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
