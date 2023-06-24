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
const {
  saveMessageToDB,
  saveContact,
  deleteContact,
  deleteAllChats,
} = require("./middleware/handle-data");
const { generateRoomId } = require("./middleware/utils");
const userData = require("./routes/user-data");

app.use(cors());
app.use(express.json());
app.use("/register", register);
app.use("/login", login);
app.use("/messages", messages);
app.use("/user-data", userData);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", ({ sender, receiver }) => {
    const room = generateRoomId(sender, receiver);
    socket.join(room);
    const userCount = io.sockets.adapter.rooms.get(room).size;
    io.to(room).emit("chat_status", userCount === 2);
  });

  socket.on("send_message", async (data) => {
    const { sender, receiver } = data;
    const room = generateRoomId(sender, receiver);
    io.in(room).emit("receive_message", data);
    await saveMessageToDB(data);
  });

  socket.on("add_contact", async ({ username, contactUsername }) => {
    try {
      const res = await saveContact(username, contactUsername);
      socket.emit(Array.isArray(res) ? "contact_added" : "error", res);
    } catch (error) {
      socket.emit("error", error);
    }
  });

  socket.on("leave_room", ({ sender, receiver }) => {
    const room = generateRoomId(sender, receiver);
    socket.leave(room);
    const socketRoom = io.sockets.adapter.rooms.get(room);
    if (socketRoom) {
      const userCount = socketRoom.size;
      io.to(room).emit("chat_status", userCount === 2);
    }
  });

  socket.on("delete_contact", async ({ username, contactUsername }) => {
    try {
      await deleteContact(username, contactUsername);
    } catch (error) {
      socket.emit("error", error);
    }
  });

  socket.on("delete_chats_all", async ({ username, contactUsername }) => {
    try {
      await deleteAllChats(username, contactUsername);
    } catch (error) {
      socket.emit("error", error);
    }
  });
});

server.listen(4000);

module.exports = app;
