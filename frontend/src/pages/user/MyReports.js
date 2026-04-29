import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const MyReports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get(`${API_URL}/api/user/reports`, config);
        setReports(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, [user.token]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Reports</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Engineer Assigned</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r._id.slice(-6).toUpperCase()}</td>
                <td>{r.reason}</td>
                <td><span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span></td>
                <td>{r.assignedEngineer ? r.assignedEngineer.name : 'Not Assigned'}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center'}}>No reports found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReports;
