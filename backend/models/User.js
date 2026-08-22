const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('EMPLOYEE', 'ADMIN'),
    allowNull: false,
    defaultValue: 'EMPLOYEE'
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'Engineering'
  },
  designation: {
    type: DataTypes.STRING,
    defaultValue: 'Software Engineer'
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: '+1 (555) 123-4567'
  },
  address: {
    type: DataTypes.STRING,
    defaultValue: '123 Tech Park, Suite 400'
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  salary: {
    type: DataTypes.STRING,
    defaultValue: '$5,200'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'users'
});

module.exports = User;
