import React, { useContext, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { AlertCircle, Send, CheckCircle2, Info, MapPin, Database, Layers, Droplets } from 'lucide-react';

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const [reason, setReason] = useState('Dirty water');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/user/reports`, { reason }, config);
      setMsg('Issue reported successfully!');
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      console.error(err);
      setMsg('Failed to report issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Report Water Issue</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Submit a complaint directly to the water department engineers.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Form */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          {msg && (
            <div style={{ 
              background: msg.includes('success') ? '#f0fdf4' : '#fef2f2', 
              color: msg.includes('success') ? '#166534' : '#991b1b',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              border: `1px solid ${msg.includes('success') ? '#bbf7d0' : '#fecaca'}`
            }}>
              {msg.includes('success') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <AlertCircle size={14} /> Problem Category
              </label>
              <select 
                className="form-control" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: '#f8fafc'
                }}
              >
                <option>Dirty water</option>
                <option>Dark water</option>
                <option>Foam water</option>
                <option>Smelly water</option>
                <option>No water supply</option>
                <option>Low pressure</option>
                <option>Other</option>
              </select>
            </div>

            {/* Read-only Info */}
            {[
              { label: 'Meter ID', value: user.meterId, icon: Database },
              { label: 'Zone', value: user.zone, icon: MapPin },
              { label: 'Tank', value: user.tank, icon: Droplets },
              { label: 'Ward', value: user.ward, icon: Layers }
            ].map((field, idx) => (
              <div key={idx}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>{field.label}</label>
                <div style={{ 
                  padding: '10px 14px', 
                  background: '#f1f5f9', 
                  borderRadius: '8px', 
                  color: '#475569', 
                  fontSize: '0.9rem', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <field.icon size={14} /> {field.value}
                </div>
              </div>
            ))}

            <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  background: '#004aad', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#002a5c'}
                onMouseOut={(e) => e.currentTarget.style.background = '#004aad'}
              >
                <Send size={18} /> {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.2rem', background: '#fffbeb', borderLeft: '4px solid #f59e0b' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Info size={16} /> Guidelines
            </h3>
            <ul style={{ fontSize: '0.8rem', color: '#b45309', paddingLeft: '1.2rem', margin: 0 }}>
              <li>Reports are assigned to zone engineers.</li>
              <li>Expected response time: 2-4 hours.</li>
              <li>You can track progress in "My Reports".</li>
            </ul>
          </div>
          
          <div className="glass-card" style={{ padding: '1.2rem', background: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} /> Urgent Help
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#1d4ed8', margin: 0 }}>
              For water emergencies, call the helpline: <strong>1800-AQUA-SAFE</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
