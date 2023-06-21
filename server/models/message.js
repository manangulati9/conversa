const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String },
  receiver: { type: String },
  message: { type: String },
  time: { type: String },
});
module.exports = mongoose.model("message", messageSchema);
