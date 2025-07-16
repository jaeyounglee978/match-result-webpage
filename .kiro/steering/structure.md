# Project Structure

## Root Level
- `docker-compose.yml` - Container orchestration
- `start-dev.sh` - Development startup script
- `README.md` - Project documentation (Korean)
- `PLANNING.md` - Development milestones and tasks

## Backend Structure (`/backend`)
```
backend/
├── index.js              # Express server entry point
├── database.js           # SQLite connection and table creation
├── package.json          # Node.js dependencies
├── Dockerfile            # Backend container config
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── matchController.js
│   ├── rangeController.js
│   └── userController.js
├── middleware/           # Express middleware
│   ├── authMiddleware.js # JWT authentication
│   └── adminMiddleware.js # Admin role checking
├── routes/              # API route definitions
├── services/            # Business logic
│   └── pscParser.js     # PractiScore file parser (TODO)
└── uploads/             # File upload storage
```

## Frontend Structure (`/frontend`)
```
frontend/
├── public/              # Static assets
├── src/
│   ├── App.js          # Main component with routing
│   ├── index.js        # React entry point
│   ├── components/     # Reusable UI components
│   │   ├── Header.js
│   │   └── PrivateRoute.js
│   ├── pages/          # Route components
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── MatchListPage.js
│   │   ├── MatchDetailPage.js
│   │   ├── UploadPage.js
│   │   └── Admin/      # Admin-only pages
│   ├── hooks/          # Custom React hooks
│   │   ├── AuthContext.js
│   │   └── useAuth.js
│   └── services/       # API communication
│       └── api.js
└── Dockerfile          # Frontend container config
```

## Database Schema
- `users` - User accounts with roles
- `ranges` - Shooting ranges
- `matches` - Match records linked to ranges
- `scores` - Individual shooter results per match

## API Structure
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management (admin)
- `/api/ranges/*` - Range management
- `/api/matches/*` - Match data and file uploads

## Conventions
- Controllers handle request/response logic
- Middleware for authentication and authorization
- Services contain business logic
- React hooks for state management
- Private routes protect authenticated content