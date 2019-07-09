/* eslint-disable func-names */
/* eslint-disable consistent-return */
function admin(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  if (!req.user.isAdmin)
    return res
      .status(403)
      .send('Access denied, you have to be admin to make this action !');

  next();
}

module.exports = admin;
