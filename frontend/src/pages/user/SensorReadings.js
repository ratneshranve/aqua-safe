import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

import { AuthContext } from '../../AuthContext';

const SensorReadings = () => {
  const { user } = useContext(AuthContext);
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/sensor-data/${user.meterId}`);
        setReadings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReadings();
  }, [user.meterId]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sensor Readings</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Meter ID</th>
              <th>TDS</th>
              <th>Turbidity</th>
              <th>pH</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r, index) => (
              <tr key={index}>
                <td>{r.meterId}</td>
                <td>{r.tds}</td>
                <td>{r.turbidity}</td>
                <td>{r.ph}</td>
                <td><span className={`status-badge status-${r.status}`}>{r.status}</span></td>
                <td>{new Date(r.dateTime).toLocaleString()}</td>
              </tr>
            ))}
            {readings.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No readings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorReadings;
