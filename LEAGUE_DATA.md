# League Data Format

Edit `public/data/fixtures.json` to manage your league. This is the single source of truth.

## Root Structure

```json
{
  "league": { ... },
  "players": [ ... ],
  "matches": [ ... ]
}
```

## League Metadata

```json
{
  "league": {
    "name": "Warhammer The Old World League",
    "season": 1,
    "updated": "2026-03-31"
  }
}
```

- **name** (string): Display name of the league
- **season** (number): Season number
- **updated** (string): ISO date of last update (YYYY-MM-DD)

## Players Array

Player metadata only (no stats - stats are derived from matches):

```json
{
  "id": "rich",
  "name": "Rich",
  "army": "Wolves of the Sea"
}
```

### Player Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (lowercase, no spaces) |
| `name` | string | Yes | Player's display name |
| `army` | string | Yes | Army faction name |

## Matches Array

Each match entry represents one game played between two players:

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

### Match Fields

| Field | Type | Required | Condition | Description |
|-------|------|----------|-----------|-------------|
| `id` | string | Yes | Always | Unique match identifier |
| `player1Id` | string | Yes | Always | ID of first player |
| `player2Id` | string | Yes | Always | ID of second player |
| `player1VP` | number | Conditional | If `played: true` | Victory points scored by player 1 |
| `player2VP` | number | Conditional | If `played: true` | Victory points scored by player 2 |
| `played` | boolean | Yes | Always | Whether the match has been played |

### Tournament Points Calculation

Tournament Points are automatically calculated from Victory Point differential:

| VP Diff | Result | Player 1 TP | Player 2 TP |
|---------|--------|------------|------------|
| 0-300 | Draw | 3 | 3 |
| 301-750 | Marginal | 4 (winner) | 2 (loser) |
| 751-1400 | Resounding | 5 (winner) | 1 (loser) |
| 1401+ | Crushing | 6 (winner) | 0 (loser) |

## Example Data

```json
{
  "league": {
    "name": "Warhammer The Old World League",
    "season": 1,
    "updated": "2026-03-31"
  },
  "players": [
    {
      "id": "rich",
      "name": "Rich",
      "army": "Wolves of the Sea"
    },
    {
      "id": "hector",
      "name": "Hector",
      "army": "Vampire Counts"
    },
    {
      "id": "phil",
      "name": "Phil",
      "army": "Grand Cathay"
    }
  ],
  "matches": [
    {
      "id": "match_001",
      "player1Id": "rich",
      "player2Id": "hector",
      "player1VP": 950,
      "player2VP": 1050,
      "played": true
    },
    {
      "id": "match_002",
      "player1Id": "rich",
      "player2Id": "phil",
      "player1VP": 1200,
      "player2VP": 600,
      "played": true
    },
    {
      "id": "match_003",
      "player1Id": "hector",
      "player2Id": "phil",
      "played": false
    }
  ]
}
```

## How to Use

### Playing a New Match

1. Add a new match object to the `matches` array
2. Set `played: true`
3. Add `player1VP` and `player2VP` values (Victory Points for each side)
4. Save the file
5. The standings will auto-update with calculated Tournament Points

### Scheduling a Future Match

1. Add a new match object to the `matches` array
2. Set `played: false`
3. Do NOT include VP values
4. Save the file
5. The match will appear in the fixtures grid but won't affect standings

### Edit League Info

Update `league.name`, `league.season`, or `league.updated` as needed.

## Notes

- Only matches with `"played": true` are included in standings calculations
- Standings are ranked by Tournament Points (primary) then Victory Points Diff (tiebreaker)
- Win/Draw/Loss records are derived from match results (no need to track separately)
- All player stats (VP For/Against, TP, W/D/L) are calculated automatically from match data
- The fixtures grid shows all played matches in a matrix view by player
