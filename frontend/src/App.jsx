import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

/* Employee Portal Pages */
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

/* Admin Portal Pages */
import AdminDashboard from "./pages/AdminDashboard";
import Employees from "./pages/Employees";
import AdminAttendance from "./pages/AdminAttendance";
import AdminLeaves from "./pages/AdminLeaves";
import AdminNotifications from "./pages/AdminNotifications";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Root Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />
          
          {/* Fallback for general notification link */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<Profile />} />
          <Route path="/employee/attendance" element={<Attendance />} />
          <Route path="/employee/leave" element={<Leave />} />
          <Route path="/employee/payroll" element={<Payroll />} />
          <Route path="/employee/notifications" element={<Notifications />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/leaves" element={<AdminLeaves />} />
          <Route path="/admin/payroll" element={<Payroll />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/analytics" element={<Analytics />} />

          {/* Wildcard */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}