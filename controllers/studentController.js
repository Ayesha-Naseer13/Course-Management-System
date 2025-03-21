// controllers/studentController.js
const Student = require('../models/Student');

exports.showLogin = (req, res) => {
  res.render('student/login', { error: null });
};

exports.login = async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.body.rollNumber });
    if (!student) {
      return res.render('student/login', { error: 'Invalid roll number' });
    }
    req.session.studentId = student._id;
    res.redirect('/student/dashboard');
  } catch (error) {
    res.render('student/login', { error: 'Login failed' });
  }
};

exports.dashboard = async (req, res) => {
  const student = await Student.findById(req.session.studentId);
  res.render('student/dashboard', { student });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/student/login');
};

exports.overrideRegistration = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    const [student, course] = await Promise.all([
      Student.findById(studentId),
      Course.findById(courseId)
    ]);

    if (!student || !course) {
      return res.status(404).json({ error: 'Student or course not found' });
    }

    // Force registration
    await Promise.all([
      Student.findByIdAndUpdate(studentId, {
        $addToSet: { registeredCourses: courseId }
      }),
      Course.findByIdAndUpdate(courseId, {
        $addToSet: { registeredStudents: studentId }
      })
    ]);

    res.redirect(`/admin/students/${studentId}`);
  } catch (error) {
    res.status(500).render('error', { error: 'Registration override failed' });
  }
};
// Save tentative schedule middleware
exports.saveTentativeSchedule = async (req, res, next) => {
  if (!req.session.tentativeSchedule) {
    const student = await Student.findById(req.session.studentId)
      .select('tentativeSchedule')
      .populate('tentativeSchedule');
    req.session.tentativeSchedule = student.tentativeSchedule;
  }
  next();
};

// Update session on changes
exports.updateTentativeSchedule = async (req, res, next) => {
  if (req.session.tentativeSchedule) {
    await Student.findByIdAndUpdate(req.session.studentId, {
      tentativeSchedule: req.session.tentativeSchedule
    });
  }
  next();
};
exports.removeRegistration = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    
    await Promise.all([
      Student.findByIdAndUpdate(studentId, {
        $pull: { registeredCourses: courseId }
      }),
      Course.findByIdAndUpdate(courseId, {
        $pull: { registeredStudents: studentId }
      })
    ]);

    res.redirect(`/admin/students/${studentId}`);
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to remove registration' });
  }
};