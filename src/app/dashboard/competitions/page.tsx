"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./competitions.module.css";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  FolderGit2,
  FileCode2,
  Box,
  Cpu,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { SUB_TEAM_ROLES, SubTeamRoleType, ProjectVaultAsset } from "@/lib/portalRelations";

interface Segment {
  id: string;
  name: string;
  fee: number;
  maxParticipants: number;
  description?: string;
}

export default function CompetitionsPage() {
  const { user, userData } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"tournaments" | "subteams" | "vault">("tournaments");
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<{ [compId: string]: string }>({});

  // Payment form state
  const [activePaymentCompId, setActivePaymentCompId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [paymentTxn, setPaymentTxn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sub-Team Roster & Build Logs state
  const [subteamRoster, setSubteamRoster] = useState<any[]>([]);
  const [selectedSubteamCompId, setSelectedSubteamCompId] = useState("");
  const [selectedSubteamRole, setSelectedSubteamRole] = useState<SubTeamRoleType>("Firmware Engineer");
  const [subteamName, setSubteamName] = useState("");
  const [buildLogNote, setBuildLogNote] = useState("");
  const [submittingRole, setSubmittingRole] = useState(false);

  // Project Vault state (Schematics, Firmware GitHub Links, 3D CAD .step/.stl)
  const [vaultAssets, setVaultAssets] = useState<ProjectVaultAsset[]>([]);
  const [vaultTitle, setVaultTitle] = useState("");
  const [vaultType, setVaultType] = useState<"schematic" | "firmware" | "cad" | "documentation">("firmware");
  const [vaultUrl, setVaultUrl] = useState("");
  const [vaultVersion, setVaultVersion] = useState("v1.0");
  const [vaultCompId, setVaultCompId] = useState("");
  const [vaultNotes, setVaultNotes] = useState("");
  const [submittingVault, setSubmittingVault] = useState(false);

  useEffect(() => {
    if (!user) return;

    const compQ = query(collection(db, "competitions"));
    const unsubComp = onSnapshot(compQ, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      data.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
      setCompetitions(data);
    });

    const appQ = query(collection(db, "competition_participants"));
    const unsubApp = onSnapshot(appQ, (snap) => {
      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter(p => p.userId === user.uid);
      setMyApplications(data);
    });

    const unsubSubteams = onSnapshot(collection(db, "competition_subteams"), (snap) => {
      setSubteamRoster(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubVault = onSnapshot(collection(db, "project_vault"), (snap) => {
      const assets = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectVaultAsset));
      assets.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setVaultAssets(assets);
    });

    return () => {
      unsubComp();
      unsubApp();
      unsubSubteams();
      unsubVault();
    };
  }, [user]);

  const handleApply = async (comp: any) => {
    if (!user) return;

    const segments: Segment[] = Array.isArray(comp.segments) && comp.segments.length > 0
      ? comp.segments
      : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

    const selectedSegId = selectedSegments[comp.id] || segments[0]?.id;
    const selectedSeg = segments.find(s => s.id === selectedSegId) || segments[0];

    try {
      await addDoc(collection(db, "competition_participants"), {
        userId: user.uid,
        competitionId: comp.id,
        competitionName: comp.name,
        segmentId: selectedSeg.id,
        segmentName: selectedSeg.name,
        fee: selectedSeg.fee,
        status: "pending_approval",
        paymentStatus: "unpaid",
        appliedAt: serverTimestamp(),
      });
      alert(`Application submitted for "${selectedSeg.name}"! Waiting for admin approval.`);
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to apply. Please try again.");
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent, applicationId: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "competition_participants", applicationId), {
        paymentStatus: "pending_verification",
        method: paymentMethod,
        txnId: paymentMethod === "bKash" ? paymentTxn : null,
      });
      alert("Payment details submitted! Admin will verify your transaction.");
      setActivePaymentCompId(null);
      setPaymentTxn("");
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSubteam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSubteamCompId || !subteamName.trim()) return;
    setSubmittingRole(true);
    const compObj = competitions.find(c => c.id === selectedSubteamCompId);
    try {
      await addDoc(collection(db, "competition_subteams"), {
        competitionId: selectedSubteamCompId,
        competitionName: compObj ? compObj.name : "Competition Squad",
        subteamName: subteamName.trim(),
        userId: user.uid,
        userName: userData?.name || user.displayName || user.email || "Member",
        userEmail: user.email,
        role: selectedSubteamRole,
        buildLog: buildLogNote.trim() || null,
        updatedAt: new Date().toISOString(),
      });
      setSubteamName("");
      setBuildLogNote("");
      alert("Sub-Team Role & Build Log registered in Competition Arena!");
    } catch (err) {
      console.error("Error registering subteam role:", err);
      alert("Failed to register sub-team role.");
    } finally {
      setSubmittingRole(false);
    }
  };

  const handleAddVaultAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vaultTitle.trim() || !vaultUrl.trim()) return;
    setSubmittingVault(true);
    const compObj = competitions.find(c => c.id === vaultCompId);
    try {
      await addDoc(collection(db, "project_vault"), {
        competitionId: vaultCompId || "general",
        competitionName: compObj ? compObj.name : "General Robotics R&D",
        title: vaultTitle.trim(),
        assetType: vaultType,
        url: vaultUrl.trim(),
        version: vaultVersion.trim() || "v1.0",
        uploadedByUid: user.uid,
        uploadedByName: userData?.name || user.displayName || user.email || "Engineer",
        notes: vaultNotes.trim() || null,
        createdAt: new Date().toISOString(),
      });
      setVaultTitle("");
      setVaultUrl("");
      setVaultNotes("");
      alert("Engineering asset added to Project Vault!");
    } catch (err) {
      console.error("Error adding vault asset:", err);
      alert("Failed to add asset to Project Vault.");
    } finally {
      setSubmittingVault(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={28} color="#F5B800" />
          <div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', margin: 0 }}>Competition Arena &amp; Team Workbench</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.92rem' }}>
              Register for robotics tournaments, coordinate sub-team engineering roles, and manage schematics &amp; CAD in the Project Vault.
            </p>
          </div>
        </div>

        {/* Arena Tab Switcher */}
        <div style={{ display: "flex", background: "#111827", padding: "0.3rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap", gap: "0.25rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("tournaments")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.9rem",
              borderRadius: "7px",
              border: "none",
              background: activeTab === "tournaments" ? "rgba(245, 184, 0, 0.16)" : "transparent",
              color: activeTab === "tournaments" ? "#F5B800" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            <Trophy size={15} /> Tournaments ({competitions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subteams")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.9rem",
              borderRadius: "7px",
              border: "none",
              background: activeTab === "subteams" ? "rgba(245, 184, 0, 0.16)" : "transparent",
              color: activeTab === "subteams" ? "#F5B800" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            <Users size={15} /> Sub-Team Roster ({subteamRoster.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vault")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.9rem",
              borderRadius: "7px",
              border: "none",
              background: activeTab === "vault" ? "rgba(245, 184, 0, 0.16)" : "transparent",
              color: activeTab === "vault" ? "#F5B800" : "#94A3B8",
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            <FolderGit2 size={15} /> Project Vault ({vaultAssets.length})
          </button>
        </div>
      </div>

      {activeTab === "tournaments" && (
        <div className={styles.grid}>
          {competitions.map(comp => {
            const myApp = myApplications.find(a => a.competitionId === comp.id);
            const segments: Segment[] = Array.isArray(comp.segments) && comp.segments.length > 0 
              ? comp.segments 
              : [{ id: "default", name: comp.name || "General Contest", fee: comp.fee || 0, maxParticipants: comp.maxParticipants || 30 }];

            const currentChosenSegmentId = selectedSegments[comp.id] || segments[0]?.id;
            const chosenSegment = segments.find(s => s.id === currentChosenSegmentId) || segments[0];

            return (
              <div key={comp.id} className={styles.compCard}>
                <div className={styles.compHeader}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-primary)', margin: 0 }}>{comp.name}</h2>
                    <span className={`${styles.badge} ${comp.status === 'Ongoing' ? styles.badgeSuccess : comp.status === 'Completed' ? styles.badgeDanger : styles.badgeWarning}`}>
                      {comp.status}
                    </span>
                  </div>

                  <div className={styles.compMeta}>
                    <span><Calendar size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {comp.date || "TBD"}</span>
                    <span><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {comp.location || "Club Lab"}</span>
                  </div>

                  {comp.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.45', margin: '0.5rem 0' }}>
                      {comp.description}
                    </p>
                  )}
                </div>

                {/* SEGMENT SELECTION (IF NOT YET APPLIED) */}
                {!myApp && (
                  <div className={styles.segmentsSelectionSection}>
                    <div className={styles.segmentsSelectionTitle}>
                      Select Your Competition Category:
                    </div>

                    <div className={styles.segmentOptionsList}>
                      {segments.map((seg) => {
                        const isSelected = seg.id === currentChosenSegmentId;
                        return (
                          <label 
                            key={seg.id} 
                            className={`${styles.segmentRadioCard} ${isSelected ? styles.segmentRadioCardActive : ""}`}
                          >
                            <input
                              type="radio"
                              name={`seg_${comp.id}`}
                              value={seg.id}
                              checked={isSelected}
                              onChange={() => setSelectedSegments({ ...selectedSegments, [comp.id]: seg.id })}
                              className={styles.segmentRadioInput}
                            />
                            <div className={styles.segmentCardInfo}>
                              <div className={styles.segmentCardHeader}>
                                <span>{seg.name}</span>
                                <span className={styles.segmentCardFee}>{seg.fee} BDT</span>
                              </div>
                              <div className={styles.segmentCardDesc}>
                                Capacity: {seg.maxParticipants} slots {seg.description ? `• ${seg.description}` : ""}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ACTION / APPLICATION STATUS AREA */}
                <div className={styles.actionArea}>
                  {!myApp ? (
                    comp.status === "Upcoming" || comp.status === "Ongoing" ? (
                      <button onClick={() => handleApply(comp)} className={styles.applyBtn}>
                        <Trophy size={16} />
                        Apply for {chosenSegment?.name || "Competition"} ({chosenSegment?.fee || 0} BDT)
                      </button>
                    ) : (
                      <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                        Competition is {comp.status?.toLowerCase()}
                      </div>
                    )
                  ) : (
                    <div className={styles.statusArea}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', background: 'rgba(244, 179, 4, 0.1)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(244, 179, 4, 0.2)' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Registered Category</div>
                          <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>{myApp.segmentName || "General Contest"}</strong>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Category Fee</div>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{myApp.fee !== undefined ? myApp.fee : comp.fee} BDT</strong>
                        </div>
                      </div>
                      
                      {/* Approval Status */}
                      <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className={styles.statusLabel}>Selection Status:</span>
                        <span className={`${styles.badge} ${myApp.status === 'approved' ? styles.badgeSuccess : myApp.status === 'rejected' ? styles.badgeDanger : styles.badgeWarning}`}>
                          {myApp.status === 'pending_approval' ? 'Waiting for Selection' : myApp.status}
                        </span>
                      </div>

                      {/* Payment Status (if approved) */}
                      {myApp.status === 'approved' && (
                        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className={styles.statusLabel}>Fee Status:</span>
                            <span className={`${styles.badge} ${myApp.paymentStatus === 'verified' ? styles.badgeSuccess : myApp.paymentStatus === 'unpaid' ? styles.badgeDanger : styles.badgeWarning}`}>
                              {myApp.paymentStatus?.replace('_', ' ')}
                            </span>
                          </div>

                          {myApp.paymentStatus === 'unpaid' && activePaymentCompId !== comp.id && (
                            <button onClick={() => setActivePaymentCompId(comp.id)} className={styles.payBtn}>
                              Pay Registration Fee ({myApp.fee !== undefined ? myApp.fee : comp.fee} BDT)
                            </button>
                          )}

                          {activePaymentCompId === comp.id && (
                            <form onSubmit={(e) => handleSubmitPayment(e, myApp.id)} className={styles.paymentForm}>
                              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                                Submit Payment of {myApp.fee !== undefined ? myApp.fee : comp.fee} BDT
                              </h4>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                  Payment Method
                                </label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={styles.input}>
                                  <option value="bKash">bKash (Send Money to 01902821018)</option>
                                  <option value="Cash">Cash (Handover to Admin)</option>
                                </select>
                              </div>
                              {paymentMethod === 'bKash' && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                    bKash Transaction ID (TrxID)
                                  </label>
                                  <input 
                                    type="text" 
                                    required 
                                    value={paymentTxn} 
                                    onChange={e => setPaymentTxn(e.target.value)} 
                                    className={styles.input} 
                                    placeholder="e.g. 9X2B..." 
                                  />
                                </div>
                              )}
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                                </button>
                                <button type="button" onClick={() => setActivePaymentCompId(null)} className={styles.cancelBtn}>
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}

                          {myApp.paymentStatus === 'verified' && (
                            <div style={{ color: '#2ecc71', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <CheckCircle2 size={16} />
                              Enrolled officially in {myApp.segmentName}!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {competitions.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              No competitions found at the moment. Check back soon!
            </div>
          )}
        </div>
      )}

      {activeTab === "subteams" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* Register Sub-Team Role & Build Log */}
          <div className={styles.compCard}>
            <h2 style={{ fontSize: "1.2rem", color: "#F9FAFB", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <Users size={18} color="#F5B800" /> Assign Sub-Team Engineering Role
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: "1rem" }}>
              Designate your squad role (Team Lead, Firmware Engineer, Hardware Fabricator, or CAD Lead) and log build progress.
            </p>
            <form onSubmit={handleJoinSubteam} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Target Competition</label>
                <select
                  required
                  value={selectedSubteamCompId}
                  onChange={(e) => setSelectedSubteamCompId(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Select Competition...</option>
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Sub-Team / Squad Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RoboBEE Alpha Line-Follower Squad"
                  value={subteamName}
                  onChange={(e) => setSubteamName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Engineering Role</label>
                <select
                  value={selectedSubteamRole}
                  onChange={(e) => setSelectedSubteamRole(e.target.value as SubTeamRoleType)}
                  className={styles.input}
                >
                  {SUB_TEAM_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Current Build Log / Milestone Status</label>
                <input
                  type="text"
                  placeholder="e.g. Calibrated 8-channel IR array & tuned PID Kp=1.8"
                  value={buildLogNote}
                  onChange={(e) => setBuildLogNote(e.target.value)}
                  className={styles.input}
                />
              </div>
              <button type="submit" disabled={submittingRole} className={styles.applyBtn}>
                {submittingRole ? "Saving..." : "Register Role & Build Log"}
              </button>
            </form>
          </div>

          {/* Active Sub-Team Roster Stream */}
          <div className={styles.compCard}>
            <h2 style={{ fontSize: "1.2rem", color: "#F9FAFB", marginBottom: "0.85rem" }}>Active Competition Sub-Teams</h2>
            {subteamRoster.length === 0 ? (
              <p style={{ color: "#94A3B8", fontSize: "0.86rem" }}>No sub-team roles logged yet. Register your squad on the left.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {subteamRoster.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.75)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <strong style={{ color: "#F9FAFB", fontSize: "0.94rem" }}>{member.subteamName}</strong>
                      <span style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.55rem",
                        borderRadius: "999px",
                        background: "rgba(245, 184, 0, 0.14)",
                        color: "#F5B800",
                        border: "1px solid rgba(245, 184, 0, 0.35)",
                        fontWeight: 700,
                      }}>
                        {member.role}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: "0.3rem" }}>
                      Engineer: <strong style={{ color: "#E2E8F0" }}>{member.userName}</strong> • {member.competitionName}
                    </div>
                    {member.buildLog && (
                      <div style={{ fontSize: "0.78rem", color: "#10B981", marginTop: "0.35rem", fontFamily: "var(--font-mono)" }}>
                        ▸ {member.buildLog}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "vault" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* Add Asset to Project Vault */}
          <div className={styles.compCard}>
            <h2 style={{ fontSize: "1.2rem", color: "#F9FAFB", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <PlusCircle size={18} color="#F5B800" /> Publish to Project Vault
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: "1rem" }}>
              Central repository for circuit schematics, GitHub C++/ROS firmware repositories, and 3D CAD (`.step` / `.stl`) files.
            </p>
            <form onSubmit={handleAddVaultAsset} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Combat Bot 15kg Weapon ESC Wiring Schematic"
                  value={vaultTitle}
                  onChange={(e) => setVaultTitle(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Asset Classification</label>
                  <select
                    value={vaultType}
                    onChange={(e) => setVaultType(e.target.value as any)}
                    className={styles.input}
                  >
                    <option value="firmware">Firmware / GitHub Repo</option>
                    <option value="schematic">Circuit Schematic / PCB</option>
                    <option value="cad">3D CAD (.STEP / .STL)</option>
                    <option value="documentation">Engineering Datasheet / Doc</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Revision Tag</label>
                  <input
                    type="text"
                    value={vaultVersion}
                    onChange={(e) => setVaultVersion(e.target.value)}
                    placeholder="v1.0"
                    className={styles.input}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Repository / File URL (GitHub, Onshape, GrabCAD, Drive)</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/robobee-innovators/..."
                  value={vaultUrl}
                  onChange={(e) => setVaultUrl(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Linked Competition (Optional)</label>
                <select
                  value={vaultCompId}
                  onChange={(e) => setVaultCompId(e.target.value)}
                  className={styles.input}
                >
                  <option value="">General Lab R&amp;D</option>
                  {competitions.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#94A3B8", marginBottom: "0.25rem" }}>Release Notes / Pinout Summary</label>
                <input
                  type="text"
                  placeholder="Key changes, MCU target, or print infill specs..."
                  value={vaultNotes}
                  onChange={(e) => setVaultNotes(e.target.value)}
                  className={styles.input}
                />
              </div>
              <button type="submit" disabled={submittingVault} className={styles.applyBtn}>
                {submittingVault ? "Publishing..." : "Publish Asset to Vault"}
              </button>
            </form>
          </div>

          {/* Project Vault Repository List */}
          <div className={styles.compCard}>
            <h2 style={{ fontSize: "1.2rem", color: "#F9FAFB", marginBottom: "0.85rem" }}>Engineering Project Vault</h2>
            {vaultAssets.length === 0 ? (
              <p style={{ color: "#94A3B8", fontSize: "0.86rem" }}>
                No schematics, firmware repos, or 3D CAD files published yet. Add the first engineering asset on the left.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {vaultAssets.map((asset) => (
                  <div
                    key={asset.id}
                    style={{
                      padding: "0.9rem 1rem",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.78)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
                        {asset.assetType === "firmware" ? (
                          <FileCode2 size={16} color="#60A5FA" />
                        ) : asset.assetType === "cad" ? (
                          <Box size={16} color="#10B981" />
                        ) : (
                          <Cpu size={16} color="#F5B800" />
                        )}
                        <strong style={{ color: "#F9FAFB", fontSize: "0.94rem" }}>{asset.title}</strong>
                        <span style={{
                          fontSize: "0.68rem",
                          fontFamily: "var(--font-mono)",
                          padding: "0.1rem 0.45rem",
                          borderRadius: "6px",
                          background: "rgba(255,255,255,0.07)",
                          color: "#E2E8F0",
                        }}>
                          {asset.version || "v1.0"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#94A3B8", marginTop: "0.3rem" }}>
                        {asset.competitionName} • Uploaded by {asset.uploadedByName}
                      </div>
                      {asset.notes && (
                        <div style={{ fontSize: "0.76rem", color: "#64748B", marginTop: "0.2rem" }}>
                          {asset.notes}
                        </div>
                      )}
                    </div>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.4rem 0.7rem",
                        borderRadius: "7px",
                        background: "rgba(245, 184, 0, 0.14)",
                        border: "1px solid rgba(245, 184, 0, 0.35)",
                        color: "#F5B800",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        flexShrink: 0,
                      }}
                    >
                      Open <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
