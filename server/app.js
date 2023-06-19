require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const register = require("./routes/register");
const login = require("./routes/login");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/register", register);
app.use("/login", login);

module.exports = app;
