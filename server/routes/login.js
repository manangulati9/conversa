const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(401).send("All input required"); // Use return to exit the function
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(401)
        .send("User doesn't exist. Please create an account."); // Use return to exit the function
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      return res.status(200).json(user); // Use return to exit the function
    } else {
      return res.status(401).send("Invalid credentials"); // Use return to exit the function
    }
  } catch (error) {
    console.log(error);
    // Handle the error appropriately, e.g., return an error response
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
