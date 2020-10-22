const knex = require("knex");

const UserService = {
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = UserService;
