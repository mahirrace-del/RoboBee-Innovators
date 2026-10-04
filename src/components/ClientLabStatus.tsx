"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import styles from "./ClientLabStatus.module.css";

export default function ClientLabStatus() {
  const [labStatus, setLabStatus] = useState<"Open" | "Closed" | "Loading">("Loading");

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "labStatus"), 
      (docSnap) => {
        if (docSnap.exists()) {
          setLabStatus(docSnap.data().status);
        } else {
          setLabStatus("Closed");
        }
      },
      (error) => {
        console.warn("Could not read lab status, defaulting to Closed:", error);
        setLabStatus("Closed");
      }
    );

    return () => unsub();
  }, []);

  if (labStatus === "Loading") return null;

  const isOpen = labStatus === "Open";

  return (
    <div 
      className={`${styles.statusBadge} ${isOpen ? styles.openBadge : styles.closedBadge}`}
      role="status"
      aria-label={`Robotics Lab status is currently ${labStatus}`}
    >
      <div className={`${styles.indicatorDot} ${isOpen ? styles.dotOpen : styles.dotClosed}`}></div>
      <span className={styles.statusText}>
        Lab is {labStatus}
      </span>
    </div>
  );
}

