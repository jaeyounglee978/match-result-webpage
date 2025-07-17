const ShooterService = require('../services/shooterService');
const { setupTestDatabase, cleanupTestDatabase, getTestDatabase } = require('../test-setup');

describe('Shooter Service Integration Tests', () => {
  let shooterService;
  let testDb;

  beforeEach(async () => {
    testDb = getTestDatabase();
    shooterService = new ShooterService();
    
    // Insert test data
    await insertTestData();
  });

  const insertTestData = () => {
    return new Promise((resolve, reject) => {
      const insertQueries = `
        INSERT INTO ranges (id, name, description) VALUES 
          (1, 'Test Range 1', 'First test range'),
          (2, 'Test Range 2', 'Second test range');
        
        INSERT INTO matches (id, name, date, range_id) VALUES 
          (1, 'Match 1', '2024-01-15', 1),
          (2, 'Match 2', '2024-06-20', 1),
          (3, 'Match 3', '2024-12-10', 2);
        
        INSERT INTO scores (match_id, shooter_name, division, score, time) VALUES 
          (1, 'John Doe', 'Production', 85.5, 120.5),
          (1, 'Jane Smith', 'Production', 92.3, 110.2),
          (2, 'John Doe', 'Production', 88.7, 115.8),
          (2, 'Jane Smith', 'Limited', 90.1, 108.9),
          (3, 'John Doe', 'Production', 91.2, 118.3),
          (3, 'Bob Wilson', 'Open', 95.8, 105.1);
      `;
      
      testDb.exec(insertQueries, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  describe('getShooterProfile', () => {
    it('should return profile for existing shooter', async () => {
      const profile = await shooterService.getShooterProfile('John Doe');
      
      expect(profile).toEqual({
        shooterName: 'John Doe',
        totalMatches: 3,
        dateRange: {
          firstMatch: '2024-01-15',
          lastMatch: '2024-12-10'
        },
        availableSports: [],
        availableDivisions: ['Production']
      });
    });

    it('should return profile with date filtering', async () => {
      const profile = await shooterService.getShooterProfile('John Doe', {
        startDate: '2024-06-01',
        endDate: '2024-12-31'
      });
      
      expect(profile).toEqual({
        shooterName: 'John Doe',
        totalMatches: 2,
        dateRange: {
          firstMatch: '2024-06-20',
          lastMatch: '2024-12-10'
        },
        availableSports: [],
        availableDivisions: ['Production']
      });
    });

    it('should return profile with division filtering', async () => {
      const profile = await shooterService.getShooterProfile('Jane Smith', {
        division: 'Production'
      });
      
      expect(profile).toEqual({
        shooterName: 'Jane Smith',
        totalMatches: 1,
        dateRange: {
          firstMatch: '2024-01-15',
          lastMatch: '2024-01-15'
        },
        availableSports: [],
        availableDivisions: ['Production']
      });
    });

    it('should throw error for non-existent shooter', async () => {
      await expect(shooterService.getShooterProfile('Non Existent'))
        .rejects.toThrow('Shooter not found');
    });

    it('should return empty profile for shooter with no matches in date range', async () => {
      const profile = await shooterService.getShooterProfile('John Doe', {
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });
      
      expect(profile).toEqual({
        shooterName: 'John Doe',
        totalMatches: 0,
        dateRange: {
          firstMatch: null,
          lastMatch: null
        },
        availableSports: [],
        availableDivisions: []
      });
    });
  });

  describe('checkShooterExists', () => {
    it('should return true for existing shooter', async () => {
      const exists = await shooterService.checkShooterExists('John Doe');
      expect(exists).toBe(true);
    });

    it('should return false for non-existent shooter', async () => {
      const exists = await shooterService.checkShooterExists('Non Existent');
      expect(exists).toBe(false);
    });

    it('should be case sensitive', async () => {
      const exists = await shooterService.checkShooterExists('john doe');
      expect(exists).toBe(false);
    });
  });

  describe('queryDatabase', () => {
    it('should execute simple query successfully', async () => {
      const result = await shooterService.queryDatabase('SELECT COUNT(*) as count FROM scores');
      expect(result).toHaveLength(1);
      expect(result[0].count).toBe(6);
    });

    it('should execute parameterized query successfully', async () => {
      const result = await shooterService.queryDatabase(
        'SELECT * FROM scores WHERE shooter_name = ?', 
        ['John Doe']
      );
      expect(result).toHaveLength(3);
      expect(result[0].shooter_name).toBe('John Doe');
    });

    it('should handle query errors', async () => {
      await expect(shooterService.queryDatabase('SELECT * FROM non_existent_table'))
        .rejects.toThrow();
    });
  });
});