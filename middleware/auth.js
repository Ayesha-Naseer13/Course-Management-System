// middleware/auth.js
exports.requireRole = (role) => {
    return (req, res, next) => {
      if (req.session.user?.role === role) {
        next();
      } else {
        res.status(403).send(`Access denied. ${role} privileges required`);
      }
    };
  };
  // middleware/auth.js
  exports.requireStudent = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'student') {
      return res.redirect('/login');
    }
    next();
  };
  
  exports.requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
    next();
  };
  // router.get('/dashboard', requireRole('student'), (req, res) => {...});