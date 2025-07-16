const MatchRepository = require('../repositories/matchRepository');
const ScoreRepository = require('../repositories/scoreRepository');
const pscParser = require('./pscParser');

class MatchService {
  constructor() {
    this.matchRepository = new MatchRepository();
    this.scoreRepository = new ScoreRepository();
  }

  async uploadMatch(name, date, rangeId, filePath) {
    try {
      // Parse the PSC file
      const scores = await pscParser.parse(filePath);

      // Create the match
      const matchResult = await this.matchRepository.create({
        name,
        date,
        range_id: rangeId
      });

      const matchId = matchResult.lastID;

      // Prepare scores data with match_id
      const scoresData = scores.map(score => ({
        match_id: matchId,
        shooter_name: score.shooter_name,
        division: score.division,
        score: score.score,
        time: score.time
      }));

      // Save scores in batch
      await this.scoreRepository.createBatch(scoresData);

      return { 
        matchId, 
        message: 'Match uploaded successfully',
        scoresCount: scoresData.length
      };
    } catch (error) {
      throw new Error(`Error processing match upload: ${error.message}`);
    }
  }

  async getMatches(rangeId = null) {
    return await this.matchRepository.findAllWithRange(rangeId);
  }

  async getMatchById(id) {
    const match = await this.matchRepository.findByIdWithRange(id);
    if (!match) {
      throw new Error('Match not found');
    }

    const scores = await this.scoreRepository.findByMatchId(id);
    return { ...match, scores };
  }

  async deleteMatch(id) {
    const result = await this.matchRepository.deleteById(id);
    if (result.changes === 0) {
      throw new Error('Match not found');
    }
    return { message: 'Match deleted successfully' };
  }
}

module.exports = MatchService;