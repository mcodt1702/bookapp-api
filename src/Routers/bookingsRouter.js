const express = require("express");
const { requireAuth } = require("../Auth/jwtAuthorization");
const BookingService = require("../Services/bookingService");
const BookingsRouter = express.Router();
const jsonParser = express.json();
const path = require("path");

serializeBooking = (booking) => ({
  id: booking.id,
  users_id: booking.users_id,
  venue_id: booking.venue_id,
  date: booking.date,
  status: booking.status,
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
    const { users_id, venue_id, booking_date, status } = req.body;

    const newBooking = { users_id, venue_id, booking_date, status };

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
  });

module.exports = BookingsRouter;
