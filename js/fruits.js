/** Fruit pairs — same image appears twice on the board. */
export const FRUITS = [
  { name: "Apple", emoji: "🍎" },
  { name: "Banana", emoji: "🍌" },
  { name: "Grapes", emoji: "🍇" },
  { name: "Orange", emoji: "🍊" },
  { name: "Strawberry", emoji: "🍓" },
  { name: "Peach", emoji: "🍑" },
  { name: "Cherries", emoji: "🍒" },
  { name: "Kiwi", emoji: "🥝" },
  { name: "Pineapple", emoji: "🍍" },
  { name: "Watermelon", emoji: "🍉" },
  { name: "Mango", emoji: "🥭" },
  { name: "Pear", emoji: "🍐" },
  { name: "Blueberries", emoji: "🫐" },
  { name: "Lemon", emoji: "🍋" },
  { name: "Coconut", emoji: "🥥" },
  { name: "Melon", emoji: "🍈" },
  { name: "Avocado", emoji: "🥑" },
  { name: "Tomato", emoji: "🍅" },
];

const TWEMOJI_BASE =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72";

/**
 * PNG fruit icon URL (Twemoji) — renders consistently in all browsers.
 * @param {string} emoji
 * @returns {string}
 */
export function fruitImageUrl(emoji) {
  const codePoint = [...emoji]
    .map((char) => char.codePointAt(0).toString(16))
    .join("-");
  return `${TWEMOJI_BASE}/${codePoint}.png`;
}
