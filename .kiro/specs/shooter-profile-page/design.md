# Design Document

## Overview

The shooter profile page feature extends the existing match result management system by providing detailed shooter-centric views. This feature integrates with the current React frontend and Express backend architecture, adding new API endpoints, database queries, and UI components to display comprehensive shooter statistics and match history.

## Architecture

### Frontend Architecture
- **New Page Component**: `ShooterProfilePage.js` - Main profile page component
- **Navigation Integration**: Update `Header.js` to include "My Profile" link
- **Match Detail Enhancement**: Update `MatchDetailPage.js` to make shooter names clickable
- **Routing**: Add new route `/profile/:shooterName` in `App.js`
- **API Integration**: Extend `api.js` service for shooter-specific endpoints

### Backend Architecture
- **New Controller**: `shooterController.js` - Handle shooter profile requests
- **New Service**: `shooterService.js` - Business logic for shooter data aggregation
- **Database Queries**: Complex queries to aggregate shooter statistics across matches
- **API Endpoints**: RESTful endpoints for shooter data retrieval

## Components and Interfaces

### Frontend Components

#### ShooterProfilePage Component
```javascript
// Props interface
interface ShooterProfilePageProps {
  shooterName: string; // from URL params
}

// State interface
interface ShooterProfileState {
  shooterData: ShooterProfile;
  matches: Match[];
  statistics: ShooterStatistics;
  filters: {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
    sport: string;
    division: string;
  };
  loading: boolean;
  error: string | null;
}
```

#### Filter Controls Component
```javascript
// Reusable component for date and category filtering
interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableSports: string[];
  availableDivisions: string[];
}
```

### Backend API Interfaces

#### Shooter Profile Endpoint
```javascript
// GET /api/shooters/:shooterName/profile
// Query parameters: startDate, endDate, sport, division
interface ShooterProfileResponse {
  shooterName: string;
  totalMatches: number;
  dateRange: {
    firstMatch: string;
    lastMatch: string;
  };
  availableSports: string[];
  availableDivisions: string[];
}
```

#### Shooter Matches Endpoint
```javascript
// GET /api/shooters/:shooterName/matches
// Query parameters: startDate, endDate, sport, division, limit, offset
interface ShooterMatchesResponse {
  matches: Array<{
    id: number;
    name: string;
    date: string;
    rangeName: string;
    sport: string;
    division: string;
    score: number;
    time: number;
    placement: number;
    totalParticipants: number;
  }>;
  totalCount: number;
}
```

#### Shooter Statistics Endpoint
```javascript
// GET /api/shooters/:shooterName/statistics
// Query parameters: startDate, endDate, sport, division
interface ShooterStatisticsResponse {
  averageDivisionPercentage: number;
  totalShots: number;
  totalAlphas: number;
  totalCharlies: number;
  totalDeltaes: number;
  totalMisses: number;
  averageTime: number;
  bestScore: number;
  matchCount: number;
  hitFactor: number;
}
```

## Data Models

### Database Schema Extensions

The current database schema supports the shooter profile feature through existing tables:
- `scores` table contains shooter_name, division, score, time
- `matches` table contains match details and dates
- Additional computed fields will be derived from existing data

### Computed Statistics Model
```javascript
// Aggregated statistics calculated from scores table
interface ShooterStatistics {
  // Performance metrics
  averageDivisionPercentage: number;
  averageTime: number;
  bestScore: number;
  worstScore: number;
  
  // Shot breakdown (if available in future PractiScore parsing)
  totalShots: number;
  totalAlphas: number;
  totalCharlies: number;
  totalDeltas: number;
  totalMisses: number;
  totalNoShoots: number;
  
  // Match participation
  totalMatches: number;
  sportsParticipated: string[];
  divisionsParticipated: string[];
  
  // Time period
  dateRange: {
    start: string;
    end: string;
  };
}
```

## Error Handling

### Frontend Error Handling
- **Loading States**: Display loading spinners during data fetching
- **Network Errors**: Show user-friendly error messages for API failures
- **Invalid Shooter**: Handle cases where shooter name doesn't exist
- **Empty Data**: Display appropriate messages when no matches found
- **Filter Validation**: Validate date ranges and filter combinations

### Backend Error Handling
- **Invalid Shooter Name**: Return 404 for non-existent shooters
- **Invalid Date Ranges**: Return 400 for malformed date parameters
- **Database Errors**: Log errors and return 500 with generic message
- **Query Timeouts**: Handle long-running statistical queries gracefully

## Testing Strategy

### Frontend Testing
- **Component Tests**: Test ShooterProfilePage rendering and state management
- **Integration Tests**: Test API integration and data flow
- **User Interaction Tests**: Test filter controls and navigation
- **Responsive Design Tests**: Ensure mobile compatibility

### Backend Testing
- **Unit Tests**: Test shooter service business logic
- **API Tests**: Test all shooter endpoints with various parameters
- **Database Tests**: Test complex aggregation queries
- **Performance Tests**: Test query performance with large datasets

### End-to-End Testing
- **Navigation Flow**: Test header navigation to profile page
- **Shooter Link Flow**: Test clicking shooter names in match details
- **Filter Functionality**: Test date and category filtering
- **Statistics Accuracy**: Verify calculated statistics match expected values

## Performance Considerations

### Database Optimization
- **Indexing**: Add indexes on shooter_name, match dates, and divisions
- **Query Optimization**: Use efficient aggregation queries
- **Caching**: Consider caching frequently accessed shooter statistics
- **Pagination**: Implement pagination for match lists

### Frontend Optimization
- **Lazy Loading**: Load statistics only when needed
- **Debounced Filtering**: Prevent excessive API calls during filter changes
- **Memoization**: Cache computed values in React components
- **Code Splitting**: Lazy load the profile page component

## Security Considerations

### Access Control
- **Authentication**: Require login to view detailed profiles
- **Privacy**: Consider privacy settings for shooter profiles
- **Rate Limiting**: Prevent abuse of statistics endpoints
- **Input Validation**: Sanitize all user inputs and URL parameters

### Data Protection
- **Sensitive Information**: Avoid exposing personal shooter information
- **Query Injection**: Use parameterized queries for all database operations
- **CORS**: Maintain proper CORS configuration for API endpoints