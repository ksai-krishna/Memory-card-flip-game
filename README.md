# Memory Card Flip Game

A polished memory matching game built with HTML, CSS, and JavaScript. Flip two cards at a time, match all pairs, and beat your personal best score.

## Features

- **Three difficulty levels** — Easy (4×4), Medium (4×5), Hard (6×6)
- **Move counter & timer** — Track performance in real time
- **Scoring system** — Higher scores for fewer moves and faster completion
- **Personal bests** — Saved locally per difficulty (localStorage)
- **Smooth animations** — Card flips, match pulse, mismatch shake
- **Accessible** — Keyboard-friendly, ARIA labels, responsive layout
- **Azure-ready** — GitHub Actions workflow for Azure Static Web Apps

## Quick Start (Local)

No build step required. Open the game in any modern browser:

```bash
# Option 1: Open index.html directly in your browser

# Option 2: Serve locally with Python
cd memory-card-flip-game
python -m http.server 8080
# Visit http://localhost:8080
```

## Project Structure

```
memory-card-flip-game/
├── index.html              # Main page
├── css/
│   └── styles.css          # UI, animations, responsive layout
├── js/
│   ├── app.js              # Entry point, event wiring
│   ├── game.js             # Core game logic
│   └── utils.js            # Shuffle, scoring, localStorage
├── staticwebapp.config.json
├── .github/workflows/
│   └── azure-static-web-apps.yml
└── README.md
```

## How to Play

1. Choose a difficulty and click **New Game**.
2. Click two face-down cards to flip them.
3. If they match → they stay face up.
4. If not → they flip back after 1 second.
5. Match all pairs to win. Lower moves + faster time = higher score.

## Scoring

```
Score = (pairs × 100) − (extra moves × 10) − (seconds × 2)
```

Your best score per difficulty is stored in the browser.

## Deploy to Azure Static Web Apps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Memory Card Flip Game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/memory-card-flip-game.git
git push -u origin main
```

### 2. Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com) → **Create a resource** → **Static Web App**
2. Link your GitHub repository
3. Set build settings:
   - **App location:** `/`
   - **Api location:** *(leave empty)*
   - **Output location:** *(leave empty)*
4. Azure adds the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret automatically

### 3. Auto-deploy

Every push to `main` triggers the GitHub Action and deploys the site.

## Optional Extensions

| Feature | Suggested stack |
|---------|-----------------|
| Leaderboard | Node.js API + Azure SQL / Cosmos DB |
| Multiplayer | WebSockets + Azure App Service |
| User accounts | Azure AD B2C |

## License

MIT
