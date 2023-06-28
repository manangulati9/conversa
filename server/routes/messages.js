const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.post("/", async (req, res) => {
  try {
    const { username, contactUsername } = req.body;

    const messagesQuery = {
      $or: [
        { sender: username, receiver: contactUsername },
        { sender: contactUsername, receiver: username },
      ],
      deletedBy: { $nin: [username] },
    };

    const messages = await Message.find(
      messagesQuery,
      "message sender receiver time date"
    ).sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/delete-all-messages", async (req, res) => {
  try {
    const { username, contactUsername } = req.body;
    const query = {
      $or: [
        { sender: username, receiver: contactUsername },
        { sender: contactUsername, receiver: username },
      ],
    };
    const messages = await Message.find(query);

    let deletedCount = 0;

    const updatePromises = messages.map(async (msg) => {
      msg.deletedBy.push(username);
      deletedCount++;
      if (msg.deletedBy.length === 2) {
        return msg.deleteOne();
      }
      return msg.save();
    });

    await Promise.all(updatePromises);

    res.status(200).send(`${deletedCount} messages deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/delete-message", async (req, res) => {
  try {
    const { username, messageToDelete, contactUsername } = req.body;
    const query = {
      $or: [
        {
          sender: username,
          message: messageToDelete,
          receiver: contactUsername,
        },
        {
          sender: contactUsername,
          message: messageToDelete,
          receiver: username,
        },
      ],
    };

    const message = await Message.findOne(query);

    if (!message) {
      return res.status(404).send("Message not found");
    }

    message.deletedBy.push(username);
    await message.save();

    if (message.deletedBy.length === 2) {
      await Message.deleteOne(query);
    }

    res.status(200).send({ message: "Message deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
