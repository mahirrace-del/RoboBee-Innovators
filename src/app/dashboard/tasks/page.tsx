"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, addDoc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./tasks.module.css";

export default function TasksPage() {
  const { user, role } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  
  // Create Task Form State (Admin Only)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(""); // Stores member email
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    let q;
    // Admins see all tasks, members see only their tasks and general tasks
    if (role === "admin") {
      q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "tasks"), where("assignedTo", "in", [user.email, "GENERAL"]));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // Sort manually for members since we can't easily compound index without Firebase console setup
      if (role !== "admin") {
        taskData.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      }
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [user, role]);

  useEffect(() => {
    // Fetch members if admin
    if (role === "admin") {
      const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        // Filter out pending users, or just show everyone. We will show all valid members and admins.
        const activeMembers = usersData.filter(u => u.role !== 'pending');
        setMembers(activeMembers);
      });
      return () => unsubUsers();
    }
  }, [role]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedTo) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        assignedTo, // This is the email
        assignedBy: user?.email,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setDescription("");
      setAssignedTo("");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        status: "completed",
        completedAt: serverTimestamp(),
        completedBy: user?.email || "unknown"
      });
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Task Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {role === 'admin' ? "Assign and monitor all team tasks." : "View and complete your assigned tasks."}
          </p>
        </div>
      </div>

      {role === "admin" && (
        <form onSubmit={handleCreateTask} className={`glass-panel ${styles.formCard}`}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Assign a New Task</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Task Title</label>
              <input type="text" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Calibrate sensors" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Assign To (Member)</label>
              <select 
                className={styles.input} 
                value={assignedTo} 
                onChange={(e) => setAssignedTo(e.target.value)} 
                required
                style={{ appearance: 'auto', background: 'rgba(0,0,0,0.3)', color: 'white' }}
              >
                <option value="" disabled>Select a member...</option>
                <option value="GENERAL" style={{ fontWeight: 'bold' }}>📢 General / Open Task (All Members)</option>
                {members.map(m => (
                  <option key={m.id} value={m.email}>
                    {m.name} (@{m.username}) - {m.email}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Task Description & Requirements</label>
              <textarea 
                className={styles.input} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </form>
      )}

      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Active & Past Tasks</h2>
        
        {tasks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No tasks found.
          </div>
        ) : (
          <div className={styles.grid}>
            {tasks.map(task => (
              <div key={task.id} className={`glass-panel ${styles.taskCard}`} style={{ borderLeftColor: task.status === 'completed' ? '#2ecc71' : 'var(--accent-primary)' }}>
                
                <div className={styles.taskHeader}>
                  <div className={styles.taskTitle}>{task.title}</div>
                  <div className={`${styles.statusBadge} ${task.status === 'completed' ? styles.statusCompleted : styles.statusPending}`}>
                    {task.status}
                  </div>
                </div>

                <div className={styles.taskDesc}>{task.description}</div>

                <div className={styles.metaInfo}>
                  <div style={{ marginBottom: '0.25rem' }}>
                    <strong>Assigned to:</strong> <span style={{ color: 'var(--accent-primary)' }}>{task.assignedTo === 'GENERAL' ? 'All Members' : task.assignedTo}</span>
                  </div>
                  {role === "admin" && (
                    <div>
                       <strong>Assigned by:</strong> {task.assignedBy}
                    </div>
                  )}
                  {task.status === 'completed' && task.completedBy && (
                    <div style={{ marginTop: '0.25rem' }}>
                       <strong>Completed by:</strong> <span style={{ color: '#2ecc71' }}>{task.completedBy}</span>
                    </div>
                  )}
                </div>

                {task.status === "pending" && (role === "admin" || user?.email === task.assignedTo || task.assignedTo === "GENERAL") && (
                  <button onClick={() => handleCompleteTask(task.id)} className={styles.completeBtn}>
                    Mark as Completed
                  </button>
                )}
                
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
