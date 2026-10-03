"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./checkout.module.css";

interface HardwareItem {
  id: string;
  name: string;
  description: string;
  status: "Available" | "Checked Out";
  checkedOutBy?: string;
  checkedOutAt?: any;
}

export default function CheckoutDashboard() {
  const { user, role } = useAuth();
  const [hardware, setHardware] = useState<HardwareItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "hardware"));
    const unsub = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && role === "admin") {
        // Seed some initial data if empty
        const initialHardware = [
          { name: "HuskyLens AI Vision Sensor", description: "Smart AI camera for object tracking", status: "Available" },
          { name: "STM32 Nucleo-64", description: "ARM Cortex-M4 Microcontroller", status: "Available" },
          { name: "RPLIDAR A1", description: "360 degree Laser Range Scanner", status: "Available" },
          { name: "Jetson Nano Developer Kit", description: "AI Computing Platform", status: "Available" }
        ];
        for (const item of initialHardware) {
          const newDoc = doc(collection(db, "hardware"));
          await setDoc(newDoc, item);
        }
      } else {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HardwareItem));
        setHardware(items);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [role]);

  const handleCheckout = async (itemId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "hardware", itemId), {
        status: "Checked Out",
        checkedOutBy: user.email,
        checkedOutAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
      alert("Failed to checkout item.");
    }
  };

  const handleReturn = async (itemId: string) => {
    try {
      await updateDoc(doc(db, "hardware", itemId), {
        status: "Available",
        checkedOutBy: null,
        checkedOutAt: null
      });
    } catch (err) {
      console.error(err);
      alert("Failed to return item.");
    }
  };

  const availableItems = hardware.filter(item => item.status === "Available");
  // Members only see their own checked out items, Admins see all checked out items
  const checkedOutItems = hardware.filter(item => item.status === "Checked Out" && (role === "admin" || item.checkedOutBy === user?.email));

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hardware Checkout</h1>
          <p className={styles.subtitle}>Digitally sign out expensive or reusable components</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div>
          <h2 className={styles.sectionTitle}>Available Hardware</h2>
          <div className={styles.panel}>
            {availableItems.length === 0 ? (
              <p className={styles.emptyState}>No hardware available right now.</p>
            ) : (
              <div className={styles.list}>
                {availableItems.map(item => (
                  <div key={item.id} className={styles.itemCard}>
                    <div>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemDesc}>{item.description}</div>
                    </div>
                    <button 
                      className={styles.btnCheckout}
                      onClick={() => handleCheckout(item.id)}
                    >
                      Check Out
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>
            {role === "admin" ? "All Checked Out Items" : "My Checked Out Items"}
          </h2>
          <div className={styles.panel}>
            {checkedOutItems.length === 0 ? (
              <p className={styles.emptyState}>No items are currently checked out.</p>
            ) : (
              <div className={styles.list}>
                {checkedOutItems.map(item => (
                  <div key={item.id} className={styles.itemCard}>
                    <div>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemDesc}>
                        Checked out by: <strong style={{color: 'var(--accent-primary)'}}>{item.checkedOutBy}</strong>
                      </div>
                    </div>
                    {/* Admins can return ANY item, Members can return THEIR items */}
                    {(role === "admin" || item.checkedOutBy === user?.email) && (
                      <button 
                        className={styles.btnReturn}
                        onClick={() => handleReturn(item.id)}
                      >
                        Return Part
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
