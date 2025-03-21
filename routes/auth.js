const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Admin = require('../models/Admin');

router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { role, rollNumber, username, password } = req.body;

  try {
    if (role === 'student') {
      const student = await Student.findOne({ rollNumber });
      if (!student) return res.render('auth/login', { error: 'Invalid roll number' });
      
      req.session.user = student;
      req.session.role = 'student';
      res.redirect('/student/dashboard');
    } else if (role === 'admin') {
      const admin = await Admin.findOne({ username });
      if (!admin) return res.render('auth/login', { error: 'Invalid credentials' });
      
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) return res.render('auth/login', { error: 'Invalid credentials' });
      
      req.session.user = admin;
      req.session.role = 'admin';
      res.redirect('/admin/dashboard');
    }
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
});

module.exports = router;