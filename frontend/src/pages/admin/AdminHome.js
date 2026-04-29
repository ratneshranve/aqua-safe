import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

// Geometry for 19 Hexagonal Map Zones
const HEX_SIZE = 55;
const getHexPoints = (cx, cy, size) => {
  let points = [];
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30; // -30 makes them pointy-topped
    const angle_rad = Math.PI / 180 * angle_deg;
    // adding a gap by reducing size slightly
    points.push(`${cx + (size - 3) * Math.cos(angle_rad)},${cy + (size - 3) * Math.sin(angle_rad)}`);
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
    return '#334155'; // Fallback / Unknown
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header">
        <h1 className="page-title">Indore Municipal Corporation (IMC) Map</h1>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem'}}>
          Live geospatial layout of the 19 IMC Zones. Click any sector to view metrics.
        </p>
        
        {/* Map Legend */}
        <div style={{display:'flex', gap:'2rem', marginBottom:'2.5rem', background: 'var(--glass-gradient-strong)', padding: '10px 25px', borderRadius: '30px', border: '1px solid var(--border-light)'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight:'600'}}>
             <span style={{width: 14, height:14, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981'}}></span> Safe
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight:'600'}}>
             <span style={{width: 14, height:14, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b'}}></span> Warning
          </span>
          <span style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight:'600'}}>
             <span style={{width: 14, height:14, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444'}}></span> Unsafe
          </span>
        </div>

        {/* Map SVG Container */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '800px', 
          height: '600px', 
          background: 'none', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          overflow: 'visible' 
        }}>
          
          <svg viewBox="-300 -300 600 600" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0px 15px 30px rgba(0,0,0,0.6))' }}>
            {/* Background targeting rings context */}
            <circle cx="0" cy="0" r="220" fill="none" stroke="var(--border-light)" strokeWidth="1" />
            <circle cx="0" cy="0" r="320" fill="none" stroke="var(--border-light)" strokeWidth="1" />
            
            <defs>
               <filter id="glowHex">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                     <feMergeNode in="coloredBlur"/>
                     <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
            </defs>

            {hexCenters.map(hex => {
              // Convert axial Q,R coordinates to X,Y pixels
              const x = HEX_SIZE * Math.sqrt(3) * (hex.q + hex.r/2);
              const y = HEX_SIZE * (3/2) * hex.r;
              const points = getHexPoints(x, y, HEX_SIZE);
              
              const status = zones[hex.id] || 'Green';
              const fillBase = getColor(status);
              const isSelected = selectedZone === hex.id;
              
              return (
                <g key={hex.id} 
                   onClick={() => setSelectedZone(hex.id)}
                   style={{ cursor: 'pointer', outline: 'none' }}>
                  
                  <polygon 
                    points={points} 
                    fill={fillBase}
                    stroke={isSelected ? 'var(--text-main)' : 'var(--border-light)'}
                    strokeWidth={isSelected ? 3 : 1}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      transformOrigin: `${x}px ${y}px`,
                      opacity: isSelected ? 1 : 0.85,
                      filter: (status === 'Red' || isSelected) ? 'url(#glowHex)' : 'none'
                    }}
                  >
                    {/* Pulsing effect for unsafe zones */}
                    {status === 'Red' && (
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
                    )}
                  </polygon>
                  
                  <text 
                    x={x} 
                    y={y + 5} 
                    textAnchor="middle" 
                    fill="var(--text-main)" 
                    fontSize="16" 
                    fontWeight="700"
                    fontFamily="Outfit, sans-serif"
                    style={{ 
                      pointerEvents: 'none', 
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)' 
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
              top: '5%', 
              right: '5%', 
              background: 'var(--popup-bg-base)', 
              backdropFilter: 'blur(20px)', 
              padding: '1.5rem', 
              borderRadius: '20px', 
              border: '1px solid var(--border-light)', 
              color: 'var(--text-main)', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              minWidth: '220px', 
              animation: 'slideUpPopup 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#00d2ff' }}>Sector: {selectedZone}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getColor(zones[selectedZone] || 'Green'), boxShadow: `0 0 8px ${getColor(zones[selectedZone] || 'Green')}` }}></div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                   Status: {zones[selectedZone] || 'Green'}
                </p>
              </div>
              <button onClick={() => setSelectedZone(null)} style={{ marginTop: '1rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-main)', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
