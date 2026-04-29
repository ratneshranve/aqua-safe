import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const UserAlerts = () => {
  const { user, socket } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/user/alerts`, config);
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlerts();
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Alerts</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Meter ID</th>
              <th>TDS</th>
              <th>Turbidity</th>
              <th>pH</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a._id}>
                <td>{a.meterId}</td>
                <td>{a.tds}</td>
                <td>{a.turbidity}</td>
                <td>{a.ph}</td>
                <td>{a.reason}</td>
                <td>{new Date(a.dateTime).toLocaleString()}</td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No alerts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAlerts;
