const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String },
  receiver: { type: String },
  message: { type: String },
  time: { type: String },
  date: { type: String },
  createdAt: { type: String },
  deletedBy: { type: [String] },
});
module.exports = mongoose.model("message", messageSchema);
