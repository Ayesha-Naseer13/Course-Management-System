const Course = require('../models/Course');
const Student = require('../models/Student');

exports.studentsInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.query.courseId)
      .populate('registeredStudents', 'rollNumber name');
    
    res.render('admin/reports/students-in-course', {
      course,
      courses: await Course.find().select('code name')
    });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to generate report' });
  }
};

exports.availableSeats = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $project: {
          code: 1,
          name: 1,
          seats: 1,
          available: { $subtract: ['$seats', { $size: '$registeredStudents' }] }
        }
      },
      { $match: { available: { $gt: 0 } } }
    ]);

    res.render('admin/reports/available-seats', { courses });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to generate report' });
  }
};

exports.missingPrerequisites = async (req, res) => {
  try {
    const violations = await Student.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'registeredCourses',
          foreignField: '_id',
          as: 'registeredCourses'
        }
      },
      {
        $unwind: '$registeredCourses'
      },
      {
        $project: {
          student: '$$ROOT',
          course: '$registeredCourses',
          missing: {
            $setDifference: [
              '$registeredCourses.prerequisites',
              '$completedCourses'
            ]
          }
        }
      },
      { $match: { missing: { $ne: [] } } }
    ]);

    res.render('admin/reports/missing-prerequisites', { violations });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to generate report' });
  }
};