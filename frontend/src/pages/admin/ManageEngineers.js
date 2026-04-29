import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const ManageEngineers = () => {
  const { user } = useContext(AuthContext);
  const [engineers, setEngineers] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', zone: 'Z-1'
  });

  const fetchEngineers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_URL}/api/admin/engineers`, config);
      setEngineers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEngineers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEngineer = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/admin/engineers`, formData, config);
      fetchEngineers();
      setFormData({ name: '', email: '', password: '', phone: '', zone: 'Z-1' });
      alert('Engineer added successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to add engineer');
    }
  };

  const handleDelete = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/admin/engineers/${id}`, config);
      fetchEngineers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Engineers</h1>
      </div>

      <div className="glass-card" style={{marginBottom: '2rem'}}>
        <h2>Add Engineer</h2>
        <form onSubmit={handleAddEngineer} style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem'}}>
          <input className="form-control" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          <input className="form-control" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          <input className="form-control" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          <input className="form-control" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required style={{flex: '1 1 200px'}} />
          
          <select className="form-control" name="zone" value={formData.zone} onChange={handleChange} style={{flex: '1 1 100px'}}>
            {[...Array(19)].map((_,i) => <option key={`Z-${i+1}`}>Z-{i+1}</option>)}
          </select>

          <button type="submit" className="btn btn-primary" style={{flex: '1 1 100%'}}>Add Engineer</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Zone Assigned</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {engineers.map(e => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{e.zone}</td>
                <td>
                  <button onClick={() => handleDelete(e._id)} style={{background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEngineers;
