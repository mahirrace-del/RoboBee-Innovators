"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "./portal.module.css";

export default function PortalLogin() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If already logged in, automatically redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (typeof window !== "undefined") {
        await setPersistence(auth, browserLocalPersistence);
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // While checking existing session, show clean loading state instead of empty form
  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={`glass-panel ${styles.loginCard}`} style={{ textAlign: "center", alignItems: "center" }}>
          <div className={styles.spinner} />
          <p className={styles.subtitle} style={{ marginTop: "1rem" }}>
            Checking saved login session...
          </p>
        </div>
      </div>
    );
  }

  // If user already authenticated, display session card with immediate access & sign-out options
  if (user) {
    return (
      <div className={styles.container}>
        <div className={`glass-panel ${styles.loginCard}`} style={{ textAlign: "center", alignItems: "center" }}>
          <div>
            <h1 className={styles.title} style={{ fontSize: "1.6rem" }}>Active Session</h1>
            <p className={styles.subtitle} style={{ marginBottom: "0.5rem" }}>
              You are currently logged in as:
            </p>
            <div style={{
              background: "rgba(244, 179, 4, 0.1)",
              border: "1px solid rgba(244, 179, 4, 0.3)",
              color: "var(--accent-primary)",
              padding: "0.6rem 1rem",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.95rem",
              marginBottom: "1rem"
            }}>
              {user.email}
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Redirecting to your dashboard...
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
            <button
              onClick={() => router.replace("/dashboard")}
              className={styles.submitBtn}
              style={{ width: "100%", margin: 0 }}
            >
              Go to Dashboard →
            </button>
            <button
              type="button"
              onClick={async () => {
                await signOut();
              }}
              className={styles.secondaryBtn}
            >
              Sign Out / Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.loginCard}`}>
        <div>
          <h1 className={styles.title}>Portal Access</h1>
          <p className={styles.subtitle}>
            Sign in to access your Robo Innovators dashboard
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.formGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/recruitment" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'underline' }}>
              Don't have an account? Apply to join here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
