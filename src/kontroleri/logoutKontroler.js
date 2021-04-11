/**
 * Logout kontroler, upravlja logout logikom
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {function} next ako dodje do greske
 */
function logout_post(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    req.session.destroy();
    res.redirect('/login');
  } else {
    return next();
  }
}

module.exports.logout_post = logout_post;