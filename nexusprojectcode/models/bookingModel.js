const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    hotel: {
      type: String,
      default: "",
    },
    hotelAddress: {
      type: String,
      default: "",
    },
    hotelBookingReference: {
      type: String,
      default: "",
    },
    flightNumber: {
      type: String,
      default: "",
    },
    airline: {
      type: String,
      default: "",
    },
    flightReferenceNumber: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Booking", bookingSchema);
