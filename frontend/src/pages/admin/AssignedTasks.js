import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const AssignedTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/admin/reports/assigned`, config);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1>Assigned Tasks (Working)</h1>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e1e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e1e8f0' }}>
              <th style={{ padding: '1rem' }}>REPORT ID</th>
              <th style={{ padding: '1rem' }}>TASK INFO / REASON</th>
              <th style={{ padding: '1rem' }}>ASSIGNED ENGINEER</th>
              <th style={{ padding: '1rem' }}>CONTACT</th>
              <th style={{ padding: '1rem' }}>STATUS</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>DATE ASSIGNED</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>No assigned tasks currently pending.</td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>#{t._id.slice(-6).toUpperCase()}</code>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{t.reason}</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>{t.zone} • {t.tank} • {t.ward}</div>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 500 }}>{t.assignedEngineer?.name}</td>
                  <td style={{ padding: '0.8rem 1rem', color: '#666', fontSize: '0.75rem' }}>{t.assignedEngineer?.email || 'N/A'}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {t.status === 'Pending' ? 'In Progress' : t.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem', textAlign: 'right', color: '#888', fontSize: '0.75rem' }}>
                    {new Date(t.date).toLocaleDateString()}
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

export default AssignedTasks;
