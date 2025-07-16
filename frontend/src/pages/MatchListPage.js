import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MatchListPage = () => {
  const [matches, setMatches] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [selectedRange, setSelectedRange] = useState('');

  useEffect(() => {
    const fetchRanges = async () => {
      try {
        const response = await api.get('/ranges');
        setRanges(response.data);
      } catch (error) {
        console.error('Error fetching ranges', error);
      }
    };
    fetchRanges();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const params = selectedRange ? { range_id: selectedRange } : {};
        const response = await api.get('/matches', { params });
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches', error);
      }
    };
    fetchMatches();
  }, [selectedRange]);

  return (
    <div>
      <h2>Matches</h2>
      <select onChange={(e) => setSelectedRange(e.target.value)} value={selectedRange}>
        <option value="">All Ranges</option>
        {ranges.map(range => (
          <option key={range.id} value={range.id}>{range.name}</option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Range</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.id}>
              <td>{match.name}</td>
              <td>{new Date(match.date).toLocaleDateString()}</td>
              <td>{match.range_name}</td>
              <td><Link to={`/matches/${match.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchListPage;
