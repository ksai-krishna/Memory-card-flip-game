import { MemoryGame } from "./game.js";

const game = new MemoryGame({
  boardEl: document.getElementById("game-board"),
  movesEl: document.getElementById("moves"),
  timerEl: document.getElementById("timer"),
  pairsEl: document.getElementById("pairs"),
  bestScoreEl: document.getElementById("best-score"),
  winModalEl: document.getElementById("win-modal"),
  finalMovesEl: document.getElementById("final-moves"),
  finalTimeEl: document.getElementById("final-time"),
  finalScoreEl: document.getElementById("final-score"),
  newRecordEl: document.getElementById("new-record"),
});

const difficultySelect = document.getElementById("difficulty");
const newGameBtn = document.getElementById("new-game-btn");
const playAgainBtn = document.getElementById("play-again-btn");

function startNewGame() {
  game.setDifficulty(difficultySelect.value);
  game.start();
}

newGameBtn.addEventListener("click", startNewGame);
playAgainBtn.addEventListener("click", startNewGame);

difficultySelect.addEventListener("change", startNewGame);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !game.winModalEl.hidden) {
    game.hideWinModal();
  }
});

startNewGame();
