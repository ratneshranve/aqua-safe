import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { AuthContext } from '../../AuthContext';
import { 
  ClipboardList, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  Info,
  Database,
  Search,
  CheckCircle
} from 'lucide-react';

const AllReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineers, setSelectedEngineers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const resR = await axios.get(`${API_URL}/api/admin/reports`, config);
        const resE = await axios.get(`${API_URL}/api/admin/engineers`, config);
        setReports(resR.data.filter(r => r.status === 'Pending'));
        setEngineers(resE.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user.token]);

  const handleAssign = async (reportId, engineerId) => {
    if(!engineerId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/admin/reports/assign`, { reportId, engineerId }, config);
      alert('Engineer assigned successfully!');
      setReports(reports.map(r => r._id === reportId ? {...r, assignedEngineer: engineers.find(e => e._id === engineerId)} : r));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Pending Citizen Complaints</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>User-reported issues that require engineer assignment.</p>
        </div>
        <div style={{ padding: '10px 20px', background: '#fffbeb', borderRadius: '30px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #fef3c7' }}>
          <ClipboardList size={18} />
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{reports.length} PENDING COMPLAINTS</span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {reports.map((r) => (
          <div key={r._id} className="glass-card" style={{ 
            padding: '1.5rem', 
            borderTop: '5px solid #f59e0b',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: '#fef3c7', borderRadius: '10px' }}>
                  <Info size={18} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Report ID</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>#{r._id.slice(-6).toUpperCase()}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(r.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div style={{ 
              background: '#fffbeb', 
              padding: '12px', 
              borderRadius: '12px', 
              marginBottom: '1.2rem',
              border: '1px solid #fef3c7'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Issue Description</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>{r.reason}</div>
            </div>

            <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#1e293b' }}>
                   <User size={14} color="#64748b" /> <strong>{r.user?.name || 'Anonymous'}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#1e293b' }}>
                   <Database size={14} color="#64748b" /> <strong>{r.meterId}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                <MapPin size={14} /> {r.zone} • {r.tank} • {r.ward}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
              {r.assignedEngineer ? (
                <div style={{ 
                  padding: '10px', 
                  background: '#f0fdf4', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  color: '#166534',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={16} /> Engineer Assigned: {r.assignedEngineer.name}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <select 
                    className="form-control"
                    onChange={(e) => setSelectedEngineers({ ...selectedEngineers, [r._id]: e.target.value })} 
                    value={selectedEngineers[r._id] || ""}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #e2e8f0' }}
                  >
                    <option value="" disabled>Select Engineer</option>
                    {engineers.filter(e => e.zone === r.zone).map(eng => (
                      <option key={eng._id} value={eng._id}>{eng.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleAssign(r._id, selectedEngineers[r._id])}
                    disabled={!selectedEngineers[r._id]}
                    style={{ 
                      padding: '10px 20px', 
                      background: '#0f172a', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: !selectedEngineers[r._id] ? 'not-allowed' : 'pointer',
                      opacity: !selectedEngineers[r._id] ? 0.5 : 1
                    }}
                  >
                    <UserPlus size={16} /> Assign
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: '#f8fafc' }}>
            <CheckCircle2 size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
            <h2 style={{ color: '#1e293b', fontWeight: 800 }}>Clean Queue</h2>
            <p style={{ color: '#64748b' }}>No pending complaints from citizens at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReports;
