const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// serve frontend
app.use(express.static("public"));

// store rooms
let rooms = {};

// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        board: Array(9).fill("")
      };
    }

    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
    }

    io.to(roomId).emit("playerUpdate", rooms[roomId].players);

    // start game when 2 players join
    if (rooms[roomId].players.length === 2) {
      io.to(roomId).emit("startGame", {
        players: rooms[roomId].players,
        turn: rooms[roomId].players[0]
      });
    }
  });

  // move event
  socket.on("makeMove", ({ roomId, index, symbol }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].board[index] = symbol;

    socket.to(roomId).emit("moveMade", {
      index,
      symbol
    });
  });

  // disconnect cleanup
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (let roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(
        (id) => id !== socket.id
      );
    }
  });
});

// PORT for Render
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});