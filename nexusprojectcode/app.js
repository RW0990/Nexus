const mongoose = require("mongoose");
const express = require("express");
const nexusModel = require("./models/nexusModel");
const app = express();

//use json in browser
app.use(express.json());
//making folder public
app.use(express.static("public"));
//use view engine
app.set("views", "./views");
app.set("view engine", "ejs");

//route
app.get("/", (request, response) => {
  nexusModel
    .find()
    .sort({
      createdAt: -1,
    })
    .then((result) =>
      response.render("Bookings", {
        title: "Bookings",
        nexusModel: result,
      }),
    )
    .catch((error) => {
      console.log(error);
      response.status(500).send("Error loading bookings page");
    });
});

//login page
app.get("/Login", (request, response) => {
  response.render("Login", {
    title: "Login",
  });
});

//User page
app.get("/User", (request, response) => {
  response.render("User", {
    title: "User",
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
app.get("/Map", (request, response) => {
  response.render("Map", {
    title: "Map",
  });
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
    const events = await nexusModel.find().sort({
      showDate: 1,
    });

    response.render("Recommendations", {
      title: "Recommendations",
      events,
    });
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
    const PORT = process.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log("MongoDB connection error: ", error));
