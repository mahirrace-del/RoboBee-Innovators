"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./finance.module.css";

export default function FinancePage() {
  const { user } = useAuth();
  
  const [payments, setPayments] = useState<any[]>([]);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("monthly");
  const [paymentMonth, setPaymentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [paymentTxn, setPaymentTxn] = useState("");

  useEffect(() => {
    if (user) {
      const fetchPayments = async () => {
        try {
          const payQuery = query(collection(db, "payments"), where("userId", "==", user.uid));
          const paySnap = await getDocs(payQuery);
          setPayments(paySnap.docs.map(p => ({ id: p.id, ...p.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      };
      fetchPayments();
    }
  }, [user]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingPayment(true);
    try {
      const newPayment = {
        userId: user.uid,
        type: paymentType,
        month: paymentType === "monthly" ? paymentMonth : null,
        amount: 1000,
        method: paymentMethod,
        txnId: paymentTxn,
        status: "pending_verification",
        date: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "payments"), newPayment);
      setPayments(prev => [{ id: docRef.id, ...newPayment }, ...prev]);
      alert("Payment submitted for verification!");
      setPaymentTxn("");
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const hasEnrollment = payments.some(p => p.type === 'enrollment' && p.status === 'verified');
  const hasPendingEnrollment = payments.some(p => p.type === 'enrollment' && p.status === 'pending_verification');
  
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const hasCurrentMonth = payments.some(p => p.type === 'monthly' && p.month === currentMonthStr && p.status === 'verified');
  const hasPendingCurrentMonth = payments.some(p => p.type === 'monthly' && p.month === currentMonthStr && p.status === 'pending_verification');

  let totalDue = 0;
  if (!hasEnrollment && !hasPendingEnrollment) totalDue += 1000;
  if (!hasCurrentMonth && !hasPendingCurrentMonth) totalDue += 1000;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Lab Fees & Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Check your outstanding dues and submit payments via bKash.</p>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', flex: '1', borderLeft: `4px solid ${totalDue > 0 ? '#ff5555' : '#2ecc71'}` }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Outstanding Due</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: totalDue > 0 ? '#ff5555' : '#2ecc71' }}>{totalDue} BDT</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {totalDue === 0 ? "You are all caught up!" : "Please submit your pending payments."}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        
        {/* Left Column: Dues & Payment Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className={`glass-panel ${styles.card}`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${hasEnrollment ? '#2ecc71' : hasPendingEnrollment ? '#F4B304' : '#ff5555'}` }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enrollment Fee (One-Time)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasEnrollment ? '#2ecc71' : hasPendingEnrollment ? '#F4B304' : '#ff5555' }}>
                  {hasEnrollment ? 'Paid' : hasPendingEnrollment ? 'Verification Pending' : 'Due (1000 BDT)'}
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${hasCurrentMonth ? '#2ecc71' : hasPendingCurrentMonth ? '#F4B304' : '#ff5555'}` }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Monthly Fee ({currentMonthStr})</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasCurrentMonth ? '#2ecc71' : hasPendingCurrentMonth ? '#F4B304' : '#ff5555' }}>
                  {hasCurrentMonth ? 'Paid' : hasPendingCurrentMonth ? 'Verification Pending' : 'Due (1000 BDT)'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Due by 5th of every month</div>
              </div>
            </div>
          </div>

          <div className={`glass-panel ${styles.card}`}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Submit Payment for Verification</h3>
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Payment Type</label>
                <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem', width: '100%' }}>
                  <option value="enrollment">Enrollment (1000 BDT)</option>
                  <option value="monthly">Monthly (1000 BDT)</option>
                </select>
              </div>
              {paymentType === "monthly" && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>For Month</label>
                  <input type="month" required value={paymentMonth} onChange={e => setPaymentMonth(e.target.value)} className={styles.input} style={{ padding: '0.5rem', width: '100%' }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem', width: '100%' }}>
                  <option value="bKash">bKash (Send to 01902821018)</option>
                  <option value="Cash">Cash to Admin</option>
                </select>
              </div>
              {paymentMethod === "bKash" && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Transaction ID (Required for bKash)</label>
                  <input type="text" required value={paymentTxn} onChange={e => setPaymentTxn(e.target.value)} className={styles.input} placeholder="e.g. 9X2B..." style={{ padding: '0.5rem', width: '100%' }} />
                </div>
              )}
              <button type="submit" disabled={submittingPayment} className={styles.submitBtn} style={{ padding: '0.8rem 1rem', marginTop: '0.5rem' }}>
                {submittingPayment ? "Submitting..." : "Submit for Verification"}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Payment History */}
        <div className={`glass-panel ${styles.card}`}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Payment History</h2>
          
          {payments.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No payment records found.</p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Method/Txn</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                        {payment.type} {payment.month ? `(${payment.month})` : ''}
                      </td>
                      <td>
                        {payment.method}
                        <br/>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                          {payment.txnId || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          payment.status === 'verified' ? styles.statusApproved : 
                          payment.status === 'rejected' ? styles.statusRejected : styles.statusPending
                        }`}>
                          {payment.status === 'pending_verification' ? 'pending' : payment.status}
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
