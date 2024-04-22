// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/authentication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("Users", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.post("/signup", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  newUser
    .save()
    .then((user) => {
      req.session.user = user;
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving user");
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Check if username and password are correct
  User.findOne({ username: username, password: password })
    .then((user) => {
      if (!user) {
        // Username or password is incorrect
        res.status(401).send("User not registered Sign-up");
      } else {
        // User is authenticated, store user data in session
        req.session.user = user;
        res.redirect("/dashboard");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/dashboard", (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    // User is not logged in, redirect to login page
    res.redirect("/");
  } else {
    // User is logged in, serve the dashboard page
    res.sendFile(__dirname + "/public/dashboard.html");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
