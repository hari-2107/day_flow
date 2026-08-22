import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

export default function Analytics() {
  return (
    <div className="dashboard-layout">
      <Sidebar role="Admin" user={{ name: "HR Admin", role: "HR Officer" }} />
      <main className="dashboard-main">
        <Navbar title="HR Analytics & Reports" subtitle="Organization trends, attendance, and leave statistics" />

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Avg. Attendance</span>
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
              <div className="stat-card-value">42 Days</div>
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
                <span className="stat-card-label">Overtime Logged</span>
                <div className="stat-icon"><BarChart3 size={20} /></div>
              </div>
              <div className="stat-card-value">128 hrs</div>
              <div className="stat-card-footer">Across all teams</div>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="chart-card">
              <h3>Monthly Attendance Trends</h3>
              <div className="empty-state">
                <div className="empty-state-icon"><BarChart3 size={28} /></div>
                <h3>Attendance Graph Placeholder</h3>
                <p>Ready to render with Recharts or Chart.js</p>
              </div>
            </div>

            <div className="chart-card">
              <h3>Department Leave Distribution</h3>
              <div className="empty-state">
                <div className="empty-state-icon"><Calendar size={28} /></div>
                <h3>Leave Distribution Placeholder</h3>
                <p>Ready to render breakdown by department</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}