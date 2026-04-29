import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { ClipboardList, User, Clock, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>My Service Requests</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Track the status of your reported issues and assigned engineers.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" size={32} color="#004aad" />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.2rem' 
        }}>
          {reports.map((r) => (
            <div key={r._id} className="glass-card" style={{ 
              padding: '1.2rem', 
              borderTop: `4px solid ${getStatusColor(r.status)}`,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                    <FileText size={18} color="#004aad" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Report ID</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>#{r._id.slice(-6).toUpperCase()}</div>
                  </div>
                </div>
                <span className={`status-badge status-${r.status.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                  {r.status}
                </span>
              </div>

              <div style={{ marginBottom: '1rem', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Issue Reported</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{r.reason}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={14} color="#64748b" />
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    Engineer: <strong>{r.assignedEngineer ? r.assignedEngineer.name : 'Awaiting Assignment'}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={14} color="#64748b" />
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    Reported on: <strong>{new Date(r.date).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              {r.status === 'Resolved' && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '8px', 
                  background: '#f0fdf4', 
                  borderRadius: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: '#166534',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={14} /> Problem has been fixed.
                </div>
              )}
            </div>
          ))}

          {reports.length === 0 && (
            <div className="glass-card" style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem',
              background: '#f8fafc' 
            }}>
              <ClipboardList size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <h3 style={{ color: '#64748b' }}>No active service requests</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>When you report a water quality issue, it will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyReports;
