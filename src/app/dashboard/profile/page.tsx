"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import styles from "../lab/lab.module.css"; // Reuse input styles

export default function ProfilePage() {
  const { user, userData, role } = useAuth();
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [payments, setPayments] = useState<any[]>([]);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentType, setPaymentType] = useState("monthly");
  const [paymentMonth, setPaymentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [paymentTxn, setPaymentTxn] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setUsername(userData.username || "");
      setPhone(userData.phone || "");
    }
    
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
  }, [userData, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        username: username.trim(),
        phone: phone.trim()
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

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

  if (!user || !userData) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading profile...</div>;
  }

  const hasEnrollment = payments.some(p => p.type === 'enrollment' && p.status === 'verified');
  const hasPendingEnrollment = payments.some(p => p.type === 'enrollment' && p.status === 'pending_verification');
  
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const hasCurrentMonth = payments.some(p => p.type === 'monthly' && p.month === currentMonthStr && p.status === 'verified');
  const hasPendingCurrentMonth = payments.some(p => p.type === 'monthly' && p.month === currentMonthStr && p.status === 'pending_verification');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your public member profile</p>
      </div>

      {role === 'pending' && (
        <div style={{ background: 'rgba(244, 179, 4, 0.1)', borderLeft: '4px solid #F4B304', padding: '1rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
          <strong>Account Status: Pending Approval</strong>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your account has been created. Please wait for an Admin to verify your recruitment and grant you full access to the portal.</p>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              value={user.email || ""} 
              disabled 
              className={styles.input} 
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Email cannot be changed here.</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Full Name</label>
            <input 
              type="text" 
              required
              value={name} 
              onChange={e => setName(e.target.value)} 
              className={styles.input} 
              placeholder="Your full name"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Username</label>
            <input 
              type="text" 
              required
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className={styles.input} 
              placeholder="Set a username (e.g. john_doe)"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className={styles.input} 
              placeholder="+8801..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Current Role</label>
            <div style={{ 
              display: 'inline-block',
              padding: '0.4rem 0.8rem', 
              background: role === 'admin' ? 'rgba(0, 210, 255, 0.2)' : role === 'pending' ? 'rgba(244, 179, 4, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: role === 'admin' ? '#00d2ff' : role === 'pending' ? '#F4B304' : 'var(--text-primary)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {role}
            </div>
          </div>

          <button type="submit" disabled={isSaving} className={styles.submitBtn} style={{ marginTop: '1rem', width: 'fit-content' }}>
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          Lab Fees & Payments
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
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

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Submit Payment for Verification</h3>
        <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Payment Type</label>
            <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem' }}>
              <option value="enrollment">Enrollment (1000 BDT)</option>
              <option value="monthly">Monthly (1000 BDT)</option>
            </select>
          </div>
          {paymentType === "monthly" && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>For Month</label>
              <input type="month" required value={paymentMonth} onChange={e => setPaymentMonth(e.target.value)} className={styles.input} style={{ padding: '0.5rem' }} />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem' }}>
              <option value="bKash">bKash</option>
              <option value="Cash">Cash to Admin</option>
            </select>
          </div>
          {paymentMethod === "bKash" && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Txn ID (Optional)</label>
              <input type="text" value={paymentTxn} onChange={e => setPaymentTxn(e.target.value)} className={styles.input} placeholder="e.g. 9X2B..." style={{ padding: '0.5rem', width: '120px' }} />
            </div>
          )}
          <button type="submit" disabled={submittingPayment} className={styles.submitBtn} style={{ padding: '0.6rem 1rem' }}>
            {submittingPayment ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Payment History</h3>
          {payments.length === 0 ? <div style={{ color: 'var(--text-secondary)' }}>No payment records found.</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.5rem' }}>Date Submitted</th>
                    <th style={{ padding: '0.5rem' }}>Type</th>
                    <th style={{ padding: '0.5rem' }}>Method</th>
                    <th style={{ padding: '0.5rem' }}>Txn ID</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.5rem' }}>{new Date(p.date).toLocaleDateString()}</td>
                      <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>
                        {p.type} {p.type === 'monthly' ? `(${p.month})` : ''}
                      </td>
                      <td style={{ padding: '0.5rem' }}>{p.method}</td>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{p.txnId || '-'}</td>
                      <td style={{ padding: '0.5rem' }}>
                        {p.status === 'verified' ? (
                          <span style={{ color: '#2ecc71', background: 'rgba(46, 204, 113, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Verified</span>
                        ) : (
                          <span style={{ color: '#F4B304', background: 'rgba(244, 179, 4, 0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Pending</span>
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
    </div>
  );
}
