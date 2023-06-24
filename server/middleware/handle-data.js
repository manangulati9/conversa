const Message = require("../models/message");
const User = require("../models/user");
const { getCurrentTime } = require("./utils");

async function saveMessageToDB({ sender, receiver, message }) {
  try {
    if (!sender || !receiver || !message) {
      throw new Error("Invalid data");
    }

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const newMessage = await Message.create({
      sender: sender,
      receiver: receiver,
      message: message,
      date: formattedDate,
      time: getCurrentTime(),
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

    user.contacts.push({
      name: contact.name,
      username: contactUsername,
    });

    await user.save();

    return user.contacts;
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

module.exports = { saveMessageToDB, saveContact, deleteContact };
