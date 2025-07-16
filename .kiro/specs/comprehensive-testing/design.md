# Design Document

## Overview

This design outlines a comprehensive testing strategy for the competitive shooting match management system. The testing architecture will include unit tests, integration tests, and end-to-end tests for both backend and frontend components, ensuring robust coverage and reliable functionality.

## Architecture

### Testing Stack
- **Backend Testing**: Jest + Supertest for API testing
- **Frontend Testing**: Jest + React Testing Library + MSW (Mock Service Worker)
- **Database Testing**: SQLite in-memory database for isolation
- **Integration Testing**: Supertest for full API workflows
- **Mocking**: MSW for API mocking, Jest mocks for modules

### Test Environment Structure
```
backend/
├── __tests__/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── integration/
├── jest.config.js
└── test-setup.js

frontend/
├── src/__tests__/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── integration/
├── src/mocks/
│   ├── handlers.js
│   └── server.js
└── setupTests.js
```

## Components and Interfaces

### Backend Testing Components

#### 1. Database Test Utilities
- **Purpose**: Provide clean database state for each test
- **Interface**: Setup/teardown functions for test database
- **Implementation**: In-memory SQLite database with table creation

#### 2. Authentication Test Helpers
- **Purpose**: Generate test JWT tokens and mock authentication
- **Interface**: Token generation, user creation utilities
- **Implementation**: Helper functions for creating test users and tokens

#### 3. API Test Suite
- **Purpose**: Test all REST endpoints
- **Interface**: Supertest integration with Express app
- **Implementation**: Comprehensive endpoint testing with various scenarios

#### 4. Middleware Testing
- **Purpose**: Verify authentication and authorization logic
- **Interface**: Mock request/response objects
- **Implementation**: Unit tests for middleware functions

### Frontend Testing Components

#### 1. Component Test Utilities
- **Purpose**: Render components with necessary providers
- **Interface**: Custom render function with AuthContext
- **Implementation**: Wrapper around React Testing Library render

#### 2. API Mocking Layer
- **Purpose**: Mock backend API calls for frontend tests
- **Interface**: MSW handlers for all API endpoints
- **Implementation**: Request/response mocking with realistic data

#### 3. User Interaction Testing
- **Purpose**: Simulate user actions and verify responses
- **Interface**: User event simulation and assertion helpers
- **Implementation**: React Testing Library user-event integration

#### 4. Route Testing
- **Purpose**: Verify navigation and protected routes
- **Interface**: Router testing utilities
- **Implementation**: Memory router with authentication state

## Data Models

### Test Data Factories
```javascript
// Backend test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  role: 'user'
};

const testRange = {
  name: 'Test Range',
  description: 'Test shooting range'
};

const testMatch = {
  name: 'Test Match',
  date: '2024-01-01',
  range_id: 1
};

// Frontend test data
const mockAuthUser = {
  id: 1,
  email: 'test@example.com',
  role: 'user',
  token: 'mock-jwt-token'
};
```

### Test Database Schema
- Use same schema as production but with in-memory SQLite
- Seed with minimal test data for each test suite
- Clean state between tests to ensure isolation

## Error Handling

### Backend Error Testing
- **Authentication Errors**: Invalid tokens, expired tokens, missing tokens
- **Validation Errors**: Invalid input data, missing required fields
- **Database Errors**: Connection failures, constraint violations
- **Authorization Errors**: Insufficient permissions, role-based access

### Frontend Error Testing
- **API Error Handling**: Network failures, server errors, timeout scenarios
- **Form Validation**: Invalid inputs, required field validation
- **Authentication Errors**: Login failures, token expiration
- **Navigation Errors**: Protected route access, invalid routes

## Testing Strategy

### Unit Tests
- **Backend**: Controllers, middleware, utilities (80%+ coverage)
- **Frontend**: Components, hooks, utilities (80%+ coverage)
- **Isolation**: Mock all external dependencies
- **Speed**: Fast execution for rapid feedback

### Integration Tests
- **Backend**: Full API workflows with database
- **Frontend**: Component integration with API mocking
- **Realistic**: Use actual data flows and state management
- **Coverage**: Critical user journeys and business logic

### End-to-End Tests
- **Full Stack**: Complete user workflows from UI to database
- **Authentication**: Login/logout flows with real JWT tokens
- **File Upload**: PractiScore file processing workflow
- **Admin Functions**: User and range management workflows

### Test Organization
```javascript
// Backend test structure
describe('Auth Controller', () => {
  describe('POST /register', () => {
    it('should register new user with valid data');
    it('should reject duplicate email');
    it('should validate required fields');
  });
});

// Frontend test structure
describe('LoginPage', () => {
  describe('Form Submission', () => {
    it('should login with valid credentials');
    it('should show error with invalid credentials');
    it('should redirect after successful login');
  });
});
```

### Continuous Integration
- **Pre-commit**: Run linting and unit tests
- **Pull Request**: Full test suite execution
- **Coverage Reports**: Generate and track coverage metrics
- **Failure Notifications**: Alert developers of test failures