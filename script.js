const board = document.getElementById("gameBoard");
const statusText = document.getElementById("status");
const modeRadios = document.querySelectorAll('input[name="mode"]');

let gameMode = "friend"; // default mode
let currentPlayer = "X";
let gameActive = true;
let gameState = Array(9).fill("");

// Winning conditions
const winConditions = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

// Mode selector listener
modeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    gameMode = document.querySelector('input[name="mode"]:checked').value;
    restartGame();
  });
});

function handleCellClick(index) {
  if (!gameActive || gameState[index] !== "") return;

  if (gameMode === "friend") {
    makeMove(index, currentPlayer);
    if (!checkGameOver(currentPlayer)) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  } else if (gameMode === "computer") {
    if (currentPlayer !== "X") return;
    makeMove(index, "X");
    if (checkGameOver("X")) return;

    setTimeout(() => {
      computerMoveMinimax();
    }, 300);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  renderBoard();
}

function checkGameOver(player) {
  if (checkWin(player)) {
    statusText.textContent = `🎉 ${player === "X" ? "Player X" : gameMode === "friend" ? "Player O" : "Computer"} wins!`;
    gameActive = false;
    return true;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function checkWin(player) {
  return winConditions.some(([a, b, c]) => {
    return gameState[a] === player && gameState[b] === player && gameState[c] === player;
  });
}

function renderBoard() {
  board.innerHTML = "";
  gameState.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = value;
    cell.addEventListener("click", () => handleCellClick(index));
    board.appendChild(cell);
  });
}

function restartGame() {
  gameActive = true;
  gameState = Array(9).fill("");
  currentPlayer = "X";
  renderBoard();
  statusText.textContent = gameMode === "computer"
    ? "Your turn (X)"
    : "Player X's turn";
}

/* --- MINIMAX AI START --- */

function computerMoveMinimax() {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      let score = minimax(gameState, 0, false);
      gameState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  makeMove(move, "O");

  if (!checkGameOver("O")) {
    currentPlayer = "X";
    statusText.textContent = `Your turn (X)`;
  }
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinState(boardState, "O")) return 10 - depth;
  if (checkWinState(boardState, "X")) return depth - 10;
  if (!boardState.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinState(board, player) {
  return winConditions.some(([a,b,c]) => {
    return board[a] === player && board[b] === player && board[c] === player;
  });
}

/* --- MINIMAX AI END --- */

// Initialize game
renderBoard();
