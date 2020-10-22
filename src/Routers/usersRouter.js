const express = require("express");
const UserService = require("../Services/userServices");
const UserRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const bcrypt = require("bcryptjs");
const { serialize } = require("v8");

serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  password: user.password,
});

UserRouter.route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    UserService.getAllUsers(knexInstance)
      .then((user) => {
        res.json(user.map(serializeUser));
      })
      .catch(next);
  })

  .post(jsonParser, async (req, res, next) => {
    const { name, email } = req.body;
    const hashedpassword = await bcrypt.hash(req.body.password, 12);
    password = hashedpassword;

    const newUser = { name, email, password };

    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    UserService.insertUser(req.app.get("db"), newUser)
      .then((user) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user));
      })
      .catch(next);
  });

module.exports = UserRouter;
