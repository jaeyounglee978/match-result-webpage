const ShooterService = require('../services/shooterService');

const shooterService = new ShooterService();

// Validation helper
const validateShooterName = (shooterName) => {
  if (!shooterName || typeof shooterName !== 'string' || shooterName.trim().length === 0) {
    throw new Error('Shooter name is required and must be a non-empty string');
  }
  return shooterName.trim();
};

exports.getShooterProfile = async (req, res) => {
  try {
    const { shooterName } = req.params;
    const { startDate, endDate, sport, division } = req.query;
    
    // Validate shooter name parameter
    if (!shooterName || typeof shooterName !== 'string' || shooterName.trim().length === 0) {
      return res.status(400).json({ message: 'Shooter name is required and must be a non-empty string' });
    }
    
    // Sanitize shooter name (remove extra whitespace)
    const sanitizedShooterName = shooterName.trim();
    
    const profile = await shooterService.getShooterProfile(sanitizedShooterName, {
      startDate,
      endDate,
      sport,
      division
    });
    
    res.status(200).json(profile);
  } catch (error) {
    if (error.message === 'Shooter not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error fetching shooter profile', error: error.message });
  }
};

exports.getShooterMatches = async (req, res) => {
  try {
    const { shooterName } = req.params;
    const { startDate, endDate, sport, division, limit, offset } = req.query;
    
    // Validate shooter name parameter
    if (!shooterName || typeof shooterName !== 'string' || shooterName.trim().length === 0) {
      return res.status(400).json({ message: 'Shooter name is required and must be a non-empty string' });
    }
    
    // Sanitize shooter name (remove extra whitespace)
    const sanitizedShooterName = shooterName.trim();
    
    // Validate and parse pagination parameters
    let parsedLimit = 50; // default
    let parsedOffset = 0; // default
    
    if (limit !== undefined) {
      parsedLimit = parseInt(limit);
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return res.status(400).json({ message: 'Limit must be a number between 1 and 100' });
      }
    }
    
    if (offset !== undefined) {
      parsedOffset = parseInt(offset);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({ message: 'Offset must be a non-negative number' });
      }
    }
    
    // Validate date format if provided
    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({ message: 'Start date must be in YYYY-MM-DD format' });
    }
    
    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({ message: 'End date must be in YYYY-MM-DD format' });
    }
    
    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before or equal to end date' });
    }
    
    const matches = await shooterService.getShooterMatches(sanitizedShooterName, {
      startDate,
      endDate,
      sport,
      division,
      limit: parsedLimit,
      offset: parsedOffset
    });
    
    res.status(200).json(matches);
  } catch (error) {
    if (error.message === 'Shooter not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error fetching shooter matches', error: error.message });
  }
};

// Helper function to validate date format
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && dateString === date.toISOString().split('T')[0];
};

exports.getShooterStatistics = async (req, res) => {
  try {
    const { shooterName } = req.params;
    const { startDate, endDate, sport, division } = req.query;
    
    const statistics = await shooterService.getShooterStatistics(shooterName, {
      startDate,
      endDate,
      sport,
      division
    });
    
    res.status(200).json(statistics);
  } catch (error) {
    if (error.message === 'Shooter not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error fetching shooter statistics', error: error.message });
  }
};