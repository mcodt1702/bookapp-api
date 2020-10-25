const knex = require("knex");

const BookingService = {
  getAllBookings(knex) {
    return knex.select("*").from("bookings");
  },

  insertBooking(knex, newBooking) {
    return knex
      .insert(newBooking)
      .into("bookings")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  updateStatus(knex, order_id, updateStatus) {
    return knex("bookings")
      .where({ id: order_id })
      .update(updateStatus, (returning = true))
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = BookingService;
