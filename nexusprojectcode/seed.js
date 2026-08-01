const mongoose = require("mongoose");
const { nexusApp, nexusHotel, nexusEvents } = require("./models/nexusModel");

// same connection string used in app.js
const DatabaseURI =
  "mongodb+srv://whiteryan2599_db_user:r5yGCOpquNRHX9Ng@nexusdb.of8bxwv.mongodb.net/NexusDB";

async function seed() {
  try {
    await mongoose.connect(DatabaseURI);
    console.log("Connected to MongoDB, starting seed...");

    // clear existing collections before inserting new test data
    await nexusApp.deleteMany({});
    await nexusHotel.deleteMany({});
    await nexusEvents.deleteMany({});

    //Flight
    await nexusApp.insertMany([
      {
        destination: "Rome",
        arrivalDate: new Date("2025-03-10"), // past -
        departureDate: new Date("2025-03-17"),
        flightNumber: "AZ203",
        airline: "Alitalia",
        seatNumber: "12A",
        bags: 1,
      },
      {
        destination: "Paris",
        arrivalDate: new Date("2025-06-05"), // past
        departureDate: new Date("2025-06-12"),
        flightNumber: "AF108",
        airline: "Air France",
        seatNumber: "9C",
        bags: 2,
      },
      {
        destination: "Tokyo",
        arrivalDate: new Date("2026-11-20"), // future
        departureDate: new Date("2026-12-02"),
        flightNumber: "JL044",
        airline: "Japan Airlines",
        seatNumber: "22F",
        bags: 2,
      },
      {
        destination: "New York",
        arrivalDate: new Date("2026-09-15"), // future
        departureDate: new Date("2026-09-22"),
        flightNumber: "DL400",
        airline: "Delta",
        seatNumber: "15D",
        bags: 1,
      },
    ]);

    // Hotels
    await nexusHotel.insertMany([
      {
        destination: "Rome",
        arrivalDate: new Date("2025-03-10"),
        departureDate: new Date("2025-03-17"),
        reservationNumber: "HTL-ROM-001",
        roomType: "Double",
        noOfGuests: "2",
        breakfastIncluded: "Yes",
      },
      {
        destination: "Barcelona",
        arrivalDate: new Date("2025-08-01"), // past
        departureDate: new Date("2025-08-08"),
        reservationNumber: "HTL-BCN-045",
        roomType: "Suite",
        noOfGuests: "2",
        breakfastIncluded: "No",
      },
      {
        destination: "Tokyo",
        arrivalDate: new Date("2026-11-20"),
        departureDate: new Date("2026-12-02"),
        reservationNumber: "HTL-TYO-012",
        roomType: "Single",
        noOfGuests: "1",
        breakfastIncluded: "Yes",
      },
    ]);

    console.log("Seed completed successfully!");
    console.log("Inserted: 4 flights, 3 hotels");
  } catch (error) {
    console.error("Error during seed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
