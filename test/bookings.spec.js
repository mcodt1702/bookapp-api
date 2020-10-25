const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeTestBookings } = require("./bookings.fixtures");
const { makeTestUsers } = require("./users.fixtures");
const { makeTestVenues } = require("./venues.fixtures");

describe("Bookings Endpoints", function () {
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
    db.raw("TRUNCATE TABLE bookings RESTART IDENTITY CASCADE")
  );

  context("Given there are bookings in the database", () => {
    let testVenues = makeTestVenues();
    let testUsers = makeTestUsers();
    let testBookings = makeTestBookings();
    beforeEach("insert venues", () => {
      return db.into("venues").insert(testVenues);
    });
    beforeEach("insert users", () => {
      return db.into("users").insert(testUsers);
    });
    beforeEach("insert bookings", () => {
      return db.into("bookings").insert(testBookings);
    });
    it("GET /bookings responds with 200 and all of the bookings", () => {
      return supertest(app).get("/bookings").expect(200);
    });
  });
});
