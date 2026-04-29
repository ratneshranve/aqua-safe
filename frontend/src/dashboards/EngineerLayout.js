import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import aquasafeLogo from '../aquasafe-logo.png';
import { 
  Home, 
  Briefcase, 
  CheckCircle, 
  Bell, 
  LogOut, 
  Menu, 
  Sun, 
  Moon 
} from 'lucide-react';

const EngineerLayout = () => {
  const { user, logout, socket } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const navItems = [
    { path: '/engineer', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/engineer/active', label: 'Active Tasks', icon: <Briefcase size={20} /> },
    { path: '/engineer/resolved', label: 'Resolved Tasks', icon: <CheckCircle size={20} /> },
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
            Welcome, <span style={{ color: '#fff', fontWeight: 700 }}>{user?.name || 'Engineer'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#fff', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="notification-bell" style={{ color: '#fff', cursor: 'pointer', position: 'relative', background: 'rgba(255,255,255,0.05)', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate('/engineer/active')}>
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
            {!isCollapsed && <p style={{fontSize: '0.6rem', color: '#444', marginTop: '0.4rem', letterSpacing: '1.5px', fontWeight: 900 }}>ENGINEER PORTAL</p>}
          </div>
          
          <nav className="sidebar-nav custom-scrollbar" style={{ flex: 1, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path}
                to={item.path} 
                end={item.path === '/engineer'}
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
                background: isCollapsed ? 'rgba(185, 28, 28, 0.1)' : '#b91c1c',
                color: isCollapsed ? '#b91c1c' : '#fff',
                border: 'none',
                fontWeight: 600,
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

        <main className="main-content custom-scrollbar" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', position: 'relative', background: '#f1f7fe' }}>
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

export default EngineerLayout;
