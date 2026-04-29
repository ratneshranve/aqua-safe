import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

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
        
        // Filter out resolved ones if we want, or keep all. Since there is a Resolved reports page, let's keep only Pending here.
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
      alert('Engineer assigned');
      // Update local state
      setReports(reports.map(r => r._id === reportId ? {...r, assignedEngineer: engineers.find(e => e._id === engineerId)} : r));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1>User Reports (Pending)</h1>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e1e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e1e8f0' }}>
              <th style={{ padding: '1rem' }}>REPORT ID</th>
              <th style={{ padding: '1rem' }}>USER</th>
              <th style={{ padding: '1rem' }}>LOCATION</th>
              <th style={{ padding: '1rem' }}>REASON</th>
              <th style={{ padding: '1rem' }}>DATE</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>ASSIGN ENGINEER</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>No pending reports found.</td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>#{r._id.slice(-6).toUpperCase()}</code>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{r.user?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>Meter: {r.meterId}</div>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', color: '#666' }}>
                    {r.zone} • {r.tank} • {r.ward}
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{ color: '#d97706', background: '#fffbeb', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{r.reason}</span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', color: '#888', fontSize: '0.75rem' }}>
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                    {r.assignedEngineer ? (
                      <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.75rem' }}>✓ Assigned: {r.assignedEngineer.name}</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <select 
                          onChange={(e) => setSelectedEngineers({ ...selectedEngineers, [r._id]: e.target.value })} 
                          value={selectedEngineers[r._id] || ""}
                          style={{ padding: '4px 8px', width: '150px', fontSize: '0.75rem' }}
                        >
                          <option value="" disabled>Choose Engr...</option>
                          {engineers.filter(e => e.zone === r.zone).map(eng => (
                            <option key={eng._id} value={eng._id}>{eng.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleAssign(r._id, selectedEngineers[r._id])}
                          disabled={!selectedEngineers[r._id]}
                          style={{ 
                            background: '#000', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '5px 12px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            fontWeight: 700,
                            cursor: 'pointer',
                            opacity: !selectedEngineers[r._id] ? 0.4 : 1
                          }}
                        >
                          Assign
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllReports;
