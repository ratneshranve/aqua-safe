import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { 
  Activity, 
  MapPin, 
  Droplets, 
  Layers, 
  Thermometer, 
  Clock, 
  CheckCircle,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';

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

  const statCards = [
    { title: 'Meter ID', value: user.meterId, icon: Database, color: '#fff', bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.3)' },
    { title: 'Zone', value: user.zone, icon: MapPin, color: '#fff', bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.3)' },
    { title: 'Tank', value: user.tank, icon: Droplets, color: '#fff', bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', shadow: 'rgba(6, 182, 212, 0.3)' },
    { title: 'Ward', value: user.ward, icon: Layers, color: '#fff', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.3)' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Citizen Dashboard</h1>
      </div>

      {/* Colorful Compact Stat Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.2rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ 
            background: card.bg,
            padding: '1.2rem', 
            borderRadius: '16px',
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            boxShadow: `0 10px 20px ${card.shadow}`,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative white circle */}
            <div style={{
              position: 'absolute',
              right: '-10%',
              top: '-10%',
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              zIndex: 0
            }}></div>

            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '10px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}>
              <card.icon size={22} color="#fff" />
            </div>
            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.title}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        {/* Latest Reading Card */}
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="#3b82f6" /> Current Water Quality
            </h2>
            {latest && (
              <span className={`status-badge status-${latest.status.toLowerCase()}`} style={{ 
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '20px',
                fontWeight: 700
              }}>
                {latest.status}
              </span>
            )}
          </div>

          {latest ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'TDS', value: `${latest.tds} ppm`, icon: Thermometer, color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Turbidity', value: `${latest.turbidity} NTU`, icon: Droplets, color: '#06b6d4', bg: '#ecfeff' },
                { label: 'pH Level', value: latest.ph, icon: Activity, color: '#8b5cf6', bg: '#f5f3ff' },
                { label: 'Updated At', value: new Date(latest.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), icon: Clock, color: '#64748b', bg: '#f8fafc' }
              ].map((item, i) => (
                <div key={i} style={{ 
                  background: item.bg, 
                  padding: '16px', 
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <item.icon size={18} color={item.color} />
                    <Zap size={14} color={item.color} style={{ opacity: 0.4 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 800 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
              <Activity size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 500 }}>Waiting for sensor data...</p>
            </div>
          )}
        </div>

        {/* System Status Card */}
        <div className="glass-card" style={{ 
          padding: '1.5rem', 
          background: 'linear-gradient(135deg, #002a5c 0%, #004aad 100%)',
          color: '#fff',
          boxShadow: '0 15px 30px rgba(0, 74, 173, 0.2)'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fff' }}>
            <ShieldCheck size={24} color="#4ade80" /> Safety Assurance
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                <CheckCircle size={16} color="#4ade80" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Secure Network</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>End-to-end encrypted water monitoring.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                <CheckCircle size={16} color="#4ade80" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Smart Analysis</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>AI-driven purity checks on every drop.</div>
              </div>
            </div>
            <div style={{ 
              marginTop: '1rem', 
              padding: '15px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px', 
              fontSize: '0.85rem',
              fontStyle: 'italic',
              lineHeight: '1.4',
              borderLeft: '3px solid #4ade80'
            }}>
              "Empowering citizens with transparent and real-time water intelligence."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
