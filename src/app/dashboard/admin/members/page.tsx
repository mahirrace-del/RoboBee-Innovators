"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./members.module.css";

export default function MembersManagementPage() {
  const { role, user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") return;

    // We can order by createdAt if it exists, otherwise just fetch all
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as any
      }));
      
      // Client-side sort by createdAt descending just in case index is missing
      data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setMembers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === user?.uid) {
      alert("You cannot change your own role here to prevent locking yourself out!");
      return;
    }
    
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole
      });
      alert("Role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. Check your permissions.");
    }
  };

  if (role !== "admin") {
    return <div style={{ color: '#ff5555', padding: '2rem' }}>Access Denied. Admin privileges required.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Member Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View all registered members and assign roles.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        {/* Info Box */}
        <div style={{ background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ color: '#00d2ff', marginBottom: '0.5rem', fontSize: '1rem' }}>How to add new members?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            To invite a new member, ask them to go to <strong>/portal/setup</strong> or the recruitment page to create their account. Once they register, they will automatically appear here as a "member" and you can optionally upgrade them to an "admin".
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading members...</p>
        ) : members.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No members found.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Date Joined</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{member.email}</div>
                      {member.id === user?.uid && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)' }}>(You)</div>
                      )}
                    </td>
                    <td>
                      {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${member.role === 'admin' ? styles.roleAdmin : styles.roleMember}`}>
                        {member.role || "member"}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={member.role || "member"}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className={styles.select}
                        disabled={member.id === user?.uid}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
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
