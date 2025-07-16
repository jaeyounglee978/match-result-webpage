const db = require('../database');

exports.createRange = (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Please provide a name for the range' });
  }

  const query = `INSERT INTO ranges (name, description) VALUES (?, ?)`;
  db.run(query, [name, description], function(err) {
    if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Range name already exists' });
        }
      return res.status(500).json({ message: 'Error creating range', error: err.message });
    }
    res.status(201).json({ message: 'Range created successfully', rangeId: this.lastID });
  });
};

exports.getRanges = (req, res) => {
  const query = `SELECT * FROM ranges`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching ranges', error: err.message });
    }
    res.status(200).json(rows);
  });
};
