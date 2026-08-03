//use node clear.js to delete all database entries
//i dont have access to database to do manually

const mongoose = require("mongoose");
const { nexusApp, nexusHotel, nexusEvents } = require("./models/nexusModel");
const bookingModel = require("./models/bookingModel");

const DatabaseURI =
  "mongodb+srv://whiteryan2599_db_user:r5yGCOpquNRHX9Ng@nexusdb.of8bxwv.mongodb.net/NexusDB";

async function clear() {
  try {
    await mongoose.connect(DatabaseURI);

    await nexusApp.deleteMany({});
    await nexusHotel.deleteMany({});
    await nexusEvents.deleteMany({});
    await bookingModel.deleteMany({});

    console.log("Flights, hotels, events and bookings deleted.");
  } catch (error) {
    console.log("Error clearing data:", error);
  } finally {
    await mongoose.disconnect();
  }
}

clear();
