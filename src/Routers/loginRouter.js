const express = require("express");
const AuthService = require("../Auth/authService");
const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post("/", jsonParser, (req, res, next) => {
  const { email, password } = req.body;
  const loginUser = { email, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  AuthService.getUserWithUserNameUsers(req.app.get("db"), loginUser.email).then(
    (dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect email or password",
        });
      return AuthService.comparePasswords(loginUser.password, dbUser.password)
        .then((compareMatch) => {
          if (!compareMatch)
            return res.status(400).json({
              error: "Incorrect user_name or password",
            });

          const sub = dbUser.email;
          const payload = { user_id: dbUser.id };
          res.send({
            authToken: AuthService.createJwt(sub, payload),
            user_id: dbUser.id,
          });
        })
        .catch(next);
    }
  );
});

module.exports = authRouter;
