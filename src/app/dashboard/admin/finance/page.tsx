"use client";

import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./admin-finance.module.css";
import { useAuth } from "@/context/AuthContext";

export default function AdminFinancePage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "payments"));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPayments(data);
    });

    return () => unsub();
  }, []);

  const handleVerify = async (paymentId: string) => {
    try {
      await updateDoc(doc(db, "payments", paymentId), {
        status: "verified",
        verifiedBy: user?.email
      });
      alert("Payment verified successfully!");
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Failed to verify payment.");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Are you sure you want to reject this payment request?")) return;
    try {
      await updateDoc(doc(db, "payments", paymentId), {
        status: "rejected"
      });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Failed to reject payment.");
    }
  };

  const pendingCount = payments.filter(p => p.status === 'pending_verification').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Finance Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review all member payments and verifications.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #F4B304' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending Verifications</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#F4B304' }}>{pendingCount}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #2ecc71' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Verified Payments</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2ecc71' }}>{payments.filter(p => p.status === 'verified').length}</div>
        </div>
      </div>

      <div className={`glass-panel ${styles.panel}`}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Payment Submissions</h2>
        
        {payments.length === 0 ? (
          <div className={styles.emptyState}>No payments recorded yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Member ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Method & Txn</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: '500', fontSize: '0.85rem' }}>{payment.userId}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {payment.type} {payment.month ? `(${payment.month})` : ''}
                    </td>
                    <td style={{ fontWeight: '600' }}>{payment.amount} BDT</td>
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
                    <td>
                      {payment.status === 'pending_verification' && (
                        <div className={styles.actions}>
                          <button onClick={() => handleVerify(payment.id)} className={styles.approveBtn}>Verify</button>
                          <button onClick={() => handleReject(payment.id)} className={styles.rejectBtn}>Reject</button>
                        </div>
                      )}
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
}
