const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const context = require("./context");
const middlewares = require("./middlewares");
const repository = require("./repository");
const service = require("./service");

const port = 3000;

function main() {
  const app = express();

  const db = repository.InMemory(null);
  const userService = service.UsersService(db);
  const groupService = service.GroupsService(db);

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

  // Logger middleware
  app.use(morgan("common"));

  // Serves public files
  app.use(express.static("public"));

  app.get("/", function (req, res) {
    const ctx = context.NewContext(req);
    res.render("home", ctx);
  });

  app.get("/login", middlewares.EnsureNotLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    res.render("login", ctx);
  });

  app.post("/login", middlewares.EnsureNotLoggedIn, function (req, res) {
    const { username, password } = req.body;

    const user = userService.login(username, password);
    if (!user) {
      res.render("login", {
        error: "Invalid username/password",
      });
      return;
    }

    req.session.userId = user.id;
    res.redirect("/");
  });

  app.post("/logout", middlewares.EnsureLoggedIn, function (req, res) {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  });

  app.get(
    "/profile/:profileId",
    middlewares.EnsureLoggedIn,
    function (req, res) {
      res.render("profile");
    }
  );

  app.get("/groups", middlewares.EnsureLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    const groups = groupService.getUsersGroup(ctx.userId);
    res.render("group-list", {
      ...ctx,
      groups,
    });
  });

  app.get("/groups/new-group", middlewares.EnsureLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    res.render("group-new", ctx);
  });

  app.post(
    "/groups/new-group",
    middlewares.EnsureLoggedIn,
    function (req, res) {
      const ctx = context.NewContext(req);
      const { name } = req.body;

      groupService.createGroup(ctx.userId, name);
      res.redirect("/groups");
    }
  );

  app.get(
    "/groups/:groupId",
    middlewares.EnsureLoggedIn,
    function (req, res, next) {
      const ctx = context.NewContext(req);
      const groupId = req.params.groupId;

      try {
        const group = groupService.getGroup(ctx.userId, groupId);
        const recentEvent = groupService.getRecentEventByDate(
          group,
          new Date()
        );
        const inviteLink = groupService.inviteLink(groupId);

        let paidUserById = {};

        if (recentEvent) {
          recentEvent.paidUsers.forEach((user) => {
            paidUserById[user.id] = true;
          });
        }

        let adminUserById = {};
        adminUserById[group.adminUserId] = true;

        res.render("group-details", {
          ...ctx,
          recentEvent,
          group,
          inviteLink,
          paidUserById,
          adminUserById,
        });
      } catch (e) {
        if (e instanceof service.UnauthorizedException) {
          res.status(401);
          return res.render("error", {
            title: "401 Unauthorized",
            message: "Oops! You cannot view groups that you don't belong to",
          });
        }

        next(e);
      }
    }
  );

  app.post(
    "/groups/:groupId/event/new",
    middlewares.EnsureLoggedIn,
    function (req, res) {
      const ctx = context.NewContext(req);
      const { groupId } = req.params;
      const numberOfDays = +req.body.numberOfDays;

      groupService.createNewEvent(ctx.userId, groupId, numberOfDays);
      res.redirect(`/groups/${groupId}`);
    }
  );

  app.post(
    "/groups/:groupId/event/:eventId",
    middlewares.EnsureLoggedIn,
    function (req, res) {
      const { groupId, eventId } = req.params;

      // Cast string to int because the backend expects it to be an int
      const userId = +req.body.userId;

      if (req.body.paidStatus == "paid") {
        groupService.addPaidUser(userId, groupId, eventId);
      } else {
        groupService.removePaidUser(userId, groupId, eventId);
      }

      res.redirect(`/groups/${groupId}`);
    }
  );

  app.get("/invite/:groupId", middlewares.EnsureLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    const { groupId } = req.params;
    const group = groupService.getGroupById(groupId);

    res.render("invite-confirm", {
      ...ctx,
      group,
    });
  });

  app.post("/invite/:groupId", middlewares.EnsureLoggedIn, function (req, res) {
    const ctx = context.NewContext(req);
    const { groupId } = req.params;

    try {
      groupService.addUserToGroup(ctx.userId, groupId);
      res.redirect(`/groups/${groupId}`);
    } catch (e) {
      if (e instanceof service.InvalidArgumentException) {
        res.status(400);
        return res.render("error", {
          title: "400 Bad Request",
          message: `Oops! ${e.message}!`,
        });
      }

      next(e);
    }
  });

  app.use(middlewares.CatchAllError);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

main();
