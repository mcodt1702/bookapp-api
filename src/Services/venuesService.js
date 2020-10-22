const knex = require("knex");

const VenueService = {
  getAllVenues(knex) {
    return knex.select("*").from("venues");
  },

  insertVenue(knex, newVenue) {
    return knex
      .insert(newVenue)
      .into("venues")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = VenueService;
