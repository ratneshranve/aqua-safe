import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import API_URL from '../config';

import aquasafeLogo from '../aquasafe-logo.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Engineer') navigate('/engineer');
      else if (user.role === 'User') navigate('/user');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      login(res.data);
      if (res.data.role === 'Admin') navigate('/admin');
      else if (res.data.role === 'Engineer') navigate('/engineer');
      else navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden', 
      fontFamily: "'Roboto', sans-serif",
      background: '#fff'
    }}>
      {/* Left Side: Login Form */}
      <div style={{ 
        flex: '0 0 40%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 8%', 
        zIndex: 2,
        position: 'relative',
        background: '#fff'
      }}>
        <h1 style={{ 
          fontSize: '2.8rem', 
          fontWeight: 800, 
          color: '#002a5c', 
          marginBottom: '0.5rem',
          letterSpacing: '-2px',
          textTransform: 'uppercase',
          lineHeight: 1
        }}>LOGIN</h1>
        <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Please enter your credentials to access the dashboard.</p>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600, background: '#fef2f2', padding: '10px', borderRadius: '6px', border: '1px solid #fee2e2' }}>{error}</div>}
          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#002a5c', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. admin@aquasafe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{ 
                width: '100%', 
                padding: '0.8rem 1rem', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                color: '#333',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#002a5c', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ 
                width: '100%', 
                padding: '0.8rem 1rem', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                color: '#333',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22d3ee'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <input type="checkbox" id="terms" style={{ accentColor: '#22d3ee', width: '16px', height: '16px' }} />
            <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#64748b' }}>
              I agree to the <span style={{ color: '#22d3ee', fontWeight: 600, cursor: 'pointer' }}>Terms of Service.</span>
            </label>
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            padding: '1rem', 
            background: '#002a5c', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 700, 
            fontSize: '1rem', 
            cursor: 'pointer',
            transition: 'background 0.2s',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Sign In
          </button>
        </form>

      </div>

      {/* Right Side: Ocean Image */}
      <div style={{ 
        flex: '1', 
        position: 'relative',
        background: `url(${require('./assets/login_bg.jpeg')}) no-repeat center center / cover`,
        overflow: 'hidden'
      }}>
        {/* Torn Edge Effect */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '60px',
          background: '#fff',
          clipPath: 'polygon(0% 0%, 100% 0%, 85% 5%, 100% 10%, 80% 15%, 100% 20%, 85% 25%, 100% 30%, 80% 35%, 100% 40%, 85% 45%, 100% 50%, 80% 55%, 100% 60%, 85% 65%, 100% 70%, 80% 75%, 100% 80%, 85% 85%, 100% 90%, 80% 95%, 100% 100%, 0% 100%)',
          zIndex: 1
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '12%',
          right: '5%',
          textAlign: 'right',
          color: '#fff',
          textShadow: '0 8px 20px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          animation: 'float 4s ease-in-out infinite'
        }}>
          <img src={aquasafeLogo} alt="AquaSafe" style={{ 
            width: '320px', 
            marginBottom: '1rem', 
            filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.2))' 
          }} />
          <div style={{ 
            width: '120px', 
            height: '4px', 
            background: 'rgba(255,255,255,0.8)', 
            marginBottom: '1rem',
            borderRadius: '2px'
          }}></div>
          <p style={{ 
            fontSize: '1.4rem', 
            fontWeight: 400, 
            margin: 0, 
            opacity: 0.9,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>Smart Water Quality Monitoring</p>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Login;
