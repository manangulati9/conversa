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
const { saveMessageToDB, saveContact } = require("./middleware/handleMessages");
const generateRoomId = require("./utils");
const chatData = require("./routes/chat-data");

app.use(cors());
app.use(express.json());
app.use("/register", register);
app.use("/login", login);
app.use("/messages", messages);
app.use("/chat-data", chatData);

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
    const { sender, receiver } = data;
    const room = generateRoomId(sender, receiver);
    socket.join(room);
    const userCount = io.sockets.adapter.rooms.get(room).size;
    if (userCount === 1) {
      socket.emit("chat_status", false);
    } else if (userCount === 2) {
      socket.emit("chat_status", true);
    }
  });
  socket.on("send_message", (data) => {
    const { sender, receiver } = data;
    const room = generateRoomId(sender, receiver);
    io.in(room).emit("receive_message", data);
    saveMessageToDB(data);
  });
  socket.on("add_contact", async (data) => {
    try {
      const { username, contactUsername } = data;
      await saveContact(username, contactUsername);
    } catch (error) {
      socket.emit("error", error);
    }
  });
  socket.on("leave_room", (data) => {
    const { sender, receiver } = data;
    const room = generateRoomId(sender, receiver);
    socket.leave(room);
    const userCount = io.sockets.adapter.rooms.get(room).size;
    if (userCount === 1) {
      socket.emit("chat_status", false);
    } else if (userCount === 2) {
      socket.emit("chat_status", true);
    }
  });
});

server.listen(4000);

module.exports = app;
