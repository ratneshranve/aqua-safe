import React, { useContext, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const [reason, setReason] = useState('Dirty water');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/user/reports`, { reason }, config);
      setMsg('Issue reported successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setMsg('Failed to report issue.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Report Issue</h1>
      </div>

      <div className="glass-card" style={{maxWidth: '500px'}}>
        {msg && <p style={{color: 'green', marginBottom: '1rem'}}>{msg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meter ID (Auto Selected)</label>
            <input type="text" className="form-control" value={user.meterId} disabled />
          </div>
          <div className="form-group">
            <label>Zone (Auto)</label>
            <input type="text" className="form-control" value={user.zone} disabled />
          </div>
          <div className="form-group">
            <label>Tank (Auto)</label>
            <input type="text" className="form-control" value={user.tank} disabled />
          </div>
          <div className="form-group">
            <label>Ward (Auto)</label>
            <input type="text" className="form-control" value={user.ward} disabled />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <select className="form-control" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Dirty water</option>
              <option>Dark water</option>
              <option>Foam water</option>
              <option>Smelly water</option>
              <option>Other</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit Report</button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
