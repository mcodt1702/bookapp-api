const express = require("express");
const VenueService = require("../Services/venuesService");
const VenueRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const { serialize } = require("v8");

const bcrypt = require("bcryptjs");

serializeVenue = (venue) => ({
  id: venue.id,
  name: venue.name,
  email: venue.email,
  description: venue.description,
  password: venue.password,
});

VenueRouter.route("/")
  .get((req, res, next) => {
    VenueService.getAllVenues(req.app.get("db"))
      .then((venue) => {
        res.json(venue.map(serializeVenue));
      })
      .catch(next);
  })
  .post(jsonParser, async (req, res, next) => {
    const { name, email, description } = req.body;
    const hashedpassword = await bcrypt.hash(req.body.password, 12);
    password = hashedpassword;

    const newVenue = { name, email, description, password };

    for (const [key, value] of Object.entries(newVenue)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    VenueService.insertVenue(req.app.get("db"), newVenue)
      .then((venue) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${venue.id}`))
          .json(serializeVenue(venue));
      })
      .catch(next);
  });

module.exports = VenueRouter;
