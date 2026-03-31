/**
 * Data validation utilities
 */

export function validateFixturesData(data) {
  const errors = [];

  // Check root structure
  if (!data.league) errors.push("Missing 'league' object");
  if (!Array.isArray(data.players)) errors.push("'players' must be an array");
  if (!Array.isArray(data.matches)) errors.push("'matches' must be an array");

  // Validate league metadata
  if (data.league) {
    if (!data.league.name) errors.push("League missing 'name' field");
    if (typeof data.league.season !== "number") errors.push("League 'season' must be a number");
    if (!data.league.updated) errors.push("League missing 'updated' date");
  }

  // Validate each player
  if (Array.isArray(data.players)) {
    data.players.forEach((player, index) => {
      const prefix = `Player[${index}]`;

      if (!player.id) errors.push(`${prefix}: missing 'id'`);
      if (!player.name) errors.push(`${prefix}: missing 'name'`);
      if (!player.army) errors.push(`${prefix}: missing 'army'`);
    });
  }

  // Validate each match
  if (Array.isArray(data.matches)) {
    data.matches.forEach((match, index) => {
      const prefix = `Match[${index}]`;

      if (!match.id) errors.push(`${prefix}: missing 'id'`);
      if (!match.player1Id) errors.push(`${prefix}: missing 'player1Id'`);
      if (!match.player2Id) errors.push(`${prefix}: missing 'player2Id'`);
      if (typeof match.played !== "boolean") errors.push(`${prefix}: 'played' must be a boolean`);
      if (match.played) {
        if (typeof match.player1VP !== "number") errors.push(`${prefix}: 'player1VP' must be a number`);
        if (typeof match.player2VP !== "number") errors.push(`${prefix}: 'player2VP' must be a number`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

