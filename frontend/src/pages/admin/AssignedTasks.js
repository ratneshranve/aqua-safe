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
    <div>
      <div className="page-header">
        <h1 className="page-title">Assigned Tasks (Working)</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Task Info / Reason</th>
              <th>Assigned Engineer</th>
              <th>Engineer Contact</th>
              <th>Status</th>
              <th>Date Assigned</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t._id.slice(-6).toUpperCase()}</td>
                <td>
                  <strong>{t.reason}</strong><br/>
                  <small>{t.zone}, {t.tank}, {t.ward}</small>
                </td>
                <td>{t.assignedEngineer?.name}</td>
                <td>{t.assignedEngineer?.email || 'N/A'}</td>
                <td>
                  <span className={`status-badge status-${t.status.toLowerCase()}`}>
                    {t.status === 'Pending' ? 'Not Resolved' : t.status}
                  </span>
                </td>
                <td>{new Date(t.date).toLocaleString()}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No assigned tasks currently pending.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedTasks;
