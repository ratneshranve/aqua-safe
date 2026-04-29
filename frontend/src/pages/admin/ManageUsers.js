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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/admin/users`, formData, config);
      fetchUsers();
      setFormData({
        name: '', email: '', password: '', phone: '',
        meterId: '', zone: 'Z-1', tank: 'T-1', ward: 'W-1'
      });
      alert('User added successfully');
    } catch (err) {
      console.error(err);
      alert(`Failed to add user: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/admin/users/${id}`, config);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
      </div>

      <div className="glass-card" style={{marginBottom: '2rem'}}>
        <h2>Add User</h2>
        <form onSubmit={handleAddUser} style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem'}}>
          <input className="form-control" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          <input className="form-control" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          <input className="form-control" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          <input className="form-control" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          <input className="form-control" name="meterId" placeholder="Meter ID (e.g., METER-100)" value={formData.meterId} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          
          <select className="form-control" name="zone" value={formData.zone} onChange={handleChange} style={{flex: '1 1 100px'}}>
            {[...Array(19)].map((_,i) => <option key={`Z-${i+1}`}>Z-{i+1}</option>)}
          </select>
          <select className="form-control" name="tank" value={formData.tank} onChange={handleChange} style={{flex: '1 1 100px'}}>
            {[...Array(4)].map((_,i) => <option key={`T-${i+1}`}>T-{i+1}</option>)}
          </select>
          <select className="form-control" name="ward" value={formData.ward} onChange={handleChange} style={{flex: '1 1 100px'}}>
            {[...Array(4)].map((_,i) => <option key={`W-${i+1}`}>W-{i+1}</option>)}
          </select>

          <button type="submit" className="btn btn-primary" style={{flex: '1 1 100%'}}>Add User</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Meter ID</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.meterId}</td>
                <td>{u.zone}, {u.tank}, {u.ward}</td>
                <td>
                  <button onClick={() => handleDelete(u._id)} style={{background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
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
