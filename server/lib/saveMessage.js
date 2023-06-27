const Message = require("../models/message");

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
      createdAt: Date.now(),
    });

    return newMessage;
  } catch (error) {
    throw error;
  }
}

module.exports = { saveMessageToDB };
