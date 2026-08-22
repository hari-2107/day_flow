import API from "../api/axios";


export const authService = {
  signin: (credentials) => API.post("/auth/signin", credentials),
  signup: (data) => API.post("/auth/signup", data),
  verifyEmail: (code, email) => API.post("/auth/verify-email", { code, email }),
  
  login: (credentials) => API.post("/auth/signin", credentials),
  register: (data) => API.post("/auth/signup", data)
};


export const profileService = {
  getProfile: () => API.get("/profile/me"),
  updateProfile: (data) => API.patch("/profile/me", data)
};


export const adminService = {
  getEmployees: () => API.get("/admin/employees"),
  updateEmployee: (id, data) => API.put(`/admin/employees/${id}`, data),
  getAttendance: () => API.get("/admin/attendance"),
  getLeaves: () => API.get("/admin/leaves"),
  getPayroll: () => API.get("/admin/payroll"),
  updatePayroll: (userId, data) => API.put(`/admin/payroll/${userId}`, data)
};


export const attendanceService = {
  checkIn: () => API.post("/attendance/check-in"),
  checkOut: () => API.post("/attendance/check-out"),
  getMyAttendance: () => API.get("/attendance/my"),
  getAdminAttendance: () => API.get("/admin/attendance")
};


export const leaveService = {
  applyLeave: (leaveData) => API.post("/leaves/apply", leaveData),
  getMyLeaves: () => API.get("/leaves/my"),
  getAdminLeaves: () => API.get("/admin/leaves"),
  updateStatus: (leaveId, status, comments) => API.patch(`/leaves/${leaveId}/status`, { status, comments })
};


export const payrollService = {
  getMyPayroll: () => API.get("/payroll/me"),
  getAdminPayroll: () => API.get("/admin/payroll"),
  updatePayroll: (userId, data) => API.put(`/admin/payroll/${userId}`, data)
};

export default API;