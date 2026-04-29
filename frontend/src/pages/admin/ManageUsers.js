import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const ManageUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    meterId: '', zone: 'Z-1', tank: 'T-1', ward: 'W-1'
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  const handleAddUser = async (e) => {
    if (e) e.preventDefault();
    
    if (!user || !user.token) {
      alert("Authentication error: Please log in again.");
      return;
    }

    setLoading(true);
    console.log("Attempting to register user with data:", formData);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post(`${API_URL}/api/admin/users`, formData, config);
      console.log("Server response:", res.data);
      
      await fetchUsers();
      setFormData({
        name: '', email: '', password: '', phone: '',
        meterId: '', zone: 'Z-1', tank: 'T-1', ward: 'W-1'
      });
      alert('User registered successfully!');
    } catch (err) {
      console.error("Registration error:", err);
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
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.4rem', color: '#1e293b' }}>Manage Users</h1>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
        <h2 style={{ color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', fontWeight: 700 }}>Add New User</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          <input name="meterId" placeholder="Meter ID (e.g., M-100)" value={formData.meterId} onChange={handleChange} required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e1e8f0' }} />
          
          <select name="zone" value={formData.zone} onChange={handleChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e1e8f0' }}>
            {[...Array(19)].map((_,i) => <option key={`Z-${i+1}`} value={`Z-${i+1}`}>Z-{i+1}</option>)}
          </select>
          <select name="tank" value={formData.tank} onChange={handleChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e1e8f0' }}>
            {[...Array(4)].map((_,i) => <option key={`T-${i+1}`} value={`T-${i+1}`}>T-{i+1}</option>)}
          </select>
          <select name="ward" value={formData.ward} onChange={handleChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e1e8f0' }}>
            {[...Array(4)].map((_,i) => <option key={`W-${i+1}`} value={`W-${i+1}`}>W-{i+1}</option>)}
          </select>

          <button 
            type="button"
            onClick={handleAddUser}
            disabled={loading}
            style={{ 
              gridColumn: '1 / -1', 
              background: loading ? '#444' : '#000', 
              color: '#fff', 
              border: 'none', 
              padding: '0.8rem', 
              borderRadius: '8px', 
              fontWeight: 700,
              fontSize: '0.9rem',
              marginTop: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              zIndex: 10,
              position: 'relative'
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
                <td style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: '#888' }}>{u.zone} • {u.tank} • {u.ward}</td>
                <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(u._id)} style={{ 
                    background: 'transparent', 
                    color: '#ef4444', 
                    border: '1px solid #fee2e2', 
                    padding: '4px 12px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600
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
