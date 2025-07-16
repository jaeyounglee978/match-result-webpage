const db = require('../database');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  // Generic method to run a query
  run(query, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database connection not available'));
        return;
      }
      
      this.db.run(query, params, function(err) {
        if (err) {
          console.error('Database query error:', err.message, 'Query:', query);
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Generic method to get a single row
  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Generic method to get all rows
  all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Generic method to find by ID
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return await this.get(query, [id]);
  }

  // Generic method to find all
  async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    return await this.all(query);
  }

  // Generic method to delete by ID
  async deleteById(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await this.run(query, [id]);
  }
}

module.exports = BaseRepository;