const routes = require("express").Router();
const bookControl = require("../controllers/bookControl");
const userControl = require("../controllers/userControl");
const validation = require("../middleware/validate");
const auth = require("../middleware/authenticate.js");

routes.get("/login", passport.authenticate("github"), (req, res) => {});

routes.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

routes.get("/", bookControl.getData);

routes.get("/books", bookControl.getAll);

routes.get("/books/:id", bookControl.getSingle);

routes.post("/books", auth, validation.saveBook, bookControl.createBook);

routes.put("/books/:id", auth, validation.saveBook, bookControl.updateBook);

routes.delete("/books/:id", auth, bookControl.deleteBook);

routes.get("/users", userControl.getAll);

routes.get("/users/:id", userControl.getSingle);

routes.post("/users", auth, validation.saveUser, userControl.createUser);

routes.put("/users/:id", auth, validation.saveUser, userControl.updateUser);

routes.delete("/users/:id", auth, userControl.deleteUser);

module.exports = routes;
