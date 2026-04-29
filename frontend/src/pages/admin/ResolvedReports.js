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
    <div>
      <div className="page-header">
        <h1 className="page-title">Resolved Reports</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>User</th>
              <th>Location</th>
              <th>Reason</th>
              <th>Resolved By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r._id.slice(-6).toUpperCase()}</td>
                <td>{r.user?.name}</td>
                <td>{r.zone}, {r.tank}, {r.ward}</td>
                <td>{r.reason}</td>
                <td>{r.assignedEngineer?.name}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResolvedReports;
