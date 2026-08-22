const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  check_in: {
    type: DataTypes.STRING,
    allowNull: true
  },
  check_out: {
    type: DataTypes.STRING,
    allowNull: true
  },
  working_hours: {
    type: DataTypes.STRING,
    defaultValue: '--'
  },
  status: {
    type: DataTypes.ENUM('Present', 'Half-Day', 'Absent'),
    defaultValue: 'Present'
  }
}, {
  timestamps: true,
  tableName: 'attendances'
});

module.exports = Attendance;
