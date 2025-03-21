require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

const sampleCourses = [
  {
    code: 'CS101',
    name: 'Introduction to Computer Science',
    department: 'Computer Science',
    credits: 3,
    schedule: {
      days: ['Mon', 'Wed'],
      time: '09:00 - 10:30',
      room: 'CSB-101'
    },
    seats: 30,
    prerequisites: []
  },
  {
    code: 'MATH201',
    name: 'Discrete Mathematics',
    department: 'Mathematics',
    credits: 4,
    schedule: {
      days: ['Tue', 'Thu'],
      time: '11:00 - 12:30',
      room: 'MATH-202'
    },
    seats: 25,
    prerequisites: []
  },
  {
    code: 'CS301',
    name: 'Data Structures',
    department: 'Computer Science',
    credits: 3,
    schedule: {
      days: ['Mon', 'Wed', 'Fri'],
      time: '14:00 - 15:00',
      room: 'CSB-301'
    },
    seats: 25,
    prerequisites: ['CS101', 'MATH201'] // Will be replaced with actual IDs
  }
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    // First insert courses without prerequisites
    const createdCourses = await Course.insertMany(
      sampleCourses.filter(c => c.prerequisites.length === 0),
      { ordered: false }
    );

    // Now handle courses with prerequisites
    const prerequisiteCourses = await Course.find({
      code: { $in: ['CS101', 'MATH201'] }
    });

    const advancedCourse = sampleCourses.find(c => c.code === 'CS301');
    advancedCourse.prerequisites = prerequisiteCourses.map(c => c._id);

    await Course.create(advancedCourse);

    console.log('Courses seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedCourses();