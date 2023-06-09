const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailValidator = require("node-email-validation");
const { isAuthenticated } = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide valid email and password" });
    return;
  }

  const isValid = emailValidator.is_email_valid(email);
  if (!isValid) {
    res.status(400).json({ message: "Provide a valid email." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(password, salt);
    const newUser = await User.create({ email, passwordHash });
    const response = { email: newUser.email, id: newUser._id };
    res.status(201).json(response);
  } catch (error) {
    console.log("There was an error with the signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide valid email and password" });
    return;
  }

  const isValid = emailValidator.is_email_valid(email);
  if (!isValid) {
    res.status(400).json({ message: "Provide a valid email" });
    return;
  }

  try {
    const matchingUser = await User.findOne({ email });
    if (!matchingUser) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    if (bcrypt.compareSync(password, matchingUser.passwordHash)) {
      const payload = {
        id: matchingUser._id,
        email: matchingUser.email,
        role: matchingUser.role,
      };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: "HS256", expiresIn: "6h" });
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: "Password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
