const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { username } = req.body;
  const doc = await User.findOne({ username: username });
  if (doc) {
    const contactList = doc.contacts;
    if (contactList) {
      res.status(200).json(contactList);
    } else {
      res.status(408).send("No contacts found");
    }
  } else {
    res.status(409).send("No users exist");
  }
});

module.exports = router;
