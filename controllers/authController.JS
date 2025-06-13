const register = require("../models/registerschema");
const register = require("../models/registerschema");

exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.postRegister = async (req, res) => {
  try {
    const user = new register(req.body);
    console.log(req.body);
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err.message);
    res.render("register", { error: err.message });
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    await register.updateOne({ email: "admin@gmail.com" }, { isAdmin: true });
    const user = await register.findOne({ email });
    if (!user) return res.render("login", { error: "User not found" });
    if (user.password !== password)
      return res.render("login", { error: "Incorrect password" });

    req.session.user = {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    req.session.userId = user._id;

    if (user.isAdmin) {
      return res.redirect("/admin-dashboard");
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Something went wrong" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
