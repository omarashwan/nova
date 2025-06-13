const Car = require("../models/addcarschema");
const Booking = require("../models/booking");
const User = require("../models/registerschema");


exports.adminDashboard = (req, res) => {

  res.render("admin-dashboard");
  
};


exports.getManageCars = async (req, res) => {
  try {
    const cars = await Car.find(); 
    res.render("manage", { cars });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading cars");
  }
};


exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.redirect("/cars"); 
  } catch (err) {
    console.error("Error deleting car:", err);
    res.status(500).send("Error deleting car");
  }
};


exports.getEditCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.render("edit-car", { car });
  } catch (err) {
    console.error("Error loading car:", err);
    res.status(500).send("Error loading car data");
  }
};

exports.postEditCar = async (req, res) => {
  try {
    const { name, type, dailyPrice } = req.body;
    await Car.findByIdAndUpdate(req.params.id, {
      name,
      type,
      dailyPrice,
    });
    res.redirect("/admin/cars");
  } catch (err) {
    console.error("Error updating car:", err);
    res.status(500).send("Error updating car");
  }
};


exports.managebooking = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("carId");

    const bookingsWithDuration = bookings.map((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      return {
        ...booking._doc,
        duration,
      };
    });

    res.render("bookingManage", { bookings: bookingsWithDuration });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Server Error");
  }
};


