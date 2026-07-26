const mongoose = require("mongoose");

const nexusAppSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  flightNumber: { type: String, required: true },
  airline: { type: String, required: true },
  seatNumber: { type: String, required: true },
  bags: { type: Number, required: true },
});
module.exports = mongoose.model("nexusApp", nexusAppSchema);

const nexusHotelSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  reservationNumber: { type: String, required: true },
  roomType: { type: String, required: true },
  noOfGuests: { type: String, required: true },
  breakfastIncluded: { type: String, required: true },
});
module.exports = mongoose.model("nexusHotel", nexusHotelSchema);

const nexusEventsSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  reservationNumber: { type: String, required: true },
  description: { type: String, required: true },
  noOfTickets: { type: String, required: true },
  VIP: { type: String, required: true },
});
module.exports = mongoose.model("nexusEvents", nexusEventsSchema);
