"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../portal.module.css";

export default function SetupAdmin() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgradeCurrent = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: new Date().toISOString()
      });
      setSuccess("Account upgraded to admin! The sidebar should update immediately.");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upgrade account. (Check Firestore rules)");
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 2. Set Admin Role in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        role: "admin",
        createdAt: new Date().toISOString()
      });

      setSuccess("Admin account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.loginCard}`}>
        <div>
          <h1 className={styles.title}>Initial Admin Setup</h1>
          <p className={styles.subtitle}>Create your first admin account to manage the system</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div style={{ padding: '1rem', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        {user ? (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ marginBottom: '1rem' }}>You are currently logged in as: <strong>{user.email}</strong></p>
            <button 
              onClick={handleUpgradeCurrent} 
              className={styles.submitBtn} 
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)' }}
            >
              {loading ? "Upgrading..." : "Make this account an Admin!"}
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Note: If this fails with a permissions error, you need to update your Firestore Security Rules to allow writes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSetup} className={styles.formGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Admin Email</label>
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="admin@roboinnovators.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password (min 6 chars)</label>
              <input
                type="password"
                id="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
