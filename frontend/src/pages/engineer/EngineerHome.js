import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { User, MapPin, Phone, Shield, Wrench, Briefcase } from 'lucide-react';

const EngineerHome = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { title: 'Engineer Name', value: user.name, icon: User, bg: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', shadow: 'rgba(15, 23, 42, 0.2)' },
    { title: 'Assigned Zone', value: user.zone, icon: MapPin, bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', shadow: 'rgba(59, 130, 246, 0.2)' },
    { title: 'Contact Number', value: user.phone, icon: Phone, bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', shadow: 'rgba(16, 185, 129, 0.2)' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.4rem', color: '#1e293b' }}>Engineer Workspace</h1>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Welcome back, Chief Engineer. Overview of your assignments.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '0.8rem',
        marginBottom: '1.5rem'
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ 
            background: stat.bg,
            padding: '1rem',
            borderRadius: '12px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: `0 8px 16px ${stat.shadow}`,
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{
              position: 'absolute',
              right: '-5%',
              bottom: '-5%',
              opacity: 0.1
            }}>
              <stat.icon size={60} />
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}>
              <stat.icon size={20} color="#fff" />
            </div>
            <div style={{ zIndex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase' }}>{stat.title}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#fff' }}>
        <div style={{ flex: '0 0 100px', height: '100px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', border: '3px solid #3b82f6' }}>
          <Shield size={50} color="#3b82f6" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>Engineer Privileges Active</h2>
          <p style={{ color: '#64748b', lineHeight: '1.5', maxWidth: '600px', fontSize: '0.85rem' }}>
            Authority to resolve water quality reports and track sensor anomalies across <strong>{user.zone}</strong>. Ensure all maintenance tasks are logged promptly.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', background: '#f1f5f9', padding: '5px 10px', borderRadius: '15px' }}>
              <Wrench size={12} /> Maintenance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', background: '#f1f5f9', padding: '5px 10px', borderRadius: '15px' }}>
              <Briefcase size={12} /> Zone Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerHome;
