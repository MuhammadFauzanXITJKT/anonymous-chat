const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

function randomName() {
  return "User" + Math.floor(Math.random() * 9999);
}

io.on("connection", (socket) => {
  const username = randomName();
  socket.username = username;

  socket.broadcast.emit("message", {
    user: "SYSTEM",
    text: username + " joined the chat"
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", {
      user: socket.username,
      text: msg
    });
  });

  socket.on("disconnect", () => {
    io.emit("message", {
      user: "SYSTEM",
      text: username + " left the chat"
    });
  });
});

http.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
