import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

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
        // Sort alerts by newest first (assuming backend does it, or we do it here if needed)
        // Usually, the newest alerts are added to the beginning.
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
      alert('Engineer assigned to this Alert System task!');
      // Update local state
      setAlerts(alerts.map(a => a._id === alertId ? {...a, assignedEngineer: engineers.find(e => e._id === engineerId)} : a));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1>System Alerts</h1>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e1e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e1e8f0' }}>
              <th style={{ padding: '1rem' }}>METER ID</th>
              <th style={{ padding: '1rem' }}>USER</th>
              <th style={{ padding: '1rem' }}>LOCATION</th>
              <th style={{ padding: '1rem' }}>DATA (TDS, TURB, PH)</th>
              <th style={{ padding: '1rem' }}>REASON</th>
              <th style={{ padding: '1rem' }}>DATE</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>ASSIGN ENGINEER</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>No active alerts.</td>
              </tr>
            ) : (
              alerts.map((a) => (
                <tr key={a._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{a.meterId}</code>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 500 }}>{a.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#666', fontSize: '0.75rem' }}>{a.zone} • {a.tank} • {a.ward}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <div style={{ fontSize: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <span title="TDS">🚰 {a.tds}</span>
                      <span title="Turbidity">☁️ {a.turbidity}</span>
                      <span title="pH">🧪 {a.ph}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{ color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.7rem' }}>{a.reason}</span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', color: '#888', fontSize: '0.75rem' }}>
                    {new Date(a.dateTime).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                    {a.assignedEngineer ? (
                      <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.75rem' }}>✓ Assigned: {a.assignedEngineer.name}</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <select 
                          onChange={(e) => setSelectedEngineers({ ...selectedEngineers, [a._id]: e.target.value })} 
                          value={selectedEngineers[a._id] || ""}
                          style={{ padding: '4px 8px', width: '130px', fontSize: '0.75rem' }}
                        >
                          <option value="" disabled>Choose Engr...</option>
                          {engineers.filter(e => e.zone === a.zone).map(eng => (
                            <option key={eng._id} value={eng._id}>{eng.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleAssign(a._id, selectedEngineers[a._id])}
                          disabled={!selectedEngineers[a._id]}
                          style={{ 
                            background: '#000', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '5px 12px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            fontWeight: 700,
                            cursor: 'pointer',
                            opacity: !selectedEngineers[a._id] ? 0.4 : 1
                          }}
                        >
                          Assign
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAlerts;
