const express = require("express");
const router = express.Router();
const Message = require("../models/message");
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

router.post("/add-contact", async (req, res) => {
  const { username, contactUsername } = req.body;
  try {
    if (!username || !contactUsername) {
      throw new Error("Invalid data");
    }

    const [contact, user] = await Promise.all([
      User.findOne({ username: contactUsername }),
      User.findOne({ username: username }),
    ]);

    if (!contact) {
      res.status(404).send("Contact user doesn't exist");
    }

    if (!user) {
      res.status(404).send("User doesn't exist");
    }

    const existingContact = user.contacts.find(
      (c) => c.username === contactUsername
    );

    if (existingContact) {
      res.status(404).send("Contact already exists");
    }

    const newContact = {
      name: contact.name,
      username: contactUsername,
    };

    user.contacts.push(newContact);

    await user.save();

    res.status(200).json(newContact);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.post("/delete-contact", async (req, res) => {
  const { username, contactUsername } = req.body;
  try {
    if (username && contactUsername) {
      await User.updateOne(
        { username: username },
        { $pull: { contacts: { username: contactUsername } } }
      );

      const messagesExist = await Message.exists({
        $or: [
          { sender: username, receiver: contactUsername },
          { sender: contactUsername, receiver: username },
        ],
      });

      if (messagesExist) {
        await Message.deleteMany({
          $or: [
            { sender: username, receiver: contactUsername },
            { sender: contactUsername, receiver: username },
          ],
        });
      }

      res
        .status(200)
        .send("Contact deleted successfully and messages deleted.");
    } else {
      res.status(401).send("Invalid data");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
