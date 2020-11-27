module.exports.EnsureLoggedIn = function (req, res, next) {
  if (req.session.userId) {
    req.currentUser = {id: 1, username: "admin", password: "admin"}
    return next();
  }

  res.redirect("/login");
};

module.exports.EnsureNotLoggedIn = function (req, res, next) {
  if (req.session.userId) {
    res.redirect("/");
    return;
  }

  next();
};
