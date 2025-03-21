const Student = require('../models/Student');

exports.loginStudent = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    const student = await Student.findOne({ rollNumber });

    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).render('login', {
        error: 'Invalid credentials'
      });
    }

    req.session.user = {
      _id: student._id,
      role: 'student',
      name: student.name
    };

    res.redirect('/student/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};