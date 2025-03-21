const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    
    const admin = new Admin({
      username: 'admin',
      password: '123' // Will be hashed automatically
    });

    await admin.save();
    console.log('Admin seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAdmin();