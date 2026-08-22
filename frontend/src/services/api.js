import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Member 2 will connect this endpoint
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor for attaching auth tokens
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("dayflow_user") || "{}");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  login: (credentials) => API.post("/auth/login", credentials),
  register: (data) => API.post("/auth/register", data),
  verifyOtp: (code) => API.post("/auth/verify-otp", { code })
};

// Attendance endpoints
export const attendanceService = {
  checkIn: () => API.post("/attendance/check-in"),
  checkOut: () => API.post("/attendance/check-out"),
  getLogs: () => API.get("/attendance/logs")
};

// Leave endpoints
export const leaveService = {
  getLeaves: () => API.get("/leaves"),
  applyLeave: (leaveData) => API.post("/leaves/apply", leaveData),
  updateStatus: (leaveId, status) => API.patch(`/leaves/${leaveId}`, { status })
};

// Payroll endpoints
export const payrollService = {
  getPayslips: () => API.get("/payroll/payslips"),
  getSalaryStructure: () => API.get("/payroll/structure")
};

export default API;