// Mock the shooter service before importing the controller
const mockGetShooterProfile = jest.fn();
const mockGetShooterMatches = jest.fn();
const mockGetShooterStatistics = jest.fn();

jest.mock('../services/shooterService', () => {
  return jest.fn().mockImplementation(() => ({
    getShooterProfile: mockGetShooterProfile,
    getShooterMatches: mockGetShooterMatches,
    getShooterStatistics: mockGetShooterStatistics
  }));
});

const shooterController = require('../controllers/shooterController');

describe('Shooter Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      params: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getShooterProfile', () => {
    it('should return shooter profile successfully', async () => {
      const mockProfile = {
        shooterName: 'John Doe',
        totalMatches: 5,
        dateRange: {
          firstMatch: '2024-01-01',
          lastMatch: '2024-12-31'
        },
        availableSports: ['IPSC'],
        availableDivisions: ['Production']
      };

      req.params.shooterName = 'John Doe';
      mockGetShooterProfile.mockResolvedValue(mockProfile);

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfile);
      expect(mockGetShooterProfile).toHaveBeenCalledWith('John Doe', {
        startDate: undefined,
        endDate: undefined,
        sport: undefined,
        division: undefined
      });
    });

    it('should return shooter profile with query filters', async () => {
      const mockProfile = {
        shooterName: 'John Doe',
        totalMatches: 2,
        dateRange: {
          firstMatch: '2024-06-01',
          lastMatch: '2024-12-31'
        },
        availableSports: ['IPSC'],
        availableDivisions: ['Production']
      };

      req.params.shooterName = 'John Doe';
      req.query = {
        startDate: '2024-06-01',
        endDate: '2024-12-31',
        sport: 'IPSC',
        division: 'Production'
      };
      mockGetShooterProfile.mockResolvedValue(mockProfile);

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfile);
      expect(mockGetShooterProfile).toHaveBeenCalledWith('John Doe', {
        startDate: '2024-06-01',
        endDate: '2024-12-31',
        sport: 'IPSC',
        division: 'Production'
      });
    });

    it('should return 400 for empty shooter name', async () => {
      req.params.shooterName = '   ';

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Shooter name is required and must be a non-empty string'
      });
      expect(mockGetShooterProfile).not.toHaveBeenCalled();
    });

    it('should return 400 for undefined shooter name', async () => {
      req.params.shooterName = undefined;

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Shooter name is required and must be a non-empty string'
      });
      expect(mockGetShooterProfile).not.toHaveBeenCalled();
    });

    it('should return 404 when shooter not found', async () => {
      req.params.shooterName = 'NonExistent Shooter';
      mockGetShooterProfile.mockRejectedValue(new Error('Shooter not found'));

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Shooter not found'
      });
      expect(mockGetShooterProfile).toHaveBeenCalledWith('NonExistent Shooter', {
        startDate: undefined,
        endDate: undefined,
        sport: undefined,
        division: undefined
      });
    });

    it('should return 500 for database errors', async () => {
      req.params.shooterName = 'John Doe';
      mockGetShooterProfile.mockRejectedValue(new Error('Database connection failed'));

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching shooter profile',
        error: 'Database connection failed'
      });
    });

    it('should sanitize shooter name by trimming whitespace', async () => {
      const mockProfile = {
        shooterName: 'John Doe',
        totalMatches: 5,
        dateRange: {
          firstMatch: '2024-01-01',
          lastMatch: '2024-12-31'
        },
        availableSports: ['IPSC'],
        availableDivisions: ['Production']
      };

      req.params.shooterName = '  John Doe  ';
      mockGetShooterProfile.mockResolvedValue(mockProfile);

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfile);
      expect(mockGetShooterProfile).toHaveBeenCalledWith('John Doe', {
        startDate: undefined,
        endDate: undefined,
        sport: undefined,
        division: undefined
      });
    });

    it('should handle special characters in shooter name', async () => {
      const mockProfile = {
        shooterName: 'John O\'Connor-Smith',
        totalMatches: 3,
        dateRange: {
          firstMatch: '2024-01-01',
          lastMatch: '2024-12-31'
        },
        availableSports: ['IPSC'],
        availableDivisions: ['Production']
      };

      req.params.shooterName = 'John O\'Connor-Smith';
      mockGetShooterProfile.mockResolvedValue(mockProfile);

      await shooterController.getShooterProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfile);
      expect(mockGetShooterProfile).toHaveBeenCalledWith('John O\'Connor-Smith', {
        startDate: undefined,
        endDate: undefined,
        sport: undefined,
        division: undefined
      });
    });
  });
});