const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async create(userData) {
    const { email, password_hash, role = 'user' } = userData;
    const query = `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`;
    return await this.run(query, [email, password_hash, role]);
  }

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    return await this.get(query, [email]);
  }

  async updateRole(id, role) {
    const query = `UPDATE users SET role = ? WHERE id = ?`;
    return await this.run(query, [role, id]);
  }

  async getAllUsers() {
    const query = `SELECT id, email, role FROM users`;
    return await this.all(query);
  }
}

module.exports = UserRepository;