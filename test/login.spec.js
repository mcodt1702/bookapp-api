const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const { makeTestUsers } = require("./users.fixtures");

describe("Auth-Router Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db.raw("TRUNCATE TABLE users CASCADE"));
  afterEach("clean the table", () => db.raw("TRUNCATE TABLE users CASCADE"));

  context("Given there are valid credentials", () => {
    let testUsers = makeTestUsers();
    beforeEach("insert users", () => {
      return db.into("users").insert(testUsers);
    });
    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        email: testUsers[0].email,
        password: "2P@assword!",
      };

      return supertest(app).post("/login").send(userValidCreds).expect(200);
    });
  });
});
