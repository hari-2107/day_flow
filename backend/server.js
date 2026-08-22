const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sequelize = require('./config/db');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const Payroll = require('./models/Payroll');

const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));


app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});


const seedInitialData = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('🌱 Seeding initial demo users...');
      const adminPassword = await bcrypt.hash('admin123', 10);
      const empPassword = await bcrypt.hash('employee123', 10);

      const admin = await User.create({
        employee_id: 'EMP-ADMIN-01',
        name: 'HR Admin Officer',
        email: 'admin@dayflow.io',
        password: adminPassword,
        role: 'ADMIN',
        department: 'Human Resources',
        designation: 'HR Officer',
        phone: '+1 (555) 000-1122',
        address: '100 Corporate Plaza, Executive Suite',
        salary: '$8,500'
      });

      const emp1 = await User.create({
        employee_id: 'EMP-1042',
        name: 'Alex Morgan',
        email: 'alex.morgan@dayflow.io',
        password: empPassword,
        role: 'EMPLOYEE',
        department: 'Engineering',
        designation: 'Frontend Engineer',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Springfield',
        salary: '$5,200'
      });

      const emp2 = await User.create({
        employee_id: 'EMP-1043',
        name: 'Sarah Connor',
        email: 'sarah.connor@dayflow.io',
        password: empPassword,
        role: 'EMPLOYEE',
        department: 'Design',
        designation: 'UI/UX Designer',
        phone: '+1 (555) 987-6543',
        address: '88 Cyberdyne Way',
        salary: '$4,800'
      });

      
      await Attendance.create({
        user_id: emp1.id,
        employee_id: emp1.employee_id,
        user_name: emp1.name,
        date: 'Aug 21, 2026',
        check_in: '09:00 AM',
        check_out: '05:00 PM',
        working_hours: '8h 00m',
        status: 'Present'
      });

      
      await Leave.create({
        user_id: emp1.id,
        employee_id: emp1.employee_id,
        user_name: emp1.name,
        leave_type: 'Sick Leave',
        from_date: '2026-08-10',
        to_date: '2026-08-11',
        reason: 'Fever and rest',
        status: 'Approved',
        admin_comments: 'Get well soon!'
      });

      
      await Payroll.create({
        user_id: emp1.id,
        employee_id: emp1.employee_id,
        user_name: emp1.name,
        month: 'July 2026',
        issued_date: '2026-07-31',
        basic_pay: '$3,200.00',
        hra: '$1,200.00',
        medical_allowance: '$400.00',
        special_allowance: '$400.00',
        tax_deduction: '$650.00',
        health_insurance: '$200.00',
        pf: '$100.00',
        gross_salary: '$5,200.00',
        net_salary: '$4,250.00'
      });

      console.log('✅ Demo users and initial records seeded successfully.');
    }
  } catch (error) {
    console.error('⚠️ Seeding error:', error.message);
  }
};

const PORT = process.env.PORT || 5000;


sequelize.sync()
  .then(async () => {
    console.log('✅ Database connected and models synchronized');
    await seedInitialData();
    app.listen(PORT, () => console.log(`🚀 Dayflow Backend Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });