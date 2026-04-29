import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import aquasafeLogo from '../aquasafe-logo.png';

const AdminLayout = () => {
  const { user, logout, socket } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('newAlert', (data) => {
        setNotification({ type: 'unsafe', message: `NEW ALERT in zone ${data.zone}! Reason: ${data.reason}` });
        setTimeout(() => setNotification(null), 5000);
      });

      socket.on('newReport', (data) => {
        setNotification({ type: 'unsafe', message: `New Issue Reported in ${data.zone}` });
        setTimeout(() => setNotification(null), 5000);
      });
    }
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header" style={{ textAlign: 'center' }}>
          <img src={aquasafeLogo} alt="AquaSafe" style={{ width: '160px', marginBottom: '0.5rem' }} />
          <p style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)'}}>Admin Dashboard</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
          <NavLink to="/admin/users" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Users</NavLink>
          <NavLink to="/admin/engineers" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Engineers</NavLink>
          <NavLink to="/admin/reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Unassigned Reports</NavLink>
          <NavLink to="/admin/assigned" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Assigned Tasks</NavLink>
          <NavLink to="/admin/resolved" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Resolved Reports</NavLink>
          <NavLink to="/admin/alerts" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Alerts</NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      
      <main className="main-content">
        <div className="top-bar">
          <button onClick={toggleTheme} style={{ marginRight: '1.5rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'background 0.3s' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="notification-bell" title="Notifications" onClick={() => navigate('/admin/alerts')}>
            🔔
            {notification && <span className="badge"></span>}
          </div>
          <div className="user-profile-sm">
            {user?.name || 'Admin'}
          </div>
        </div>

        {notification && (
          <div className={`notification-popup ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
