const mongoose = require("mongoose");
const express = require("express");
const { nexusApp, nexusHotel, nexusEvents } = require("./models/nexusModel");
const app = express();
const session = require("express-session");
const userModel = require("./models/userModel");
const bookingModel = require("./models/bookingModel");


//use json in browser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//User login session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);
//making folder public
app.use(express.static(__dirname + "/public"));
//use view engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use((request, response, next) => {
  response.locals.username = request.session.username || null;
  next();
});
//route
app.get("/", async (request, response) => {
  if (!request.session.userId) {
    return response.redirect("/Login");
  }
  try {
    //const flights = await nexusApp.find();
    //const hotels = await nexusHotel.find();
    const bookings = await bookingModel
      .find({
        userId: request.session.userId,
      })
      //newest booking first
      .sort({
        departureDate: 1,
      });
    console.log("Bookings found:", bookings);

    response.render("Booking", {
      title: "Bookings",
      username: request.session.username,
      bookings: bookings,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error loading bookings");
  }
});
// delete bnooking button
app.post("/DeleteBooking/:id", async (request, response) => {
  //check the user is logged in
  if (!request.session.userId) {
    return response.redirect("/Login");
  }

  try {
    //delete only the logged-in user's booking
    const deletedBooking = await bookingModel.findOneAndDelete({
      //requst
      _id: request.params.id,
      userId: request.session.userId,
    });

    //booking not found
    if (!deletedBooking) {
      return response.status(404).send("Booking not found.");
    }

    console.log("Booking deleted:", deletedBooking);

    //return to bookings page
    response.redirect("/");
  } catch (error) {
    console.log("Delete booking error:", error);
    response.status(500).send("Unable to delete booking.");
  }
});

//login page
//Login form
app.get("/Login", (request, response) => {
  response.render("Login", { title: "Login", error: null });
});

app.post("/Login", async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return response.render("Login", {
        title: "Login",
        error: "User not found",
      });
    }

    if (user.password !== password) {
      return response.render("Login", {
        title: "Login",
        error: "Incorrect password",
      });
    }

    request.session.userId = user._id;
    request.session.username = user.username;
    response.redirect("/");
  } catch (error) {
    console.log(error);
    response.status(500).send("Error during the login");
  }
});

//Registrer form
app.get("/Register", (request, response) => {
  response.render("Register", { title: "Register", error: null });
});

app.post("/Register", async (request, response) => {
  const { username, email, password } = request.body;

  try {
    const newUser = new userModel({ username, email, password });
    await newUser.save();
    response.redirect("/Login");
  } catch (error) {
    console.log(error);
    response.render("Register", {
      title: "Register",
      error: "Email or username already in the system ",
    });
  }
});

// logout
app.get("/Logout", (request, response) => {
  request.session.destroy(() => {
    response.redirect("/Login");
  });
});

//User page
app.get("/User", (request, response) => {
  response.render("User", {
    title: "User",
  });
});
//new booking page
app.get("/NewBooking", (request, response) => {
  //make user log in before saving booking
  if (!request.session.userId) {
    return response.redirect("/Login");
  }
  //set todays date so user cannot log passed dates as new booking
  //also convert date to YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  response.render("NewBooking", {
    title: "New Booking",
    username: request.session.username,
    error: null,
    today: today,
  });
});

//accept and save new booking
app.post("/NewBooking", async (request, response) => {
  if (!request.session.userId) {
    return response.redirect("/Login");
  }
  const { destination, departureDate, returnDate, hotel, hotelAddress, hotelBookingReference, flightNumber, airline, flightReferenceNumber, notes } =
    request.body;

  //create dates
  const selectedDepartureDate = new Date(departureDate);
  const selectedReturnDate = new Date(returnDate);

  //set todays date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //check departure datre isnt in the past
  if (selectedDepartureDate < today) {
    return response.render("NewBooking", {
      title: "New Booking",
      username: request.session.username,
      error: "Departure date cannot be in the past.",
      today: today.toISOString().split("T")[0],
    });
  }

  //check return date isnt before departure date
  if (selectedReturnDate < selectedDepartureDate) {
    return response.render("NewBooking", {
      title: "New Booking",
      username: request.session.username,
      error: "Return date cannot be before the departure date.",
      today: today.toISOString().split("T")[0],
    });
  }

  //try create new booking
  try {
    const newBooking = new bookingModel({
      userId: request.session.userId,
      destination,
      departureDate,
      returnDate,
      hotel,
      hotelAddress,
      hotelBookingReference,
      flightNumber,
      airline,
      flightReferenceNumber,
      notes,
    });

    //save booking
    await newBooking.save();
    console.log("Booking saved:", newBooking);
    response.redirect("/");
  } catch (error) {
    console.log("Booking save error:", error);

    response.render("NewBooking", {
      title: "New Booking",
      username: request.session.username,
      error: "The booking could not be created",
      today: today.toISOString().split("T")[0],
    });
  }
});

//Trip page
app.get("/Trip", (request, response) => {
  response.render("Trip", {
    title: "Trip",
  });
});
//Reminders page
app.get("/Reminders", (request, response) => {
  response.render("Reminders", {
    title: "Reminders",
  });
});

//Map page

const geocodeCache = {};

async function geocodeCity(cityName) {
  if (geocodeCache[cityName]) return geocodeCache[cityName];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "NexusApp/1.0" },
  });
  const data = await res.json();

  if (data.length === 0) return null;

  const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  geocodeCache[cityName] = coords;
  return coords;
}

app.get("/Map", async (request, response) => {
  if (!request.session.userId) {
    return response.redirect("/Login");
  }

  try {
    const bookings = await bookingModel.find({
      userId: request.session.userId,
    });
    console.log("DEBUG - bookings found:", bookings.length, bookings); // <-- aggiungi

    const now = new Date();
    const uniqueDestinations = new Map();

    bookings.forEach((booking) => {
      const visited = new Date(booking.departureDate) < now;
      const existing = uniqueDestinations.get(booking.destination);
      if (!existing || (visited && !existing.visited)) {
        uniqueDestinations.set(booking.destination, { visited });
      }
    });

    console.log("unique destinations:", uniqueDestinations); // debug console log

    const markers = [];
    for (const [destination, info] of uniqueDestinations) {
      const coords = await geocodeCity(destination);
      console.log("geocoding", destination, "->", coords); // debug console log
      if (coords) {
        markers.push({
          name: destination,
          lat: coords.lat,
          lng: coords.lng,
          visited: info.visited,
        });
      }
    }

    console.log("final markers:", markers); //Debug console log

    response.render("Map", { title: "Map", markers });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error loading map page");
  }
});
//Flights page
app.get("/Flights", async (request, response) => {
  //get user id from session to find bookings for that user
  if (!request.session.userId) {
    return response.redirect("/Login");
  }

  try {
    
    const bookings = await bookingModel
      .find({ userId: request.session.userId })
      .sort({ departureDate: 1 });

    response.render("Flights", {
      title: "Flights",
      bookings: bookings
    });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error loading flights page");
  }
});

//Events page
app.get("/Events", (request, response) => {
  response.render("Events", {
    title: "Events",
  });
});

//Accomodation page
app.get("/Accomodation", async (request, response) => {
  //get user id from session to find bookings for that user
  if (!request.session.userId) {
    return response.redirect("/Login");
  }
 //get bookings for that user and sort by departure date
  try {
    const bookings = await bookingModel
      .find({ userId: request.session.userId })
      .sort({ departureDate: 1 });
    //render the accomodation page with the bookings
    response.render("Accomodation", {
      title: "Accomodation",
      username: request.session.username,
      bookings,
    });
  } catch (error) {
    console.log("Could not load accommodation:", error);
    response.status(500).send("Could not load accommodation");
  }
});

//Recommendations page
app.get("/Recommendations", async (request, response) => {
  try {
    const events = await nexusEvents.find();
    response.render("Recommendations", { title: "Recommendations", events });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error loading recommendations page");
  }
});
//404 error page
app.use((request, response) => {
  response.status(404).render("404", {
    title: "Error",
    heading: "Page not found",
    message: "The page you are looking for does not exist.",
    status: 404,
  });
});

//connection to Database
const DatabaseURI =
  "mongodb+srv://whiteryan2599_db_user:r5yGCOpquNRHX9Ng@nexusdb.of8bxwv.mongodb.net/NexusDB";

//setting up connection
console.log();
mongoose
  .connect(DatabaseURI)
  .then(() => {
    console.log("Successfully connected to MongoDB");
    const PORT = 3300;
    app.listen(PORT, () =>
      console.log(
        `Server running on port 3300 please run http://localhost:3300 in your browser`,
      ),
    );
  })
  .catch((error) => console.log("MongoDB connection error: ", error));
