"use client";

import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  serverTimestamp, 
  getDocs, 
  where 
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./admin-competitions.module.css";
import { useAuth } from "@/context/AuthContext";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Globe, 
  Lock, 
  Calendar, 
  MapPin, 
  Users, 
  PhoneCall, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Check, 
  ExternalLink 
} from "lucide-react";

interface Segment {
  id: string;
  name: string;
  fee: number;
  maxParticipants: number;
  description?: string;
}

export default function AdminCompetitionsPage() {
  const { user, role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_competitions");
  
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [memberParticipants, setMemberParticipants] = useState<any[]>([]);
  const [publicRegistrations, setPublicRegistrations] = useState<any[]>([]);
  const [activeTabs, setActiveTabs] = useState<{ [compId: string]: "members" | "public" }>({});
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newComp, setNewComp] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    visibility: "public_and_members" as "public_and_members" | "members_only",
    segments: [
      { id: "seg_1", name: "Sumo Bot", fee: 500, maxParticipants: 20, description: "Weight <= 3kg, autonomous/RC standard sumo ring" },
      { id: "seg_2", name: "Soccer Bot", fee: 600, maxParticipants: 16, description: "Standard RC / Autonomous soccer robot tournament" },
      { id: "seg_3", name: "Robo Junior", fee: 350, maxParticipants: 25, description: "Junior innovators, beginner line-follower & challenge arena" }
    ] as Segment[]
  });

  useEffect(() => {
    // 1. Fetch competitions
    const compQ = query(collection(db, "competitions"));
    const unsubComp = onSnapshot(compQ, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      data.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      setCompetitions(data);
    });

    // 2. Fetch member participants
    const partQ = query(collection(db, "competition_participants"));
    const unsubPart = onSnapshot(partQ, async (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      const userIds = [...new Set(data.map(p => p.userId))];
      let userMap: any = {};
      if (userIds.length > 0) {
        const userQ = query(collection(db, "users"));
        const userSnap = await getDocs(userQ);
        userSnap.docs.forEach(uDoc => {
          userMap[uDoc.id] = uDoc.data().email || uDoc.id;
        });
      }

      data.forEach(p => p.userEmail = userMap[p.userId] || p.userId);
      setMemberParticipants(data);
    });

    // 3. Fetch public competition registrations
    const pubQ = query(collection(db, "public_competition_registrations"));
    const unsubPub = onSnapshot(pubQ, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      data.sort((a, b) => {
        const timeA = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : new Date(a.submittedAt || 0).getTime();
        const timeB = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : new Date(b.submittedAt || 0).getTime();
        return timeB - timeA;
      });
      setPublicRegistrations(data);
    });

    return () => {
      unsubComp();
      unsubPart();
      unsubPub();
    };
  }, []);

  // Add a new segment row to form
  const handleAddSegmentRow = () => {
    const newId = `seg_${Date.now()}`;
    setNewComp(prev => ({
      ...prev,
      segments: [
        ...prev.segments,
        { id: newId, name: "", fee: 500, maxParticipants: 20, description: "" }
      ]
    }));
  };

  // Remove a segment row
  const handleRemoveSegmentRow = (index: number) => {
    if (newComp.segments.length <= 1) return;
    setNewComp(prev => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index)
    }));
  };

  // Update specific segment field
  const handleSegmentChange = (index: number, field: keyof Segment, value: any) => {
    setNewComp(prev => {
      const updated = [...prev.segments];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, segments: updated };
    });
  };

  // Create new competition
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComp.segments.length === 0) {
      alert("Please add at least one competition segment/category.");
      return;
    }

    // Validate segments
    for (const seg of newComp.segments) {
      if (!seg.name.trim()) {
        alert("Each segment must have a category name (e.g., Sumo Bot).");
        return;
      }
    }

    setIsCreating(true);
    try {
      // Calculate total capacity and fee summary for backward compatibility
      const totalCapacity = newComp.segments.reduce((sum, s) => sum + (Number(s.maxParticipants) || 0), 0);
      const minFee = Math.min(...newComp.segments.map(s => Number(s.fee) || 0));

      await addDoc(collection(db, "competitions"), {
        name: newComp.name.trim(),
        date: newComp.date,
        location: newComp.location.trim(),
        description: newComp.description.trim(),
        visibility: newComp.visibility,
        segments: newComp.segments.map(s => ({
          id: s.id,
          name: s.name.trim(),
          fee: Number(s.fee) || 0,
          maxParticipants: Number(s.maxParticipants) || 0,
          description: s.description?.trim() || ""
        })),
        // Legacy fallbacks for older queries:
        fee: minFee,
        maxParticipants: totalCapacity,
        status: "Upcoming",
        createdAt: serverTimestamp(),
      });

      alert("Competition successfully launched with multi-category segments!");
      setNewComp({
        name: "",
        date: "",
        location: "",
        description: "",
        visibility: "public_and_members",
        segments: [
          { id: "seg_1", name: "Sumo Bot", fee: 500, maxParticipants: 20, description: "Weight <= 3kg, autonomous/RC standard sumo ring" },
          { id: "seg_2", name: "Soccer Bot", fee: 600, maxParticipants: 16, description: "Standard RC / Autonomous soccer robot tournament" },
          { id: "seg_3", name: "Robo Junior", fee: 350, maxParticipants: 25, description: "Junior innovators, beginner line-follower & challenge arena" }
        ]
      });
    } catch (error) {
      console.error("Error creating competition:", error);
      alert("Failed to create competition.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateCompetitionStatus = async (compId: string, status: string) => {
    try {
      await updateDoc(doc(db, "competitions", compId), { status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateCompetitionVisibility = async (compId: string, visibility: "public_and_members" | "members_only") => {
    try {
      await updateDoc(doc(db, "competitions", compId), { visibility });
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const handleParticipantAction = async (partId: string, action: string, updateData: any) => {
    try {
      await updateDoc(doc(db, "competition_participants", partId), updateData);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Failed to ${action} participant.`);
    }
  };

  // Public Applicant Status Update
  const handlePublicStatusChange = async (regId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "public_competition_registrations", regId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating applicant status:", error);
      alert("Failed to update status.");
    }
  };

  // Delete Public Applicant
  const handleDeletePublicApplicant = async (regId: string, name: string) => {
    if (!window.confirm(`Delete public registration record for "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, "public_competition_registrations", regId));
    } catch (error) {
      console.error("Error deleting registration:", error);
    }
  };

  // Delete Competition completely with all member & public records
  const handleDeleteCompetition = async (compId: string, compName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the competition "${compName}"?\n\nThis will remove all member applications and public registrations for this event.`)) {
      return;
    }
    try {
      // 1. Delete competition document
      await deleteDoc(doc(db, "competitions", compId));

      // 2. Clean up member participant records
      const partQ = query(collection(db, "competition_participants"), where("competitionId", "==", compId));
      const partSnap = await getDocs(partQ);
      const partDeletes = partSnap.docs.map(d => deleteDoc(doc(db, "competition_participants", d.id)));
      await Promise.all(partDeletes);

      // 3. Clean up public registrations
      const pubQ = query(collection(db, "public_competition_registrations"), where("competitionId", "==", compId));
      const pubSnap = await getDocs(pubQ);
      const pubDeletes = pubSnap.docs.map(d => deleteDoc(doc(db, "public_competition_registrations", d.id)));
      await Promise.all(pubDeletes);

      alert(`Competition "${compName}" and its registrations have been removed.`);
    } catch (error) {
      console.error("Error deleting competition:", error);
      alert("Failed to remove competition. Check permissions.");
    }
  };

  // Helper to format WhatsApp link
  const getWhatsAppLink = (phone: string, applicantName: string, compName: string, segmentName: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("01")) {
      clean = "88" + clean; // Format for Bangladesh (+880)
    }
    const message = encodeURIComponent(`Hello ${applicantName}, this is RoboBee Innovators regarding your registration for ${compName} - Category: ${segmentName}. Are you ready for the contest briefing?`);
    return `https://wa.me/${clean}?text=${message}`;
  };

  if (!canAccess) {
    return (
      <div className={styles.container} style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ff5555', marginBottom: '1rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to manage competitions.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={32} color="#F4B304" />
          <div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', margin: 0 }}>Manage Competitions</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.92rem' }}>
              Launch multi-segment competitions, toggle public portal visibility, and review member &amp; WhatsApp applicant signups.
            </p>
          </div>
        </div>
      </div>

      {/* LAUNCH NEW DETAILED COMPETITION */}
      <div className={styles.panel} style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--accent-primary)" />
            Launch New Multi-Segment Competition
          </h2>
        </div>

        <form onSubmit={handleCreate}>
          <div className={styles.formGrid}>
            <div>
              <label>Competition Title / Name *</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. National Robotics Championship 2026"
                value={newComp.name} 
                onChange={e => setNewComp({...newComp, name: e.target.value})} 
                className={styles.input} 
              />
            </div>
            <div>
              <label>Event Date *</label>
              <input 
                type="date" 
                required 
                value={newComp.date} 
                onChange={e => setNewComp({...newComp, date: e.target.value})} 
                className={styles.input} 
              />
            </div>
            <div>
              <label>Location / Venue *</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Club Innovation Lab / University Auditorium"
                value={newComp.location} 
                onChange={e => setNewComp({...newComp, location: e.target.value})} 
                className={styles.input} 
              />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Overview &amp; Rules / Description (Optional)
            </label>
            <textarea
              placeholder="Provide event details, general guidelines, eligibility, and arena specifications..."
              value={newComp.description}
              onChange={e => setNewComp({...newComp, description: e.target.value})}
              className={styles.textarea}
              rows={2}
            />
          </div>

          {/* AUDIENCE / VISIBILITY CONTROL */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Audience &amp; Portal Visibility *
            </label>
            <div className={styles.visibilityGrid}>
              <label 
                className={`${styles.visibilityOption} ${newComp.visibility === "public_and_members" ? styles.visibilityOptionActive : ""}`}
              >
                <input 
                  type="radio" 
                  name="visibility" 
                  checked={newComp.visibility === "public_and_members"}
                  onChange={() => setNewComp({...newComp, visibility: "public_and_members"})}
                  className={styles.visibilityRadio}
                />
                <div>
                  <div className={styles.visibilityLabel}>🌐 Public Website &amp; Club Members</div>
                  <div className={styles.visibilityDesc}>
                    Featured on the public landing page with an attractive registration popup for external enthusiasts and visible on the member portal.
                  </div>
                </div>
              </label>

              <label 
                className={`${styles.visibilityOption} ${newComp.visibility === "members_only" ? styles.visibilityOptionActive : ""}`}
              >
                <input 
                  type="radio" 
                  name="visibility" 
                  checked={newComp.visibility === "members_only"}
                  onChange={() => setNewComp({...newComp, visibility: "members_only"})}
                  className={styles.visibilityRadio}
                />
                <div>
                  <div className={styles.visibilityLabel}>🔒 Members Only</div>
                  <div className={styles.visibilityDesc}>
                    Only authenticated club members can view and apply inside the team dashboard. Hidden from public visitors.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* DYNAMIC SEGMENTS BUILDER */}
          <div className={styles.segmentsBuilder}>
            <div className={styles.segmentsHeader}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', margin: 0 }}>
                  Competition Segments &amp; Categories
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Define individual categories (e.g. Sumo Bot, Soccer Bot, Robo Junior). Members and public applicants can register individually for their specific interest.
                </p>
              </div>
              <button 
                type="button" 
                onClick={handleAddSegmentRow}
                className={styles.addSegmentBtn}
              >
                <Plus size={16} />
                Add Category / Segment
              </button>
            </div>

            {newComp.segments.map((seg, idx) => (
              <div key={seg.id} className={styles.segmentRow}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                    Category Name #{idx + 1}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sumo Bot, Soccer Bot, Line Follower"
                    value={seg.name}
                    onChange={e => handleSegmentChange(idx, "name", e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                    Fee (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="500"
                    value={seg.fee}
                    onChange={e => handleSegmentChange(idx, "fee", Number(e.target.value))}
                    className={styles.input}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>
                    Max Slots
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="20"
                    value={seg.maxParticipants}
                    onChange={e => handleSegmentChange(idx, "maxParticipants", Number(e.target.value))}
                    className={styles.input}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveSegmentRow(idx)}
                    disabled={newComp.segments.length <= 1}
                    className={styles.removeSegmentBtn}
                    title="Remove this segment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>
                Total Categories: <strong style={{ color: 'var(--accent-primary)' }}>{newComp.segments.length}</strong> | 
                Total Capacity: <strong style={{ color: 'var(--text-primary)' }}>{newComp.segments.reduce((a, s) => a + (Number(s.maxParticipants) || 0), 0)} slots</strong>
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isCreating} className={styles.submitBtn}>
              <Trophy size={18} />
              {isCreating ? "Launching Competition..." : "Launch Competition Now"}
            </button>
          </div>
        </form>
      </div>

      {/* ACTIVE COMPETITIONS LIST & APPLICANTS MANAGEMENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {competitions.length === 0 ? (
          <div className={styles.panel} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Trophy size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
            <h3>No competitions created yet</h3>
            <p>Use the form above to launch your first multi-segment competition.</p>
          </div>
        ) : (
          competitions.map(comp => {
            const compSegments: Segment[] = Array.isArray(comp.segments) && comp.segments.length > 0 
              ? comp.segments 
              : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

            const membersForComp = memberParticipants.filter(p => p.competitionId === comp.id);
            const publicForComp = publicRegistrations.filter(r => r.competitionId === comp.id);
            const activeTab = activeTabs[comp.id] || "public";
            const pendingPublicCount = publicForComp.filter(r => r.status === "pending").length;

            return (
              <div key={comp.id} className={styles.compCard}>
                <div className={styles.compHeader}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1.45rem', color: 'var(--accent-primary)', margin: 0 }}>{comp.name}</h2>
                      
                      {/* Audience Badge */}
                      {comp.visibility === "members_only" ? (
                        <span className={`${styles.badge} ${styles.badgeMembersOnly}`}>
                          <Lock size={12} />
                          Members Only
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgePublic}`}>
                          <Globe size={12} />
                          Public &amp; Members
                        </span>
                      )}

                      <span className={`${styles.badge} ${comp.status === 'Ongoing' ? styles.badgeSuccess : comp.status === 'Completed' ? styles.badgeDanger : styles.badgeWarning}`}>
                        {comp.status}
                      </span>
                    </div>

                    <div className={styles.compMeta}>
                      <span className={styles.compMetaItem}>
                        <Calendar size={14} /> {comp.date || "TBD"}
                      </span>
                      <span className={styles.compMetaItem}>
                        <MapPin size={14} /> {comp.location || "Online / Lab"}
                      </span>
                      <span className={styles.compMetaItem}>
                        <Users size={14} /> 
                        {membersForComp.filter(m => m.status === 'approved').length + publicForComp.filter(p => p.status === 'accepted').length} confirmed participants
                      </span>
                    </div>

                    {comp.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.6rem', lineHeight: '1.4' }}>
                        {comp.description}
                      </p>
                    )}

                    {/* Segments Pill List */}
                    <div className={styles.segmentsList}>
                      {compSegments.map(seg => {
                        const segMembers = membersForComp.filter(m => m.segmentId === seg.id && m.status === 'approved').length;
                        const segPublic = publicForComp.filter(p => p.segmentId === seg.id && p.status === 'accepted').length;
                        const segTotalFilled = segMembers + segPublic;

                        return (
                          <div key={seg.id} className={styles.segmentPill}>
                            <strong>{seg.name}</strong>
                            <span className={styles.segmentPillFee}>💰 {seg.fee} BDT</span>
                            <span className={styles.segmentPillSlots}>({segTotalFilled}/{seg.maxParticipants} slots)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions & Status Controls */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select 
                      value={comp.visibility || "public_and_members"} 
                      onChange={(e) => updateCompetitionVisibility(comp.id, e.target.value as any)}
                      className={styles.select}
                      style={{ width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                      title="Change Portal Visibility"
                    >
                      <option value="public_and_members">🌐 Public &amp; Members</option>
                      <option value="members_only">🔒 Members Only</option>
                    </select>

                    <select 
                      value={comp.status} 
                      onChange={(e) => updateCompetitionStatus(comp.id, e.target.value)}
                      className={styles.select}
                      style={{ width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button 
                      onClick={() => handleDeleteCompetition(comp.id, comp.name)}
                      className={styles.actionBtn}
                      style={{ background: 'rgba(255, 85, 85, 0.15)', color: '#ff5555', border: '1px solid rgba(255, 85, 85, 0.3)' }}
                      title="Remove competition completely"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* REGISTRATIONS TAB SECTION */}
                <div className={styles.tabsContainer}>
                  <div className={styles.tabButtons}>
                    <button
                      type="button"
                      onClick={() => setActiveTabs({ ...activeTabs, [comp.id]: "public" })}
                      className={`${styles.tabBtn} ${activeTab === "public" ? styles.tabBtnActive : ""}`}
                    >
                      <Globe size={16} />
                      Public Applicants
                      <span className={styles.tabCountBadge}>
                        {publicForComp.length}
                        {pendingPublicCount > 0 && <span style={{ color: '#F4B304', marginLeft: 4 }}>({pendingPublicCount} new)</span>}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTabs({ ...activeTabs, [comp.id]: "members" })}
                      className={`${styles.tabBtn} ${activeTab === "members" ? styles.tabBtnActive : ""}`}
                    >
                      <Users size={16} />
                      Club Members
                      <span className={styles.tabCountBadge}>{membersForComp.length}</span>
                    </button>
                  </div>

                  {/* TAB 1: PUBLIC APPLICANTS */}
                  {activeTab === "public" && (
                    <div>
                      {publicForComp.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem 0' }}>
                          No public applications received yet for this competition.
                        </p>
                      ) : (
                        <>
                          <div className={styles.desktopTable}>
                            <table className={styles.table}>
                              <thead>
                                <tr>
                                  <th>Applicant</th>
                                  <th>WhatsApp / Contact</th>
                                  <th>Category / Segment</th>
                                  <th>Location / Institution</th>
                                  <th>Past Experience</th>
                                  <th>Status</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {publicForComp.map(reg => (
                                  <tr key={reg.id}>
                                    <td>
                                      <div>
                                        <strong style={{ color: 'var(--text-primary)' }}>{reg.fullName}</strong>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{reg.email}</div>
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '0.85rem' }}>{reg.whatsapp}</span>
                                        <a 
                                          href={getWhatsAppLink(reg.whatsapp, reg.fullName, comp.name, reg.segmentName || "Category")}
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className={styles.whatsappBtn}
                                        >
                                          <PhoneCall size={12} />
                                          WhatsApp Chat
                                        </a>
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                                        {reg.segmentName || "General"}
                                      </span>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        Fee: {reg.fee} BDT
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{ fontSize: '0.85rem' }}>{reg.location || "N/A"}</span>
                                    </td>
                                    <td>
                                      <div className={styles.experienceBox}>
                                        {reg.experience || "No prior experience noted."}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`${styles.badge} ${
                                        reg.status === 'accepted' ? styles.badgeSuccess : 
                                        reg.status === 'contacted' ? styles.badgeInfo : 
                                        reg.status === 'rejected' ? styles.badgeDanger : 
                                        styles.badgeWarning
                                      }`}>
                                        {reg.status || 'pending'}
                                      </span>
                                    </td>
                                    <td>
                                      <div className={styles.actionGroup}>
                                        <select
                                          value={reg.status || "pending"}
                                          onChange={(e) => handlePublicStatusChange(reg.id, e.target.value)}
                                          className={styles.select}
                                          style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="contacted">Contacted</option>
                                          <option value="accepted">Accepted</option>
                                          <option value="rejected">Rejected</option>
                                        </select>
                                        <button 
                                          onClick={() => handleDeletePublicApplicant(reg.id, reg.fullName)}
                                          className={styles.actionBtn}
                                          style={{ background: 'rgba(255, 85, 85, 0.1)', color: '#ff5555' }}
                                          title="Delete registration"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View for Public Applicants */}
                          <div className={styles.mobileList}>
                            {publicForComp.map(reg => (
                              <div key={reg.id} className={styles.mobileCard}>
                                <div className={styles.mobileCardHeader}>
                                  <div>
                                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{reg.fullName}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{reg.email}</div>
                                  </div>
                                  <span className={`${styles.badge} ${
                                    reg.status === 'accepted' ? styles.badgeSuccess : 
                                    reg.status === 'contacted' ? styles.badgeInfo : 
                                    reg.status === 'rejected' ? styles.badgeDanger : 
                                    styles.badgeWarning
                                  }`}>
                                    {reg.status || 'pending'}
                                  </span>
                                </div>

                                <div style={{ fontSize: '0.85rem' }}>
                                  Category: <strong style={{ color: 'var(--accent-primary)' }}>{reg.segmentName || "General"}</strong> (Fee: {reg.fee} BDT)
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                  Location: {reg.location || "N/A"}
                                </div>
                                <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                                  <strong>Experience:</strong> {reg.experience || "None provided"}
                                </div>

                                <div className={styles.mobileActions}>
                                  <a 
                                    href={getWhatsAppLink(reg.whatsapp, reg.fullName, comp.name, reg.segmentName || "Category")}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.whatsappBtn}
                                    style={{ flex: 1, justifyContent: 'center' }}
                                  >
                                    <PhoneCall size={14} />
                                    WhatsApp ({reg.whatsapp})
                                  </a>
                                  
                                  <select
                                    value={reg.status || "pending"}
                                    onChange={(e) => handlePublicStatusChange(reg.id, e.target.value)}
                                    className={styles.select}
                                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem' }}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* TAB 2: CLUB MEMBERS */}
                  {activeTab === "members" && (
                    <div>
                      {membersForComp.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1rem 0' }}>
                          No club members have applied for this competition yet.
                        </p>
                      ) : (
                        <>
                          <div className={styles.desktopTable}>
                            <table className={styles.table}>
                              <thead>
                                <tr>
                                  <th>Member Email</th>
                                  <th>Selected Category</th>
                                  <th>Application Status</th>
                                  <th>Payment Status</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {membersForComp.map(part => (
                                  <tr key={part.id}>
                                    <td>{part.userEmail}</td>
                                    <td>
                                      <strong style={{ color: 'var(--accent-primary)' }}>
                                        {part.segmentName || "General"}
                                      </strong>
                                      {part.fee !== undefined && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                          Fee: {part.fee} BDT
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <span className={`${styles.badge} ${part.status === 'approved' ? styles.badgeSuccess : part.status === 'rejected' ? styles.badgeDanger : styles.badgeWarning}`}>
                                        {part.status?.replace('_', ' ')}
                                      </span>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        <span className={`${styles.badge} ${part.paymentStatus === 'verified' ? styles.badgeSuccess : part.paymentStatus === 'pending_verification' ? styles.badgeWarning : styles.badgeDanger}`}>
                                          {part.paymentStatus?.replace('_', ' ')}
                                        </span>
                                        {part.method && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{part.method} {part.txnId ? `(${part.txnId})` : ''}</span>}
                                      </div>
                                    </td>
                                    <td>
                                      <div className={styles.actionGroup}>
                                        {part.status === 'pending_approval' && (
                                          <>
                                            <button onClick={() => handleParticipantAction(part.id, 'approve', { status: 'approved' })} className={`${styles.actionBtn} ${styles.btnSuccess}`}>Approve</button>
                                            <button onClick={() => handleParticipantAction(part.id, 'reject', { status: 'rejected' })} className={`${styles.actionBtn} ${styles.btnDanger}`}>Reject</button>
                                          </>
                                        )}
                                        
                                        {part.status === 'approved' && part.paymentStatus !== 'verified' && (
                                          <button onClick={() => handleParticipantAction(part.id, 'verify payment', { paymentStatus: 'verified' })} className={`${styles.actionBtn} ${styles.btnPrimary}`}>
                                            Verify Payment
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View for Club Members */}
                          <div className={styles.mobileList}>
                            {membersForComp.map(part => (
                              <div key={part.id} className={styles.mobileCard}>
                                <div className={styles.partEmail}>{part.userEmail}</div>
                                <div style={{ fontSize: '0.85rem' }}>
                                  Category: <strong style={{ color: 'var(--accent-primary)' }}>{part.segmentName || "General"}</strong>
                                </div>
                                <div className={styles.partBadges}>
                                  <span className={`${styles.badge} ${part.status === 'approved' ? styles.badgeSuccess : part.status === 'rejected' ? styles.badgeDanger : styles.badgeWarning}`}>
                                    {part.status?.replace('_', ' ')}
                                  </span>
                                  <span className={`${styles.badge} ${part.paymentStatus === 'verified' ? styles.badgeSuccess : part.paymentStatus === 'pending_verification' ? styles.badgeWarning : styles.badgeDanger}`}>
                                    Pay: {part.paymentStatus?.replace('_', ' ')}
                                  </span>
                                </div>
                                {part.method && (
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    via {part.method} {part.txnId ? `(Txn: ${part.txnId})` : ''}
                                  </div>
                                )}
                                {(part.status === 'pending_approval' || (part.status === 'approved' && part.paymentStatus !== 'verified')) && (
                                  <div className={styles.mobileActions}>
                                    {part.status === 'pending_approval' && (
                                      <>
                                        <button onClick={() => handleParticipantAction(part.id, 'approve', { status: 'approved' })} className={`${styles.actionBtn} ${styles.btnSuccess}`}>Approve</button>
                                        <button onClick={() => handleParticipantAction(part.id, 'reject', { status: 'rejected' })} className={`${styles.actionBtn} ${styles.btnDanger}`}>Reject</button>
                                      </>
                                    )}
                                    {part.status === 'approved' && part.paymentStatus !== 'verified' && (
                                      <button onClick={() => handleParticipantAction(part.id, 'verify payment', { paymentStatus: 'verified' })} className={`${styles.actionBtn} ${styles.btnPrimary}`}>
                                        Verify Payment
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
