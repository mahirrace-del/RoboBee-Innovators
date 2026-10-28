"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminRecruitmentPage() {
  const { role } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") return;

    const q = query(collection(db, "recruitment"), orderBy("submittedAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(appsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "recruitment", id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this application?")) {
      try {
        await deleteDoc(doc(db, "recruitment", id));
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  if (role !== "admin") {
    return <div style={{ color: '#ff5555' }}>Access Denied. Admin privileges required.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Recruitment Applications</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review and manage pending applications to join Robo Innovators.</p>
        </div>
        <Link 
          href="/dashboard/members?tab=recruitment"
          style={{
            background: '#6B0F24',
            color: '#ffffff',
            border: '1px solid #9c6f18',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          Open Consolidated Member Portal &rarr;
        </Link>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No applications found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => (
            <div key={app.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{app.name}</h3>
                  <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{app.email} • {app.phone}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{app.department}</div>
                </div>
                <div style={{ 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '0.8rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor: app.status === 'pending' ? 'rgba(245, 184, 0, 0.15)' : 
                                   app.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                  color: app.status === 'pending' ? '#9c6f18' : 
                         app.status === 'approved' ? '#065f46' : '#991b1b',
                  border: `1px solid ${app.status === 'pending' ? 'rgba(245, 184, 0, 0.35)' : 
                                      app.status === 'approved' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`
                }}>
                  {app.status}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.2rem' }}>SKILLS</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{app.skills}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.2rem' }}>REASON FOR JOINING</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', lineHeight: '1.45' }}>
                  {app.reason}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                {app.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(app.id, 'approved')}
                      style={{ padding: '0.6rem 1.2rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(app.id, 'rejected')}
                      style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid #dc2626', color: '#dc2626', borderRadius: 'var(--radius-sm)', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => handleDelete(app.id)}
                  style={{ padding: '0.6rem 1.2rem', marginLeft: 'auto', background: 'transparent', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)' }}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
