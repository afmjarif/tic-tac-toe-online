body {
  text-align: center;
  font-family: Arial;
  background: #1e1e2f;
  color: white;
}

.joinBox {
  margin: 10px;
}

input, button {
  padding: 10px;
  margin: 5px;
}

#board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
}

.cell {
  width: 100px;
  height: 100px;
  background: white;
  color: black;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
