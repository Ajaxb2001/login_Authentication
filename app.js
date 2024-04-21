// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

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
    cookie: {
      secure: true, // Requires HTTPS
      httpOnly: true, // Prevents client-side access to cookies
      maxAge: 3600000, // Session expires in 1 hour
    },
  })
);

// Middleware for CSRF protection
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/signup", csrfProtection, (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.post(
  "/signup",
  csrfProtection,
  [
    check("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      req.session.user = newUser;
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving user");
    }
  }
);

app.post(
  "/login",
  csrfProtection,
  async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send("Username or password is incorrect");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send("Username or password is incorrect");
      }
      req.session.user = user;
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/public/dashboard.html");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});