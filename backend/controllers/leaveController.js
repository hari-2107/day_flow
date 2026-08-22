const Leave = require('../models/Leave');
const User = require('../models/User');


exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, leave_type, from, from_date, to, to_date, remarks, reason } = req.body;

    const user = await User.findByPk(userId);

    const leave = await Leave.create({
      user_id: userId,
      employee_id: req.user.employee_id || (user ? user.employee_id : `EMP-${userId}`),
      user_name: user ? user.name : req.user.email,
      leave_type: type || leave_type || 'Paid Leave',
      from_date: from || from_date || new Date().toISOString().split('T')[0],
      to_date: to || to_date || new Date().toISOString().split('T')[0],
      reason: remarks || reason || 'Personal Leave',
      status: 'Pending'
    });

    return res.status(201).json({ message: 'Leave application submitted successfully.', leave });
  } catch (error) {
    return res.status(500).json({ message: 'Error applying for leave.', error: error.message });
  }
};


exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await Leave.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ leaves });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching leave applications.', error: error.message });
  }
};


exports.getAdminLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ leaves });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching all leave applications.', error: error.message });
  }
};


exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments, admin_comments } = req.body;

    const leave = await Leave.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    if (status) leave.status = status;
    if (comments || admin_comments) leave.admin_comments = comments || admin_comments;

    await leave.save();

    return res.status(200).json({ message: `Leave status updated to ${status}.`, leave });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating leave status.', error: error.message });
  }
};
