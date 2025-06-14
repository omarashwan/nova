const Booking = require("../models/booking");
const register = require("../models/registerschema");

// Home page controller
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

// User dashboard controller
exports.userDashboard = async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  try {
    const user = await register.findOne({ email: req.session.user.email });
    const bookings = await Booking.find({ user: user._id }).populate("carId");

    res.render("user-dashboard", { user, bookings, session: req.session });
  } catch (err) {
    console.error("User dashboard error:", err);
    res.status(500).send("Internal server error");
  }
};

// Render register page
exports.renderRegister = (req, res) => {
  res.render("register", { error: null });
};

// Register new user with password validation
exports.register = async (req, res) => {
  try {
    const { email, password, username, license } = req.body;

    // Validate password length
    if (!password || password.length < 8) {
      return res.status(400).render("register", { error: "Password must be at least 8 characters long" });
    }

    // Validate license (required + alphanumeric + min length 6)
    const licenseRegex = /^[a-zA-Z0-9]{6,}$/;
    if (!license || !licenseRegex.test(license)) {
      return res.status(400).render("register", { error: "License must be at least 6 characters long and alphanumeric" });
    }

    const existingUser = await register.findOne({ email });
    if (existingUser) {
      return res.status(400).render("register", { error: "Email already registered" });
    }

    const newUser = new register({ email, password, username, license });
    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Internal server error");
  }
};


// Render login page
exports.renderLogin = (req, res) => {
  res.render("login", { error: null });
};

// Login user with basic password length check
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).render("login", { error: "Invalid email or password" });
    }

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

// Logout controller
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Internal server error");
    }
    res.redirect("/");
  });
};
