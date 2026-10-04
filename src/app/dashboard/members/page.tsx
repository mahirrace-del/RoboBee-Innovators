"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./members.module.css";
import { Shield, User as UserIcon, Trash2, Mail, Phone } from "lucide-react";
import { 
  PERMISSION_LIST, 
  ROLE_PRESETS, 
  getUserRoleBadge, 
  PermissionKey 
} from "@/lib/permissions";

export default function MembersDashboard() {
  const { role, canManage, user: currentUser } = useAuth();
  const canAccess = role === "admin" || canManage("manage_members");

  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Role Assignment Modal State
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("member");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [customRoleTitle, setCustomRoleTitle] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("member");
  const [isSavingRole, setIsSavingRole] = useState(false);

  useEffect(() => {
    if (!canAccess) return;
    
    // Listen to all users in the system
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(allUsers);
    });

    return () => unsub();
  }, [canAccess]);

  const handleOpenRoleModal = (user: any) => {
    setEditingMember(user);
    setSelectedStatus(user.role || "member");
    setSelectedPermissions(Array.isArray(user.permissions) ? user.permissions : []);
    setCustomRoleTitle(user.roleTitle || "");
    
    // Determine initial preset
    if (user.role === "admin") {
      setSelectedPreset("admin");
    } else if (user.rolePreset) {
      setSelectedPreset(user.rolePreset);
    } else {
      const matched = ROLE_PRESETS.find(p => 
        p.id !== "admin" && 
        p.permissions.length === (user.permissions?.length || 0) &&
        p.permissions.every((perm: string) => user.permissions?.includes(perm))
      );
      setSelectedPreset(matched ? matched.id : user.permissions?.length ? "custom" : "member");
    }
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === "admin") {
      setSelectedStatus("admin");
      const adminPreset = ROLE_PRESETS.find(p => p.id === "admin");
      setSelectedPermissions(adminPreset ? [...adminPreset.permissions] : []);
      setCustomRoleTitle("Administrator");
    } else if (presetId === "member") {
      setSelectedStatus("member");
      setSelectedPermissions([]);
      setCustomRoleTitle("");
    } else if (presetId === "custom") {
      setSelectedStatus("member");
      // Keep existing permissions
    } else {
      setSelectedStatus("member");
      const preset = ROLE_PRESETS.find(p => p.id === presetId);
      if (preset) {
        setSelectedPermissions([...preset.permissions]);
        setCustomRoleTitle(preset.name);
      }
    }
  };

  const handleTogglePermission = (permKey: string) => {
    setSelectedPreset("custom");
    setSelectedPermissions(prev => 
      prev.includes(permKey) ? prev.filter(k => k !== permKey) : [...prev, permKey]
    );
  };

  const handleSaveRole = async () => {
    if (!editingMember) return;
    setIsSavingRole(true);

    try {
      const isSelf = editingMember.id === currentUser?.uid;
      // Prevent self lock-out from admin
      const finalRole = isSelf && role === "admin" ? "admin" : (selectedPreset === "admin" ? "admin" : selectedStatus);

      await updateDoc(doc(db, "users", editingMember.id), {
        role: finalRole,
        permissions: selectedPermissions,
        rolePreset: selectedPreset,
        roleTitle: customRoleTitle.trim()
      });

      alert(`Updated roles and permissions for ${editingMember.name || editingMember.email}!`);
      setEditingMember(null);
    } catch (error) {
      console.error("Error saving roles:", error);
      alert("Failed to update member role. Please check permissions.");
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleDirectStatusChange = async (userId: string, newStatus: string) => {
    if (userId === currentUser?.uid && role === "admin" && newStatus !== "admin") {
      alert("You cannot demote yourself to prevent locking out the admin account!");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        role: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userId === currentUser?.uid) {
      alert("You cannot delete your own account from here.");
      return;
    }
    if (window.confirm(`Are you sure you want to remove user "${userEmail}" from the database? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "users", userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  if (!canAccess) {
    return <div style={{ color: '#ff5555', padding: '2rem' }}>Access Denied. Member Management or Admin privileges required.</div>;
  }

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const username = (u.username || "").toLowerCase();
    const roleTitle = (u.roleTitle || "").toLowerCase();
    return name.includes(q) || email.includes(q) || username.includes(q) || roleTitle.includes(q);
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Member & Role Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage access levels, assign individual task permissions, and approve recruits.</p>
        </div>
        <input 
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
          style={{ maxWidth: '320px', padding: '0.6rem 1rem' }}
        />
      </div>

      {/* Desktop View: Multi-Column Data Table */}
      <div className={`glass-panel ${styles.desktopTableContainer}`} style={{ padding: '1.5rem' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Contact</th>
              <th>Account Status</th>
              <th>Assigned Role / Privileges</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {users.length === 0 ? "Loading users..." : "No matching members found."}
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const badge = getUserRoleBadge(u);
                const isSelf = u.id === currentUser?.uid;

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                        {u.name || "N/A"} {isSelf && <span style={{ color: '#00d2ff', fontSize: '0.8rem' }}>(You)</span>}
                      </div>
                      <div style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                        @{u.username || "unknown"}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.email}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.phone || "No phone"}</div>
                    </td>
                    <td>
                      <select 
                        value={u.role || 'pending'} 
                        onChange={(e) => handleDirectStatusChange(u.id, e.target.value)}
                        disabled={isSelf && u.role === "admin"}
                        className={styles.statusSelect}
                        style={{ 
                          color: u.role === 'admin' ? '#00d2ff' : u.role === 'declined' ? '#ff5555' : u.role === 'pending' ? '#F4B304' : 'var(--text-primary)', 
                          cursor: isSelf ? 'default' : 'pointer'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="member">Active Member</option>
                        <option value="admin">Full Admin</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td>
                      <span style={{ 
                        color: badge.color, 
                        background: badge.background,
                        padding: '0.3rem 0.7rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        border: `1px solid ${badge.color}33`
                      }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handleOpenRoleModal(u)}
                          style={{
                            background: 'rgba(168, 85, 247, 0.15)',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            color: '#c084fc',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}
                          title="Assign special roles and task permissions"
                        >
                          🛡️ Assign Role
                        </button>

                        <Link 
                          href={`/dashboard/members/${u.id}`}
                          style={{ 
                            background: 'rgba(0, 210, 255, 0.15)', 
                            border: '1px solid rgba(0, 210, 255, 0.3)', 
                            color: '#00d2ff', 
                            padding: '0.4rem 0.8rem', 
                            borderRadius: '4px', 
                            fontSize: '0.85rem', 
                            textDecoration: 'none',
                            fontWeight: '600'
                          }}
                        >
                          Profile
                        </Link>

                        {!isSelf && (
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            style={{ 
                              background: 'rgba(255, 85, 85, 0.15)', 
                              border: '1px solid rgba(255, 85, 85, 0.3)', 
                              color: '#ff5555', 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              fontSize: '0.85rem' 
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Dedicated Member Cards */}
      <div className={styles.mobileCardsContainer}>
        {filteredUsers.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {users.length === 0 ? "Loading users..." : "No matching members found."}
          </div>
        ) : (
          filteredUsers.map(u => {
            const badge = getUserRoleBadge(u);
            const isSelf = u.id === currentUser?.uid;
            const initials = (u.name || u.email || "M").substring(0, 2).toUpperCase();

            return (
              <div key={u.id} className={styles.memberCard}>
                <div className={styles.cardTop}>
                  <div className={styles.avatarCircle}>{initials}</div>
                  <div className={styles.cardDetails}>
                    <div className={styles.memberName}>
                      {u.name || "N/A"} {isSelf && <span style={{ color: '#00d2ff', fontSize: '0.75rem' }}>(You)</span>}
                    </div>
                    <div className={styles.memberUsername}>@{u.username || "unknown"}</div>
                    <div className={styles.memberContact}>{u.email}</div>
                    {u.phone && <div className={styles.memberContact}>📞 {u.phone}</div>}
                  </div>
                </div>

                <div className={styles.badgesRow}>
                  <span style={{ 
                    color: badge.color, 
                    background: badge.background,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    border: `1px solid ${badge.color}33`
                  }}>
                    {badge.label}
                  </span>

                  <select 
                    value={u.role || 'pending'} 
                    onChange={(e) => handleDirectStatusChange(u.id, e.target.value)}
                    disabled={isSelf && u.role === "admin"}
                    className={styles.statusSelect}
                    style={{ 
                      color: u.role === 'admin' ? '#00d2ff' : u.role === 'declined' ? '#ff5555' : u.role === 'pending' ? '#F4B304' : 'var(--text-primary)', 
                      cursor: isSelf ? 'default' : 'pointer'
                    }}
                  >
                    <option value="pending">Status: Pending</option>
                    <option value="member">Status: Active</option>
                    <option value="admin">Status: Admin</option>
                    <option value="declined">Status: Declined</option>
                  </select>
                </div>

                <div className={styles.mobileActionsGrid}>
                  <button
                    onClick={() => handleOpenRoleModal(u)}
                    className={`${styles.mobileBtn} ${styles.roleBtn}`}
                  >
                    🛡️ Roles
                  </button>

                  <Link 
                    href={`/dashboard/members/${u.id}`}
                    className={`${styles.mobileBtn} ${styles.profileBtn}`}
                  >
                    Profile
                  </Link>

                  {!isSelf && (
                    <button 
                      onClick={() => handleDeleteUser(u.id, u.email)}
                      className={`${styles.mobileBtn} ${styles.deleteBtn}`}
                    >
                      Delete Member
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Role & Permissions Assignment Modal */}
      {editingMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  Assign Role & Permissions
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Configuring access for <strong>{editingMember.name || editingMember.email}</strong>
                </p>
              </div>
              <button 
                onClick={() => setEditingMember(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Role Preset Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Role Preset
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className={styles.input}
                style={{ fontSize: '0.95rem' }}
              >
                {ROLE_PRESETS.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} — {preset.description}
                  </option>
                ))}
                <option value="custom">⚙️ Custom Permissions Checklist</option>
              </select>
            </div>

            {/* Custom Role Title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Role Badge / Title (Optional)
              </label>
              <input
                type="text"
                value={customRoleTitle}
                onChange={(e) => setCustomRoleTitle(e.target.value)}
                placeholder="e.g. Store Manager, Competition Lead"
                className={styles.input}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                This title will appear on their profile and dashboard badge.
              </span>
            </div>

            {/* Granular Task Permissions Checklist */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
                Specific Admin Privileges
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PERMISSION_LIST.map(perm => {
                  const isChecked = selectedPreset === "admin" || selectedPermissions.includes(perm.key);
                  const isDisabled = selectedPreset === "admin";

                  return (
                    <label 
                      key={perm.key}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.8rem',
                        background: isChecked ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: isChecked ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                        cursor: isDisabled ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={() => handleTogglePermission(perm.key)}
                        style={{ marginTop: '0.2rem', accentColor: '#a855f7' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: isChecked ? '#fff' : 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {perm.label}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {perm.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'var(--text-primary)',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                disabled={isSavingRole}
                className={styles.submitBtn}
                style={{ padding: '0.8rem 1.5rem' }}
              >
                {isSavingRole ? "Saving..." : "Save Role & Permissions"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
