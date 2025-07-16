const RangeService = require('../services/rangeService');

const rangeService = new RangeService();

exports.createRange = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Please provide a name for the range' });
    }

    const result = await rangeService.createRange(name, description);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Range name already exists') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating range', error: error.message });
  }
};

exports.getRanges = async (req, res) => {
  try {
    const ranges = await rangeService.getAllRanges();
    res.status(200).json(ranges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ranges', error: error.message });
  }
};
