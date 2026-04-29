import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import aquasafeLogo from '../aquasafe-logo.png';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  ClipboardList, 
  UserCheck, 
  CheckCircle, 
  AlertCircle, 
  LogOut, 
  Menu, 
  Sun, 
  Moon, 
  Bell 
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout, socket } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/admin/engineers', label: 'Engineers', icon: <Wrench size={20} /> },
    { path: '/admin/reports', label: 'Reports', icon: <ClipboardList size={20} /> },
    { path: '/admin/assigned', label: 'Assigned', icon: <UserCheck size={20} /> },
    { path: '/admin/resolved', label: 'Resolved', icon: <CheckCircle size={20} /> },
    { path: '/admin/alerts', label: 'Alerts', icon: <AlertCircle size={20} /> },
  ];

  return (
    <div className="dashboard-wrapper" style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Roboto', sans-serif",
      background: 'linear-gradient(-45deg, #f8fafc, #ebf2f9, #f1f5f9, #e2e8f0)',
      backgroundSize: '400% 400%',
      animation: 'gradientMove 15s ease infinite'
    }}>
      {/* Top Navbar - Full Width */}
      <header className="top-navbar" style={{ 
        height: '60px',
        background: '#0a0a0a',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 1.5rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        zIndex: 1000,
        position: 'sticky',
        top: 0
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
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
            Welcome, <span style={{ color: '#fff', fontWeight: 700 }}>{user?.name || 'Admin'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              cursor: 'pointer', 
              color: '#fff', 
              width: '35px',
              height: '35px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="notification-bell" style={{ 
            color: '#fff', 
            cursor: 'pointer',
            position: 'relative',
            background: 'rgba(255,255,255,0.05)',
            width: '35px',
            height: '35px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} onClick={() => navigate('/admin/alerts')}>
            <Bell size={18} />
            {notification && <span className="badge" style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #0a0a0a' }}></span>}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar - Below Navbar */}
        <aside className="sidebar" style={{ 
          width: isCollapsed ? '75px' : '230px',
          background: '#0a0a0a',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 60px)',
          position: 'sticky',
          top: '60px'
        }}>
          <div className="sidebar-header" style={{ padding: '1.2rem 0', textAlign: 'center' }}>
            <img src={aquasafeLogo} alt="AquaSafe" style={{ 
              width: isCollapsed ? '35px' : '100px',
              transition: 'all 0.4s ease',
              margin: '0 auto'
            }} />
            {!isCollapsed && <p style={{fontSize: '0.6rem', color: '#444', marginTop: '0.4rem', letterSpacing: '1.5px', fontWeight: 900 }}>ADMINISTRATOR</p>}
          </div>
          
          <nav className="sidebar-nav custom-scrollbar" style={{ 
            flex: 1,
            padding: '0.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px',
            overflowY: 'auto'
          }}>
            {navItems.map(item => (
              <NavLink 
                key={item.path}
                to={item.path} 
                end={item.path === '/admin'}
                title={isCollapsed ? item.label : ""}
                className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isCollapsed ? '0.8rem 0' : '0.8rem 1.8rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: '#888',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  gap: '12px',
                  background: 'transparent'
                }}
              >
                <span style={{ transition: 'all 0.3s', display: 'flex' }}>{item.icon}</span>
                {!isCollapsed && <span style={{ transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer" style={{ padding: '1.5rem', marginTop: 'auto' }}>
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
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s',
                boxShadow: isCollapsed ? 'none' : '0 4px 12px rgba(185, 28, 28, 0.2)'
              }}
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="main-content" style={{ 
          flex: 1, 
          padding: '1.5rem 2rem',
          background: '#f1f7fe'
        }}>
          {notification && (
            <div className={`notification-popup ${notification.type}`} style={{
              background: '#fff',
              color: '#333',
              border: '1px solid #f00',
              borderRadius: '8px',
              padding: '1rem 1.5rem',
              fontSize: '0.85rem',
              boxShadow: '0 10px 30px rgba(255,0,0,0.1)',
              marginBottom: '1rem'
            }}>
              {notification.message}
            </div>
          )}
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
