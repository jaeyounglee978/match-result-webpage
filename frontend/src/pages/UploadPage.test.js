import React from 'react';
import { render, screen } from '@testing-library/react';
import UploadPage from './UploadPage';

test('renders upload page', () => {
  render(<UploadPage />);
  const linkElement = screen.getByText(/Upload/i);
  expect(linkElement).toBeInTheDocument();
});
