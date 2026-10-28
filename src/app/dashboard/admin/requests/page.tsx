"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function AdminPartRequestsPage() {
  const { role, canManage } = useAuth();
  const canAccess = role === "admin" || canManage("manage_store");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canAccess) return;

    const q = query(collection(db, "partRequests"), orderBy("requestedAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [canAccess]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "partRequests", id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this request?")) {
      try {
        await deleteDoc(doc(db, "partRequests", id));
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  if (!canAccess) {
    return <div style={{ color: '#ff5555', padding: '2rem' }}>Access Denied. Store Management or Admin privileges required.</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Parts Requests Queue</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review parts requested by team members.</p>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No parts requests found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>{req.partName}</h3>
                <div style={{ 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '0.7rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor: req.status === 'pending' ? 'rgba(245, 184, 0, 0.15)' : 
                                   req.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                  color: req.status === 'pending' ? '#9c6f18' : 
                         req.status === 'approved' ? '#065f46' : '#991b1b',
                  border: `1px solid ${req.status === 'pending' ? 'rgba(245, 184, 0, 0.35)' : 
                                      req.status === 'approved' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(220, 38, 38, 0.35)'}`
                }}>
                  {req.status}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Requested by: <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{req.requestedBy}</span>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', flex: 1, marginBottom: '1rem', lineHeight: '1.45' }}>
                {req.reason}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {req.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'approved')}
                      style={{ flex: 1, padding: '0.55rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'rejected')}
                      style={{ flex: 1, padding: '0.55rem', background: 'transparent', border: '1px solid #dc2626', color: '#dc2626', borderRadius: 'var(--radius-sm)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Reject
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => handleDelete(req.id)}
                  style={{ padding: '0.5rem 0.8rem', marginLeft: req.status !== 'pending' ? 'auto' : '0', background: 'transparent', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
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
