const car = require("../models/addcarschema");
const Booking = require("../models/booking");

exports.bookCar = async (req, res) => {
  const carId = req.params.id;
  const { startDate, endDate } = req.body;
  const userId = req.session.userId;

  try {
    const existingBooking = await Booking.findOne({
      carId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (existingBooking) {
      return res.status(400).send("Car is already booked during this period.");
    }

    const car = await require("../models/addcarschema").findById(carId);

    if (!car) {
      return res.status(404).send("Car not found.");
    }

    const booking = new Booking({
      user: userId,
      carId,
      startDate,
      endDate,
      carName: car.name,  
    });
    console.log("Fetched car name:", car.name);


    await booking.save();
    req.session.bookingId = booking._id;

    res.redirect("/confirmation");
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).send("Error processing booking.");
  }
};


exports.confirmation = async (req, res) => {
  const bookingId = req.session.bookingId;
  if (!bookingId) return res.redirect("/");

  const booking = await Booking.findById(bookingId).populate("carId");
  if (!booking) return res.redirect("/");

  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  res.render("confirmation", {
    booking,
    car: booking.carId,
    diffDays,
  });
};

exports.history = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const bookings = await Booking.find({ user: req.session.userId }).populate("carId");
    const user = await require("../models/registerschema").findById(req.session.userId);

    res.render("history", { bookings, user, session: req.session });
  } catch (err) {
    console.error("Error loading history:", err);
    res.status(500).send("Internal server error");
  }
};
