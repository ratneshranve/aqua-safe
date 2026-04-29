import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { CheckCircle, User, Database, Clock, History, Search } from 'lucide-react';

const ResolvedTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/engineer/tasks/resolved`, config);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [user.token]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Resolution History</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>A complete record of issues resolved by you in <strong>Zone {user.zone}</strong>.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
          <CheckCircle size={20} />
          <span>{tasks.length} Resolved</span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.2rem' 
      }}>
        {tasks.map((t) => (
          <div key={t._id} className="glass-card" style={{ 
            padding: '1.2rem', 
            borderTop: '4px solid #10b981',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', background: '#dcfce7', borderRadius: '6px' }}>
                  <CheckCircle size={14} color="#10b981" />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>#{t._id.slice(-6).toUpperCase()}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {new Date(t.date).toLocaleDateString()}
              </div>
            </div>

            <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Resolved Issue</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{t.reason}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={14} color="#64748b" />
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>User</span>
                  <strong>{t.user?.name || 'Anonymous'}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={14} color="#64748b" />
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Meter</span>
                  <strong>{t.user?.meterId || t.meterId}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="glass-card" style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '4rem',
            background: '#f8fafc'
          }}>
            <History size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <h3 style={{ color: '#64748b' }}>No resolution history found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolvedTasks;
