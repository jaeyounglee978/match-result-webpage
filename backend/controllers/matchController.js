const db = require('../database');
const pscParser = require('../services/pscParser');

exports.uploadMatch = async (req, res) => {
    const { name, date, range_id } = req.body;
    const file = req.file;

    if (!name || !date || !range_id || !file) {
        return res.status(400).json({ message: 'Please provide match name, date, range, and a file' });
    }

    try {
        // TODO: Implement the actual parsing logic in pscParser.js
        const scores = await pscParser.parse(file.path);

        db.serialize(() => {
            const matchQuery = `INSERT INTO matches (name, date, range_id) VALUES (?, ?, ?)`;
            db.run(matchQuery, [name, date, range_id], function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Error creating match', error: err.message });
                }
                const match_id = this.lastID;
                const scoreQuery = `INSERT INTO scores (match_id, shooter_name, division, score, time) VALUES (?, ?, ?, ?, ?)`;
                const stmt = db.prepare(scoreQuery);
                for (const score of scores) {
                    stmt.run(match_id, score.shooter_name, score.division, score.score, score.time);
                }
                stmt.finalize((err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving scores', error: err.message });
                    }
                    res.status(201).json({ message: 'Match uploaded successfully', matchId: match_id });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error parsing file', error: error.message });
    }
};

exports.getMatches = (req, res) => {
    const { range_id } = req.query;
    let query = `SELECT m.id, m.name, m.date, r.name as range_name FROM matches m JOIN ranges r ON m.range_id = r.id`;
    const params = [];
    if (range_id) {
        query += ` WHERE m.range_id = ?`;
        params.push(range_id);
    }
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching matches', error: err.message });
        }
        res.status(200).json(rows);
    });
};

exports.getMatchById = (req, res) => {
    const { id } = req.params;
    const matchQuery = `SELECT m.id, m.name, m.date, r.name as range_name FROM matches m JOIN ranges r ON m.range_id = r.id WHERE m.id = ?`;
    db.get(matchQuery, [id], (err, match) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching match details', error: err.message });
        }
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        const scoresQuery = `SELECT * FROM scores WHERE match_id = ?`;
        db.all(scoresQuery, [id], (err, scores) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching scores', error: err.message });
            }
            res.status(200).json({ ...match, scores });
        });
    });
};

exports.deleteMatch = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM matches WHERE id = ?`;
    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting match', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.status(200).json({ message: 'Match deleted successfully' });
    });
};
