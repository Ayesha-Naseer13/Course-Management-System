// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authAdmin = require('../middleware/authAdmin');

router.get('/login', adminController.showLogin);
router.post('/login', adminController.login);
router.get('/dashboard', authAdmin, adminController.dashboard);
router.get('/logout', adminController.logout);

module.exports = router;