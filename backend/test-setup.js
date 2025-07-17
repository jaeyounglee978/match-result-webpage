const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Global test database instance
let testDb = null;

// Database setup utility for tests
const setupTestDatabase = () => {
  return new Promise((resolve, reject) => {
    // Create in-memory database
    testDb = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Create tables for testing
      const createTables = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS ranges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS matches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          date TEXT NOT NULL,
          range_id INTEGER,
          file_path TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (range_id) REFERENCES ranges (id)
        );
        
        CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          match_id INTEGER,
          shooter_name TEXT NOT NULL,
          division TEXT,
          score REAL,
          time REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (match_id) REFERENCES matches (id)
        );
      `;
      
      testDb.exec(createTables, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(testDb);
        }
      });
    });
  });
};

// Database cleanup utility
const cleanupTestDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!testDb) {
      resolve();
      return;
    }
    
    const cleanupSql = `
      DELETE FROM scores;
      DELETE FROM matches;
      DELETE FROM ranges;
      DELETE FROM users;
    `;
    
    testDb.exec(cleanupSql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Close test database
const closeTestDatabase = () => {
  return new Promise((resolve) => {
    if (testDb) {
      testDb.close((err) => {
        if (err) {
          console.error('Error closing test database:', err);
        }
        testDb = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Get test database instance
const getTestDatabase = () => testDb;

// Export utilities
module.exports = {
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase,
  getTestDatabase
};

// Global setup and teardown
beforeAll(async () => {
  await setupTestDatabase();
});

afterEach(async () => {
  await cleanupTestDatabase();
});

afterAll(async () => {
  await closeTestDatabase();
});