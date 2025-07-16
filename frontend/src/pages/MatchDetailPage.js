import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const MatchDetailPage = () => {
  const [match, setMatch] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await api.get(`/matches/${id}`);
        setMatch(response.data);
      } catch (error) {
        console.error('Error fetching match details', error);
      }
    };
    fetchMatch();
  }, [id]);

  if (!match) return <div>Loading...</div>;

  return (
    <div>
      <h2>{match.name}</h2>
      <p>Date: {new Date(match.date).toLocaleDateString()}</p>
      <p>Range: {match.range_name}</p>
      <h3>Scores</h3>
      <table>
        <thead>
          <tr>
            <th>Shooter</th>
            <th>Division</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {match.scores.map(score => (
            <tr key={score.id}>
              <td>{score.shooter_name}</td>
              <td>{score.division}</td>
              <td>{score.score}</td>
              <td>{score.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchDetailPage;
