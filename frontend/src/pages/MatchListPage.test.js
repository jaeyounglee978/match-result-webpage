import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchListPage from './MatchListPage';

test('renders match list page', () => {
  render(<MatchListPage />);
  const linkElement = screen.getByText(/Match List/i);
  expect(linkElement).toBeInTheDocument();
});
