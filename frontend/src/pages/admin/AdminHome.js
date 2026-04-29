import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  ClipboardList, 
  Map as MapIcon,
  Globe
} from 'lucide-react';

const HEX_SIZE = 35;
const getHexPoints = (cx, cy, size) => {
  let points = [];
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30;
    const angle_rad = Math.PI / 180 * angle_deg;
    points.push(`${cx + (size - 2) * Math.cos(angle_rad)},${cy + (size - 2) * Math.sin(angle_rad)}`);
  }
  return points.join(' ');
};

const hexCenters = [
  { id: 'Z-1', q: 0, r: -3 },
  { id: 'Z-2', q: -1, r: -2 }, { id: 'Z-3', q: 0, r: -2 }, { id: 'Z-4', q: 1, r: -2 },
  { id: 'Z-5', q: -2, r: -1 }, { id: 'Z-6', q: -1, r: -1 }, { id: 'Z-7', q: 0, r: -1 }, { id: 'Z-8', q: 1, r: -1 }, { id: 'Z-9', q: 2, r: -1 },
  { id: 'Z-10', q: -1, r: 0 }, { id: 'Z-11', q: 0, r: 0 }, { id: 'Z-12', q: 1, r: 0 },
  { id: 'Z-13', q: -2, r: 1 }, { id: 'Z-14', q: -1, r: 1 }, { id: 'Z-15', q: 0, r: 1 }, { id: 'Z-16', q: 1, r: 1 },
  { id: 'Z-17', q: -1, r: 2 }, { id: 'Z-18', q: 0, r: 2 },
  { id: 'Z-19', q: 0, r: 3 }
];

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ zoneStatus: {}, stats: {} });
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, config);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, [user.token]);

  const getColor = (status) => {
    if (status === 'Green') return '#10b981';
    if (status === 'Yellow') return '#f59e0b';
    if (status === 'Red') return '#ef4444';
    return '#cbd5e1';
  };

  const statCards = [
    { title: 'Registered Citizens', value: data.stats?.totalUsers || 0, icon: Users, bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', shadow: 'rgba(59, 130, 246, 0.2)' },
    { title: 'Active Engineers', value: data.stats?.totalEngineers || 0, icon: ShieldCheck, bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', shadow: 'rgba(139, 92, 246, 0.2)' },
    { title: 'Active Alerts', value: data.stats?.activeAlerts || 0, icon: AlertTriangle, bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', shadow: 'rgba(239, 68, 68, 0.2)' },
    { title: 'Pending Tasks', value: data.stats?.pendingTasks || 0, icon: ClipboardList, bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.2)' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Administrative Overview</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Comprehensive monitoring of Indore's smart water network.</p>
        </div>
        <div style={{ padding: '8px 16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', color: '#004aad' }}>
          <Globe size={18} className="animate-pulse" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>System Online</span>
        </div>
      </div>

      {/* Colorful Stat Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.2rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ 
            background: card.bg,
            padding: '1.5rem', 
            borderRadius: '20px',
            color: '#fff',
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.2rem',
            boxShadow: `0 12px 24px ${card.shadow}`,
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{
              position: 'absolute',
              right: '-10%',
              top: '-10%',
              opacity: 0.1
            }}>
              <card.icon size={100} />
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '12px', 
              borderRadius: '12px',
              zIndex: 1
            }}>
              <card.icon size={24} color="#fff" />
            </div>
            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Geospatial Map */}
        <div className="glass-card" style={{ padding: '1.5rem', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapIcon size={20} color="#3b82f6" /> IMC Geospatial Analysis
            </h2>
            <div style={{ display:'flex', gap:'1rem', background: '#f8fafc', padding: '6px 16px', borderRadius: '30px' }}>
              <span style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight:'700', fontSize: '0.7rem'}}>
                 <span style={{width: 6, height:6, borderRadius: '50%', background: '#10b981'}}></span> Safe
              </span>
              <span style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight:'700', fontSize: '0.7rem'}}>
                 <span style={{width: 6, height:6, borderRadius: '50%', background: '#ef4444'}}></span> Critical
              </span>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '400px', display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="-200 -200 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 15px 30px rgba(0,0,0,0.1))' }}>
              {hexCenters.map((hex, index) => {
                const x = HEX_SIZE * Math.sqrt(3) * (hex.q + hex.r/2);
                const y = HEX_SIZE * (3/2) * hex.r;
                const points = getHexPoints(x, y, HEX_SIZE);
                const status = data.zoneStatus[hex.id] || 'Green';
                const fillBase = getColor(status);
                const isSelected = selectedZone === hex.id;
                
                return (
                  <g key={hex.id} onClick={() => setSelectedZone(hex.id)} style={{ cursor: 'pointer' }}>
                    <polygon 
                      points={points} 
                      fill={fillBase}
                      stroke={isSelected ? '#1e293b' : '#fff'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', opacity: isSelected ? 1 : 0.9 }}
                    >
                      {status === 'Red' && (
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                      )}
                    </polygon>
                    <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900" style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                      {hex.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {selectedZone && (
              <div style={{ 
                position: 'absolute', top: '10px', right: '10px', background: '#fff', padding: '1.2rem', borderRadius: '16px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', minWidth: '200px', animation: 'fadeIn 0.3s ease-out' 
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#1e293b', fontWeight: 800 }}>Zone: {selectedZone}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: getColor(data.zoneStatus[selectedZone] || 'Green') + '15', borderRadius: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getColor(data.zoneStatus[selectedZone] || 'Green') }}></div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: getColor(data.zoneStatus[selectedZone] || 'Green') }}>
                    Status: {data.zoneStatus[selectedZone] || 'Green'}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedZone(null)} 
                  style={{ width: '100%', marginTop: '1rem', background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#64748b' }}
                >Close Details</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <ShieldCheck color="#4ade80" /> Operational Health
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Network Coverage: <strong style={{ color: '#fff' }}>98.4%</strong></div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                   <div style={{ width: '98%', height: '100%', background: '#4ade80', borderRadius: '3px' }}></div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Response Efficiency: <strong style={{ color: '#fff' }}>92.0%</strong></div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                   <div style={{ width: '92%', height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
