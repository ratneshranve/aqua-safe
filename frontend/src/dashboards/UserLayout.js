import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import aquasafeLogo from '../aquasafe-logo.png';

const UserLayout = () => {
  const { user, logout, socket } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('newAlert', (data) => {
        setNotification({ type: 'unsafe', message: `ALERT! Water is unsafe in ${data.zone}. Reason: ${data.reason}` });
        setTimeout(() => setNotification(null), 5000);
      });

      socket.on('reportResolved', (data) => {
        setNotification({ type: 'safe', message: `Your report #${data._id.slice(-4)} has been resolved!` });
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
          <p style={{fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)'}}>Citizen Portal</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/user" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
          <NavLink to="/user/sensors" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Sensor Readings</NavLink>
          <NavLink to="/user/report" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Report Issue</NavLink>
          <NavLink to="/user/my-reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>My Reports</NavLink>
          <NavLink to="/user/alerts" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Alerts</NavLink>
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
          <div className="notification-bell" title="Notifications" onClick={() => navigate('/user/alerts')}>
            🔔
            {notification && <span className="badge"></span>}
          </div>
          <div className="user-profile-sm">
            {user?.name || 'Citizen'}
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

export default UserLayout;
