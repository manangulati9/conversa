const Message = require("../models/message");
const User = require("../models/user");

function saveMessageToDB({ sender, receiver, message, time }) {
  return new Promise((res, rej) => {
    try {
      if (sender && receiver && message && time) {
        const newMessage = Message.create({
          sender: sender,
          receiver: receiver,
          message: message,
          time: time,
        });
        res(newMessage);
      }
    } catch (error) {
      rej(error);
    }
  });
}

function saveContact(username, contactUsername, contactName) {
  return new Promise(async (res, rej) => {
    try {
      if (username && contactUsername) {
        const docs = await User.find({ username: username });
        docs.forEach((doc) => {
          doc.contacts.push({ name: contactName, username: contactUsername });
          doc.save();
        });
      }
    } catch (error) {
      rej(error);
    }
  });
}

module.exports = { saveMessageToDB, saveContact };
