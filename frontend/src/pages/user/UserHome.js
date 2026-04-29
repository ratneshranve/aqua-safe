import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

import { AuthContext } from '../../AuthContext';

const UserHome = () => {
  const { user } = useContext(AuthContext);
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/sensor-data/${user.meterId}`);
        setReadings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReadings();
  }, [user.meterId]);

  const latest = readings.length > 0 ? readings[0] : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Citizen Home</h1>
      </div>

      <div className="cards-grid">
        <div className="glass-card stat-card">
          <span className="stat-title">Meter ID</span>
          <span className="stat-value">{user.meterId}</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-title">Zone</span>
          <span className="stat-value">{user.zone}</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-title">Tank</span>
          <span className="stat-value">{user.tank}</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-title">Ward</span>
          <span className="stat-value">{user.ward}</span>
        </div>
      </div>

      <div className="glass-card" style={{marginTop: '2rem'}}>
        <h2>Latest Sensor Reading</h2>
        {latest ? (
          <div style={{marginTop: '1rem'}}>
            <p><strong>TDS:</strong> {latest.tds}</p>
            <p><strong>Turbidity:</strong> {latest.turbidity}</p>
            <p><strong>pH:</strong> {latest.ph}</p>
            <p>
              <strong>Status: </strong> 
              <span className={`status-badge status-${latest.status}`}>{latest.status}</span>
            </p>
            <p><strong>Time:</strong> {new Date(latest.dateTime).toLocaleString()}</p>
          </div>
        ) : (
          <p>No sensor readings available yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserHome;
