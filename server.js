const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const rooms = {}; // Simpan room & password

io.on("connection", (socket) => {

 socket.on("joinRoom", ({ roomName, password, username }) => {

  if (!roomName || !password) {
    socket.emit("errorMessage", "Room dan password wajib diisi!");
    return;
  }

  // Kalau room belum ada → buat
  if (!rooms[roomName]) {
    rooms[roomName] = password;
  }

  // Kalau password salah
  if (rooms[roomName] !== password) {
    socket.emit("errorMessage", "Password salah!");
    return;
  }

  socket.join(roomName);
  socket.room = roomName;
  socket.username = username || "Anonymous";

  socket.emit("joinedSuccess"); // kirim konfirmasi sukses

  io.to(roomName).emit("message", {
    user: "SYSTEM",
    text: socket.username + " joined the room"
  });
});


  socket.on("disconnect", () => {
    if (socket.room) {
      io.to(socket.room).emit("message", {
        user: "SYSTEM",
        text: socket.username + " left the room"
      });
    }
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
