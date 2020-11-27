const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");

const context = require("./context");
const middlewares = require("./middlewares");
const port = 3000;

function main() {
  const app = express();

  // Use handlebars as the template engine
  app.engine("handlebars", exphbs());
  app.set("view engine", "handlebars");
  // This middleware makes it possible to parse form-data requests
  app.use(bodyParser.urlencoded({ extended: true }));

  // Creates a session middleware. We use session to persist
  //  which user is logged in in req.session.id
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(express.static("public"));

  app.get("/", function (req, res) {
    const ctx = context.NewContext(req);
    res.render("home", ctx);
  });

  app.get("/hello-sarah", function (req, res) {
    res.render("hello-sarah", {
      name: "Sarah",
    });
  });

  app.get("/login", middlewares.EnsureNotLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    res.render("login", ctx);
  });

  app.post("/logout", middlewares.EnsureLoggedIn, function (req, res) {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  });

  app.post("/login", middlewares.EnsureNotLoggedIn, function (req, res) {
    const { username, password } = req.body;
    if (username !== "admin" || password !== "admin") {
      res.render("login", {
        error: "Invalid username/password",
      });
      return;
    }

    req.session.userId = 3;
    res.redirect("/");
  });

  app.get("/profile", middlewares.EnsureLoggedIn, function (req, res) {
    res.render("profile");
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

main();
