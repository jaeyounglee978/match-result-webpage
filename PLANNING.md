# Project Plan: Match Result Webpage

This document outlines the development plan for the competitive shooting match result application. The project is divided into three main parts: Backend, Frontend, and Deployment.

---

##  Milestone 1: Project Scaffolding & Basic Setup

- [ ] Initialize git repository.
- [ ] Create a `docker-compose.yml` to orchestrate the frontend, backend, and database services.
- [ ] Set up directory structure for `frontend` and `backend`.
- [ ] Create basic `Dockerfile` for both services.

---

##  milestone 2: Backend Development (Node.js & Express)

### **Phase 1: Core Server & Database**
- [ ] Initialize Node.js project (`npm init`).
- [ ] Install dependencies: `express`, `sqlite3`, `jsonwebtoken`, `bcryptjs`, `cors`, `multer`.
- [ ] Establish a connection to the SQLite database.
- [ ] Create database initialization script (`database.js`) to define and create tables:
    - `users` (id, email, password_hash, role)
    - `ranges` (id, name, description)
    - `matches` (id, name, date, range_id)
    - `scores` (id, match_id, shooter_name, division, score, time)

### **Phase 2: User Authentication**
- [ ] **API Endpoint:** `POST /api/auth/register` - Register a new user. Hash password with `bcryptjs`.
- [ ] **API Endpoint:** `POST /api/auth/login` - Login user. Return a JWT.
- [ ] Implement JWT middleware (`authMiddleware.js`) to protect routes.
- [ ] Implement role-based access control (e.g., `adminMiddleware.js`).

### **Phase 3: Admin Features**
- [ ] **API Endpoint:** `POST /api/ranges` - (Admin only) Add a new shooting range.
- [ ] **API Endpoint:** `GET /api/users` - (Admin only) List all users.
- [ ] **API Endpoint:** `DELETE /api/users/:id` - (Admin only) Delete a user.
- [ ] **API Endpoint:** `PUT /api/users/:id/role` - (Admin only) Change a user's role.

### **Phase 4: Match Data Handling**
- [ ] **API Endpoint:** `GET /api/ranges` - Get a list of all ranges for dropdowns.
- [ ] **API Endpoint:** `POST /api/matches/upload` - (Authenticated users) Upload a `.psc` file.
    - Use `multer` for file handling.
    - **TODO:** Create a placeholder service `pscParser.js` with an interface `parse(filePath)` that will contain the logic for parsing the `.psc` file. This service will be implemented later.
- [ ] **API Endpoint:** `GET /api/matches` - Get a list of all matches, with optional filtering by `range_id`.
- [ ] **API Endpoint:** `GET /api/matches/:id` - Get detailed information for a single match, including all associated scores.
- [ ] **API Endpoint:** `DELETE /api/matches/:id` - (Admin only) Delete a match and its associated scores.

---

## Milestone 3: Frontend Development (React)

### **Phase 1: Project Setup & Routing**
- [ ] Initialize React project (`npx create-react-app`).
- [ ] Install dependencies: `axios`, `react-router-dom`.
- [ ] Set up basic project structure: `components`, `pages`, `services`, `hooks`.
- [ ] Implement routing (`App.js` or a dedicated `Routes.js`):
    - `/login`, `/register`
    - `/` (main dashboard, shows list of matches)
    - `/matches/:id` (match details page)
    - `/upload` (match upload page)
    - `/admin/users` (user management)
    - `/admin/ranges` (range management)
- [ ] Create a `PrivateRoute` component that checks for JWT and user role.

### **Phase 2: UI Components & Pages**
- [ ] **Component:** `Header.js` - Navigation bar with login/logout and links.
- [ ] **Page:** `LoginPage.js` - Form to log in.
- [ ] **Page:** `RegisterPage.js` - Form to register.
- [ ] **Page:** `MatchListPage.js` - Display matches in a table/list. Include a dropdown to filter by range.
- [ ] **Page:** `MatchDetailPage.js` - Display match details and a table of scores for all participants.
- [ ] **Page:** `UploadPage.js` - Form with a file input and a dropdown to select the range.
- [ ] **Service:** `api.js` - A module to centralize all `axios` API calls to the backend.
- [ ] **Hook:** `useAuth.js` - A custom hook to manage user authentication state (token, user info) using Context API.

### **Phase 3: Admin UI**
- [ ] **Page:** `Admin/UserManagementPage.js` - Table of users with buttons to delete or change roles.
- [ ] **Page:** `Admin/RangeManagementPage.js` - Form to add a new range and a list of existing ranges.

---

## Milestone 4: Deployment

- [ ] Refine `Dockerfile` for production builds (e.g., multi-stage build for React).
- [ ] Configure Nginx (or similar) to serve the React frontend and proxy API requests to the backend.
- [ ] Write deployment scripts/instructions in `README.md`.
- [ ] Test the full application stack using `docker-compose up`.