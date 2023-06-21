const Message = require("../models/message");

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

module.exports = saveMessageToDB;
