const User = require('../models/User');


exports.getAllEmployees = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']]
    });

    const formatted = users.map(u => ({
      id: u.employee_id || `EMP-${u.id}`,
      dbId: u.id,
      name: u.name,
      email: u.email,
      role: u.designation || u.role,
      dept: u.department,
      status: u.is_verified ? 'Active' : 'Inactive',
      phone: u.phone,
      address: u.address,
      salary: u.salary
    }));

    return res.status(200).json({ employees: formatted });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching employees.', error: error.message });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params; 
    let user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { id: isNaN(id) ? -1 : parseInt(id) },
          { employee_id: id }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const { name, dept, role, status, salary, phone, address } = req.body;

    if (name !== undefined) user.name = name;
    if (dept !== undefined) user.department = dept;
    if (role !== undefined) user.designation = role;
    if (status !== undefined) user.is_verified = status === 'Active';
    if (salary !== undefined) user.salary = salary;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    return res.status(200).json({
      message: 'Employee updated successfully.',
      employee: {
        id: user.employee_id,
        dbId: user.id,
        name: user.name,
        email: user.email,
        role: user.designation,
        dept: user.department,
        status: user.is_verified ? 'Active' : 'Inactive',
        phone: user.phone,
        address: user.address,
        salary: user.salary
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating employee.', error: error.message });
  }
};
