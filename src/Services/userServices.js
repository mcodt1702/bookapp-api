const knex = require("knex");

const UserService = {
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },
  getOneUser(knex, id) {
    return knex.select("name").from("users").where(id);
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
