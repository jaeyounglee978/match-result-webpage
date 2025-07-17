import React from 'react';
import { render, screen } from '@testing-library/react';
import UserManagementPage from './UserManagementPage';

test('renders user management page', () => {
  render(<UserManagementPage />);
  const linkElement = screen.getByText(/User Management/i);
  expect(linkElement).toBeInTheDocument();
});
