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
    <div style={{ animation: 'fadeIn 0.5s ease-out', padding: '0.5rem' }}>
      <div className="page-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.4rem', color: '#1e293b' }}>Sensor History</h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Real-time water quality data for Meter ID: <strong>{user.meterId}</strong></p>
        </div>
        <div style={{ padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
          <Activity size={14} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Live Tracking Active</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <div className="table-container" style={{ padding: '0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '10px 15px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> Time & Date</div>
                </th>
                <th style={{ padding: '10px 15px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Thermometer size={12} /> TDS</div>
                </th>
                <th style={{ padding: '10px 15px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Droplets size={12} /> Turbidity</div>
                </th>
                <th style={{ padding: '10px 15px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={12} /> pH Level</div>
                </th>
                <th style={{ padding: '10px 15px', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Info size={12} /> Status</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', background: index % 2 === 0 ? '#fff' : '#fcfdfe' }} className="table-row-hover">
                  <td style={{ padding: '10px 15px', fontSize: '0.85rem', color: '#1e293b' }}>
                    <div style={{ fontWeight: 600 }}>{new Date(r.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(r.dateTime).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '10px 15px', fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6' }}>{r.tds} <span style={{fontSize: '0.65rem', fontWeight: 500, color: '#94a3b8'}}>ppm</span></td>
                  <td style={{ padding: '10px 15px', fontSize: '0.9rem', fontWeight: 700, color: '#06b6d4' }}>{r.turbidity} <span style={{fontSize: '0.65rem', fontWeight: 500, color: '#94a3b8'}}>NTU</span></td>
                  <td style={{ padding: '10px 15px', fontSize: '0.9rem', fontWeight: 700, color: '#8b5cf6' }}>{r.ph}</td>
                  <td style={{ padding: '10px 15px' }}>
                    <span className={`status-badge status-${r.status.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '12px' }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {readings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b', background: '#f8fafc' }}>
                    <Database size={32} style={{ opacity: 0.1, marginBottom: '0.8rem' }} />
                    <p style={{ fontSize: '0.85rem' }}>No sensor logs found for your meter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: #f0f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default SensorReadings;
