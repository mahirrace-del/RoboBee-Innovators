"use client";

import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./public-site.module.css";
import { useAuth } from "@/context/AuthContext";

export default function AdminPublicSitePage() {
  const { role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_achievements");
  const [activeTab, setActiveTab] = useState<"projects" | "achievements" | "marquee" | "leaders" | "cleanup">("projects");

  // State for Projects
  const [projects, setProjects] = useState<any[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImage, setProjectImage] = useState("");

  // State for Achievements
  const [achievements, setAchievements] = useState<any[]>([]);
  const [achYear, setAchYear] = useState("");
  const [achTitle, setAchTitle] = useState("");
  const [achDesc, setAchDesc] = useState("");
  const [achImage, setAchImage] = useState("");

  // State for Marquee
  const [marquees, setMarquees] = useState<any[]>([]);
  const [marqueeImage, setMarqueeImage] = useState("");

  // State for Leaders
  const [leaders, setLeaders] = useState<any[]>([]);
  const [leaderName, setLeaderName] = useState("");
  const [leaderRole, setLeaderRole] = useState("");
  const [leaderImage, setLeaderImage] = useState("");

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
          // Clean competitions
          const compSnap = await getDocs(collection(db, "competitions"));
          const compDeletes = compSnap.docs.map(d => deleteDoc(doc(db, "competitions", d.id)));
          await Promise.all(compDeletes);
          totalDeleted += compSnap.docs.length;

          // Clean competition_participants
          const partSnap = await getDocs(collection(db, "competition_participants"));
          const partDeletes = partSnap.docs.map(d => deleteDoc(doc(db, "competition_participants", d.id)));
          await Promise.all(partDeletes);
          totalDeleted += partSnap.docs.length;
        } else if (collKey === "sessions") {
          // Clean sessions and classes
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
      alert(`Cleanup completed! ${totalDeleted} test items removed.`);
    } catch (err: any) {
      console.error("Cleanup error:", err);
      alert("Failed to delete some test records: " + (err.message || "Unknown error"));
    } finally {
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubAchievements = onSnapshot(query(collection(db, "achievements"), orderBy("year", "desc")), (snap) => {
      setAchievements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubMarquee = onSnapshot(collection(db, "marquee"), (snap) => {
      setMarquees(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubLeaders = onSnapshot(collection(db, "leaders"), (snap) => {
      setLeaders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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
          // Max dimension to compress the image
          const MAX_SIZE = 800;
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
          
          // Compress as JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setter(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        title: projectTitle,
        description: projectDesc,
        image: projectImage,
        createdAt: new Date()
      });
      setProjectTitle("");
      setProjectDesc("");
      setProjectImage("");
    } catch (error) {
      console.error(error);
      alert("Error adding project");
    }
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "achievements"), {
        year: achYear,
        title: achTitle,
        description: achDesc,
        image: achImage,
        createdAt: new Date()
      });
      setAchYear("");
      setAchTitle("");
      setAchDesc("");
      setAchImage("");
    } catch (error) {
      console.error(error);
      alert("Error adding achievement");
    }
  };

  const handleAddMarquee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "marquee"), {
        image: marqueeImage,
        createdAt: new Date()
      });
      setMarqueeImage("");
    } catch (error) {
      console.error(error);
      alert("Error adding marquee image");
    }
  };

  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "leaders"), {
        name: leaderName,
        role: leaderRole,
        image: leaderImage,
        createdAt: new Date()
      });
      setLeaderName("");
      setLeaderRole("");
      setLeaderImage("");
    } catch (error) {
      console.error(error);
      alert("Error adding leader");
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if(confirm("Are you sure?")) {
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
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Customize the public homepage features.</p>

      <div className={styles.tabsContainer}>
        <button className={activeTab === 'projects' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={activeTab === 'achievements' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('achievements')}>Achievements</button>
        <button className={activeTab === 'marquee' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('marquee')}>Member Marquee</button>
        <button className={activeTab === 'leaders' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('leaders')}>Core Team</button>
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

      {activeTab === 'projects' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Add New Project</h2>
          <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <input type="text" placeholder="Project Title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required className={styles.input} />
            <textarea placeholder="Description" value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} required className={styles.input} style={{ minHeight: '80px' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setProjectImage)} required className={styles.input} />
            {projectImage?.trim() ? <img src={projectImage.trim()} alt="Preview" style={{ height: '100px', objectFit: 'contain', alignSelf: 'flex-start' }} /> : null}
            <button type="submit" className={styles.btnAction}>Add Project</button>
          </form>

          <h2 style={{ marginBottom: '1.5rem' }}>Current Projects</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map(p => (
              <div key={p.id} className={styles.itemCard}>
                {p.image?.trim() ? <img src={p.image.trim()} alt={p.title} className={styles.itemImg} /> : null}
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{p.title}</h3>
                  <p className={styles.itemDesc}>{p.description}</p>
                </div>
                <button onClick={() => handleDelete('projects', p.id)} className={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Add Achievement</h2>
          <form onSubmit={handleAddAchievement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <input type="text" placeholder="Year (e.g. 2024)" value={achYear} onChange={(e) => setAchYear(e.target.value)} required className={styles.input} />
            <input type="text" placeholder="Title (e.g. EWU RoboFest - Runner Up)" value={achTitle} onChange={(e) => setAchTitle(e.target.value)} required className={styles.input} />
            <textarea placeholder="Description" value={achDesc} onChange={(e) => setAchDesc(e.target.value)} required className={styles.input} style={{ minHeight: '80px' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setAchImage)} className={styles.input} />
            {achImage?.trim() ? <img src={achImage.trim()} alt="Preview" style={{ height: '100px', objectFit: 'contain', alignSelf: 'flex-start' }} /> : null}
            <button type="submit" className={styles.btnAction}>Add Achievement</button>
          </form>

          <h2 style={{ marginBottom: '1.5rem' }}>Current Achievements</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {achievements.map(a => (
              <div key={a.id} className={styles.itemCard}>
                {a.image?.trim() ? <img src={a.image.trim()} alt={a.title} className={styles.itemImg} /> : null}
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}><span style={{ color: '#F4B304' }}>{a.year}</span> | {a.title}</h3>
                  <p className={styles.itemDesc}>{a.description}</p>
                </div>
                <button onClick={() => handleDelete('achievements', a.id)} className={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'marquee' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Add Member Marquee Image</h2>
          <form onSubmit={handleAddMarquee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setMarqueeImage)} required className={styles.input} />
            {marqueeImage?.trim() ? <img src={marqueeImage.trim()} alt="Preview" style={{ height: '100px', objectFit: 'cover', borderRadius: '50%', alignSelf: 'flex-start' }} /> : null}
            <button type="submit" className={styles.btnAction}>Add Image</button>
          </form>

          <h2 style={{ marginBottom: '1.5rem' }}>Current Marquee Images</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {marquees.map(m => (
              <div key={m.id} style={{ position: 'relative', display: 'inline-block' }}>
                {m.image?.trim() ? <img src={m.image.trim()} alt="Member" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} /> : null}
                <button onClick={() => handleDelete('marquee', m.id)} style={{ position: 'absolute', top: -5, right: -5, background: '#ff5555', color: 'white', borderRadius: '50%', width: '24px', height: '24px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaders' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Manage Core Team</h2>
          <form onSubmit={handleAddLeader} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <input type="text" placeholder="Name (e.g. Mahir Rahman)" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} required className={styles.input} />
            <input type="text" placeholder="Role (e.g. Team Leader)" value={leaderRole} onChange={(e) => setLeaderRole(e.target.value)} required className={styles.input} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLeaderImage)} className={styles.input} />
            {leaderImage?.trim() ? <img src={leaderImage.trim()} alt="Preview" style={{ height: '100px', objectFit: 'cover', borderRadius: '50%', width: '100px', alignSelf: 'flex-start' }} /> : null}
            <button type="submit" className={styles.btnAction}>Add Team Member</button>
          </form>

          <h2 style={{ marginBottom: '1.5rem' }}>Current Team Leaders</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {leaders.map(l => (
              <div key={l.id} style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                {l.image?.trim() ? <img src={l.image.trim()} alt={l.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F4B304', marginBottom: '1rem' }} /> : null}
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{l.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{l.role}</p>
                <button onClick={() => handleDelete('leaders', l.id)} style={{ position: 'absolute', top: 10, right: 10, background: '#ff5555', color: 'white', borderRadius: '4px', padding: '0.2rem 0.5rem', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cleanup' && role === 'admin' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem', color: '#ff5555' }}>Live Launch: Test Data Cleanup</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Ready to take the website live? Select which categories of mock/test data you would like to purge from Firebase Firestore.
          </p>

          <div style={{ background: 'rgba(0, 210, 255, 0.08)', border: '1px solid rgba(0, 210, 255, 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#00d2ff', marginBottom: '0.3rem' }}>🔒 Accounts Are Safe</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              User logins, admin accounts, and authentication credentials will <strong>NEVER</strong> be deleted by this cleanup tool.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={handleSelectAllCleanups} type="button" className={styles.tab} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
              Select All
            </button>
            <button onClick={handleDeselectAllCleanups} type="button" className={styles.tab} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
              Clear Selection
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {cleanupOptions.map(opt => {
              const checked = selectedCleanups.includes(opt.key);
              return (
                <label 
                  key={opt.key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    background: checked ? 'rgba(255, 85, 85, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: checked ? '1px solid rgba(255, 85, 85, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleCleanup(opt.key)}
                    style={{ marginTop: '0.2rem', accentColor: '#ff5555' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: checked ? '#fff' : 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {opt.desc}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {cleanupMessage && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
              {cleanupMessage}
            </div>
          )}

          <button 
            type="button" 
            onClick={handleExecuteCleanup}
            disabled={isCleaning || selectedCleanups.length === 0}
            style={{
              background: '#ff5555',
              color: 'white',
              border: 'none',
              padding: '0.9rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isCleaning ? 'not-allowed' : 'pointer',
              opacity: isCleaning || selectedCleanups.length === 0 ? 0.6 : 1,
              boxShadow: '0 4px 15px rgba(255, 85, 85, 0.3)'
            }}
          >
            {isCleaning ? "Purging Selected Test Data..." : `Purge Selected Data (${selectedCleanups.length} categories)`}
          </button>
        </div>
      )}

    </div>
  );
}
