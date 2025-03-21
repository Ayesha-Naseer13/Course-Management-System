// controllers/adminController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

exports.showLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

exports.login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }
    req.session.adminId = admin._id;
    res.redirect('/admin/courses');
  } catch (error) {
    res.render('admin/login', { error: 'Login failed' });
  }
};

exports.dashboard = (req, res) => {
  res.render('admin/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};