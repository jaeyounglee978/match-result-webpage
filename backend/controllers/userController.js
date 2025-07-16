const db = require('../database');

exports.getUsers = (req, res) => {
  const query = `SELECT id, email, role FROM users`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
    res.status(200).json(rows);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM users WHERE id = ?`;
  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
    if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

exports.updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  const query = `UPDATE users SET role = ? WHERE id = ?`;
  db.run(query, [role, id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating user role', error: err.message });
    }
    if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User role updated successfully' });
  });
};
