const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || process.env.API_PORT;
const { saveMessageToDB } = require("./lib/saveMessage");
const { generateRoomId } = require("./lib/utils");

const io = new Server(server, {
  cors: {
    origin: "*",
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

// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
