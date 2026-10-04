"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, increment } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./inventory.module.css";
import { Plus, Minus, Trash2, ArrowLeft } from "lucide-react";

export default function InventoryDashboard() {
  const { user, role, canManage } = useAuth();
  const canEditStore = role === "admin" || canManage("manage_store");
  
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showMobileAdd, setShowMobileAdd] = useState(false);
  
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
      setShowMobileAdd(false);
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Store Management System</h1>
          <p className={styles.subtitle}>Organize, track, and manage all robotics components.</p>
        </div>
        <Link href="/dashboard/lab" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Lab Status
        </Link>
      </div>

      {/* Mobile-Only Quick Toggle for Adding Component */}
      {canEditStore && (
        <button 
          className={styles.mobileAddToggle} 
          onClick={() => setShowMobileAdd(!showMobileAdd)}
        >
          {showMobileAdd ? "✕ Close Add Form" : "➕ Add New Component"}
        </button>
      )}

      {/* Mobile Collapsible Add Part Form (Shown when toggled on mobile) */}
      {canEditStore && showMobileAdd && (
        <div className={`glass-panel ${styles.formCard}`} style={{ marginBottom: '2rem' }}>
          <h2 className={styles.formTitle}>Add New Component</h2>
          <form onSubmit={handleAddPart}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Part Name</label>
              <input 
                type="text" 
                required 
                value={newPartName} 
                onChange={e => setNewPartName(e.target.value)} 
                className={styles.formInput} 
                placeholder="e.g. Raspberry Pi 4" 
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <input 
                type="text" 
                value={newPartCategory} 
                onChange={e => setNewPartCategory(e.target.value)} 
                className={styles.formInput} 
                placeholder="e.g. Microcontroller" 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className={styles.formLabel}>Unit Price (৳)</label>
                <input 
                  type="number" 
                  required 
                  min="0" 
                  value={newPartPrice} 
                  onChange={e => setNewPartPrice(parseFloat(e.target.value) || 0)} 
                  className={styles.formInput} 
                />
              </div>
              <div>
                <label className={styles.formLabel}>Quantity</label>
                <input 
                  type="number" 
                  required 
                  min="1" 
                  value={newPartQty} 
                  onChange={e => setNewPartQty(parseInt(e.target.value) || 1)} 
                  className={styles.formInput} 
                />
              </div>
            </div>
            <button type="submit" disabled={isAddingPart} className={styles.submitBtn}>
              {isAddingPart ? 'Adding...' : 'Add to Inventory'}
            </button>
          </form>
        </div>
      )}

      <div className={canEditStore ? styles.layoutGridWithAdmin : styles.layoutGrid}>
        
        {/* Main Store View */}
        <div>
          {/* Controls: Search and Scrollable Categories */}
          <div className={`glass-panel ${styles.filterCard}`}>
            <input 
              type="text"
              placeholder="Search parts by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            
            <div className={styles.categoryScroll}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.categoryPill} ${selectedCategory === cat ? styles.categoryPillActive : styles.categoryPillInactive}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Inventory Grid */}
          {filteredInventory.length === 0 ? (
            <div className={`glass-panel ${styles.emptyState}`}>
              No parts found matching your selection.
            </div>
          ) : (
            <div className={styles.inventoryGrid}>
              {filteredInventory.map(item => (
                <div key={item.id} className={`glass-panel ${styles.partCard}`}>
                  <div>
                    <div className={styles.partCategory}>
                      {item.category || "Uncategorized"}
                    </div>
                    <h3 className={styles.partName}>
                      {item.name}
                    </h3>
                    <div className={styles.partQuantity}>
                      {item.quantity} <span className={styles.quantitySub}>in stock</span>
                    </div>
                    <div className={styles.partPrice}>
                      {item.price ? `${item.price} ৳ / unit` : 'Price not set'}
                    </div>
                  </div>

                  {/* Admin / Store Manager Controls */}
                  {canEditStore && (
                    <div className={styles.controlArea}>
                      <div className={styles.stepperGroup}>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, -1, item.quantity)}
                          className={styles.stepperBtn}
                          aria-label="Decrease stock"
                        >
                          <Minus size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, 1, item.quantity)}
                          className={styles.stepperBtn}
                          aria-label="Increase stock"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleDeletePart(item.id)}
                        className={styles.deleteBtn}
                        aria-label="Delete item"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Desktop Admin / Store Manager Form */}
        {canEditStore && (
          <div className={styles.adminFormContainer}>
            <div className={`glass-panel ${styles.formCard}`}>
              <h2 className={styles.formTitle}>Add New Part</h2>
              <form onSubmit={handleAddPart}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Part Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newPartName} 
                    onChange={e => setNewPartName(e.target.value)} 
                    className={styles.formInput} 
                    placeholder="e.g. Raspberry Pi 4" 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <input 
                    type="text" 
                    value={newPartCategory} 
                    onChange={e => setNewPartCategory(e.target.value)} 
                    className={styles.formInput} 
                    placeholder="e.g. Microcontroller" 
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                    Type or reuse category name to group components
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className={styles.formLabel}>Unit Price (৳)</label>
                    <input 
                      type="number" 
                      required 
                      min="0" 
                      value={newPartPrice} 
                      onChange={e => setNewPartPrice(parseFloat(e.target.value) || 0)} 
                      className={styles.formInput} 
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Quantity</label>
                    <input 
                      type="number" 
                      required 
                      min="1" 
                      value={newPartQty} 
                      onChange={e => setNewPartQty(parseInt(e.target.value) || 1)} 
                      className={styles.formInput} 
                    />
                  </div>
                </div>
                <button type="submit" disabled={isAddingPart} className={styles.submitBtn}>
                  {isAddingPart ? 'Adding...' : 'Add to Inventory'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
