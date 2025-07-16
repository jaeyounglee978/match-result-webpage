#!/bin/bash

# Check for a specific argument
if [ "$1" = "be" ]; then
  echo "Starting backend server on port 3000..."
  (cd backend && npm start)
elif [ "$1" = "fe" ]; then
  echo "Starting frontend server on port 3001..."
  (cd frontend && PORT=3001 npm start)
elif [ -z "$1" ]; then
  echo "Starting both backend and frontend servers..."
  # Start the backend server in the background
  (cd backend && npm start) &
  # Start the frontend server on port 3001 and wait for it
  (cd frontend && PORT=3001 npm start)
else
  echo "Invalid argument. Use 'be' for backend, 'fe' for frontend, or no argument for both."
  exit 1
fi