import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import API_URL from '../config';

import aquasafeLogo from '../aquasafe-logo.png';
import { MainNavbar } from './LandingPage';

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
    <>
      <MainNavbar />
      <div className="auth-container">
        <div className="glass-card auth-form">
        <img src={aquasafeLogo} alt="AquaSafe" style={{ width: '220px', display: 'block', margin: '0 auto 1.5rem auto' }} />
        <p style={{marginBottom: '1.5rem', color: 'gray'}}>Smart Water Quality Monitoring</p>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">Login to Dashboard</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
