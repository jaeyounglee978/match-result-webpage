const BaseRepository = require('./baseRepository');

class MatchRepository extends BaseRepository {
  constructor() {
    super('matches');
  }

  async create(matchData) {
    const { name, date, range_id } = matchData;
    const query = `INSERT INTO matches (name, date, range_id) VALUES (?, ?, ?)`;
    return await this.run(query, [name, date, range_id]);
  }

  async findAllWithRange(rangeId = null) {
    let query = `SELECT m.id, m.name, m.date, r.name as range_name 
                 FROM matches m 
                 JOIN ranges r ON m.range_id = r.id`;
    const params = [];
    
    if (rangeId) {
      query += ` WHERE m.range_id = ?`;
      params.push(rangeId);
    }
    
    return await this.all(query, params);
  }

  async findByIdWithRange(id) {
    const query = `SELECT m.id, m.name, m.date, r.name as range_name 
                   FROM matches m 
                   JOIN ranges r ON m.range_id = r.id 
                   WHERE m.id = ?`;
    return await this.get(query, [id]);
  }
}

module.exports = MatchRepository;