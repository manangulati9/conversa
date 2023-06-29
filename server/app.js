require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const app = express();
const register = require("./routes/register");
const login = require("./routes/login");
const messages = require("./routes/messages");
const userInfo = require("./routes/user");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/register", register);
app.use("/login", login);
app.use("/user/messages", messages);
app.use("/user", userInfo);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(`Server running on port ${process.env.PORT || process.env.API_PORT}`);
});

module.exports = app;
