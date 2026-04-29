import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { 
  ShieldAlert, 
  User, 
  MapPin, 
  Activity, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  Bell,
  Thermometer,
  Droplets,
  Database
} from 'lucide-react';

const AdminAlerts = () => {
  const { user, socket } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineers, setSelectedEngineers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const resAlerts = await axios.get(`${API_URL}/api/admin/alerts`, config);
        const resEng = await axios.get(`${API_URL}/api/admin/engineers`, config);
        setAlerts(resAlerts.data);
        setEngineers(resEng.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user.token]);

  useEffect(() => {
    if (socket) {
      const handleNewAlert = (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev]);
      };
      socket.on('newAlert', handleNewAlert);
      return () => {
        socket.off('newAlert', handleNewAlert);
      };
    }
  }, [socket]);

  const handleAssign = async (alertId, engineerId) => {
    if(!engineerId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/admin/alerts/assign`, { alertId, engineerId }, config);
      alert('Engineer assigned to this task!');
      setAlerts(alerts.map(a => a._id === alertId ? {...a, assignedEngineer: engineers.find(e => e._id === engineerId)} : a));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Active System Alerts</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Critical water quality deviations across all zones.</p>
        </div>
        <div style={{ padding: '10px 20px', background: '#fee2e2', borderRadius: '30px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fecaca' }}>
          <ShieldAlert size={18} />
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{alerts.length} UNRESOLVED</span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {alerts.map((a) => (
          <div key={a._id} className="glass-card" style={{ 
            padding: '1.5rem', 
            borderTop: '5px solid #ef4444',
            background: '#fff',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '10px' }}>
                  <Bell size={18} color="#ef4444" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Alert Reason</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b' }}>{a.reason}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(a.dateTime).toLocaleTimeString()}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(a.dateTime).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Parameter Snapshot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
              {[
                { label: 'TDS', value: a.tds, icon: Thermometer, color: '#3b82f6' },
                { label: 'Turbidity', value: a.turbidity, icon: Droplets, color: '#06b6d4' },
                { label: 'pH', value: a.ph, icon: Activity, color: '#8b5cf6' }
              ].map((p, i) => (
                <div key={i} style={{ padding: '8px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{p.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: p.color }}>{p.value}</div>
                </div>
              ))}
            </div>

            {/* Context */}
            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#1e293b' }}>
                   <User size={14} color="#64748b" /> <strong>{a.user?.name || 'Unknown'}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#1e293b' }}>
                   <Database size={14} color="#64748b" /> <strong>{a.meterId}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                <MapPin size={14} /> {a.zone} • {a.tank} • {a.ward}
              </div>
            </div>

            {/* Assignment Logic */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
              {a.assignedEngineer ? (
                <div style={{ 
                  padding: '10px', 
                  background: '#f0fdf4', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  color: '#166534',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  <CheckCircle2 size={16} /> Task Assigned: {a.assignedEngineer.name}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <select 
                    className="form-control"
                    onChange={(e) => setSelectedEngineers({ ...selectedEngineers, [a._id]: e.target.value })} 
                    value={selectedEngineers[a._id] || ""}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}
                  >
                    <option value="" disabled>Select Engineer</option>
                    {engineers.filter(e => e.zone === a.zone).map(eng => (
                      <option key={eng._id} value={eng._id}>{eng.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleAssign(a._id, selectedEngineers[a._id])}
                    disabled={!selectedEngineers[a._id]}
                    style={{ 
                      padding: '10px 20px', 
                      background: '#0f172a', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: !selectedEngineers[a._id] ? 'not-allowed' : 'pointer',
                      opacity: !selectedEngineers[a._id] ? 0.5 : 1
                    }}
                  >
                    <UserPlus size={16} /> Assign
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: '#f0fdf4' }}>
            <CheckCircle2 size={64} color="#10b981" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
            <h2 style={{ color: '#166534', fontWeight: 800 }}>System Healthy</h2>
            <p style={{ color: '#15803d' }}>All sensor parameters across all zones are within safety limits.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlerts;
