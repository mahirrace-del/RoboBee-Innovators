"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./bom.module.css";

export default function BOMDashboard() {
  const { role } = useAuth();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // New Project Form
  const [newProjectName, setNewProjectName] = useState("");

  // Add Item to BOM Form (Custom or Inventory)
  const [addMode, setAddMode] = useState<"custom" | "inventory">("custom");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState(0);
  const [customSource, setCustomSource] = useState("Daraz");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      setProjects(items);
      if (items.length > 0 && !selectedProjectId) {
        setSelectedProjectId(items[0].id);
      }
    });

    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as any,
        price: (doc.data() as any).price || 150 
      }));
      setInventory(items);
    });

    return () => {
      unsubProjects();
      unsubInventory();
    };
  }, [selectedProjectId]);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    
    const docRef = await addDoc(collection(db, "projects"), {
      name: newProjectName,
      bom: []
    });
    setNewProjectName("");
    setSelectedProjectId(docRef.id);
  };

  const handleAddItemToBOM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || quantity < 1) return;

    let newItem = null;

    if (addMode === "inventory") {
      const item = inventory.find(i => i.id === selectedItemId);
      if (!item) return;
      newItem = {
        id: Date.now().toString(),
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        totalCost: item.price * quantity,
        source: "Lab Inventory",
        status: "In Stock"
      };
    } else {
      if (!customName || customPrice < 0) return;
      newItem = {
        id: Date.now().toString(),
        name: customName,
        price: customPrice,
        quantity: quantity,
        totalCost: customPrice * quantity,
        source: customSource,
        status: "Needed"
      };
    }

    if (newItem) {
      await updateDoc(doc(db, "projects", selectedProjectId), {
        bom: arrayUnion(newItem)
      });
    }
    
    // Reset form
    setCustomName("");
    setCustomPrice(0);
    setSelectedItemId("");
    setQuantity(1);
  };

  const totalProjectCost = activeProject?.bom?.reduce((acc: number, item: any) => acc + item.totalCost, 0) || 0;
  const neededCost = activeProject?.bom?.filter((b: any) => b.status === "Needed").reduce((acc: number, item: any) => acc + item.totalCost, 0) || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Project Budgets & BOM</h1>
        <p>Plan robot builds, track required purchases, and estimate total competition costs.</p>
      </div>

      {role === "admin" && (
        <div className={styles.panel} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Switch Project</label>
            <select className={styles.select} value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '1rem', flex: 1 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Create New Project</label>
              <input 
                className={styles.input} 
                style={{ marginBottom: 0 }}
                placeholder="e.g. RoboCup 2026 Build"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.btn} style={{ width: 'auto', whiteSpace: 'nowrap' }}>Create</button>
          </form>
        </div>
      )}

      {activeProject ? (
        <div className={styles.panels}>
          <div style={{ gridColumn: 'span 2' }}>
            <div className={styles.panel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>{activeProject.name} - Bill of Materials</h2>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>Total Est: {totalProjectCost} ৳</div>
                  <div style={{ fontSize: '0.9rem', color: '#ff5555' }}>New Funds Needed: {neededCost} ৳</div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Part Name</th>
                      <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Source</th>
                      <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Unit Cost</th>
                      <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Qty</th>
                      <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Total Cost</th>
                      <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProject.bom?.length > 0 ? activeProject.bom.map((b: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{b.name}</td>
                        <td style={{ padding: '1rem' }}>{b.source}</td>
                        <td style={{ padding: '1rem' }}>{b.price} ৳</td>
                        <td style={{ padding: '1rem' }}>{b.quantity}</td>
                        <td style={{ padding: '1rem', color: 'var(--accent-primary)' }}>{b.totalCost} ৳</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '20px', 
                            fontSize: '0.8rem',
                            background: b.status === 'In Stock' ? 'rgba(0,255,0,0.1)' : 'rgba(255,85,85,0.1)',
                            color: b.status === 'In Stock' ? '#55ff55' : '#ff5555'
                          }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No items added to this project's BOM yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <h2 className={styles.sectionTitle}>Add Item to Budget</h2>
            <div className={styles.panel}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button 
                  onClick={() => setAddMode("custom")}
                  className={styles.btn} 
                  style={{ background: addMode === 'custom' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: addMode === 'custom' ? '#000' : '#fff' }}
                >
                  Add Custom Part (To Buy)
                </button>
                <button 
                  onClick={() => setAddMode("inventory")}
                  className={styles.btn} 
                  style={{ background: addMode === 'inventory' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', color: addMode === 'inventory' ? '#000' : '#fff' }}
                >
                  Add from Lab Inventory
                </button>
              </div>

              <form onSubmit={handleAddItemToBOM} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                {addMode === "inventory" ? (
                  <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Select Part</label>
                    <select className={styles.select} value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)} required>
                      <option value="">-- Choose Part --</option>
                      {inventory.map(i => (
                        <option key={i.id} value={i.id}>{i.name} (Est. {i.price} ৳)</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Part Name</label>
                      <input type="text" className={styles.input} style={{ marginBottom: 0 }} value={customName} onChange={e => setCustomName(e.target.value)} required placeholder="e.g. 12V DC Motor" />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Unit Cost (৳)</label>
                      <input type="number" className={styles.input} style={{ marginBottom: 0 }} min="0" value={customPrice} onChange={e => setCustomPrice(parseFloat(e.target.value) || 0)} required />
                    </div>
                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Source</label>
                      <select className={styles.select} value={customSource} onChange={e => setCustomSource(e.target.value)}>
                        <option value="Daraz">Daraz</option>
                        <option value="AliExpress">AliExpress</option>
                        <option value="Local Market (Patuatuli)">Local Market (Patuatuli)</option>
                        <option value="RoboShop BD">RoboShop BD</option>
                        <option value="TechShop BD">TechShop BD</option>
                      </select>
                    </div>
                  </>
                )}

                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Quantity</label>
                  <input type="number" className={styles.input} style={{ marginBottom: 0 }} min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} required />
                </div>

                <button type="submit" className={styles.btn}>Add to BOM</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Select or create a project to start planning the budget.
        </div>
      )}
    </div>
  );
}
