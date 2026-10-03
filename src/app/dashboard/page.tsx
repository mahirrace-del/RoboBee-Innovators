"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const { user, role } = useAuth();
  
  const [labStatus, setLabStatus] = useState<"Open" | "Closed">("Closed");
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // 1. Lab Status
    const unsubLab = onSnapshot(doc(db, "settings", "labStatus"), (docSnap) => {
      if (docSnap.exists()) {
        setLabStatus(docSnap.data().status);
      }
    });

    // 2. Tasks
    const qTasks = query(collection(db, "tasks"), where("assignedTo", "==", user.email));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
      let pending = 0;
      let completed = 0;
      snap.forEach(doc => {
        if (doc.data().status === "Done") {
          completed++;
        } else {
          pending++;
        }
      });
      setPendingTasks(pending);
      setCompletedTasks(completed);
    });

    // 3. Finance Status
    const qPayments = query(collection(db, "payments"), where("userId", "==", user.uid));
    const unsubPayments = onSnapshot(qPayments, (snap) => {
      let pendingCount = 0;
      snap.forEach(doc => {
        if (doc.data().status === "pending_verification") {
          pendingCount++;
        }
      });
      setPendingVerifications(pendingCount);
    });

    // 4. Attendance
    const qAttendance = query(collection(db, "attendance"), where("userId", "==", user.uid));
    const unsubAttendance = onSnapshot(qAttendance, (snap) => {
      setAttendanceCount(snap.size);
    });

    return () => {
      unsubLab();
      unsubTasks();
      unsubPayments();
      unsubAttendance();
    };
  }, [user]);

  // Dedication Score Calculation
  // 10 points per attendance, 15 points per completed task
  let score = (attendanceCount * 10) + (completedTasks * 15);
  if (score < 0) score = 0;
  
  let scoreGrade = "Needs Improvement";
  let scoreColor = "#ff5555";
  if (score >= 50) { scoreGrade = "Solid Contributor"; scoreColor = "#f4b304"; }
  if (score >= 100) { scoreGrade = "Top Innovator"; scoreColor = "#00d2ff"; }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        Welcome back, Innovator!
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Here is your live summary and dedication status.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Dedication Scorecard */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -1', background: 'linear-gradient(135deg, rgba(43, 12, 35, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)', border: `1px solid ${scoreColor}40` }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Dedication Scorecard</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: scoreColor }}>
                {score} <span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-secondary)' }}>pts</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: scoreColor }}>{scoreGrade}</div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{attendanceCount}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Classes Attended</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completedTasks}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tasks Done</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Status Card */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Lab Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '12px', height: '12px', borderRadius: '50%', 
              backgroundColor: labStatus === 'Open' ? '#00d2ff' : '#ff5555', 
              boxShadow: `0 0 10px ${labStatus === 'Open' ? '#00d2ff' : '#ff5555'}` 
            }}></div>
            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>{labStatus}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {labStatus === 'Open' ? "The lab is currently active." : "The lab is closed."}
          </p>
        </div>

        {/* Pending Tasks */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>My Tasks</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {pendingTasks}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Tasks pending completion
          </p>
        </div>

        {/* Finance Status */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Payment Status</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: pendingVerifications > 0 ? '#F4B304' : '#2ecc71' }}>
            {pendingVerifications > 0 ? "Pending Verification" : "All Clear"}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {pendingVerifications} payment(s) awaiting admin approval
          </p>
        </div>

      </div>
    </div>
  );
}
