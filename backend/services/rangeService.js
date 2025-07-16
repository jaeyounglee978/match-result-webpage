const RangeRepository = require('../repositories/rangeRepository');

class RangeService {
  constructor() {
    this.rangeRepository = new RangeRepository();
  }

  async createRange(name, description) {
    // Check if range name already exists
    const existingRange = await this.rangeRepository.findByName(name);
    if (existingRange) {
      throw new Error('Range name already exists');
    }

    const result = await this.rangeRepository.create({ name, description });
    return { rangeId: result.lastID, message: 'Range created successfully' };
  }

  async getAllRanges() {
    return await this.rangeRepository.findAll();
  }

  async getRangeById(id) {
    const range = await this.rangeRepository.findById(id);
    if (!range) {
      throw new Error('Range not found');
    }
    return range;
  }

  async deleteRange(id) {
    const result = await this.rangeRepository.deleteById(id);
    if (result.changes === 0) {
      throw new Error('Range not found');
    }
    return { message: 'Range deleted successfully' };
  }
}

module.exports = RangeService;