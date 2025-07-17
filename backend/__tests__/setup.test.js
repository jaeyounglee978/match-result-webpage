const { getTestDatabase } = require('../test-setup');

describe('Test Infrastructure Setup', () => {
  test('should have test database available', () => {
    const db = getTestDatabase();
    expect(db).toBeDefined();
    expect(db).not.toBeNull();
  });

  test('should be able to run basic database query', (done) => {
    const db = getTestDatabase();
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
      expect(err).toBeNull();
      expect(row).toBeDefined();
      expect(row.name).toBe('users');
      done();
    });
  });

  test('should have all required tables created', (done) => {
    const db = getTestDatabase();
    const expectedTables = ['users', 'ranges', 'matches', 'scores'];
    
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
      expect(err).toBeNull();
      const tableNames = rows.map(row => row.name);
      
      expectedTables.forEach(tableName => {
        expect(tableNames).toContain(tableName);
      });
      
      done();
    });
  });
});