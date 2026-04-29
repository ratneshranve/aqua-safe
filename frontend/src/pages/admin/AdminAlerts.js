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
    <div>
      <div className="page-header">
        <h1 className="page-title">System Alerts</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Meter ID</th>
              <th>User</th>
              <th>Location</th>
              <th>Data (TDS, Turb, pH)</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Assign Engineer</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a._id}>
                <td>{a.meterId}</td>
                <td>{a.user?.name || 'Unknown'}</td>
                <td>{a.zone}, {a.tank}, {a.ward}</td>
                <td>{a.tds}, {a.turbidity}, {a.ph}</td>
                <td>{a.reason}</td>
                <td>{new Date(a.dateTime).toLocaleString()}</td>
                <td>
                  {a.assignedEngineer ? (
                    <span style={{color: 'green'}}>Assigned to {a.assignedEngineer.name}</span>
                  ) : (
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <select 
                        onChange={(e) => setSelectedEngineers({...selectedEngineers, [a._id]: e.target.value})} 
                        value={selectedEngineers[a._id] || ""}
                        className="form-control"
                        style={{padding: '5px', width: '180px'}}
                      >
                        <option value="" disabled>Select Engineer</option>
                        {engineers.filter(e => e.zone === a.zone).map(eng => (
                          <option key={eng._id} value={eng._id}>{eng.name} ({eng.zone})</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleAssign(a._id, selectedEngineers[a._id])}
                        disabled={!selectedEngineers[a._id]}
                        className="btn btn-primary"
                        style={{padding: '5px 10px', fontSize: '0.9rem', width: 'auto'}}
                      >
                        Assign
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAlerts;
