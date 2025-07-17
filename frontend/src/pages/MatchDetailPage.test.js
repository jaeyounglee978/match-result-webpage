import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchDetailPage from './MatchDetailPage';

test('renders match detail page', () => {
  render(<MatchDetailPage />);
  const linkElement = screen.getByText(/Match Detail/i);
  expect(linkElement).toBeInTheDocument();
});
