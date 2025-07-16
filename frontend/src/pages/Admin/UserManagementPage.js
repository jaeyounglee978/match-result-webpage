import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await api.delete(`/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user', error);
        }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
        await api.put(`/users/${userId}/role`, { role: newRole });
        fetchUsers();
    } catch (error) {
        console.error('Error updating user role', error);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagementPage;
