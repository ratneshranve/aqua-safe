import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

// Geometry for 19 Hexagonal Map Zones
const HEX_SIZE = 35;
const getHexPoints = (cx, cy, size) => {
  let points = [];
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30; // -30 makes them pointy-topped
    const angle_rad = Math.PI / 180 * angle_deg;
    // adding a gap by reducing size slightly
    points.push(`${cx + (size - 2) * Math.cos(angle_rad)},${cy + (size - 2) * Math.sin(angle_rad)}`);
  }
  return points.join(' ');
};

// Geographic Mapping of Indore Municipal Corporation's 19 Zones
// Asymmetric diamond layout simulating real city limits (North to South span)
const hexCenters = [
  // North Indore
  { id: 'Z-1', q: 0, r: -3 },
  { id: 'Z-2', q: -1, r: -2 }, { id: 'Z-3', q: 0, r: -2 }, { id: 'Z-4', q: 1, r: -2 },
  // North-West / North-East
  { id: 'Z-5', q: -2, r: -1 }, { id: 'Z-6', q: -1, r: -1 }, { id: 'Z-7', q: 0, r: -1 }, { id: 'Z-8', q: 1, r: -1 }, { id: 'Z-9', q: 2, r: -1 },
  // Central Indore
  { id: 'Z-10', q: -1, r: 0 }, { id: 'Z-11', q: 0, r: 0 }, { id: 'Z-12', q: 1, r: 0 },
  // South-West / South-East
  { id: 'Z-13', q: -2, r: 1 }, { id: 'Z-14', q: -1, r: 1 }, { id: 'Z-15', q: 0, r: 1 }, { id: 'Z-16', q: 1, r: 1 },
  // South Indore
  { id: 'Z-17', q: -1, r: 2 }, { id: 'Z-18', q: 0, r: 2 },
  // Far South Extension
  { id: 'Z-19', q: 0, r: 3 }
];

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const [zones, setZones] = useState({});
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, config);
        setZones(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, [user.token]);

  // Premium colors
  const getColor = (status) => {
    if (status === 'Green') return '#10b981'; // Green (Safe)
    if (status === 'Yellow') return '#f59e0b'; // Amber (Warning)
    if (status === 'Red') return '#ef4444'; // Red (Danger)
    return '#cbd5e1'; // Fallback
  };

  return (
    <div style={{ 
      animation: 'fadeIn 0.5s ease-out', 
      background: '#f1f6fa', 
      borderRadius: '20px',
      padding: '1.5rem',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div className="page-header" style={{ marginBottom: '0.5rem', width: '100%', textAlign: 'center' }}>
        <h1 className="page-title" style={{ fontSize: '1.4rem', color: '#1e293b', fontWeight: 900 }}>IMC Geospatial Map</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Map Legend */}
        <div style={{
          display:'flex', 
          gap:'1rem', 
          marginBottom:'0.8rem', 
          background: '#fff', 
          padding: '5px 12px', 
          borderRadius: '30px', 
          border: '1px solid rgba(0,0,0,0.05)', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
          <span style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight:'700', fontSize: '0.75rem'}}>
             <span style={{width: 8, height:8, borderRadius: '50%', background: '#10b981'}}></span> Safe
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight:'700', fontSize: '0.75rem'}}>
             <span style={{width: 8, height:8, borderRadius: '50%', background: '#f59e0b'}}></span> Warning
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight:'700', fontSize: '0.75rem'}}>
             <span style={{width: 8, height:8, borderRadius: '50%', background: '#ef4444'}}></span> Unsafe
          </span>
        </div>

        {/* Map SVG Container */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '550px', 
          height: '340px', 
          background: 'transparent', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          overflow: 'visible',
          marginTop: '-10px'
        }}>
          
          <svg viewBox="-200 -200 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.08))' }}>
            {/* Background targeting rings context */}
            <circle cx="0" cy="0" r="140" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            <circle cx="0" cy="0" r="200" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            
            <defs>
               <filter id="glowHex">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                     <feMergeNode in="coloredBlur"/>
                     <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
            </defs>

            {hexCenters.map((hex, index) => {
              // Convert axial Q,R coordinates to X,Y pixels
              const x = HEX_SIZE * Math.sqrt(3) * (hex.q + hex.r/2);
              const y = HEX_SIZE * (3/2) * hex.r;
              const points = getHexPoints(x, y, HEX_SIZE);
              
              const zoneInfo = zones[hex.id] || { status: 'Green', name: 'Loading...' };
              const status = zoneInfo.status;
              const fillBase = getColor(status);
              const isSelected = selectedZone === hex.id;
              
              return (
                <g key={hex.id} 
                   onClick={() => setSelectedZone(hex.id)}
                   style={{ 
                     cursor: 'pointer', 
                     outline: 'none',
                     animation: `popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                     animationDelay: `${index * 0.05}s`,
                     opacity: 0
                   }}>
                  
                  <polygon 
                    points={points} 
                    fill={fillBase}
                    stroke={isSelected ? '#333' : '#fff'}
                    strokeWidth={isSelected ? 2 : 1}
                    className="hex-polygon"
                    style={{
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: `${x}px ${y}px`,
                      opacity: isSelected ? 1 : 0.9,
                    }}
                  >
                    {status === 'Red' && (
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                    )}
                    {status === 'Red' && (
                      <animateTransform 
                        attributeName="transform" 
                        type="scale" 
                        values="1;1.05;1" 
                        dur="1.5s" 
                        repeatCount="indefinite"
                        additive="sum"
                      />
                    )}
                  </polygon>
                  
                  <text 
                    x={x} 
                    y={y + 4} 
                    textAnchor="middle" 
                    fill="#fff" 
                    fontSize="11" 
                    fontWeight="900"
                    style={{ 
                      pointerEvents: 'none', 
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      fontFamily: "'Roboto', sans-serif"
                    }}
                  >
                    {hex.id}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Tooltip Popup on Selection */}
          {selectedZone && (
            <div style={{ 
              position: 'absolute', 
              top: '0%', 
              right: '0%', 
              background: '#fff', 
              padding: '1.2rem', 
              borderRadius: '12px', 
              border: '1px solid #e1e8f0', 
              color: '#333', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              minWidth: '220px', 
              animation: 'slideUpPopup 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 100
            }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#1e293b', fontWeight: 800 }}>{zones[selectedZone]?.name || 'Unknown Area'}</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>Sector ID: {selectedZone}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getColor(zones[selectedZone]?.status || 'Green') }}></div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.85rem' }}>
                   Status: {zones[selectedZone]?.status || 'Green'}
                </p>
              </div>
              <button onClick={() => setSelectedZone(null)} style={{ marginTop: '1rem', background: '#334155', border: 'none', color: '#fff', width: '100%', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Close View</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
