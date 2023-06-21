const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.sendStatus(400).send("All input required");
    }
    const user = await User.findOne({ email: email });
    const name = user.first_name;
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await jwt.sign(
        { user_id: user._id, email, name },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
