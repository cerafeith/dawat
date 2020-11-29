module.exports.EnsureLoggedIn = function (req, res, next) {
  if (req.session.userId) {
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

module.exports.CatchAllError = function (err, req, res, next) {
  res.status(500);
  res.render("error", {
    title: "Unexpected Eror",
    message: "An unexpected error has occured please try again later",
  });
};
