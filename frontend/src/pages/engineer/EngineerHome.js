import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';

const EngineerHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Engineer Home</h1>
      </div>

      <div className="cards-grid">
        <div className="glass-card stat-card">
          <span className="stat-title">Engineer Name</span>
          <span className="stat-value">{user.name}</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-title">Assigned Zone</span>
          <span className="stat-value">{user.zone}</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-title">Contact</span>
          <span className="stat-value">{user.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default EngineerHome;
