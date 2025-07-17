const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const rangeRoutes = require('./routes/ranges');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const shooterRoutes = require('./routes/shooters');

app.use('/api/auth', authRoutes);
app.use('/api/ranges', rangeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/shooters', shooterRoutes);




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
