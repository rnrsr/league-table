# League Data Format

Edit `public/data/league.json` to manage your league standings.

## Root Structure

```json
{
  "league": { ... },
  "players": [ ... ]
}
```

## League Metadata

```json
{
  "league": {
    "name": "Warhammer The Old World League Season 1",
    "season": 1,
    "updated": "2026-03-31"
  }
}
```

- **name** (string): Display name of the league
- **season** (number): Season number or year
- **updated** (string): ISO date of last update (YYYY-MM-DD)

## Players Array

Each player object contains:

```json
{
  "id": "unique_id",
  "name": "Player Display Name",
  "army": "Army Faction Name",
  "wins": 5,
  "draws": 1,
  "losses": 2,
  "victoryPointsFor": 89,
  "victoryPointsAgainst": 45,
  "victoryPointDiff": 44,
  "totalTournamentPoints": 67
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (no spaces, lowercase) |
| `name` | string | Yes | Player's display name |
| `army` | string | Yes | Army faction (e.g., "Stormcast Eternals", "Khorne") |
| `wins` | number | Yes | Total match wins |
| `draws` | number | Yes | Total match draws |
| `losses` | number | Yes | Total match losses |
| `victoryPointsFor` | number | Yes | Total victory points earned across all matches |
| `victoryPointsAgainst` | number | Yes | Total victory points conceded across all matches |
| `victoryPointDiff` | number | Yes | Victory points differential (For - Against) |
| `totalTournamentPoints` | number | Yes | Total tournament points earned |

## Example Data

```json
{
  "league": {
    "name": "Warhammer The Old World League Season 1",
    "season": 1,
    "updated": "2026-03-31"
  },
  "players": [
    {
      "id": "player_01",
      "name": "Alice",
      "army": "Stormcast Eternals",
      "wins": 5,
      "draws": 1,
      "losses": 2,
      "victoryPointsFor": 89,
      "victoryPointsAgainst": 45,
      "victoryPointDiff": 44,
      "totalTournamentPoints": 67
    },
    {
      "id": "player_02",
      "name": "Bob",
      "army": "Forces of Chaos",
      "wins": 4,
      "draws": 2,
      "losses": 2,
      "victoryPointsFor": 76,
      "victoryPointsAgainst": 38,
      "victoryPointDiff": 38,
      "totalTournamentPoints": 58
    },
    {
      "id": "player_03",
      "name": "Charlie",
      "army": "Seraphon",
      "wins": 3,
      "draws": 1,
      "losses": 4,
      "victoryPointsFor": 62,
      "victoryPointsAgainst": 56,
      "victoryPointDiff": 6,
      "totalTournamentPoints": 45
    }
  ]
}
```

## Notes

- Keep `id` fields simple and consistent (e.g., `player_01`, `player_02`)
- Tournament Points and Victory Points are tracked separately for flexibility
- The standings table will automatically rank players by Tournament Points (or Victory Points as fallback)
- Win/Loss/Draw counts are displayed but not directly used for ranking
