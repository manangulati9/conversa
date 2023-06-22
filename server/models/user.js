const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  username: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  contacts: { type: [{ name: String, username: String }] },
});

module.exports = mongoose.model("user", userSchema);
