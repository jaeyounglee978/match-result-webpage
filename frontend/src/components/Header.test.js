import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders header component', () => {
  render(<Header />);
  const linkElement = screen.getByText(/Match Result Webpage/i);
  expect(linkElement).toBeInTheDocument();
});
