const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payroll = sequelize.define('Payroll', {
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
  month: {
    type: DataTypes.STRING,
    allowNull: false
  },
  issued_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  basic_pay: {
    type: DataTypes.STRING,
    defaultValue: '$3,200.00'
  },
  hra: {
    type: DataTypes.STRING,
    defaultValue: '$1,200.00'
  },
  medical_allowance: {
    type: DataTypes.STRING,
    defaultValue: '$400.00'
  },
  special_allowance: {
    type: DataTypes.STRING,
    defaultValue: '$400.00'
  },
  tax_deduction: {
    type: DataTypes.STRING,
    defaultValue: '$650.00'
  },
  health_insurance: {
    type: DataTypes.STRING,
    defaultValue: '$200.00'
  },
  pf: {
    type: DataTypes.STRING,
    defaultValue: '$100.00'
  },
  gross_salary: {
    type: DataTypes.STRING,
    defaultValue: '$5,200.00'
  },
  net_salary: {
    type: DataTypes.STRING,
    defaultValue: '$4,250.00'
  }
}, {
  timestamps: true,
  tableName: 'payrolls'
});

module.exports = Payroll;
