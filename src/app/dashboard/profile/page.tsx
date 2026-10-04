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
  


  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setUsername(userData.username || "");
      setPhone(userData.phone || "");
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



  if (!user || !userData) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading profile...</div>;
  }



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
    </div>
  );
}
