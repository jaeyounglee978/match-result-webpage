import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MatchListPage from './pages/MatchListPage';
import MatchDetailPage from './pages/MatchDetailPage';
import UploadPage from './pages/UploadPage';
import AdminUserManagementPage from './pages/Admin/UserManagementPage';
import AdminRangeManagementPage from './pages/Admin/RangeManagementPage';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<MatchListPage />} />
        <Route path="/matches/:id" element={<MatchDetailPage />} />
        <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute adminOnly={true}><AdminUserManagementPage /></PrivateRoute>} />
        <Route path="/admin/ranges" element={<PrivateRoute adminOnly={true}><AdminRangeManagementPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;