const BaseRepository = require('./baseRepository');

class ScoreRepository extends BaseRepository {
  constructor() {
    super('scores');
  }

  async create(scoreData) {
    const { match_id, shooter_name, division, score, time } = scoreData;
    const query = `INSERT INTO scores (match_id, shooter_name, division, score, time) VALUES (?, ?, ?, ?, ?)`;
    return await this.run(query, [match_id, shooter_name, division, score, time]);
  }

  async createBatch(scoresData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO scores (match_id, shooter_name, division, score, time) VALUES (?, ?, ?, ?, ?)`;
      const stmt = this.db.prepare(query);
      
      let completed = 0;
      const total = scoresData.length;
      
      if (total === 0) {
        resolve([]);
        return;
      }
      
      scoresData.forEach((scoreData) => {
        const { match_id, shooter_name, division, score, time } = scoreData;
        stmt.run([match_id, shooter_name, division, score, time], (err) => {
          if (err) {
            stmt.finalize();
            reject(err);
            return;
          }
          
          completed++;
          if (completed === total) {
            stmt.finalize((finalizeErr) => {
              if (finalizeErr) {
                reject(finalizeErr);
              } else {
                resolve(scoresData);
              }
            });
          }
        });
      });
    });
  }

  async findByMatchId(matchId) {
    const query = `SELECT * FROM scores WHERE match_id = ?`;
    return await this.all(query, [matchId]);
  }
}

module.exports = ScoreRepository;