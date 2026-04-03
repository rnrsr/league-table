# Warhammer The Old World League Table

A single-page application for displaying Warhammer fantasy league standings. Built with Svelte and Vite, styled with a parchment aesthetic and medieval typography.

**Live**: https://tow.rnrsr.dev

## Features

- 📊 **Standings Tab** - Dynamic league table ranked by Tournament Points
- 🏆 **Fixtures Tab** - Match matrix grid showing all played games with VP and TP results
- 🎨 **Parchment Theme** - Aged paper background with brown accents and Cinzel font
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Auto-Calculated Stats** - All standings derived from match results (single source of truth)
- 🎯 **Smart TP Calculation** - Tournament Points based on VP differential:
  - 0-300 VP diff → Draw (3 TP each)
  - 301-750 VP diff → Marginal win/loss (4/2 TP)
  - 751-1400 VP diff → Resounding win/loss (5/1 TP)
  - 1401+ VP diff → Crushing win/loss (6/0 TP)
- 📦 **Static Deployment** - Deploy to GitHub Pages, Netlify, or Vercel

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install --registry https://registry.npmjs.org/
```

### Development

```bash
npm run dev
```

Opens dev server at `http://localhost:5173` with hot reload.

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder.

## Data Management

All league data is stored in `public/data/fixtures.json` - the single source of truth.

### Quick Start

Edit `public/data/fixtures.json` to:

**Add a played match:**
```json
{
  "id": "match_001",
  "player1Id": "rich",
  "player2Id": "hector",
  "player1VP": 950,
  "player2VP": 1050,
  "played": true
}
```

**Schedule a future match:**
```json
{
  "id": "match_002",
  "player1Id": "phil",
  "player2Id": "james",
  "played": false
}
```

See [LEAGUE_DATA.md](./LEAGUE_DATA.md) for complete schema and documentation.

## Project Structure

```
src/
  components/
    Header.svelte              - League title and metadata
    TabContainer.svelte        - Tab switcher (Standings/Fixtures)
    LeagueStandings.svelte     - Rankings table
    FixturesGrid.svelte        - Match matrix view
  stores/
    leagueStore.js             - Data loading and state management
  utils/
    fixtures.js                - Match calculations and matrix generation
    calculations.js            - Ranking and stats functions
    dataValidation.js          - Fixture data validation
  styles/
    global.css                 - Parchment theme, fonts, colors
  App.svelte                   - Root component with tabs
  main.js                      - App entry point

public/
  data/
    fixtures.json              - Edit this file to manage league (all data)
  index.html                   - Root HTML

vite.config.js, svelte.config.js - Build configuration
package.json - Dependencies (Svelte, Vite)
```

## How It Works

1. **Data Flow**: `fixtures.json` → Validation → Calculate stats → Display in tabs
2. **Standings Tab**: Shows ranked players with W/D/L, VP for/against/diff, and TP
3. **Fixtures Tab**: Shows all played matches in a player-vs-player matrix grid
4. **Auto-Derived**: All player stats (wins, losses, TP) calculated from match results

## Customization

### Theme Colors

Edit `src/styles/global.css` CSS variables in `:root`:
- `--color-dark`: Parchment background
- `--color-accent`: Brown accent color
- `--font-display`, `--font-body`: Typography

### Ranking Rules

Edit `src/utils/calculations.js` `calculateRankings()` to change sort order.

## License

MIT
