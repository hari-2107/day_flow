import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";


import EmployeeDashboard from "./pages/EmployeeDashboard";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";


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
          {}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />

          {}
          <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE", "ADMIN"]} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/profile" element={<Profile />} />
            <Route path="/employee/attendance" element={<Attendance />} />
            <Route path="/employee/leave" element={<Leave />} />
            <Route path="/employee/payroll" element={<Payroll />} />
            <Route path="/employee/notifications" element={<Notifications />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/leaves" element={<AdminLeaves />} />
            <Route path="/admin/payroll" element={<Payroll />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          {}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}