"use client";

import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./public-site.module.css";
import { useAuth } from "@/context/AuthContext";

interface AdminProject { id: string; title?: string; name?: string; description?: string; image?: string; status?: string; [key: string]: any }
interface AdminAchievement { id: string; title?: string; year?: string; description?: string; image?: string; category?: string; milestoneType?: string; imageFit?: "contain" | "cover"; [key: string]: any }
interface AdminMarquee { id: string; image?: string; [key: string]: any }
interface AdminLeader { id: string; name?: string; role?: string; image?: string; bio?: string; group?: string; [key: string]: any }

export default function AdminPublicSitePage() {
  const { role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_achievements");
  const [activeTab, setActiveTab] = useState<"projects" | "achievements" | "marquee" | "leaders" | "cleanup">("projects");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // State for Projects
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectStatus, setProjectStatus] = useState("Building in the lab");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // State for Achievements
  const [achievements, setAchievements] = useState<AdminAchievement[]>([]);
  const [achYear, setAchYear] = useState("");
  const [achTitle, setAchTitle] = useState("");
  const [achDesc, setAchDesc] = useState("");
  const [achCategory, setAchCategory] = useState("International Milestone");
  const [achImageFit, setAchImageFit] = useState<"contain" | "cover">("contain");
  const [achImage, setAchImage] = useState("");
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);

  // State for Marquee
  const [marquees, setMarquees] = useState<AdminMarquee[]>([]);
  const [marqueeImage, setMarqueeImage] = useState("");

  // State for Leaders
  const [leaders, setLeaders] = useState<AdminLeader[]>([]);
  const [leaderName, setLeaderName] = useState("");
  const [leaderRole, setLeaderRole] = useState("");
  const [leaderImage, setLeaderImage] = useState("");
  const [leaderBio, setLeaderBio] = useState("");
  const [leaderGroup, setLeaderGroup] = useState<"leader" | "core">("core");
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);

  // State for Live Launch Test Data Cleanup
  const [selectedCleanups, setSelectedCleanups] = useState<string[]>([
    "achievements",
    "projects",
    "competitions",
    "marquee",
    "leaders",
    "tasks"
  ]);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState<string | null>(null);

  const cleanupOptions = [
    { key: "achievements", label: "Achievements", desc: "All competitive milestones & awards" },
    { key: "projects", label: "Projects Showcase", desc: "All featured club projects on homepage" },
    { key: "competitions", label: "Competitions & Participants", desc: "All competitions and participant signups" },
    { key: "marquee", label: "Member Marquee Avatars", desc: "All photo bubbles in homepage marquee" },
    { key: "leaders", label: "Core Team Leaders", desc: "Team leaders listed on public site" },
    { key: "tasks", label: "Test Tasks", desc: "All task assignments across the team" },
    { key: "partRequests", label: "Parts Requests", desc: "Hardware part requests queue" },
    { key: "inventory", label: "Store Inventory", desc: "All components and hardware parts" },
    { key: "checkouts", label: "Hardware Checkouts", desc: "All signed-out store hardware records" },
    { key: "payments", label: "Test Payments", desc: "All logged fee and bKash payments" },
    { key: "sessions", label: "Attendance Sessions", desc: "Class sessions and attendance lists" },
  ];

  const handleToggleCleanup = (key: string) => {
    setSelectedCleanups(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllCleanups = () => {
    setSelectedCleanups(cleanupOptions.map(o => o.key));
  };

  const handleDeselectAllCleanups = () => {
    setSelectedCleanups([]);
  };

  const handleExecuteCleanup = async () => {
    if (selectedCleanups.length === 0) {
      alert("Please select at least one category to clean.");
      return;
    }

    const confirmMsg = `WARNING: Are you sure you want to permanently delete all test data from the selected categories (${selectedCleanups.join(', ')})?\n\nNote: User accounts and admin logins are protected and will NOT be touched.`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsCleaning(true);
    setCleanupMessage(null);

    try {
      let totalDeleted = 0;
      for (const collKey of selectedCleanups) {
        if (collKey === "competitions") {
          const compSnap = await getDocs(collection(db, "competitions"));
          const compDeletes = compSnap.docs.map(d => deleteDoc(doc(db, "competitions", d.id)));
          await Promise.all(compDeletes);
          totalDeleted += compSnap.docs.length;

          const partSnap = await getDocs(collection(db, "competition_participants"));
          const partDeletes = partSnap.docs.map(d => deleteDoc(doc(db, "competition_participants", d.id)));
          await Promise.all(partDeletes);
          totalDeleted += partSnap.docs.length;

          const pubSnap = await getDocs(collection(db, "public_competition_registrations"));
          const pubDeletes = pubSnap.docs.map(d => deleteDoc(doc(db, "public_competition_registrations", d.id)));
          await Promise.all(pubDeletes);
          totalDeleted += pubSnap.docs.length;
        } else if (collKey === "sessions") {
          const sessSnap = await getDocs(collection(db, "sessions"));
          const sessDeletes = sessSnap.docs.map(d => deleteDoc(doc(db, "sessions", d.id)));
          await Promise.all(sessDeletes);
          totalDeleted += sessSnap.docs.length;

          const classSnap = await getDocs(collection(db, "classes"));
          const classDeletes = classSnap.docs.map(d => deleteDoc(doc(db, "classes", d.id)));
          await Promise.all(classDeletes);
          totalDeleted += classSnap.docs.length;
        } else {
          const snap = await getDocs(collection(db, collKey));
          const deletes = snap.docs.map(d => deleteDoc(doc(db, collKey, d.id)));
          await Promise.all(deletes);
          totalDeleted += snap.docs.length;
        }
      }

      setCleanupMessage(`Success! Successfully purged ${totalDeleted} test record(s) from Firebase. Your website is ready for live content!`);
    } catch (error) {
      console.error("Cleanup error:", error);
      alert("Error occurred during cleanup. Check console for details.");
    } finally {
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminProject)));
    });

    const unsubAchievements = onSnapshot(query(collection(db, "achievements"), orderBy("year", "desc")), (snap) => {
      setAchievements(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminAchievement)));
    });

    const unsubMarquee = onSnapshot(collection(db, "marquee"), (snap) => {
      setMarquees(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminMarquee)));
    });

    const unsubLeaders = onSnapshot(collection(db, "leaders"), (snap) => {
      setLeaders(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminLeader)));
    });

    return () => {
      unsubProjects();
      unsubAchievements();
      unsubMarquee();
      unsubLeaders();
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 900;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          setter(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // --- PROJECTS FORM & ACTIONS ---
  const resetProjectForm = () => {
    setProjectTitle("");
    setProjectDesc("");
    setProjectImage("");
    setProjectStatus("Building in the lab");
    setEditingProjectId(null);
  };

  const handleEditProject = (p: AdminProject) => {
    setIsEditorOpen(true);
    setEditingProjectId(p.id);
    setProjectTitle(p.title || (p as any).name || "");
    setProjectDesc(p.description || "");
    setProjectImage(p.image || "");
    setProjectStatus(p.status || "Building in the lab");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const details = {
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        image: projectImage,
        status: projectStatus,
        updatedAt: new Date(),
      };
      if (editingProjectId) {
        await updateDoc(doc(db, "projects", editingProjectId), details);
      } else {
        await addDoc(collection(db, "projects"), {
          ...details,
          createdAt: new Date(),
        });
      }
      resetProjectForm();
      setIsEditorOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving project");
    }
  };

  // --- ACHIEVEMENTS FORM & ACTIONS ---
  const resetAchievementForm = () => {
    setAchYear("");
    setAchTitle("");
    setAchDesc("");
    setAchCategory("International Milestone");
    setAchImageFit("contain");
    setAchImage("");
    setEditingAchievementId(null);
  };

  const handleEditAchievement = (a: AdminAchievement) => {
    setIsEditorOpen(true);
    setEditingAchievementId(a.id);
    setAchYear(a.year || "");
    setAchTitle(a.title || "");
    setAchDesc(a.description || "");
    setAchCategory(a.category || a.milestoneType || "International Milestone");
    setAchImageFit(a.imageFit || "contain");
    setAchImage(a.image || "");
  };

  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const details = {
        year: achYear.trim(),
        title: achTitle.trim(),
        description: achDesc.trim(),
        category: achCategory,
        milestoneType: achCategory,
        imageFit: achImageFit,
        image: achImage,
        updatedAt: new Date(),
      };
      if (editingAchievementId) {
        await updateDoc(doc(db, "achievements", editingAchievementId), details);
      } else {
        await addDoc(collection(db, "achievements"), {
          ...details,
          createdAt: new Date(),
        });
      }
      resetAchievementForm();
      setIsEditorOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving achievement");
    }
  };

  // --- MARQUEE FORM & ACTIONS ---
  const handleAddMarquee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "marquee"), {
        image: marqueeImage,
        createdAt: new Date()
      });
      setMarqueeImage("");
      setIsEditorOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error adding marquee image");
    }
  };

  // --- LEADERS FORM & ACTIONS ---
  const resetLeaderForm = () => {
    setLeaderName("");
    setLeaderRole("");
    setLeaderImage("");
    setLeaderBio("");
    setLeaderGroup("core");
    setEditingLeaderId(null);
  };

  const handleEditLeader = (leader: AdminLeader) => {
    setIsEditorOpen(true);
    setEditingLeaderId(leader.id);
    setLeaderName(leader.name || "");
    setLeaderRole(leader.role || "");
    setLeaderImage(leader.image || "");
    setLeaderBio(leader.bio || "");
    setLeaderGroup(leader.group === "leader" || (!leader.group && /\b(team leader|team lead|club president|founder|chairperson|chairman)\b/i.test(leader.role || "")) ? "leader" : "core");
  };

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const details = {
        name: leaderName,
        role: leaderRole,
        image: leaderImage,
        bio: leaderBio.trim(),
        group: leaderGroup,
        updatedAt: new Date(),
      };
      if (editingLeaderId) {
        await updateDoc(doc(db, "leaders", editingLeaderId), details);
      } else {
        await addDoc(collection(db, "leaders"), { ...details, createdAt: new Date() });
      }
      resetLeaderForm();
      setIsEditorOpen(false);
    } catch (error) {
      console.error(error);
      alert("Could not save this team profile. Please try again.");
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if(confirm("Are you sure you want to delete this item?")) {
      if (collectionName === "leaders" && editingLeaderId === id) resetLeaderForm();
      if (collectionName === "projects" && editingProjectId === id) resetProjectForm();
      if (collectionName === "achievements" && editingAchievementId === id) resetAchievementForm();
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  if (!canAccess) {
    return (
      <div className={styles.container} style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ff5555', marginBottom: '1rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to manage public site content.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Public Site Management</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Customize the public homepage features, project showcases, and award milestones.</p>

      <div className={styles.tabsContainer}>
        <button
          className={activeTab === 'projects' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('projects');
            resetProjectForm();
            setIsEditorOpen(false);
          }}
        >
          Projects
        </button>
        <button
          className={activeTab === 'achievements' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('achievements');
            resetAchievementForm();
            setIsEditorOpen(false);
          }}
        >
          Achievements
        </button>
        <button
          className={activeTab === 'marquee' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('marquee');
            setIsEditorOpen(false);
          }}
        >
          Member Marquee
        </button>
        <button
          className={activeTab === 'leaders' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('leaders');
            resetLeaderForm();
            setIsEditorOpen(false);
          }}
        >
          Core Team
        </button>
        {role === 'admin' && (
          <button 
            className={activeTab === 'cleanup' ? styles.activeTab : styles.tab} 
            onClick={() => setActiveTab('cleanup')}
            style={{ 
              border: activeTab === 'cleanup' ? '1px solid #ff5555' : '1px solid rgba(255, 85, 85, 0.4)', 
              color: activeTab === 'cleanup' ? '#ff5555' : '#ff7777',
              background: activeTab === 'cleanup' ? 'rgba(255, 85, 85, 0.15)' : 'rgba(255, 85, 85, 0.05)'
            }}
          >
            🧹 Live Launch Cleanup
          </button>
        )}
      </div>

      {/* --- TAB 1: PROJECTS --- */}
      {activeTab === 'projects' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className={styles.sectionHeader}>
            <h2>Featured Projects</h2>
            <button
              type="button"
              className={styles.btnAction}
              onClick={() => {
                if (isEditorOpen) resetProjectForm();
                setIsEditorOpen((open) => !open);
              }}
              aria-expanded={isEditorOpen}
            >
              {isEditorOpen ? "Close Form" : "+ Add Project"}
            </button>
          </div>

          {isEditorOpen && (
            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                  {editingProjectId ? "Edit Featured Project" : "Add New Project"}
                </h3>
                {editingProjectId && (
                  <button type="button" className={styles.tab} onClick={resetProjectForm}>
                    Cancel Editing
                  </button>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Robo-Soccer Striker Bot"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status Badge</label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  className={styles.input}
                >
                  <option value="Building in the lab">Building in the lab</option>
                  <option value="Competition Ready">Competition Ready</option>
                  <option value="Prototyping">Prototyping</option>
                  <option value="Chassis Assembled">Chassis Assembled</option>
                  <option value="Testing & Tuning">Testing & Tuning</option>
                  <option value="Completed Showcase">Completed Showcase</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description *</label>
                <textarea
                  placeholder="Detailed breakdown of mechanical CAD, electronics, sensors, and firmware."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  required
                  className={styles.input}
                  style={{ minHeight: '100px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Project Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setProjectImage)}
                  className={styles.input}
                />
                {projectImage?.trim() ? (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={projectImage.trim()} alt="Preview" style={{ height: '90px', borderRadius: '6px', objectFit: 'contain' }} />
                    <button type="button" className={styles.tab} onClick={() => setProjectImage("")}>Remove photo</button>
                  </div>
                ) : null}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.btnAction}>
                  {editingProjectId ? "Save Changes" : "Publish Project"}
                </button>
                {editingProjectId && (
                  <button type="button" className={styles.tab} onClick={resetProjectForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Current Projects ({projects.length})</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.length === 0 ? (
              <p className={styles.emptyState}>No featured projects yet. Add the first project when it is ready for the public homepage.</p>
            ) : projects.map(p => {
              const displayTitle = p.title || (p as any).name || "Untitled Project";
              const displayDesc = p.description || "";
              return (
                <div key={p.id} className={styles.itemCard}>
                  {p.image?.trim() ? <img src={p.image.trim()} alt={displayTitle} className={styles.itemImg} /> : null}
                  <div className={styles.itemContent}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(156, 111, 24, 0.12)', color: '#9c6f18' }}>
                        {p.status || "Building in the lab"}
                      </span>
                    </div>
                    <h3 className={styles.itemTitle}>{displayTitle}</h3>
                    <p className={styles.itemDesc}>{displayDesc || "No description provided."}</p>
                    {displayDesc.length > 180 && (
                      <details className={styles.descriptionDetails}>
                        <summary>Read full description</summary>
                        <p>{displayDesc}</p>
                      </details>
                    )}
                  </div>
                  <div className={styles.cardActionGroup}>
                    <button onClick={() => handleEditProject(p)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete('projects', p.id)} className={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 2: ACHIEVEMENTS --- */}
      {activeTab === 'achievements' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className={styles.sectionHeader}>
            <h2>Milestones &amp; Achievements</h2>
            <button
              type="button"
              className={styles.btnAction}
              onClick={() => {
                if (isEditorOpen) resetAchievementForm();
                setIsEditorOpen((open) => !open);
              }}
              aria-expanded={isEditorOpen}
            >
              {isEditorOpen ? "Close Form" : "+ Add Achievement"}
            </button>
          </div>

          {isEditorOpen && (
            <form onSubmit={handleSaveAchievement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                  {editingAchievementId ? "Edit Milestone" : "Add New Milestone"}
                </h3>
                {editingAchievementId && (
                  <button type="button" className={styles.tab} onClick={resetAchievementForm}>
                    Cancel Editing
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Year *</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025"
                    value={achYear}
                    onChange={(e) => setAchYear(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Milestone Category Badge *</label>
                  <select
                    value={achCategory}
                    onChange={(e) => setAchCategory(e.target.value)}
                    className={styles.input}
                  >
                    <option value="International Milestone">🌍 International Milestone</option>
                    <option value="National Milestone">🇧🇩 National Milestone</option>
                    <option value="Award of Excellence">🏆 Award of Excellence</option>
                    <option value="Championship Trophy">🥇 Championship Trophy</option>
                    <option value="Special Recognition">⭐ Special Recognition</option>
                    <option value="Runner Up">🥈 Runner Up</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Photo Display Fit</label>
                  <select
                    value={achImageFit}
                    onChange={(e) => setAchImageFit(e.target.value as "contain" | "cover")}
                    className={styles.input}
                  >
                    <option value="contain">Full Picture (Fit Entire Image - No Crop)</option>
                    <option value="cover">Top-Focused Cover (Fill Frame, Face Centered)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Award Headline / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Gold at WICO 2025 South Korea"
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Story / Description *</label>
                <textarea
                  placeholder="Share the full story: date, university/venue, category, team effort, and podium victory."
                  value={achDesc}
                  onChange={(e) => setAchDesc(e.target.value)}
                  required
                  className={styles.input}
                  style={{ minHeight: '100px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Award Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setAchImage)}
                  className={styles.input}
                />
                {achImage?.trim() ? (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={achImage.trim()} alt="Preview" style={{ height: '90px', borderRadius: '6px', objectFit: 'contain' }} />
                    <button type="button" className={styles.tab} onClick={() => setAchImage("")}>Remove photo</button>
                  </div>
                ) : null}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.btnAction}>
                  {editingAchievementId ? "Save Changes" : "Publish Achievement"}
                </button>
                {editingAchievementId && (
                  <button type="button" className={styles.tab} onClick={resetAchievementForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Current Achievements ({achievements.length})</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {achievements.length === 0 ? (
              <p className={styles.emptyState}>No achievements published yet. Add a milestone to feature it on the public homepage.</p>
            ) : achievements.map(a => {
              const displayYear = a.year || "Award";
              const displayTitle = a.title || "Untitled Milestone";
              const displayDesc = a.description || "";
              const badgeLabel = a.category || a.milestoneType || "Milestone";

              return (
                <div key={a.id} className={styles.itemCard}>
                  {a.image?.trim() ? <img src={a.image.trim()} alt={displayTitle} className={styles.itemImg} /> : null}
                  <div className={styles.itemContent}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(132, 36, 58, 0.1)', color: '#84243a' }}>
                        {badgeLabel}
                      </span>
                    </div>
                    <h3 className={styles.itemTitle}><span style={{ color: '#F4B304' }}>{displayYear}</span> | {displayTitle}</h3>
                    <p className={styles.itemDesc}>{displayDesc || "No description provided."}</p>
                    {displayDesc.length > 180 && (
                      <details className={styles.descriptionDetails}>
                        <summary>Read full description</summary>
                        <p>{displayDesc}</p>
                      </details>
                    )}
                  </div>
                  <div className={styles.cardActionGroup}>
                    <button onClick={() => handleEditAchievement(a)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete('achievements', a.id)} className={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: MARQUEE --- */}
      {activeTab === 'marquee' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className={styles.sectionHeader}><h2>Member Marquee</h2><button type="button" className={styles.btnAction} onClick={() => setIsEditorOpen((open) => !open)} aria-expanded={isEditorOpen}>{isEditorOpen ? "Close form" : "Add image"}</button></div>
          {isEditorOpen && <form onSubmit={handleAddMarquee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setMarqueeImage)} required className={styles.input} />
            {marqueeImage?.trim() ? <img src={marqueeImage.trim()} alt="Preview" style={{ height: '100px', objectFit: 'cover', borderRadius: '50%', alignSelf: 'flex-start' }} /> : null}
            <button type="submit" className={styles.btnAction}>Add Image</button>
          </form>}

          <h2 style={{ marginBottom: '1.5rem' }}>Current Marquee Images</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {marquees.length === 0 ? <p className={styles.emptyState}>No member photos yet. Add photos to start the community marquee.</p> : marquees.map(m => (
              <div key={m.id} style={{ position: 'relative', display: 'inline-block' }}>
                {m.image?.trim() ? <img src={m.image.trim()} alt="Member" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} /> : null}
                <button onClick={() => handleDelete('marquee', m.id)} style={{ position: 'absolute', top: -5, right: -5, background: '#ff5555', color: 'white', borderRadius: '50%', width: '24px', height: '24px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: CORE TEAM LEADERS --- */}
      {activeTab === 'leaders' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className={styles.sectionHeader}><h2>Core Team</h2><button type="button" className={styles.btnAction} onClick={() => { resetLeaderForm(); setIsEditorOpen((open) => !open); }} aria-expanded={isEditorOpen}>{isEditorOpen ? "Close form" : "Add profile"}</button></div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Add and update leadership profiles and core member introductions shown on the public site.</p>
          {isEditorOpen && <form onSubmit={handleSaveLeader} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <label htmlFor="team-group">Profile group</label>
            <select id="team-group" value={leaderGroup} onChange={(e) => setLeaderGroup(e.target.value as "leader" | "core")} className={styles.input}>
              <option value="leader">Team leader</option>
              <option value="core">Core team member</option>
            </select>
            <label htmlFor="team-name">Name</label>
            <input id="team-name" type="text" placeholder="Full name" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} required className={styles.input} />
            <label htmlFor="team-role">Role</label>
            <input id="team-role" type="text" placeholder="e.g. Team Leader, Marketing Head, Coordinator" value={leaderRole} onChange={(e) => setLeaderRole(e.target.value)} required className={styles.input} />
            <label htmlFor="team-bio">Introduction</label>
            <textarea id="team-bio" placeholder="A short introduction or bio" value={leaderBio} onChange={(e) => setLeaderBio(e.target.value)} maxLength={420} className={styles.input} style={{ minHeight: '100px', resize: 'vertical' }} />
            <label htmlFor="team-photo">Profile photo</label>
            <input id="team-photo" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLeaderImage)} className={styles.input} />
            {leaderImage?.trim() ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={leaderImage.trim()} alt="Team profile preview" style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                <button type="button" className={styles.tab} onClick={() => setLeaderImage("")}>Remove photo</button>
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="submit" className={styles.btnAction}>{editingLeaderId ? "Save team profile" : "Add team profile"}</button>
              {editingLeaderId && <button type="button" className={styles.tab} onClick={resetLeaderForm}>Cancel editing</button>}
            </div>
          </form>}

          <h2 style={{ marginBottom: '1.5rem' }}>Current Team Profiles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {leaders.length === 0 ? <p className={styles.emptyState}>No team profiles yet. Add leaders and core members to introduce the team publicly.</p> : leaders.map(l => {
              const group = l.group === "leader" || (!l.group && /\b(team leader|team lead|club president|founder|chairperson|chairman)\b/i.test(l.role || "")) ? "Team leader" : "Core team member";
              return (
              <div key={l.id} style={{ position: 'relative', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                {l.image?.trim() ? <img src={l.image.trim()} alt={l.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F4B304', marginBottom: '1rem' }} /> : <div className={styles.avatarPlaceholder}>{l.name?.charAt(0) || "R"}</div>}
                <div className={styles.roleBadge}>{group}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{l.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{l.role}</p>
                {l.bio && <p style={{ marginTop: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>{l.bio}</p>}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className={styles.tab} onClick={() => handleEditLeader(l)}>Edit</button>
                  <button type="button" onClick={() => handleDelete('leaders', l.id)} className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 5: CLEANUP --- */}
      {activeTab === 'cleanup' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 style={{ color: '#ff5555' }}>🧹 Live Launch Test Data Cleanup</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Safely purge mock and test data created during development so your website is pristine for live members.
              </p>
            </div>
          </div>

          {cleanupMessage && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
              {cleanupMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={handleSelectAllCleanups} className={styles.tab} style={{ fontSize: '0.85rem' }}>Select All</button>
            <button type="button" onClick={handleDeselectAllCleanups} className={styles.tab} style={{ fontSize: '0.85rem' }}>Deselect All</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {cleanupOptions.map(option => (
              <label 
                key={option.key} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  background: selectedCleanups.includes(option.key) ? 'rgba(255, 85, 85, 0.1)' : 'var(--bg-secondary)', 
                  border: selectedCleanups.includes(option.key) ? '1px solid rgba(255, 85, 85, 0.4)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer' 
                }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedCleanups.includes(option.key)} 
                  onChange={() => handleToggleCleanup(option.key)}
                  style={{ marginTop: '0.2rem', accentColor: '#ff5555' }}
                />
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{option.label}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block', marginTop: '0.2rem' }}>{option.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleExecuteCleanup} 
            disabled={isCleaning || selectedCleanups.length === 0}
            style={{ 
              background: '#dc2626', 
              color: '#ffffff', 
              padding: '0.85rem 1.75rem', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 700, 
              cursor: selectedCleanups.length === 0 || isCleaning ? 'not-allowed' : 'pointer',
              opacity: selectedCleanups.length === 0 || isCleaning ? 0.6 : 1,
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
            }}
          >
            {isCleaning ? "Purging test records..." : `Permanently Purge Selected (${selectedCleanups.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
