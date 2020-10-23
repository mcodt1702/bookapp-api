const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeTestVenues } = require("./venues.fixtures");

describe("Venues Endpoints", function () {
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
    db.raw("TRUNCATE TABLE venues RESTART IDENTITY CASCADE")
  );

  context("Given there are venues in the database", () => {
    let testVenues = makeTestVenues();
    beforeEach("insert venues", () => {
      return db.into("venues").insert(testVenues);
    });
    it("GET /venues responds with 200 and all of the venues", () => {
      return supertest(app).get("/venues").expect(200);
    });
  });
});
