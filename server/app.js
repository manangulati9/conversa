require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const app = express();
const register = require("./routes/register");
const login = require("./routes/login");
const messages = require("./routes/messages");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const saveMessageToDB = require("./middleware/saveMessage");
const generateRoomId = require("./utils");

app.use(cors());
app.use(express.json());
app.use("/register", register);
app.use("/login", login);
app.use("/messages", messages);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("join_room", (data) => {
    const { contact } = data;
    socket.join(contact);
  });
  socket.on("send_message", (data) => {
    const { sender, reciever } = data;
    const room = generateRoomId(sender, reciever);
    io.in(room).emit("receive_message", data);
    saveMessageToDB(data);
  });
});

server.listen(4000);

module.exports = app;
