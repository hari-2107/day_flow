import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { TrendingUp, Calendar, Users, BarChart3 } from "lucide-react";

const attendanceData = [
  { month: "Jan", rate: 92 },
  { month: "Feb", rate: 94 },
  { month: "Mar", rate: 91 },
  { month: "Apr", rate: 95 },
  { month: "May", rate: 89 },
  { month: "Jun", rate: 96 },
  { month: "Jul", rate: 94 },
  { month: "Aug", rate: 95 },
];

const leaveData = [
  { department: "Engineering", paid: 12, sick: 5 },
  { department: "Design", paid: 8, sick: 3 },
  { department: "Marketing", paid: 6, sick: 2 },
  { department: "HR", paid: 4, sick: 1 },
  { department: "Sales", paid: 9, sick: 4 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("Monthly");

  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={{ name: "HR Admin", role: "HR Officer" }} />
      <main className="dashboard-main">
        <Navbar title="HR Analytics & Reports" subtitle="Organization trends, attendance, and leave statistics" />

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Avg. Attendance Rate</span>
                <div className="stat-icon success"><TrendingUp size={20} /></div>
              </div>
              <div className="stat-card-value">94.8%</div>
              <div className="stat-card-footer">+2.3% from last month</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Total Leaves Taken</span>
                <div className="stat-icon warning"><Calendar size={20} /></div>
              </div>
              <div className="stat-card-value">50 Days</div>
              <div className="stat-card-footer">Company-wide in August</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">New Hires</span>
                <div className="stat-icon"><Users size={20} /></div>
              </div>
              <div className="stat-card-value">6</div>
              <div className="stat-card-footer">Joined this quarter</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Overtime Hours</span>
                <div className="stat-icon"><BarChart3 size={20} /></div>
              </div>
              <div className="stat-card-value">128 hrs</div>
              <div className="stat-card-footer">Across all engineering teams</div>
            </div>
          </div>

          <div className="analytics-grid">
            {}
            <div className="chart-card">
              <div className="card-header" style={{ border: "none", padding: "0 0 16px 0" }}>
                <h3>Monthly Attendance Trends (%)</h3>
              </div>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      formatter={(value) => [`${value}%`, "Attendance"]}
                    />
                    <Area type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {}
            <div className="chart-card">
              <div className="card-header" style={{ border: "none", padding: "0 0 16px 0" }}>
                <h3>Department Leave Distribution (Days)</h3>
              </div>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    />
                    <Legend />
                    <Bar dataKey="paid" name="Paid Leave" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sick" name="Sick Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}