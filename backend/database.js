
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use the path from the environment variable, or a default for local development
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '..', 'data', 'database.sqlite');

// Create the data directory if it doesn't exist
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    createTables();
  }
});

function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin'))
    );
  `;

  const createRangesTable = `
    CREATE TABLE IF NOT EXISTS ranges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );
  `;

  const createMatchesTable = `
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      range_id INTEGER,
      FOREIGN KEY (range_id) REFERENCES ranges (id) ON DELETE SET NULL
    );
  `;

  const createScoresTable = `
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER NOT NULL,
      shooter_name TEXT NOT NULL,
      division TEXT NOT NULL,
      sport TEXT DEFAULT 'IPSC',
      score REAL NOT NULL,
      time REAL NOT NULL,
      placement INTEGER,
      FOREIGN KEY (match_id) REFERENCES matches (id) ON DELETE CASCADE
    );
  `;

  db.serialize(() => {
    db.run(createUsersTable, (err) => {
        if (err) console.error("Error creating users table", err.message);
    });
    db.run(createRangesTable, (err) => {
        if (err) console.error("Error creating ranges table", err.message);
    });
    db.run(createMatchesTable, (err) => {
        if (err) console.error("Error creating matches table", err.message);
    });
    db.run(createScoresTable, (err) => {
        if (err) console.error("Error creating scores table", err.message);
    });
  });
}

module.exports = db;
