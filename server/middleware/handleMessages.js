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

function saveContact(username, contactUsername) {
  return new Promise(async (res, rej) => {
    try {
      if (username && contactUsername) {
        const docs = await Promise.all([
          User.findOne({ username: contactUsername }),
          User.find({ username: username }),
        ]);
        if (docs[0] && docs[1]) {
          const contactName = docs[0].first_name;
          docs[1].forEach((doc) => {
            doc.contacts.push({ name: contactName, username: contactUsername });
            doc.save();
          });
          res(docs);
        } else {
          rej("User doesn't exist");
        }
      }
    } catch (error) {
      rej(error);
    }
  });
}

module.exports = { saveMessageToDB, saveContact };
