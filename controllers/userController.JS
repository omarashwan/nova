const Booking = require("../models/booking");
const register = require("../models/registerschema");

exports.home = async (req, res) => {
  try {
    let bookings = [];
    if (req.session.userId) {
      bookings = await Booking.find({ user: req.session.userId }).populate("carId");
    }
    const user = await register.findById(req.session.userId);

    res.render("index", { user, bookings, session: req.session });
  } catch (err) {
    console.error("Failed to load homepage:", err);
    res.status(500).send("Internal server error");
  }
};

exports.userDashboard = async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const user = await register.findOne({ email: req.session.user.email });
  const bookings = await Booking.find({ user: user._id }).populate("carId");

  res.render("user-dashboard", { user, bookings, session: req.session });
};



exports.renderRegister = (req, res) => {
  res.render("register");
};

exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await register.findOne({ email });

    if (!user) {
      return res.status(400).render("login", { error: "Invalid email or password" });
    }

    if (user.password !== password) {
      return res.status(400).render("login", { error: "Invalid email or password" });
    }

    req.session.userId = user._id;
    req.session.user = user;
    if (user.isAdmin) {
      return res.redirect("/admin-dashboard");
    }

    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error");
  }
};
exports.renderLogin = (req, res) => {
  res.render("login",{error:null});
};

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await register.findOne({ email });
    if (existingUser) {
      return res.status(400).render("register", { error: "Email already registered" });
    }

    const newUser = new register({ email, password, username });
    await newUser.save();

  

    res.redirect("/login");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Internal server error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/");
  });
};
