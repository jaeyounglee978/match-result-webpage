const UserRepository = require('../repositories/userRepository');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async deleteUser(id) {
    const result = await this.userRepository.deleteById(id);
    if (result.changes === 0) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async updateUserRole(id, role) {
    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      throw new Error('Invalid role specified');
    }

    const result = await this.userRepository.updateRole(id, role);
    if (result.changes === 0) {
      throw new Error('User not found');
    }
    return { message: 'User role updated successfully' };
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = UserService;