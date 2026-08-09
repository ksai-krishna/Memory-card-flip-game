# Memory Card Flip Game — Project Explanation

## What it is

A single-page memory matching (concentration) game built with plain
HTML, CSS, and vanilla JavaScript (ES modules). No framework, no build
step, no backend — the entire app is static files served directly to
the browser.

## Purpose

The player flips cards two at a time trying to find matching fruit
pairs, aiming to clear the board in as few moves and as little time as
possible. The app tracks moves, elapsed time, matched pairs, and a
per-difficulty personal best score saved in the browser's
`localStorage`.

## Tech stack

- HTML5
- CSS3 (custom properties/design tokens, CSS Grid, 3D transforms for
  the card-flip animation, keyframe animations, responsive media
  queries)
- Vanilla JavaScript (ES modules, no external libraries or frameworks)
- Browser `localStorage` for persisting best scores
- Google Fonts (Outfit) loaded via `<link>`
- Deployment target: Azure Static Web Apps (config and GitHub Actions
  workflow included in the repo)

## Project structure

```
Memory-card-flip-game/
├── index.html              Page shell: header, controls, stats bar,
│                            game board container, win modal
├── css/
│   └── styles.css          All visual styling and animations
├── js/
│   ├── app.js              Entry point — wires DOM controls to the game
│   ├── game.js             MemoryGame class: core game logic
│   ├── utils.js            Shuffle, scoring, time formatting,
│   │                       best-score persistence
│   └── fruits.js           List of fruit name/emoji pairs used as cards
├── staticwebapp.config.json
└── .github/workflows/      Azure Static Web Apps deploy workflow
```

## Core gameplay flow

1. The player picks a difficulty (Easy 4×4, Medium 4×5, Hard 6×6) and
   clicks **New Game**.
2. The app builds a shuffled deck: it picks enough fruit types for the
   number of pairs needed, duplicates each, and shuffles the full deck
   (Fisher-Yates shuffle in `utils.js`).
3. Each card renders as a button with two faces — a back (face-down)
   side and a front side showing the fruit's emoji and name — flipped
   between via a CSS 3D transform.
4. Clicking a face-down card flips it. After two cards are flipped,
   they're compared:
   - **Match** — both cards stay face-up permanently and become
     non-interactive.
   - **No match** — both cards flip back face-down after a short
     delay.
5. Moves and elapsed time are tracked throughout and shown in the
   stats bar.
6. When all pairs are matched, a win modal appears showing final
   moves, time, and a computed score; a new personal best is saved to
   `localStorage` if applicable.

## Scoring formula

```
Score = (pairs × 100) − (extra moves beyond the ideal × 10) − (seconds elapsed × 2)
```

Best score per difficulty persists locally in the browser and is
displayed in the stats bar and win modal.

## Key modules

- **`game.js` (`MemoryGame` class)** — owns all game state: the shuffled
  card deck, which cards are flipped/matched, move count, timer, and
  win detection. Renders the board into the DOM and handles all card
  click events.
- **`utils.js`** — stateless helper functions: shuffling, time
  formatting (`m:ss`), score calculation, and reading/writing best
  scores to `localStorage`.
- **`fruits.js`** — static data: the list of fruit names and emoji used
  as card faces.
- **`app.js`** — bootstraps a `MemoryGame` instance, binds it to the
  DOM elements in `index.html`, and wires up the New Game / Play Again
  buttons, the difficulty selector, and an Escape-key handler to close
  the win modal.
