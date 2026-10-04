"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

import Link from "next/link";
import styles from "./overview.module.css";
import { Zap, CheckSquare, Calendar, Package, Trophy, CreditCard } from "lucide-react";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome back, Innovator!
        </h1>
        <p className={styles.subtitle}>
          Here is your live summary and dedication status.
        </p>
      </div>

      {/* Dedication Scorecard */}
      <div className={`glass-panel ${styles.scoreCard}`} style={{ borderColor: `${scoreColor}40` }}>
        <div className={styles.scoreMain}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
            Dedication Scorecard
          </div>
          <div className={styles.scoreVal} style={{ color: scoreColor }}>
            {score} <span className={styles.scorePts}>pts</span>
          </div>
          <div className={styles.scoreGrade} style={{ color: scoreColor }}>
            {scoreGrade}
          </div>
        </div>

        <div className={styles.scoreDivider}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{attendanceCount}</div>
            <div className={styles.statLabel}>Classes Attended</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{completedTasks}</div>
            <div className={styles.statLabel}>Tasks Completed</div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Tiles for Mobile & PC */}
      <div className={styles.quickSectionTitle}>
        <Zap size={18} style={{ color: 'var(--accent-primary)' }} />
        <span>Quick Launchpad</span>
      </div>
      <div className={styles.quickGrid}>
        <Link href="/dashboard/inventory" className={styles.quickCard}>
          <div className={styles.quickIconBox}>
            <Package size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>Store & Lab</h4>
            <p>Components & parts</p>
          </div>
        </Link>

        <Link href="/dashboard/competitions" className={styles.quickCard}>
          <div className={styles.quickIconBox} style={{ background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff' }}>
            <Trophy size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>Competitions</h4>
            <p>Events & tickets</p>
          </div>
        </Link>

        <Link href="/dashboard/tasks" className={styles.quickCard}>
          <div className={styles.quickIconBox} style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71' }}>
            <CheckSquare size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>My Tasks</h4>
            <p>{pendingTasks} pending</p>
          </div>
        </Link>

        <Link href="/dashboard/attendance" className={styles.quickCard}>
          <div className={styles.quickIconBox} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Calendar size={22} />
          </div>
          <div className={styles.quickInfo}>
            <h4>Attendance</h4>
            <p>Class history</p>
          </div>
        </Link>
      </div>

      {/* Live System Stats */}
      <div className={styles.statsGrid}>
        {/* Lab Status Card */}
        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.cardHeader}>Lab Status</div>
          <div className={styles.statusIndicator}>
            <div 
              className={styles.statusDot} 
              style={{ 
                backgroundColor: labStatus === 'Open' ? '#00d2ff' : '#ff5555', 
                boxShadow: `0 0 10px ${labStatus === 'Open' ? '#00d2ff' : '#ff5555'}` 
              }}
            />
            <span className={styles.statusText}>{labStatus}</span>
          </div>
          <p className={styles.cardDesc}>
            {labStatus === 'Open' ? "The lab is open and ready for prototyping." : "The lab is currently closed."}
          </p>
        </div>

        {/* Pending Tasks */}
        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.cardHeader}>Pending Tasks</div>
          <div className={styles.bigNum}>{pendingTasks}</div>
          <p className={styles.cardDesc}>
            Tasks assigned to your account
          </p>
        </div>

        {/* Finance Status */}
        <div className={`glass-panel ${styles.card}`}>
          <div className={styles.cardHeader}>Payment Status</div>
          <div className={styles.statusText} style={{ color: pendingVerifications > 0 ? '#F4B304' : '#2ecc71' }}>
            {pendingVerifications > 0 ? "Pending Verification" : "All Clear"}
          </div>
          <p className={styles.cardDesc}>
            {pendingVerifications} payment(s) awaiting verification
          </p>
        </div>
      </div>
    </div>
  );
}
