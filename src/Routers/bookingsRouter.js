const express = require("express");
const { requireAuth } = require("../Auth/jwtAuthorization");
const BookingService = require("../Services/bookingService");
const BookingsRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const cors = require("cors");

serializeBooking = (booking) => ({
  id: booking.id,
  users_id: booking.users_id,
  venue_id: booking.venue_id,
  booking_date: booking.booking_date,
});

BookingsRouter.route("/")
  .get((req, res, next) => {
    BookingService.getAllBookings(req.app.get("db"))
      .then((booking) => {
        res.json(booking.map(serializeBooking));
      })
      .catch(next);
  })
  .post(jsonParser, async (req, res, next) => {
    const { users_id, venue_id, booking_date } = req.body;

    const newBooking = { users_id, venue_id, booking_date };

    for (const [key, value] of Object.entries(newBooking)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: { message: `Missing '${key}' in request body` } });
      }
    }

    BookingService.insertBooking(req.app.get("db"), newBooking)
      .then((booking) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${booking.id}`))
          .json(serializeBooking(booking));
      })
      .catch(next);
  })
  .put(requireAuth, jsonParser, (req, res, next) => {
    const { id } = req.body;
    const updateUsers_id = { users_id: req.user.id };

    const numberOfValues = Object.values(updateUsers_id).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'Users Id' or/and the booking id`,
        },
      });

    BookingService.updateStatus(req.app.get("db"), id, updateUsers_id)
      .then((updatedBooking) => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl, `/${updatedBooking.id}`))
          .json(serializeBooking(updatedBooking));
      })
      .catch(next);
  });

BookingsRouter.route("/cancel").put(
  requireAuth,
  jsonParser,
  (req, res, next) => {
    const { id } = req.body;
    const updateUsers_id = { users_id: null };

    if (!id)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'Users Id' or/and the booking id`,
        },
      });

    BookingService.updateStatus(req.app.get("db"), id, updateUsers_id)
      .then((updatedBooking) => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl, `/${updatedBooking.id}`))
          .json(serializeBooking(updatedBooking));
      })
      .catch(next);
  }
);

module.exports = BookingsRouter;
