import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const ResolvedReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/admin/reports/resolved`, config);
        setReports(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, [user.token]);

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1>Resolved Reports</h1>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e1e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e1e8f0' }}>
              <th style={{ padding: '1rem' }}>REPORT ID</th>
              <th style={{ padding: '1rem' }}>USER</th>
              <th style={{ padding: '1rem' }}>LOCATION</th>
              <th style={{ padding: '1rem' }}>REASON</th>
              <th style={{ padding: '1rem' }}>RESOLVED BY</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>DATE</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>No resolved reports found.</td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>#{r._id.slice(-6).toUpperCase()}</code>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 500 }}>{r.user?.name}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#666', fontSize: '0.75rem' }}>{r.zone} • {r.tank} • {r.ward}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>{r.reason}</span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 500, color: '#333' }}>{r.assignedEngineer?.name || 'Unknown'}</td>
                  <td style={{ padding: '0.8rem 1rem', textAlign: 'right', color: '#888', fontSize: '0.75rem' }}>
                    {new Date(r.date).toLocaleDateString()}
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

export default ResolvedReports;
