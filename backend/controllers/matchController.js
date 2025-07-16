const MatchService = require('../services/matchService');

const matchService = new MatchService();

exports.uploadMatch = async (req, res) => {
    try {
        const { name, date, range_id } = req.body;
        const file = req.file;

        if (!name || !date || !range_id || !file) {
            return res.status(400).json({ message: 'Please provide match name, date, range, and a file' });
        }

        const result = await matchService.uploadMatch(name, date, range_id, file.path);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading match', error: error.message });
    }
};

exports.getMatches = async (req, res) => {
    try {
        const { range_id } = req.query;
        const matches = await matchService.getMatches(range_id);
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching matches', error: error.message });
    }
};

exports.getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await matchService.getMatchById(id);
        res.status(200).json(match);
    } catch (error) {
        if (error.message === 'Match not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error fetching match details', error: error.message });
    }
};

exports.deleteMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await matchService.deleteMatch(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'Match not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error deleting match', error: error.message });
    }
};
