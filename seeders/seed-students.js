// seeders/seed-students.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student'); // Corrected path
const Course = require('../models/Course'); // Add Course model

require('dotenv').config();

async function seedStudents() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    // Get course references
    const courses = await Course.find();
    const courseMap = new Map(courses.map(c => [c.code, c._id]));

    const students = [
      {
        rollNumber: '22F-3672',
        name: 'Ayesha Naseer',
        password: bcrypt.hashSync('student123', 10),
        registeredCourses: [],
        completedCourses: [courseMap.get('CS101'), courseMap.get('MATH201')],
        department: 'Software Engineering',
        degreeProgram: 'BS Software Engineering',
        semester: 6
      },
      // Add other students with course references
    ];

    await Student.deleteMany({});
    await Student.insertMany(students);
    
    console.log('Students seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedStudents();