import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UploadPage = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [rangeId, setRangeId] = useState('');
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRanges = async () => {
      try {
        const response = await api.get('/ranges');
        setRanges(response.data);
        if (response.data.length > 0) {
          setRangeId(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching ranges', error);
      }
    };
    fetchRanges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', date);
    formData.append('range_id', rangeId);
    formData.append('pscfile', file);

    try {
      await api.post('/matches/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Match uploaded successfully!');
      setName('');
      setDate('');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload match');
    }
  };

  return (
    <div>
      <h2>Upload Match</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Match Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={rangeId} onChange={(e) => setRangeId(e.target.value)} required>
          {ranges.map(range => (
            <option key={range.id} value={range.id}>{range.name}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default UploadPage;
