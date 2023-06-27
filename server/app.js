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

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  const { newUser } = socket.handshake.query;
  onlineUsers.add(newUser);
  io.emit("online-users", Array.from(onlineUsers));

  socket.on('join_room',({username,contactUsername})=>{
    const room = generateRoomId(username,contactUsername);
    socket.join(room);
  })

  socket.on("send_message", async (data) => {
    const { sender, receiver } = data;
    const room = generateRoomId(sender, receiver);
    io.to(room).emit("receive_message", data);
    await saveMessageToDB(data);
  });

  socket.on("add_contact", async ({ username, contactUsername }) => {
    try {
      const newContact = await saveContact(username, contactUsername);
      socket.emit("contact_added", newContact);
    } catch (error) {
      socket.emit("error", error);
      console.error(error);
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

  socket.on("disconnect", () => {
    onlineUsers.delete(newUser);
    io.emit("online-users", Array.from(onlineUsers));
  });
});

server.listen(4000);

module.exports = app;
