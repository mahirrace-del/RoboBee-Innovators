"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../lab/lab.module.css"; 

export default function MemberProfileAdminView() {
  const { role, user: currentUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [member, setMember] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New task state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Attendance state
  const [attendancePct, setAttendancePct] = useState<number>(0);

  // Payment log state
  const [paymentType, setPaymentType] = useState("monthly");
  const [paymentMonth, setPaymentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [isLoggingPayment, setIsLoggingPayment] = useState(false);

  useEffect(() => {
    if (role !== "admin") return;

    const fetchMemberData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMember(userData);

          // Fetch tasks assigned to this user (by email)
          if (userData.email) {
            const taskQuery = query(collection(db, "tasks"), where("assignedTo", "==", userData.email));
            const taskSnap = await getDocs(taskQuery);
            setTasks(taskSnap.docs.map(t => ({ id: t.id, ...t.data() })));
          }

          // Fetch user's payments
          const payQuery = query(collection(db, "payments"), where("userId", "==", userId));
          const paySnap = await getDocs(payQuery);
          setPayments(paySnap.docs.map(p => ({ id: p.id, ...p.data() })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));

          // Fetch attendance
          const sessSnap = await getDocs(collection(db, "sessions"));
          const allSessions = sessSnap.docs.map(d => d.data());
          if (allSessions.length > 0) {
            let presentCount = 0;
            allSessions.forEach(session => {
              if (session.attendees && session.attendees.includes(userId)) {
                presentCount++;
              }
            });
            setAttendancePct(Math.round((presentCount / allSessions.length) * 100));
          } else {
            setAttendancePct(100); // 100% if no sessions yet
          }
        }
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [role, userId]);

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDesc || !member?.email) return;
    setIsAssigning(true);

    try {
      const newTask = {
        title: taskTitle,
        description: taskDesc,
        assignedTo: member.email,
        assignedBy: currentUser?.email,
        status: "pending",
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setTasks(prev => [...prev, { id: docRef.id, ...newTask }]);
      
      setTaskTitle("");
      setTaskDesc("");
      alert("Task assigned successfully!");
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleLogPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingPayment(true);
    try {
      const newPayment = {
        userId: userId,
        type: paymentType,
        month: paymentType === "monthly" ? paymentMonth : null,
        amount: 1000,
        method: paymentMethod,
        status: "verified",
        date: new Date().toISOString(),
        verifiedBy: currentUser?.email
      };
      const docRef = await addDoc(collection(db, "payments"), newPayment);
      setPayments(prev => [{ id: docRef.id, ...newPayment }, ...prev]);
      alert("Payment logged successfully.");
    } catch (error) {
      console.error("Error logging payment:", error);
      alert("Failed to log payment.");
    } finally {
      setIsLoggingPayment(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      await updateDoc(doc(db, "payments", paymentId), {
        status: "verified",
        verifiedBy: currentUser?.email
      });
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "verified", verifiedBy: currentUser?.email } : p));
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  if (role !== "admin") {
    return <div style={{ color: 'var(--text-secondary)' }}>Permission Denied</div>;
  }

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading profile...</div>;
  }

  if (!member) {
    return <div style={{ color: 'var(--text-secondary)' }}>Member not found.</div>;
  }

  // Calculate metrics
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Compute payment status
  const hasEnrollment = payments.some(p => p.type === 'enrollment' && p.status === 'verified');
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const hasCurrentMonth = payments.some(p => p.type === 'monthly' && p.month === currentMonthStr && p.status === 'verified');

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{member.name}'s Profile</h1>
          <p style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
            @{member.username || "username_not_set"} &bull; {member.role}
          </p>
        </div>
        <Link href="/dashboard/members" className={styles.submitBtn} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}>
          &larr; Back to Members
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Details & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              Application & Contact Info
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Email:</strong> {member.email}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Phone:</strong> {member.phone || 'N/A'}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Department:</strong> {member.department || 'N/A'}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Joined:</strong> {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}</div>
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Skills:</strong>
                <p style={{ marginTop: '0.2rem' }}>{member.skills || 'No skills listed'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong style={{ color: 'var(--text-secondary)' }}>Reason for joining:</strong>
                <p style={{ marginTop: '0.2rem', fontStyle: 'italic' }}>"{member.reason || 'No reason provided'}"</p>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              Performance Metrics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00d2ff' }}>{totalTasks}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Tasks Assigned</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>{completionRate}%</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Completion Rate</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F4B304' }}>{attendancePct}%</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Lab Attendance</div>
              </div>
            </div>
          </div>

          {/* Payment Status & Logging */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              Financial Status
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${hasEnrollment ? '#2ecc71' : '#ff5555'}` }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enrollment Fee</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasEnrollment ? '#2ecc71' : '#ff5555' }}>
                  {hasEnrollment ? 'Paid' : 'Due (1000 BDT)'}
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${hasCurrentMonth ? '#2ecc71' : '#ff5555'}` }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Monthly Fee ({currentMonthStr})</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasCurrentMonth ? '#2ecc71' : '#ff5555' }}>
                  {hasCurrentMonth ? 'Paid' : 'Due (1000 BDT)'}
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Log Payment</h3>
            <form onSubmit={handleLogPayment} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type</label>
                <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem' }}>
                  <option value="enrollment">Enrollment (1000)</option>
                  <option value="monthly">Monthly (1000)</option>
                </select>
              </div>
              {paymentType === "monthly" && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Month</label>
                  <input type="month" value={paymentMonth} onChange={e => setPaymentMonth(e.target.value)} className={styles.input} style={{ padding: '0.5rem' }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={styles.input} style={{ appearance: 'auto', padding: '0.5rem' }}>
                  <option value="bKash">bKash</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <button type="submit" disabled={isLoggingPayment} className={styles.submitBtn} style={{ padding: '0.6rem 1rem' }}>
                {isLoggingPayment ? "Logging..." : "Mark as Paid"}
              </button>
            </form>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Payment History</h3>
              {payments.length === 0 ? <div style={{ color: 'var(--text-secondary)' }}>No payments found.</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.5rem' }}>Date</th>
                      <th style={{ padding: '0.5rem' }}>Type</th>
                      <th style={{ padding: '0.5rem' }}>Method</th>
                      <th style={{ padding: '0.5rem' }}>Status</th>
                      <th style={{ padding: '0.5rem' }}>Action</th>
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
                        <td style={{ padding: '0.5rem' }}>
                          <span style={{ color: p.status === 'verified' ? '#2ecc71' : '#F4B304' }}>{p.status}</span>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          {p.status === 'pending_verification' && (
                            <button onClick={() => handleVerifyPayment(p.id)} style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Verify</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Direct Assign & Recent Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Assign Direct Task</h2>
            <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Task Title</label>
                <input type="text" required value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className={styles.input} placeholder="e.g. Test Motor Drivers" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</label>
                <textarea required value={taskDesc} onChange={e => setTaskDesc(e.target.value)} className={styles.input} style={{ minHeight: '80px', resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={isAssigning} className={styles.submitBtn}>
                {isAssigning ? "Assigning..." : "Assign Task"}
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Recent Tasks</h2>
            {tasks.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>No tasks assigned yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${task.status === 'completed' ? '#2ecc71' : '#F4B304'}` }}>
                    <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textTransform: 'uppercase' }}>{task.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
