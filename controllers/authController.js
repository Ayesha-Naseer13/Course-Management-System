// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Student login
exports.studentLogin = async (req, res) => {
    try {
        const { rollNumber } = req.body;
        const student = await User.findOne({ rollNumber, role: 'student' });
        if (!student) return res.status(400).json({ message: 'Invalid Roll Number' });
        
        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login Successful', user: student });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Admin login
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await User.findOne({ username, role: 'admin' });
        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login Successful', user: admin });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
