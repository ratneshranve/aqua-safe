import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import aquasafeLogo from '../aquasafe-logo.png';

const EngineerLayout = () => {
  const { user, logout, socket } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('taskAssigned', (data) => {
        setNotification({ type: 'unsafe', message: `New Task Assigned! Report at ${data.zone}` });
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
          <p style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)'}}>Engineer Portal</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/engineer" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
          <NavLink to="/engineer/active" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Active Tasks</NavLink>
          <NavLink to="/engineer/resolved" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Resolved Tasks</NavLink>
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
          <div className="notification-bell" title="Notifications" onClick={() => navigate('/engineer/active')}>
            🔔
            {notification && <span className="badge"></span>}
          </div>
          <div className="user-profile-sm">
            {user?.name || 'Engineer'}
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

export default EngineerLayout;
