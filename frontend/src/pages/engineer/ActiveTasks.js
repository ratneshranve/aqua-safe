import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const ActiveTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_URL}/api/engineer/tasks/active`, config);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (reportId) => {
    const status = statusUpdates[reportId];
    if (!status) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/engineer/tasks/status`, { reportId, status }, config);
      alert(`Task marked as ${status}!`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Active Tasks</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>User</th>
              <th>Meter ID</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t._id.slice(-6).toUpperCase()}</td>
                <td>{t.user?.name}</td>
                <td>{t.user?.meterId || t.meterId}</td>
                <td>{t.reason}</td>
                <td>
                  <span className={`status-badge status-${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
                <td>{new Date(t.date).toLocaleString()}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <select 
                      className="form-control"
                      value={statusUpdates[t._id] || t.status}
                      onChange={(e) => setStatusUpdates({...statusUpdates, [t._id]: e.target.value})}
                      style={{padding: '5px', width: '180px'}}
                    >
                      <option value="Pending">Pending (Not Resolved)</option>
                      <option value="Working">Working</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button 
                      onClick={() => handleUpdateStatus(t._id)}
                      className="btn btn-primary"
                      style={{padding: '5px 10px', fontSize: '0.9rem', width: 'auto'}}
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="7" style={{textAlign: 'center'}}>No active tasks</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTasks;
