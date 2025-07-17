import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from './RegisterPage';

test('renders register page', () => {
  render(<RegisterPage />);
  const linkElement = screen.getByText(/Register/i);
  expect(linkElement).toBeInTheDocument();
});
