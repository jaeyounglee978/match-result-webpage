import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminRangeManagementPage = () => {
  const [ranges, setRanges] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRanges = async () => {
    try {
      const response = await api.get('/ranges');
      setRanges(response.data);
    } catch (error) {
      console.error('Error fetching ranges', error);
    }
  };

  useEffect(() => {
    fetchRanges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/ranges', { name, description });
      setSuccess('Range created successfully!');
      setName('');
      setDescription('');
      fetchRanges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create range');
    }
  };

  return (
    <div>
      <h2>Range Management</h2>
      <form onSubmit={handleSubmit}>
        <h3>Create New Range</h3>
        <input
          type="text"
          placeholder="Range Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Range</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>

      <h3>Existing Ranges</h3>
      <ul>
        {ranges.map(range => (
          <li key={range.id}>{range.name} - {range.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRangeManagementPage;
