const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeTestUsers } = require("./users.fixtures");

describe("Users Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
  );
  context("Given there are users in the database", () => {
    let testUsers = makeTestUsers();
    beforeEach("insert users", () => {
      return db.into("users").insert(testUsers);
    });

    it("GET /users responds with 200 and all of the consumers", () => {
      return supertest(app).get("/users").expect(200);
      // TODO: add more assertions about the body
    });
  });
});
