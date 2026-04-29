import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const ResolvedTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/engineer/tasks/resolved`, config);
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [user.token]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Resolved Tasks</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>User</th>
              <th>Meter ID</th>
              <th>Issue</th>
              <th>Date Resolved</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t._id}>
                <td>{t._id.slice(-6).toUpperCase()}</td>
                <td>{t.user?.name}</td>
                <td>{t.user?.meterId || t.meterId}</td>
                <td>{t.reason}</td>
                <td>{new Date(t.date).toLocaleString()}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center'}}>No resolved tasks</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResolvedTasks;
