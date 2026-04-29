import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { Activity, Clock, Database, Thermometer, Droplets, Info } from 'lucide-react';

const SensorReadings = () => {
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

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Sensor History</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Real-time water quality data for Meter ID: <strong>{user.meterId}</strong></p>
        </div>
        <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6', color: '#fff' }}>
          <Activity size={16} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Live Tracking Active</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container">
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} /> Time & Date</div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Thermometer size={14} /> TDS (ppm)</div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Droplets size={14} /> Turbidity</div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={14} /> pH Level</div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={14} /> Safety Status</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, index) => (
                <tr key={index} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#1e293b' }}>
                    <div style={{ fontWeight: 600 }}>{new Date(r.dateTime).toLocaleTimeString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(r.dateTime).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.95rem', fontWeight: 700, color: '#3b82f6' }}>{r.tds}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.95rem', fontWeight: 700, color: '#06b6d4' }}>{r.turbidity}</td>
                  <td style={{ padding: '12px 16px', fontSize: '0.95rem', fontWeight: 700, color: '#8b5cf6' }}>{r.ph}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`status-badge status-${r.status.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {readings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <Database size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                    <p>No sensor logs found for your meter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default SensorReadings;
