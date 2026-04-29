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
    <div>
      <div className="page-header">
        <h1 className="page-title">User Reports (Pending)</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>User</th>
              <th>Location</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Assign Engineer</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r._id.slice(-6).toUpperCase()}</td>
                <td>{r.user?.name} ({r.meterId})</td>
                <td>{r.zone}, {r.tank}, {r.ward}</td>
                <td>{r.reason}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
                <td>
                  {r.assignedEngineer ? (
                    <span style={{color: 'green'}}>Assigned to {r.assignedEngineer.name}</span>
                  ) : (
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <select 
                        onChange={(e) => setSelectedEngineers({...selectedEngineers, [r._id]: e.target.value})} 
                        value={selectedEngineers[r._id] || ""}
                        className="form-control"
                        style={{padding: '5px', width: '180px'}}
                      >
                        <option value="" disabled>Select Engineer</option>
                        {engineers.filter(e => e.zone === r.zone).map(eng => (
                          <option key={eng._id} value={eng._id}>{eng.name} ({eng.zone})</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleAssign(r._id, selectedEngineers[r._id])}
                        disabled={!selectedEngineers[r._id]}
                        className="btn btn-primary"
                        style={{padding: '5px 10px', fontSize: '0.9rem', width: 'auto'}}
                      >
                        Assign
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllReports;
