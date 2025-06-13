const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");


app.use(
  session({
    secret: "fl tak bak mno",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});



const userRoutes = require("./Routes/userRoutes");
const carRoutes = require("./Routes/carRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const adminRoutes = require("./Routes/adminRoutes");

app.use("/", userRoutes);
app.use("/", carRoutes);
app.use("/", bookingRoutes);
app.use("/", adminRoutes);



const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://reshooomar50:1010abab@omarreshoo.wofur9v.mongodb.net/?retryWrites=true&w=majority&appName=omarreshoo")
  .then(() => {
    app.listen(7005, () => {
      console.log("Server running at http://localhost:7005/");
    });
  })
  .catch((err) => console.log(err));
