"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { usePathname } from "next/navigation";

export default function ClientLabStatus() {
  const [labStatus, setLabStatus] = useState<"Open" | "Closed" | "Loading">("Loading");

  const pathname = usePathname();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "labStatus"), (docSnap) => {
      if (docSnap.exists()) {
        setLabStatus(docSnap.data().status);
      } else {
        setLabStatus("Closed");
      }
    });

    return () => unsub();
  }, []);

  // Only show the lab status indicator on dashboard/member portal pages
  if (!pathname.startsWith('/dashboard')) return null;
  if (labStatus === "Loading") return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      border: `1px solid ${labStatus === 'Open' ? 'rgba(0, 210, 255, 0.3)' : 'rgba(255, 85, 85, 0.3)'}`,
      boxShadow: `0 4px 15px rgba(0,0,0,0.1)`,
      backdropFilter: 'blur(10px)',
      flexShrink: 0
    }}>
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        backgroundColor: labStatus === 'Open' ? '#00d2ff' : '#ff5555',
        boxShadow: `0 0 10px ${labStatus === 'Open' ? '#00d2ff' : '#ff5555'}`
      }}></div>
      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
        Lab is {labStatus}
      </span>
    </div>
  );
}
