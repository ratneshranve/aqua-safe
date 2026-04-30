import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import aquasafeLogo from '../aquasafe-logo.png';
import { 
  Home, 
  Activity, 
  AlertTriangle, 
  ClipboardList, 
  Bell, 
  LogOut, 
  Menu, 
  Sun, 
  Moon 
} from 'lucide-react';

const UserLayout = () => {
  const { user, logout, socket } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const navItems = [
    { path: '/user', label: 'Home', icon: <Home size={20} /> },
    { path: '/user/sensors', label: 'Sensors', icon: <Activity size={20} /> },
    { path: '/user/report', label: 'Report Issue', icon: <AlertTriangle size={20} /> },
    { path: '/user/my-reports', label: 'My Reports', icon: <ClipboardList size={20} /> },
    { path: '/user/alerts', label: 'Global Alerts', icon: <Bell size={20} /> },
  ];

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      {/* Top Navbar */}
      <header className="top-navbar" style={{ 
        height: '60px',
        background: '#0a0a0a',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 1.5rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
            Welcome, <span style={{ color: '#fff', fontWeight: 700 }}>{user?.name || 'Citizen'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#fff', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="notification-bell" style={{ color: '#fff', cursor: 'pointer', position: 'relative', background: 'rgba(255,255,255,0.05)', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/user/alerts')}>
            <Bell size={18} />
            {notification && <span className="badge" style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #0a0a0a' }}></span>}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="sidebar" style={{ 
          width: isCollapsed ? '75px' : '230px',
          background: '#0a0a0a',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div className="sidebar-header" style={{ padding: '1.5rem 0', textAlign: 'center' }}>
            <img src={aquasafeLogo} alt="AquaSafe" style={{ width: isCollapsed ? '35px' : '100px', transition: 'all 0.4s' }} />
            {!isCollapsed && <p style={{fontSize: '0.6rem', color: '#444', marginTop: '0.4rem', letterSpacing: '1.5px', fontWeight: 900 }}>CITIZEN PORTAL</p>}
          </div>
          
          <nav className="sidebar-nav custom-scrollbar" style={{ flex: 1, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path}
                to={item.path} 
                end={item.path === '/user'}
                className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isCollapsed ? '0.8rem 0' : '0.8rem 1.8rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: '#888',
                  transition: 'all 0.3s',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  gap: '12px'
                }}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer" style={{ padding: '1.5rem' }}>
            <button 
              className="logout-btn" 
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: isCollapsed ? 'rgba(239, 68, 68, 0.1)' : '#ef4444',
                color: isCollapsed ? '#ef4444' : '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '10px',
                transition: 'all 0.3s'
              }}
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        <main className="main-content custom-scrollbar" style={{ flex: 1, padding: '2rem', overflowY: 'auto', position: 'relative' }}>
          {notification && (
            <div className={`notification-popup ${notification.type}`} style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 1000,
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              background: notification.type === 'unsafe' ? '#fef2f2' : '#f0fdf4',
              color: notification.type === 'unsafe' ? '#ef4444' : '#10b981',
              border: `1px solid ${notification.type === 'unsafe' ? '#fee2e2' : '#dcfce7'}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              animation: 'slideInRight 0.3s ease-out'
            }}>
              {notification.message}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
