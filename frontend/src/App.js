import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import UserLayout from './dashboards/UserLayout';
import AdminLayout from './dashboards/AdminLayout';
import EngineerLayout from './dashboards/EngineerLayout';

// User Pages
import UserHome from './pages/user/UserHome';
import SensorReadings from './pages/user/SensorReadings';
import ReportIssue from './pages/user/ReportIssue';
import MyReports from './pages/user/MyReports';
import UserAlerts from './pages/user/UserAlerts';

// Admin Pages
import AdminHome from './pages/admin/AdminHome';
import ManageUsers from './pages/admin/ManageUsers';
import ManageEngineers from './pages/admin/ManageEngineers';
import AllReports from './pages/admin/AllReports';
import AssignedTasks from './pages/admin/AssignedTasks';
import ResolvedReports from './pages/admin/ResolvedReports';
import AdminAlerts from './pages/admin/AdminAlerts';

// Engineer Pages
import EngineerHome from './pages/engineer/EngineerHome';
import ActiveTasks from './pages/engineer/ActiveTasks';
import ResolvedTasks from './pages/engineer/ResolvedTasks';

import './index.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = React.useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Access denied for role: ${user.role}. Required: ${allowedRoles}`);
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />

          {/* User Routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['User']}>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<UserHome />} />
            <Route path="sensors" element={<SensorReadings />} />
            <Route path="report" element={<ReportIssue />} />
            <Route path="my-reports" element={<MyReports />} />
            <Route path="alerts" element={<UserAlerts />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="engineers" element={<ManageEngineers />} />
            <Route path="reports" element={<AllReports />} />
            <Route path="assigned" element={<AssignedTasks />} />
            <Route path="resolved" element={<ResolvedReports />} />
            <Route path="alerts" element={<AdminAlerts />} />
          </Route>

          {/* Engineer Routes */}
          <Route path="/engineer" element={
            <ProtectedRoute allowedRoles={['Engineer']}>
              <EngineerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<EngineerHome />} />
            <Route path="active" element={<ActiveTasks />} />
            <Route path="resolved" element={<ResolvedTasks />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
