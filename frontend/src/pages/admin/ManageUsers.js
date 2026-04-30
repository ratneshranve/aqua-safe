import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const ZONE_NAMES = {
  'Z-1': 'Rajwada Circle',
  'Z-2': 'Vijay Nagar',
  'Z-3': 'Old Palasia',
  'Z-4': 'Bhanwarkuan',
  'Z-5': 'Annapurna Road',
  'Z-6': 'Sarafa Bazaar',
  'Z-7': 'Khajrana Area',
  'Z-8': 'Mhow Naka',
  'Z-9': 'Sudama Nagar',
  'Z-10': 'Banganga',
  'Z-11': 'Aerodrome Road',
  'Z-12': 'Rau Area',
  'Z-13': 'Azad Nagar',
  'Z-14': 'Musakhedi',
  'Z-15': 'Pipliyahana',
  'Z-16': 'Malwa Mill',
  'Z-17': 'Patnipura',
  'Z-18': 'Sukhlia',
  'Z-19': 'LIG Square'
};

const ManageUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    meterId: '', zone: 'Z-1', tank: 'T-1', ward: 'W-1', otp: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_URL}/api/admin/users`, config);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateEmail = (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      alert('Please enter a valid email address first.');
      return;
    }

    setOtpLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/admin/send-otp`, { email: formData.email }, config);
      setOtpSent(true);
      alert('Verification OTP sent to ' + formData.email);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const validateMeterId = (id) => {
    return /^METER-\d+$/.test(id);
  };

  const handleAddUser = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || formData.name.length < 3) return alert('Name must be at least 3 characters');
    if (!validateEmail(formData.email)) return alert('Invalid email format');
    if (!validatePhone(formData.phone)) return alert('Phone must be 10 digits');
    if (!formData.password || formData.password.length < 6) return alert('Password must be at least 6 characters');
    if (!validateMeterId(formData.meterId)) return alert('Invalid Meter ID format (e.g., METER-01)');
    if (!formData.otp) return alert('Please enter the OTP sent to email');

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/admin/users`, formData, config);
      
      await fetchUsers();
      setFormData({
        name: '', email: '', password: '', phone: '',
        meterId: '', zone: 'Z-1', tank: 'T-1', ward: 'W-1', otp: ''
      });
      setOtpSent(false);
      alert('User registered successfully!');
    } catch (err) {
      alert(`Registration Failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/admin/users/${id}`, config);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Manage Users</h1>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', fontWeight: 700 }}>Add New User</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          <div style={{ display: 'flex', gap: '5px' }}>
            <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
            <button 
              type="button" 
              onClick={handleSendOTP} 
              disabled={otpLoading || otpSent}
              style={{ padding: '0 10px', background: '#004aad', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              {otpSent ? 'Sent' : (otpLoading ? '...' : 'Verify')}
            </button>
          </div>
          <input name="password" type="password" placeholder="Password (Min 6)" value={formData.password} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          <input name="phone" placeholder="Phone (10 digits)" value={formData.phone} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          <input name="meterId" placeholder="Meter ID (e.g., METER-01)" value={formData.meterId} onChange={handleChange} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          
          <select name="zone" value={formData.zone} onChange={handleChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e1e8f0' }}>
            {Object.entries(ZONE_NAMES).map(([id, name]) => <option key={id} value={id}>{id}: {name}</option>)}
          </select>

          {otpSent && (
            <input 
              name="otp" 
              placeholder="Enter 6-digit OTP" 
              value={formData.otp} 
              onChange={handleChange} 
              style={{ padding: '8px 12px', borderRadius: '6px', border: '2px solid #004aad', background: '#f0f7ff' }} 
            />
          )}

          <button 
            type="button"
            onClick={handleAddUser}
            disabled={loading || !otpSent}
            style={{ 
              gridColumn: '1 / -1', 
              background: (loading || !otpSent) ? '#94a3b8' : '#1e293b', 
              color: '#fff', 
              border: 'none', 
              padding: '0.8rem', 
              borderRadius: '8px', 
              fontWeight: 700,
              fontSize: '0.9rem',
              marginTop: '0.5rem',
              cursor: (loading || !otpSent) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Registering User...' : 'Register User'}
          </button>
        </div>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e1e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e1e8f0' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Meter ID</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.8rem 1rem', fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: '0.8rem 1rem', color: '#666' }}>{u.email}</td>
                <td style={{ padding: '0.8rem 1rem' }}>
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{u.meterId}</code>
                </td>
                <td style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: '#888' }}>
                  {u.zone} ({ZONE_NAMES[u.zone] || 'Area'})
                </td>
                <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(u._id)} style={{ 
                    background: 'transparent', color: '#ef4444', border: '1px solid #fee2e2', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;

