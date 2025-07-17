const db = require('../database');

class ShooterService {
  async getShooterProfile(shooterName, filters = {}) {
    const { startDate, endDate, sport, division } = filters;
    
    // Check if shooter exists
    const shooterExists = await this.checkShooterExists(shooterName);
    if (!shooterExists) {
      throw new Error('Shooter not found');
    }
    
    // Build date filter conditions
    let dateConditions = '';
    const params = [shooterName];
    
    if (startDate) {
      dateConditions += ' AND m.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      dateConditions += ' AND m.date <= ?';
      params.push(endDate);
    }
    if (sport) {
      dateConditions += ' AND s.sport = ?';
      params.push(sport);
    }
    if (division) {
      dateConditions += ' AND s.division = ?';
      params.push(division);
    }
    
    // Get basic profile information
    const profileQuery = `
      SELECT 
        s.shooter_name,
        COUNT(DISTINCT m.id) as totalMatches,
        MIN(m.date) as firstMatch,
        MAX(m.date) as lastMatch
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      WHERE s.shooter_name = ?${dateConditions}
      GROUP BY s.shooter_name
    `;
    
    const profile = await this.queryDatabase(profileQuery, params);
    
    // Get available sports and divisions for this shooter
    const sportsQuery = `
      SELECT DISTINCT s.sport
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      WHERE s.shooter_name = ?${dateConditions}
      ORDER BY s.sport
    `;
    
    const divisionsQuery = `
      SELECT DISTINCT s.division
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      WHERE s.shooter_name = ?${dateConditions}
      ORDER BY s.division
    `;
    
    const sports = await this.queryDatabase(sportsQuery, params);
    const divisions = await this.queryDatabase(divisionsQuery, params);
    
    return {
      shooterName: profile[0]?.shooter_name || shooterName,
      totalMatches: profile[0]?.totalMatches || 0,
      dateRange: {
        firstMatch: profile[0]?.firstMatch || null,
        lastMatch: profile[0]?.lastMatch || null
      },
      availableSports: sports.map(row => row.sport),
      availableDivisions: divisions.map(row => row.division)
    };
  }
  
  async getShooterMatches(shooterName, filters = {}) {
    const { startDate, endDate, sport, division, limit = 50, offset = 0 } = filters;
    
    // Check if shooter exists
    const shooterExists = await this.checkShooterExists(shooterName);
    if (!shooterExists) {
      throw new Error('Shooter not found');
    }
    
    // Build filter conditions
    let conditions = '';
    const params = [shooterName];
    
    if (startDate) {
      conditions += ' AND m.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      conditions += ' AND m.date <= ?';
      params.push(endDate);
    }
    if (sport && sport.trim() !== '') {
      conditions += ' AND LOWER(s.sport) = LOWER(?)';
      params.push(sport.trim());
    }
    if (division && division.trim() !== '') {
      conditions += ' AND LOWER(s.division) = LOWER(?)';
      params.push(division.trim());
    }
    
    // Get matches with pagination - enhanced query with better data
    const matchesQuery = `
      SELECT 
        m.id,
        m.name,
        m.date,
        r.name as rangeName,
        s.sport,
        s.division,
        s.score,
        s.time,
        s.placement,
        (SELECT COUNT(*) FROM scores s2 WHERE s2.match_id = m.id AND LOWER(s2.division) = LOWER(s.division)) as totalParticipants,
        CASE 
          WHEN s.placement = 1 THEN 'Winner'
          WHEN s.placement <= 3 THEN 'Podium'
          WHEN s.placement <= (SELECT COUNT(*) FROM scores s3 WHERE s3.match_id = m.id AND LOWER(s3.division) = LOWER(s.division)) * 0.1 THEN 'Top 10%'
          ELSE 'Participant'
        END as performanceCategory
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      JOIN ranges r ON m.range_id = r.id
      WHERE s.shooter_name = ?${conditions}
      ORDER BY m.date DESC, m.id DESC
      LIMIT ? OFFSET ?
    `;
    
    params.push(limit, offset);
    const matches = await this.queryDatabase(matchesQuery, params);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      WHERE s.shooter_name = ?${conditions}
    `;
    
    const countParams = params.slice(0, -2); // Remove limit and offset
    const countResult = await this.queryDatabase(countQuery, countParams);
    
    // Format the matches data
    const formattedMatches = matches.map(match => ({
      id: match.id,
      name: match.name,
      date: match.date,
      rangeName: match.rangeName,
      sport: match.sport,
      division: match.division,
      score: parseFloat(match.score) || 0,
      time: parseFloat(match.time) || 0,
      placement: parseInt(match.placement) || 0,
      totalParticipants: parseInt(match.totalParticipants) || 0,
      performanceCategory: match.performanceCategory
    }));
    
    return {
      matches: formattedMatches,
      totalCount: countResult[0]?.total || 0,
      pagination: {
        limit: limit,
        offset: offset,
        hasMore: (offset + limit) < (countResult[0]?.total || 0)
      }
    };
  }
  
  async getShooterStatistics(shooterName, filters = {}) {
    const { startDate, endDate, sport, division } = filters;
    
    // Check if shooter exists
    const shooterExists = await this.checkShooterExists(shooterName);
    if (!shooterExists) {
      throw new Error('Shooter not found');
    }
    
    // Build filter conditions
    let conditions = '';
    const params = [shooterName];
    
    if (startDate) {
      conditions += ' AND m.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      conditions += ' AND m.date <= ?';
      params.push(endDate);
    }
    if (sport) {
      conditions += ' AND s.sport = ?';
      params.push(sport);
    }
    if (division) {
      conditions += ' AND s.division = ?';
      params.push(division);
    }
    
    // Calculate comprehensive statistics based on current schema
    const statsQuery = `
      SELECT 
        AVG(s.score) as averageScore,
        AVG(s.time) as averageTime,
        MAX(s.score) as bestScore,
        MIN(s.score) as worstScore,
        COUNT(*) as totalMatches,
        MIN(m.date) as startDate,
        MAX(m.date) as endDate
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      WHERE s.shooter_name = ?${conditions}
    `;
    
    const stats = await this.queryDatabase(statsQuery, params);
    const result = stats[0] || {};
    
    // Get sports and divisions participated in
    const sportsQuery = `
      SELECT DISTINCT s.sport
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      WHERE s.shooter_name = ?${conditions}
      ORDER BY s.sport
    `;
    
    const divisionsQuery = `
      SELECT DISTINCT s.division
      FROM scores s
      JOIN matches m ON s.match_id = m.id
      WHERE s.shooter_name = ?${conditions}
      ORDER BY s.division
    `;
    
    const sports = await this.queryDatabase(sportsQuery, params);
    const divisions = await this.queryDatabase(divisionsQuery, params);
    
    return {
      averageDivisionPercentage: result.averageScore || 0, // Using average score as proxy for now
      averageTime: result.averageTime || 0,
      bestScore: result.bestScore || 0,
      worstScore: result.worstScore || 0,
      totalShots: 0, // Not available in current schema
      totalAlphas: 0, // Not available in current schema
      totalCharlies: 0, // Not available in current schema
      totalDeltas: 0, // Not available in current schema
      totalMisses: 0, // Not available in current schema
      totalNoShoots: 0, // Not available in current schema
      totalMatches: result.totalMatches || 0,
      sportsParticipated: sports.map(row => row.sport),
      divisionsParticipated: divisions.map(row => row.division),
      dateRange: {
        start: result.startDate || null,
        end: result.endDate || null
      }
    };
  }
  
  async checkShooterExists(shooterName) {
    const query = 'SELECT 1 FROM scores WHERE shooter_name = ? LIMIT 1';
    const result = await this.queryDatabase(query, [shooterName]);
    return result.length > 0;
  }
  
  queryDatabase(query, params = []) {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = ShooterService;