# Warhammer Fantasy League Table

A single-page application for displaying Warhammer fantasy league standings. Built with Svelte and Vite, styled with a dark Warhammer aesthetic.

## Features

- 📊 Dynamic league standings table
- 🎨 Warhammer-themed dark UI with gold accents
- 📱 Responsive design (desktop and mobile)
- 🎯 Tracks wins, draws, losses, Victory Points, and Tournament Points
- ⚡ Fast builds with Vite + Svelte
- 📦 Deployable as static site (GitHub Pages, Netlify, Vercel)

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens dev server at `http://localhost:5173` with hot reload.

### Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Deploy

Push the `dist/` folder to your hosting:

- **GitHub Pages**: Commit `dist/` or use Actions to deploy
- **Netlify**: Connect repo and set build command to `npm run build`
- **Vercel**: Similar to Netlify, auto-deploys on push

## Data Format

Edit `public/data/league.json` to update league standings. See `LEAGUE_DATA.md` for the schema.

```json
{
  "league": {
    "name": "League Name",
    "season": 1,
    "updated": "2026-03-31"
  },
  "players": [
    {
      "id": "player1",
      "name": "Player Name",
      "army": "Army Faction",
      "wins": 5,
      "draws": 1,
      "losses": 2,
      "totalVictoryPoints": 18,
      "totalTournamentPoints": 45
    }
  ]
}
```

## Project Structure

```
src/
  components/       - Svelte components
  stores/          - Reactive data stores
  utils/           - Utility functions
  styles/          - Global styles and theme
  App.svelte       - Root component
  main.js          - App entry point

public/
  data/
    league.json    - League standings (edit this to update)
  assets/          - Images, fonts, icons
```

## Customization

### Theme

Edit `src/styles/theme.css` to customize colors, fonts, and spacing.

### Components

Components are in `src/components/`:
- `Header.svelte` - League title and info
- `LeagueStandings.svelte` - Main standings table
- `PlayerRow.svelte` - Individual player row
- `StatsCard.svelte` - mobile card view
- `FilterSort.svelte` - Sorting and filtering controls

## License

MIT
