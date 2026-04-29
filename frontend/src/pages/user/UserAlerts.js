import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { AlertTriangle, Bell, Clock, Activity, Droplets, Thermometer, Info, ShieldAlert } from 'lucide-react';

const UserAlerts = () => {
  const { user, socket } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/user/alerts`, config);
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [user.token]);

  useEffect(() => {
    if (socket) {
      const handleNewAlert = (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev]);
        // Optional: play sound or browser notification
      };
      socket.on('newAlert', handleNewAlert);
      return () => {
        socket.off('newAlert', handleNewAlert);
      };
    }
  }, [socket]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Global Water Alerts</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time warnings and notifications regarding water quality in your area.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ padding: '10px', background: '#fee2e2', borderRadius: '50%', color: '#ef4444' }}>
            <Bell size={20} />
          </div>
          {alerts.length > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-5px', 
              background: '#ef4444', 
              color: '#fff', 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              padding: '2px 6px', 
              borderRadius: '10px',
              border: '2px solid #fff'
            }}>{alerts.length}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.map((a) => (
          <div key={a._id} className="glass-card" style={{ 
            padding: '1.2rem', 
            background: 'linear-gradient(to right, #fef2f2, #fff)',
            borderLeft: '5px solid #ef4444',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '12px', color: '#ef4444' }}>
              <ShieldAlert size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>{a.reason}</span>
                <span style={{ padding: '2px 8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>High Priority</span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#4b5563' }}>
                  <Thermometer size={14} /> <strong>TDS:</strong> {a.tds}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#4b5563' }}>
                  <Droplets size={14} /> <strong>Turbidity:</strong> {a.turbidity}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#4b5563' }}>
                  <Activity size={14} /> <strong>pH:</strong> {a.ph}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <Clock size={12} /> {new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {new Date(a.dateTime).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && !loading && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', background: '#f0fdf4', border: '1px dashed #bbf7d0' }}>
            <div style={{ padding: '15px', background: '#dcfce7', borderRadius: '50%', width: 'fit-content', margin: '0 auto 1rem', color: '#22c55e' }}>
              <Bell size={32} />
            </div>
            <h3 style={{ color: '#166534' }}>All Clear!</h3>
            <p style={{ color: '#15803d', fontSize: '0.9rem' }}>No water quality alerts in your area at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAlerts;
