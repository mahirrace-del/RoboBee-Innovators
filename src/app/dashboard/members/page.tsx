"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../lab/lab.module.css"; 

export default function MembersDashboard() {
  const { role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "admin") return;
    
    // Listen to all users in the system
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(allUsers);
    });

    return () => unsub();
  }, [role]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole
      });
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to remove this user from the database? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (role !== "admin") {
    return <div style={{ color: 'var(--text-secondary)' }}>You do not have permission to view this page.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Member Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Approve recruits and manage team member access levels.</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Username</th>
              <th style={{ padding: '1rem' }}>Phone</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Status / Role</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found.</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{u.name || "N/A"}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent-primary)' }}>@{u.username || "unknown"}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.phone || "N/A"}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      value={u.role || 'pending'} 
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        color: u.role === 'admin' ? '#00d2ff' : u.role === 'declined' ? '#ff5555' : u.role === 'pending' ? '#F4B304' : 'var(--text-primary)', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        padding: '0.3rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="declined">Declined</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link 
                      href={`/dashboard/members/${u.id}`}
                      style={{ background: 'rgba(0, 210, 255, 0.2)', border: 'none', color: '#00d2ff', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem', textDecoration: 'none' }}
                    >
                      View Profile
                    </Link>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ background: 'rgba(255, 85, 85, 0.2)', border: 'none', color: '#ff5555', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
