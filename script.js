const socket = io();

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");
const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomInput");

let roomId = "";
let symbol = "";
let myTurn = false;

let board = Array(9).fill("");

joinBtn.onclick = () => {
  roomId = roomInput.value;
  socket.emit("joinRoom", roomId);
};

// when players join
socket.on("playerUpdate", (players) => {
  statusText.innerText = `Players in room: ${players.length}`;
});

// start game
socket.on("startGame", (data) => {
  symbol = socket.id === data.first ? "X" : "O";
  myTurn = symbol === "X";

  statusText.innerText = "Game started! You are " + symbol;

  createBoard();
});

// receive opponent move
socket.on("moveMade", ({ index, symbol: sym }) => {
  board[index] = sym;
  document.querySelectorAll(".cell")[index].innerText = sym;
  myTurn = true;
});

// create board
function createBoard() {
  boardDiv.innerHTML = "";

  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.onclick = () => makeMove(i);
    boardDiv.appendChild(cell);
  });
}

// make move
function makeMove(i) {
  if (!myTurn || board[i]) return;

  board[i] = symbol;
  document.querySelectorAll(".cell")[i].innerText = symbol;

  socket.emit("makeMove", {
    roomId,
    index: i,
    symbol
  });

  myTurn = false;
}
