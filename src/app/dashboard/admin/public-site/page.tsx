"use client";

import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./public-site.module.css";

export default function AdminPublicSitePage() {
  const [activeTab, setActiveTab] = useState<"projects" | "achievements" | "marquee" | "leaders">("projects");

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

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Public Site Management</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Customize the public homepage features.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={activeTab === 'projects' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={activeTab === 'achievements' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('achievements')}>Achievements</button>
        <button className={activeTab === 'marquee' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('marquee')}>Member Marquee</button>
        <button className={activeTab === 'leaders' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('leaders')}>Core Team</button>
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
              <div key={p.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
                {p.image?.trim() ? <img src={p.image.trim()} alt={p.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} /> : null}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.description}</p>
                </div>
                <button onClick={() => handleDelete('projects', p.id)} style={{ padding: '0.5rem 1rem', background: '#ff5555', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Delete</button>
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
              <div key={a.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
                {a.image?.trim() ? <img src={a.image.trim()} alt={a.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} /> : null}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem' }}><span style={{ color: '#F4B304' }}>{a.year}</span> | {a.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{a.description}</p>
                </div>
                <button onClick={() => handleDelete('achievements', a.id)} style={{ padding: '0.5rem 1rem', background: '#ff5555', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Delete</button>
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

    </div>
  );
}
