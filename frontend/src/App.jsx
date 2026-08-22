import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Employees from "./pages/Employees";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Employee Routes */}
          <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<Profile />} />
          <Route path="/employee/attendance" element={<Attendance />} />
          <Route path="/employee/leave" element={<Leave />} />
          <Route path="/employee/payroll" element={<Payroll />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/analytics" element={<Analytics />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}