/** Difficulty presets: columns × rows */
export const DIFFICULTY = {
  easy: { cols: 4, rows: 4, label: "easy" },
  medium: { cols: 4, rows: 5, label: "medium" },
  hard: { cols: 6, rows: 6, label: "hard" },
};

const STORAGE_KEY = "memory-flip-best-scores";

/**
 * Fisher-Yates shuffle (in-place copy).
 * @param {Array} array
 * @returns {Array}
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Format seconds as m:ss
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Score: higher is better. Rewards speed and penalizes extra moves.
 * @param {number} moves
 * @param {number} seconds
 * @param {number} pairCount
 * @returns {number}
 */
export function calculateScore(moves, seconds, pairCount) {
  const idealMoves = pairCount;
  const movePenalty = Math.max(0, moves - idealMoves) * 10;
  const timePenalty = seconds * 2;
  const base = pairCount * 100;
  return Math.max(0, Math.round(base - movePenalty - timePenalty));
}

/**
 * @param {string} difficulty
 * @returns {{ moves: number, score: number } | null}
 */
export function getBestScore(difficulty) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return data[difficulty] ?? null;
  } catch {
    return null;
  }
}

/**
 * @param {string} difficulty
 * @param {number} moves
 * @param {number} score
 * @returns {boolean} true if new personal best
 */
export function saveBestScore(difficulty, moves, score) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const current = data[difficulty];
    const isNewBest = !current || score > current.score;

    if (isNewBest) {
      data[difficulty] = { moves, score };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return isNewBest;
  } catch {
    return false;
  }
}

/**
 * @param {{ moves: number, score: number } | null} best
 * @returns {string}
 */
export function formatBestScore(best) {
  if (!best) return "—";
  return `${best.score} pts`;
}
