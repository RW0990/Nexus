/**
 * @jest-environment jsdom
 */

const { screen } = require("@testing-library/dom");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

//login test
describe("login page", () => {
  //this code runs before every test is ran
  beforeEach(async () => {
    //render the ejs file
    const html = await ejs.renderFile(
      //path for login.ejs
      path.join(__dirname, "views/login.ejs"),
      {
        username: "",
        error: "",
      },
    );
    //put it into jsdom
    document.open();
    document.write(html);
    document.close();
  });
  test("email input box", () => {
    //aranging
    const input = document.getElementById("email-input");
    input.value = "anything";

    //assertion
    expect(input.value).toBe("anything");
  });
  test("password input box", () => {
    const input = document.getElementById("password-input");
    input.value = "passw0rd";

    expect(input.value).toBe("passw0rd");
  });
  //test login all together
  test("login", () => {
    //test password
    const password = document.getElementById("password-input");
    password.value = "passw0rd";
    expect(password.value).toBe("passw0rd");

    //test email
    const email = document.getElementById("email-input");
    email.value = "emai1";
    expect(email.value).toBe("emai1");

    //login
    const button = document.getElementById("login-button");
    button.click();

    //check the form action contains "/Login"
    //when email and pass are correct, it redirects to the correct page
    const form = document.querySelector("form");
    expect(form.action).toContain("/Login");
  });
});

//create booking test
describe("create booking", () => {
  //this code runs before every test is ran
  beforeEach(async () => {
    //render the ejs file
    const html = await ejs.renderFile(
      //path for newbooking.ejs
      path.join(__dirname, "views/NewBooking.ejs"),
      {
        username: "",
        error: "",
        today: "2026-08-01",
      },
    );
    //put it into jsdom
    document.open();
    document.write(html);
    document.close();
  });
  //test entering booking details and clicking button
  test("booking details and creation", () => {
    //simulate form entries
    const destination = document.getElementById("destination");
    destination.value = "dublin";
    expect(destination.value).toBe("dublin");

    const departureDate = document.getElementById("departureDate");
    departureDate.value = "2026-09-01";
    expect(departureDate.value).toBe("2026-09-01");

    const returnDate = document.getElementById("returnDate");
    returnDate.value = "2026-09-10";
    expect(returnDate.value).toBe("2026-09-10");

    const hotel = document.getElementById("hotel");
    hotel.value = "hotel";
    expect(hotel.value).toBe("hotel");

    const hotelAddress = document.getElementById("hotelAddress");
    hotelAddress.value = "hotel address";
    expect(hotelAddress.value).toBe("hotel address");

    const hotelBookingReference = document.getElementById("hotelBookingReference");
    hotelBookingReference.value = "booking reference";
    expect(hotelBookingReference.value).toBe("booking reference");

    const flightNumber = document.getElementById("flightNumber");
    flightNumber.value = "flight number";
    expect(flightNumber.value).toBe("flight number");

    const airline = document.getElementById("airline");
    airline.value = "airline";
    expect(airline.value).toBe("airline");

    const flightReferenceNumber = document.getElementById("flightReferenceNumber");
    flightReferenceNumber.value = "reference number";
    expect(flightReferenceNumber.value).toBe("reference number");

    const notes = document.getElementById("notes");
    notes.value = "notes";
    expect(notes.value).toBe("notes");

    //create the booking button
    const button = document.getElementById("create-booking-btn");
    //find the form which has the button
    const form = button.closest("form");

    //listen for form submission
    form.addEventListener("submit", (event) => {
      //stop jsdom from really submitting the form
      event.preventDefault();
    })
    //click button
    button.click();

    //check the form action contains "/NewBooking" (/NewBooking route creates and saves the booking model)
    //when email and pass are correct, it redirects to the correct page
    expect(form.action).toContain("/NewBooking");
  });


});
