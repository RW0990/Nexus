import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import request from "supertest";
import app from "./app.js";
import mongoose from "mongoose";
import Booking from "./models/bookingModel.js";
import User from "./models/userModel.js";

const test_dburi =
  "mongodb+srv://ryanwhite9945_db_user:TestPassword123@test.53ncohc.mongodb.net/";

//statement test case - the rendering of the register page
describe("get/Register", () => {
  test("should return Register page", async () => {
    /*variables*/
    const response = await request(app).get("/Register");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Register");
  });
});

//Branch coverage test case - user login
beforeAll(async () => {
  //connection to our test cluster on mongodb
  await mongoose.connect(test_dburi);
});
beforeEach(async () => {
  //delete any data and start with fresh usernames and passwords
  await User.deleteMany({});
  await User.create({
    username: "test123",
    email: "test@email.com",
    password: "Newpassword123",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

//login
describe("post/Login", () => {
  //user does not have an account
  test("returns error if the user is not set up", async () => {
    const response = await request(app)
      .post("/Login")
      .send({ email: "noemail@email.com", password: "hello123" });
    expect(response.text).toContain("User not found");
  });
  //user does have an account but password is wrong
  test("returns error if the user password incorrect", async () => {
    const response = await request(app)
      .post("/Login")
      .send({ email: "test@email.com", password: "incorrect" });
    expect(response.text).toContain("Incorrect password");
  });
  //user exists and all credentials are correct - redirect to logged in status and dashboard etc
  test("Successful login", async () => {
    const response = await request(app)
      .post("/Login")
      .send({ email: "test@email.com", password: "Newpassword123" });
    expect(response.status).toBe(302); //redirect to logged in status and dashboard etc
  });
});

//condition coverage test - Bookings and map test
describe("get/Map - condition coverage", () => {
  let agent;
  let userId;

  beforeEach(async () => {
    //delete any data and start with fresh usernames and passwords
    await User.deleteMany({});

    const user = await User.create({
      username: "test123",
      email: "test@email.com",
      password: "Newpassword123",
    });
    userId = user._id;

    agent = request.agent(app);
    await agent
      .post("/Login")
      .send({ email: "test@email.com", password: "Newpassword123" });
  });
  //adding new trip
  test("add new destination", async () => {
    await Booking.create({
      userId,
      destination: "New York",
      departureDate: "2027=06-01",
      returnDate: "2027-06-10",
    });
    const response = await agent.get("/Map");
    expect(response.status).toBe(200);
    expect(response.text).toContain("New York");
  });
  //adding new trip that doesnt overwrite a past trip
  test("Dont overwrite previously visted city(date in past)", async () => {
    await Booking.create({
      userId,
      destination: "London",
      departureDate: "2023=06-01",
      returnDate: "2023-06-10",
    });
    await Booking.create({
      userId,
      destination: "London",
      departureDate: "2027=06-01",
      returnDate: "2027-06-10",
    });
    const response = await agent.get("/Map");
    expect(response.status).toBe(200);
    expect(response.text).toContain("London");
  });
  //adds new city to map when trip is entered
  test("add new destination", async () => {
    await Booking.create({
      userId,
      destination: "Tenerife",
      departureDate: "2027=06-01",
      returnDate: "2027-06-10",
    });
    await Booking.create({
      userId,
      destination: "Tenerife",
      departureDate: "2024=06-01",
      returnDate: "2024-06-10",
    });
    const response = await agent.get("/Map");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Tenerife");
  });
});
