import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

test('renders login page', () => {
  render(<LoginPage />);
  const linkElement = screen.getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
