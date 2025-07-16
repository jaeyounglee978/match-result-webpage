# Technology Stack

## Architecture
- **Frontend**: React 19.1.0 with React Router for SPA routing
- **Backend**: Node.js with Express 5.1.0 REST API
- **Database**: SQLite 3 for data persistence
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Deployment**: Docker Compose orchestration

## Key Dependencies

### Backend
- `express` - Web framework
- `sqlite3` - Database driver
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `multer` - File upload handling

### Frontend
- `react` & `react-dom` - UI framework
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- `react-scripts` - Build tooling

## Development Commands

### Full Stack
```bash
# Start both frontend and backend
./start-dev.sh

# Start only backend (port 3000)
./start-dev.sh be

# Start only frontend (port 3001)
./start-dev.sh fe
```

### Docker Development
```bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build
```

### Individual Services
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm start
```

## Environment Variables
- `NODE_ENV` - Environment mode
- `DATABASE_PATH` - SQLite database file path
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 3000 backend, 3001 frontend)