// middleware/authAdmin.js
module.exports = (req, res, next) => {
    if (!req.session.adminId) {
      return res.redirect('/admin/login');
    }
    next();
  };