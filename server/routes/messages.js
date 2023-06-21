const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.post("/", async (req, res) => {
  try {
    const { client1, client2 } = req.body;
    const messages = await Message.find(
      { sender: { $in: [client1, client2] } },
      "message sender receiver"
    );
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
