const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { json } = require("express");

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = "ahfahhfiaknfkvbiavnkcbaik";

app.use(express.json());

mongoose.connect(
  "mongodb+srv://blog:sbDfdGiNqIw8fbE7@cluster0.soavyro.mongodb.net/?retryWrites=true&w=majority"
);

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// REGISTRATION

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

// LOGIN

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // Logged In
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json("ok");
    });
  } else {
    res.status(400).json("wrogn credentials.");
  }
});

app.listen(4000);

//
