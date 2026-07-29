import {
  DIFFICULTY,
  shuffle,
  formatTime,
  calculateScore,
  getBestScore,
  saveBestScore,
  formatBestScore,
} from "./utils.js";
import { FRUITS, fruitImageUrl } from "./fruits.js";

const FLIP_BACK_DELAY_MS = 1500;

export class MemoryGame {
  /**
   * @param {object} options
   * @param {HTMLElement} options.boardEl
   * @param {HTMLElement} options.movesEl
   * @param {HTMLElement} options.timerEl
   * @param {HTMLElement} options.pairsEl
   * @param {HTMLElement} options.bestScoreEl
   * @param {HTMLElement} options.winModalEl
   * @param {HTMLElement} options.finalMovesEl
   * @param {HTMLElement} options.finalTimeEl
   * @param {HTMLElement} options.finalScoreEl
   * @param {HTMLElement} options.newRecordEl
   */
  constructor(options) {
    this.boardEl = options.boardEl;
    this.movesEl = options.movesEl;
    this.timerEl = options.timerEl;
    this.pairsEl = options.pairsEl;
    this.bestScoreEl = options.bestScoreEl;
    this.winModalEl = options.winModalEl;
    this.finalMovesEl = options.finalMovesEl;
    this.finalTimeEl = options.finalTimeEl;
    this.finalScoreEl = options.finalScoreEl;
    this.newRecordEl = options.newRecordEl;

    this.difficulty = "medium";
    this.cards = [];
    this.flipped = [];
    this.matchedCount = 0;
    this.moves = 0;
    this.seconds = 0;
    this.timerInterval = null;
    this.isLocked = false;
    this.isPlaying = false;
  }

  /** @param {string} difficulty */
  setDifficulty(difficulty) {
    this.difficulty = difficulty in DIFFICULTY ? difficulty : "medium";
  }

  start() {
    this.stopTimer();
    this.resetState();
    this.renderBoard();
    this.updateStats();
    this.isPlaying = true;
    this.startTimer();
  }

  resetState() {
    this.flipped = [];
    this.matchedCount = 0;
    this.moves = 0;
    this.seconds = 0;
    this.isLocked = false;
    this.hideWinModal();
  }

  /** @returns {number} total card count for current difficulty */
  getTotalCards() {
    const { cols, rows } = DIFFICULTY[this.difficulty];
    return cols * rows;
  }

  /** @returns {number} number of pairs */
  getPairCount() {
    return this.getTotalCards() / 2;
  }

  buildDeck() {
    const pairCount = this.getPairCount();
    const picked = shuffle(FRUITS).slice(0, pairCount);
    const pairs = picked.flatMap((fruit, pairId) => [
      { ...fruit, pairId },
      { ...fruit, pairId },
    ]);
    return shuffle(pairs);
  }

  renderBoard() {
    this.cards = this.buildDeck();
    const { label } = DIFFICULTY[this.difficulty];

    this.boardEl.className = `game-board game-board--${label}`;
    this.boardEl.innerHTML = "";

    this.cards.forEach((card, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card";
      btn.dataset.index = String(index);
      btn.setAttribute("aria-label", "Face down card");
      const imgSrc = fruitImageUrl(card.emoji);
      btn.innerHTML = `
        <span class="card__inner">
          <span class="card__face card__face--back" aria-hidden="true">
            <span class="card__back-pattern"></span>
            <span class="card__back-text">Flip</span>
          </span>
          <span class="card__face card__face--front" aria-hidden="true">
            <img class="card__fruit-img" src="${imgSrc}" alt="" width="56" height="56" decoding="async" />
            <span class="card__fruit-fallback" hidden>${card.emoji}</span>
            <span class="card__fruit-label">${card.name}</span>
          </span>
        </span>
      `;
      btn.addEventListener("click", () => this.handleCardClick(index));

      const img = btn.querySelector(".card__fruit-img");
      const fallback = btn.querySelector(".card__fruit-fallback");
      img?.addEventListener("error", () => {
        img.hidden = true;
        if (fallback) fallback.hidden = false;
      });

      this.boardEl.appendChild(btn);
    });
  }

  /** @param {number} index */
  handleCardClick(index) {
    if (this.isLocked || !this.isPlaying) return;

    const cardEl = this.boardEl.children[index];
    const card = this.cards[index];

    if (
      cardEl.classList.contains("card--flipped") ||
      cardEl.classList.contains("card--matched")
    ) {
      return;
    }

    this.flipCard(index);

    if (this.flipped.length === 2) {
      this.moves++;
      this.updateStats();
      this.checkMatch();
    }
  }

  /** @param {number} index */
  flipCard(index) {
    const cardEl = this.boardEl.children[index];
    cardEl.classList.add("card--flipped");
    cardEl.setAttribute("aria-label", `Revealed ${this.cards[index].name}`);
    this.flipped.push(index);
  }

  checkMatch() {
    const [first, second] = this.flipped;
    const cardA = this.cards[first];
    const cardB = this.cards[second];
    const elA = this.boardEl.children[first];
    const elB = this.boardEl.children[second];

    this.isLocked = true;

    if (cardA.pairId === cardB.pairId) {
      elA.classList.add("card--matched");
      elB.classList.add("card--matched");
      elA.disabled = true;
      elB.disabled = true;
      this.matchedCount++;
      this.flipped = [];
      this.isLocked = false;
      this.updateStats();

      if (this.matchedCount === this.getPairCount()) {
        this.handleWin();
      }
    } else {
      elA.classList.add("card--mismatch");
      elB.classList.add("card--mismatch");

      setTimeout(() => {
        elA.classList.remove("card--flipped", "card--mismatch");
        elB.classList.remove("card--flipped", "card--mismatch");
        elA.setAttribute("aria-label", "Face down card");
        elB.setAttribute("aria-label", "Face down card");
        this.flipped = [];
        this.isLocked = false;
      }, FLIP_BACK_DELAY_MS);
    }
  }

  handleWin() {
    this.isPlaying = false;
    this.stopTimer();

    const score = calculateScore(this.moves, this.seconds, this.getPairCount());
    const isNewBest = saveBestScore(this.difficulty, this.moves, score);

    this.finalMovesEl.textContent = String(this.moves);
    this.finalTimeEl.textContent = formatTime(this.seconds);
    this.finalScoreEl.textContent = String(score);
    this.newRecordEl.hidden = !isNewBest;

    this.updateStats();
    this.showWinModal();
  }

  updateStats() {
    const pairCount = this.getPairCount();
    this.movesEl.textContent = String(this.moves);
    this.timerEl.textContent = formatTime(this.seconds);
    this.pairsEl.textContent = `${this.matchedCount} / ${pairCount}`;
    this.bestScoreEl.textContent = formatBestScore(getBestScore(this.difficulty));
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.seconds++;
      this.timerEl.textContent = formatTime(this.seconds);
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  showWinModal() {
    this.winModalEl.hidden = false;
    document.getElementById("play-again-btn")?.focus();
  }

  hideWinModal() {
    this.winModalEl.hidden = true;
    this.newRecordEl.hidden = true;
  }
}
