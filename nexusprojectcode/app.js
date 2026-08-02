const mongoose = require("mongoose");
const express = require("express");
const { nexusApp, nexusHotel, nexusEvents } = require("./models/nexusModel");
const app = express();
const session = require("express-session");
const userModel = require("./models/userModel");

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
  try {
    const flights = await nexusApp.find();
    const hotels = await nexusHotel.find();

    const bookings = [...flights, ...hotels].sort(
      (a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate),
    );

    response.render("Booking", {
      title: "Bookings",
      bookings,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error loading bookings page");
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
        error: "Password errata",
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
  response.render("NewBooking.ejs", {
    username: request.session?.username
  });
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
  try {
    const flights = await nexusApp.find();
    const hotels = await nexusHotel.find();
    const allBookings = [...flights, ...hotels];

    const now = new Date();
    const uniqueDestinations = new Map(); // destination -> { visited }

    allBookings.forEach((booking) => {
      const visited = new Date(booking.arrivalDate) < now;
      const existing = uniqueDestinations.get(booking.destination);
      // red if visited
      if (!existing || (visited && !existing.visited)) {
        uniqueDestinations.set(booking.destination, { visited });
      }
    });

    const markers = [];
    for (const [destination, info] of uniqueDestinations) {
      const coords = await geocodeCity(destination);
      if (coords) {
        markers.push({
          name: destination,
          lat: coords.lat,
          lng: coords.lng,
          visited: info.visited,
        });
      }
    }

    response.render("Map", { title: "Map", markers });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error loading map page");
  }
});
//Flights page
app.get("/Flights", (request, response) => {
  response.render("Flights", {
    title: "Flights",
  });
});

//Events page
app.get("/Events", (request, response) => {
  response.render("Events", {
    title: "Events",
  });
});

//Accomodation page
app.get("/Accomodation", (request, response) => {
  response.render("Accomodation", {
    title: "Accomodation",
  });
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
