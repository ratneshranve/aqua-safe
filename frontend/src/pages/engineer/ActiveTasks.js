import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { 
  ClipboardCheck, 
  User, 
  MapPin, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Loader2,
  Hammer
} from 'lucide-react';

const ActiveTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_URL}/api/engineer/tasks/active`, config);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (reportId, newStatus) => {
    setUpdating(reportId);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/engineer/tasks/status`, { reportId, status: newStatus }, config);
      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const getPriorityColor = (reason) => {
    const critical = ['smelly water', 'dark water', 'dirty water'];
    if (critical.includes(reason.toLowerCase())) return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Active Service Tasks</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>High priority issues assigned to you in <strong>Zone {user.zone}</strong>.</p>
        </div>
        <div className="glass-card" style={{ padding: '8px 16px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClipboardCheck size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{tasks.length} Pending Tasks</span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" size={32} color="#3b82f6" />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {tasks.map((t) => (
            <div key={t._id} className="glass-card" style={{ 
              padding: '1.5rem', 
              borderLeft: `6px solid ${getPriorityColor(t.reason)}`,
              position: 'relative',
              background: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <Hammer size={18} color={getPriorityColor(t.reason)} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Task ID</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>#{t._id.slice(-6).toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`status-badge status-${t.status.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                    {t.status}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} /> {new Date(t.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Issue Details Card */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '12px', 
                borderRadius: '12px', 
                marginBottom: '1.2rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Reported Issue</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: getPriorityColor(t.reason), display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} /> {t.reason}
                </div>
              </div>

              {/* User Context */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={14} color="#64748b" />
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Reported By</span>
                    <strong>{t.user?.name || 'Anonymous'}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={14} color="#64748b" />
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Meter ID</span>
                    <strong>{t.user?.meterId || t.meterId}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button 
                  onClick={() => handleUpdateStatus(t._id, 'Working')}
                  disabled={t.status === 'Working' || updating === t._id}
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    background: t.status === 'Working' ? '#f1f5f9' : '#3b82f6', 
                    color: t.status === 'Working' ? '#94a3b8' : '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: t.status === 'Working' ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  {updating === t._id ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  Mark Working
                </button>
                <button 
                  onClick={() => handleUpdateStatus(t._id, 'Resolved')}
                  disabled={updating === t._id}
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    background: '#10b981', 
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <CheckCircle2 size={16} /> Resolve Now
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="glass-card" style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '5rem',
              background: '#f8fafc'
            }}>
              <ClipboardCheck size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
              <h2 style={{ color: '#1e293b', fontWeight: 800 }}>Great Job!</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No active tasks in your queue. Enjoy your break!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveTasks;
