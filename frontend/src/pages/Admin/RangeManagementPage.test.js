import React from 'react';
import { render, screen } from '@testing-library/react';
import RangeManagementPage from './RangeManagementPage';

test('renders range management page', () => {
  render(<RangeManagementPage />);
  const linkElement = screen.getByText(/Range Management/i);
  expect(linkElement).toBeInTheDocument();
});
