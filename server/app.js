require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const app = express();
const register = require("./routes/register");
const login = require("./routes/login");
const messages = require("./routes/messages");
const userInfo = require("./routes/user");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { saveMessageToDB } = require("./lib/saveMessage");
const { generateRoomId } = require("./lib/utils");

app.use(express.json());
app.use(cors());
app.use("/register", register);
app.use("/login", login);
app.use("/user/messages", messages);
app.use("/user", userInfo);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  const { username } = socket.handshake.query;
  const newUser = { username: username, socketId: socket.id };
  onlineUsers.add(newUser);
  io.emit("online-users", Array.from(onlineUsers));

  socket.on("join_room", ({ username, contactUsername }) => {
    const room = generateRoomId(username, contactUsername);
    socket.join(room);
  });

  socket.on("send_message", async (data) => {
    const { sender, receiver } = data;
    const room = generateRoomId(sender, receiver);
    io.to(room).emit("receive_message", data);
    await saveMessageToDB(data);
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(newUser);
    io.emit("online-users", Array.from(onlineUsers));
  });

  socket.on("typing", (sender) => {
    const recipients = Array.from(onlineUsers).filter(
      (user) => user.username !== sender
    );
    recipients.forEach((recipient) => {
      socket.to(recipient.socketId).emit("typing", sender);
    });
  });

  socket.on("stopTyping", (sender) => {
    const recipients = Array.from(onlineUsers).filter(
      (user) => user.username !== sender
    );
    recipients.forEach((recipient) => {
      socket.to(recipient.socketId).emit("stopTyping", sender);
    });
  });
});

server.listen(4000);

module.exports = app;
