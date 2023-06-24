const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { username } = req.body;
  try {
    const data = await User.findOne({ username }).lean();
    if (data) {
      const userInfo = {
        name: data.name,
        username: data.username,
        contacts: data.contacts,
      };
      return res.status(200).json(userInfo);
    } else {
      return res.status(400).send("Invalid username");
    }
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
