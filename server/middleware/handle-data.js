const Message = require("../models/message");
const User = require("../models/user");
const { getCurrentTime } = require("./utils");

async function saveMessageToDB({ sender, receiver, message, date, time }) {
  try {
    if (!sender || !receiver || !message || !date || !time) {
      throw new Error("Invalid data");
    }

    const newMessage = await Message.create({
      sender: sender,
      receiver: receiver,
      message: message,
      date: date,
      time: time,
    });

    return newMessage;
  } catch (error) {
    throw error;
  }
}

async function saveContact(username, contactUsername) {
  try {
    if (!username || !contactUsername) {
      throw new Error("Invalid data");
    }

    const [contact, user] = await Promise.all([
      User.findOne({ username: contactUsername }),
      User.findOne({ username: username }),
    ]);

    if (!contact) {
      throw new Error("Contact user doesn't exist");
    }

    if (!user) {
      throw new Error("User doesn't exist");
    }

    const existingContact = user.contacts.find(
      (c) => c.username === contactUsername
    );

    if (existingContact) {
      throw new Error("Contact already exists");
    }

    const newContact = {
      name: contact.name,
      username: contactUsername,
    };

    user.contacts.push(newContact);

    await user.save();

    return newContact;
  } catch (error) {
    throw error;
  }
}

async function deleteContact(username, contactUsername) {
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

      return "Contact deleted successfully and messages deleted.";
    } else {
      throw new Error("Invalid data");
    }
  } catch (error) {
    throw error;
  }
}

async function deleteAllChats(username, contactUsername) {
  if (username && contactUsername) {
    const query = {
      $or: [
        { sender: username, receiver: contactUsername },
        { sender: contactUsername, receiver: username },
      ],
    };
    await Message.deleteMany(query);
    return "Messages deleted";
  } else {
    throw new Error("Invalid data");
  }
}

module.exports = {
  saveMessageToDB,
  saveContact,
  deleteContact,
  deleteAllChats,
};
