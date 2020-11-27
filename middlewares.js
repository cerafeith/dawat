const models = require("./models");

module.exports.EnsureLoggedIn = function (req, res, next) {
  if (req.session.userId) {
    req.currentUser = models.NewUser(3, "admin", "admin");
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
