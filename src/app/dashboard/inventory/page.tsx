"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, increment } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "../lab/lab.module.css"; // Reuse lab styles or we can add inline

export default function InventoryDashboard() {
  const { user, role, canManage } = useAuth();
  const canEditStore = role === "admin" || canManage("manage_store");
  
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Add Part Form (Admin Only)
  const [newPartName, setNewPartName] = useState("");
  const [newPartCategory, setNewPartCategory] = useState("");
  const [newPartPrice, setNewPartPrice] = useState(0);
  const [newPartQty, setNewPartQty] = useState(1);
  const [isAddingPart, setIsAddingPart] = useState(false);

  useEffect(() => {
    // Listen to Inventory
    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInventory(items);
    });

    return () => {
      unsubInventory();
    };
  }, []);

  const handleAddPart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditStore || !newPartName) return;
    
    setIsAddingPart(true);
    try {
      // Check if part already exists (case-insensitive)
      const existingPart = inventory.find(
        p => p.name.trim().toLowerCase() === newPartName.trim().toLowerCase()
      );

      if (existingPart) {
        // Update existing part
        await updateDoc(doc(db, "inventory", existingPart.id), {
          quantity: increment(newPartQty),
          price: newPartPrice > 0 ? newPartPrice : existingPart.price
        });
        alert(`Updated existing part: ${existingPart.name}. Added ${newPartQty} more.`);
      } else {
        // Add new part
        await addDoc(collection(db, "inventory"), {
          name: newPartName.trim(),
          category: newPartCategory.trim() || "Uncategorized",
          price: newPartPrice,
          quantity: newPartQty,
          addedBy: user?.uid,
          addedAt: serverTimestamp()
        });
      }

      setNewPartName("");
      setNewPartCategory("");
      setNewPartPrice(0);
      setNewPartQty(1);
    } catch (error) {
      console.error("Error adding part:", error);
      alert("Failed to add part");
    } finally {
      setIsAddingPart(false);
    }
  };

  const handleUpdateQuantity = async (id: string, delta: number, currentQty: number) => {
    if (!canEditStore) return;
    const newQty = currentQty + delta;
    if (newQty < 0) return; // Prevent negative stock
    try {
      await updateDoc(doc(db, "inventory", id), {
        quantity: newQty
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeletePart = async (id: string) => {
    if (!canEditStore) return;
    if (window.confirm("Are you sure you want to permanently remove this part from the inventory?")) {
      try {
        await deleteDoc(doc(db, "inventory", id));
      } catch (error) {
        console.error("Error deleting part:", error);
      }
    }
  };

  // Derive categories from inventory
  const categories = useMemo(() => {
    const cats = new Set<string>();
    inventory.forEach(item => {
      cats.add(item.category || "Uncategorized");
    });
    return ["All", ...Array.from(cats).sort()];
  }, [inventory]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || (item.category || "Uncategorized") === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [inventory, searchQuery, selectedCategory]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Store Management System</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Organize, track, and manage all robotics components.</p>
        </div>
        <Link href="/dashboard/lab" className={styles.submitBtn} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}>
          Back to Lab Status
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: canEditStore ? '3fr 1fr' : '1fr', gap: '2rem' }}>
        
        {/* Main Store View */}
        <div>
          {/* Controls: Search and Categories */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <input 
              type="text"
              placeholder="Search parts by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
              style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', fontSize: '1rem' }}
            />
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    backgroundColor: selectedCategory === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                    color: selectedCategory === cat ? '#000' : 'var(--text-primary)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Inventory Grid */}
          {filteredInventory.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No parts found for this category or search query.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {filteredInventory.map(item => (
                <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.2rem', fontWeight: 'bold' }}>
                      {item.category || "Uncategorized"}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {item.name}
                    </h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: item.quantity > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {item.quantity} <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>in stock</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      {item.price ? `${item.price} ৳ / unit` : 'Price not set'}
                    </div>
                  </div>

                  {/* Admin / Store Manager Controls */}
                  {canEditStore && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, -1, item.quantity)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}
                          >-</button>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, 1, item.quantity)}
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}
                          >+</button>
                        </div>
                        <button 
                          onClick={() => handleDeletePart(item.id)}
                          style={{ background: 'rgba(255, 85, 85, 0.2)', border: 'none', color: '#ff5555', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Admin / Store Manager Forms */}
        {canEditStore && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Add New Part</h2>
            <form onSubmit={handleAddPart} className={`glass-panel ${styles.form}`}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Part Name</label>
                <input type="text" required value={newPartName} onChange={e => setNewPartName(e.target.value)} className={styles.input} placeholder="e.g. Raspberry Pi 4" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Category</label>
                <input type="text" value={newPartCategory} onChange={e => setNewPartCategory(e.target.value)} className={styles.input} placeholder="e.g. Microcontroller" />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Use exact spelling of existing categories to group items!
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Unit Price (৳)</label>
                  <input type="number" required min="0" value={newPartPrice} onChange={e => setNewPartPrice(parseFloat(e.target.value) || 0)} className={styles.input} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Quantity</label>
                  <input type="number" required min="1" value={newPartQty} onChange={e => setNewPartQty(parseInt(e.target.value) || 1)} className={styles.input} />
                </div>
              </div>
              <button type="submit" disabled={isAddingPart} className={styles.submitBtn}>
                {isAddingPart ? 'Adding...' : 'Add to Inventory'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
