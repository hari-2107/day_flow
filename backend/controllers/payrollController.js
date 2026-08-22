const Payroll = require('../models/Payroll');
const User = require('../models/User');


exports.getMyPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    let payslips = await Payroll.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });

    if (payslips.length === 0 && user) {
      
      const defaultRecord = await Payroll.create({
        user_id: userId,
        employee_id: user.employee_id,
        user_name: user.name,
        month: 'July 2026',
        issued_date: '2026-07-31',
        basic_pay: '$3,200.00',
        hra: '$1,200.00',
        medical_allowance: '$400.00',
        special_allowance: '$400.00',
        tax_deduction: '$650.00',
        health_insurance: '$200.00',
        pf: '$100.00',
        gross_salary: user.salary || '$5,200.00',
        net_salary: '$4,250.00'
      });
      payslips = [defaultRecord];
    }

    return res.status(200).json({
      salary: user ? user.salary : '$5,200.00',
      payslips
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching payroll data.', error: error.message });
  }
};


exports.getAdminPayroll = async (req, res) => {
  try {
    const records = await Payroll.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ payrolls: records });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching all payroll records.', error: error.message });
  }
};


exports.updateUserPayroll = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gross_salary, basic_pay, hra, medical_allowance, net_salary } = req.body;

    let user = await User.findByPk(userId);
    if (!user) {
      user = await User.findOne({ where: { employee_id: userId } });
    }

    if (user && gross_salary) {
      user.salary = gross_salary;
      await user.save();
    }

    let record = await Payroll.findOne({ where: { user_id: user ? user.id : userId } });
    if (!record && user) {
      record = await Payroll.create({
        user_id: user.id,
        employee_id: user.employee_id,
        user_name: user.name,
        month: 'August 2026',
        issued_date: '2026-08-31',
        gross_salary: gross_salary || '$5,200.00',
        basic_pay: basic_pay || '$3,200.00',
        hra: hra || '$1,200.00',
        medical_allowance: medical_allowance || '$400.00',
        net_salary: net_salary || '$4,250.00'
      });
    } else if (record) {
      if (gross_salary) record.gross_salary = gross_salary;
      if (basic_pay) record.basic_pay = basic_pay;
      if (hra) record.hra = hra;
      if (medical_allowance) record.medical_allowance = medical_allowance;
      if (net_salary) record.net_salary = net_salary;
      await record.save();
    }

    return res.status(200).json({ message: 'Payroll details updated successfully.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating payroll.', error: error.message });
  }
};
