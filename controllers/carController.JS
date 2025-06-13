const Car = require("../models/addcarschema");
const Booking = require("../models/booking");

exports.showCars = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    if (!startDate || !endDate) {
      const cars = await Car.find();
      return res.render("showcars", { cars, startDate: "", endDate: "" });
    }

    const bookedCarIds = await Booking.find({
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
    }).distinct("carId");

    const availableCars = await Car.find({ _id: { $nin: bookedCarIds } });

    res.render("showcars", { cars: availableCars, startDate, endDate });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

exports.newCarForm = (req, res) => {
  res.render("new-car");
};

exports.createCar = async (req, res) => {
  try {
    const {
      name,
      type,
      transmission,
      seats,
      bags,
      doors,
      dailyPrice,
      unlimitedKM,
    } = req.body;

    const newCar = new Car({
      name,
      type,
      transmission,
      seats: Number(seats),
      bags: Number(bags),
      doors: Number(doors),
      dailyPrice: Number(dailyPrice),
      unlimitedKM: unlimitedKM === "on",
      imagePath: req.file ? req.file.filename : "",
    });

    await newCar.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving car");
  }
};

exports.carDetails = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).send("Car not found");
    res.render("car", { car });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
