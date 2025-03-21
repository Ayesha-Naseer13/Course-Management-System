const Course = require('../models/Course');

exports.validateCourse = async (req, res, next) => { // Add async here
  const { code, name, seats } = req.body;
  const errors = [];
  
  if (!code || code.length < 4) errors.push('Invalid course code');
  if (!name || name.length < 5) errors.push('Course name too short');
  if (!seats || seats < 1) errors.push('Seats must be at least 1');
  
  if (errors.length > 0) {
    try {
      const courses = await Course.find();
      return res.render('admin/courses/form', {
        errors,
        course: req.body,
        courses
      });
    } catch (err) {
      return next(err);
    }
  }
  next();
};

exports.validateStudent = (req, res, next) => {
  const { rollNumber, name } = req.body;
  const errors = [];
  
  if (!rollNumber || rollNumber.length < 3) errors.push('Invalid roll number');
  if (!name || name.length < 5) errors.push('Name too short');
  
  if (errors.length > 0) {
    return res.render('admin/students/form', { 
      errors, 
      student: req.body 
    });
  }
  next();
};