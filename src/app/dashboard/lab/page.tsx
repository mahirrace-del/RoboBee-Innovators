"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, doc, addDoc, serverTimestamp, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./lab.module.css";

export default function LabDashboard() {
  const { user, role } = useAuth();
  
  const [labStatus, setLabStatus] = useState<"Open" | "Closed">("Closed");
  
  // Part Request Form
  const [partName, setPartName] = useState("");
  const [partReason, setPartReason] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  // Add Part Form (Admin Only)
  const [newPartName, setNewPartName] = useState("");
  const [newPartCategory, setNewPartCategory] = useState("");
  const [newPartPrice, setNewPartPrice] = useState(0);
  const [newPartQty, setNewPartQty] = useState(1);
  const [isAddingPart, setIsAddingPart] = useState(false);

  useEffect(() => {
    // Listen to Lab Status
    const unsubStatus = onSnapshot(doc(db, "settings", "labStatus"), (docSnap) => {
      if (docSnap.exists()) {
        setLabStatus(docSnap.data().status);
      } else {
        // Initialize if it doesn't exist
        setDoc(doc(db, "settings", "labStatus"), { status: "Closed" });
      }
    });

    return () => {
      unsubStatus();
    };
  }, []);

  const toggleLabStatus = async () => {
    if (role !== "admin") return;
    const newStatus = labStatus === "Open" ? "Closed" : "Open";
    await updateDoc(doc(db, "settings", "labStatus"), { status: newStatus });
  };

  const handleRequestPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName) return;

    setIsRequesting(true);
    try {
      await addDoc(collection(db, "partRequests"), {
        partName,
        reason: partReason,
        requestedBy: user?.email,
        uid: user?.uid,
        status: "pending",
        requestedAt: serverTimestamp(),
      });
      setPartName("");
      setPartReason("");
      alert("Part requested successfully!");
    } catch (error) {
      console.error("Error requesting part:", error);
      alert("Failed to request part.");
    } finally {
      setIsRequesting(false);
    }
  };



  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Lab & Inventory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Check lab availability and request new parts</p>
        </div>

        {/* Lab Status Indicator */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '1rem 2rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            cursor: role === 'admin' ? 'pointer' : 'default',
            border: `1px solid ${labStatus === 'Open' ? 'rgba(0, 210, 255, 0.3)' : 'rgba(255, 85, 85, 0.3)'}`
          }}
          onClick={toggleLabStatus}
        >
          <div style={{ 
            width: '15px', height: '15px', borderRadius: '50%', 
            backgroundColor: labStatus === 'Open' ? '#00d2ff' : '#ff5555', 
            boxShadow: `0 0 15px ${labStatus === 'Open' ? '#00d2ff' : '#ff5555'}` 
          }}></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Lab is Currently</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{labStatus}</div>
          </div>
          {role === 'admin' && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '1rem' }}>
              (Click to toggle)
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Full Inventory Link */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Full Lab Inventory</h2>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '300px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Organized Inventory Manager</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '300px' }}>Search, filter, categorize, and manage all lab equipment and parts in one place.</p>
            <Link href="/dashboard/inventory" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
              Open Inventory Manager
            </Link>
          </div>
        </div>

        {/* Request Part Form */}
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Request a Part</h2>
          <form onSubmit={handleRequestPart} className={`glass-panel ${styles.form}`}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Part Name / Link</label>
              <input 
                type="text" 
                required 
                value={partName}
                onChange={e => setPartName(e.target.value)}
                className={styles.input}
                placeholder="e.g. Arduino Mega 2560"
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Reason for Request</label>
              <textarea 
                required 
                value={partReason}
                onChange={e => setPartReason(e.target.value)}
                className={styles.input}
                placeholder="Needed for the drone project..."
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" disabled={isRequesting} className={styles.submitBtn}>
              {isRequesting ? 'Submitting...' : 'Add to Queue'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
