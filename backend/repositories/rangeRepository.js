const BaseRepository = require('./baseRepository');

class RangeRepository extends BaseRepository {
  constructor() {
    super('ranges');
  }

  async create(rangeData) {
    const { name, description } = rangeData;
    const query = `INSERT INTO ranges (name, description) VALUES (?, ?)`;
    return await this.run(query, [name, description]);
  }

  async findByName(name) {
    const query = `SELECT * FROM ranges WHERE name = ?`;
    return await this.get(query, [name]);
  }
}

module.exports = RangeRepository;