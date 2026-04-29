import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { ClipboardList, User, Clock, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const MyReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/user/reports`, config);
        setReports(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user.token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'assigned': return '#3b82f6';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', padding: '0.5rem' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.4rem', color: '#1e293b' }}>My Service Requests</h1>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Track progress of your complaints and assigned engineers.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" size={28} color="#3b82f6" />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1rem' 
        }}>
          {reports.map((r) => (
            <div key={r._id} className="glass-card" style={{ 
              padding: '1rem', 
              borderTop: `3px solid ${getStatusColor(r.status)}`,
              background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '6px', background: '#f1f5f9', borderRadius: '6px' }}>
                    <FileText size={16} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>ID</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>#{r._id.slice(-6).toUpperCase()}</div>
                  </div>
                </div>
                <span className={`status-badge status-${r.status.toLowerCase()}`} style={{ fontSize: '0.6rem', padding: '3px 8px' }}>
                  {r.status}
                </span>
              </div>

              <div style={{ marginBottom: '0.8rem', padding: '8px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Issue</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{r.reason}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={12} color="#64748b" />
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Eng: <strong style={{color: '#1e293b'}}>{r.assignedEngineer ? r.assignedEngineer.name : 'Awaiting...'}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={12} color="#64748b" />
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Date: <strong style={{color: '#1e293b'}}>{new Date(r.date).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              {r.status === 'Resolved' && (
                <div style={{ 
                  marginTop: '0.8rem', 
                  padding: '6px 10px', 
                  background: '#f0fdf4', 
                  borderRadius: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  color: '#166534',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  <CheckCircle2 size={12} /> Fixed
                </div>
              )}
            </div>
          ))}

          {reports.length === 0 && (
            <div className="glass-card" style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '3rem',
              background: '#f8fafc' 
            }}>
              <ClipboardList size={40} style={{ opacity: 0.1, marginBottom: '0.8rem' }} />
              <h3 style={{ color: '#64748b', fontSize: '1rem' }}>No active requests</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Reported issues will appear here for tracking.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyReports;
