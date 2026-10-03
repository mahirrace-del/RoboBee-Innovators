"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "./recruitment.module.css";

export default function RecruitmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    skills: "",
    reason: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // 1. Create the Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Save all application data into the users collection as a pending user
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        skills: formData.skills,
        reason: formData.reason,
        username: "", // To be set by user upon approval
        role: "pending",
        joinedAt: new Date().toISOString()
      });
      
      // 3. Send them to the dashboard which will instantly lock them into the pending screen
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error submitting application:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. If your application was declined, please sign in to delete your old application first.");
      } else {
        setError("Failed to submit application. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Join the Team</h1>
          <p className={styles.subtitle}>Apply and create your Robobee account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input type="text" id="name" name="name" className={styles.input} required value={formData.name} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input type="email" id="email" name="email" className={styles.input} required value={formData.email} onChange={handleChange} placeholder="Any valid email address" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone Number</label>
            <input type="tel" id="phone" name="phone" className={styles.input} required value={formData.phone} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="department" className={styles.label}>Department / Major</label>
            <input type="text" id="department" name="department" className={styles.input} required value={formData.department} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="skills" className={styles.label}>Your Skills (e.g., Python, C++, CAD, Soldering)</label>
            <input type="text" id="skills" name="skills" className={styles.input} required value={formData.skills} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reason" className={styles.label}>Why do you want to join Robo Innovators?</label>
            <textarea id="reason" name="reason" className={styles.textarea} required value={formData.reason} onChange={handleChange}></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Account Password</label>
            <input type="password" id="password" name="password" className={styles.input} required value={formData.password} onChange={handleChange} placeholder="Choose a password for your account" minLength={6} />
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application & Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
