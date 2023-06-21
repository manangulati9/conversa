const Message = require("../models/message");

function saveMessageToDB({ sender, reciever, message, time }) {
  return new Promise((res, rej) => {
    try {
      if (sender && reciever && message && time) {
        const newMessage = Message.create({
          sender: sender,
          reciever: reciever,
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
