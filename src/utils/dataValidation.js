/**
 * Data validation utilities
 */

export function validateLeagueData(data) {
  const errors = [];

  // Check root structure
  if (!data.league) errors.push("Missing 'league' object");
  if (!Array.isArray(data.players)) errors.push("'players' must be an array");

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
      if (typeof player.wins !== "number") errors.push(`${prefix}: 'wins' must be a number`);
      if (typeof player.draws !== "number") errors.push(`${prefix}: 'draws' must be a number`);
      if (typeof player.losses !== "number") errors.push(`${prefix}: 'losses' must be a number`);
      if (typeof player.victoryPointsFor !== "number")
        errors.push(`${prefix}: 'victoryPointsFor' must be a number`);
      if (typeof player.victoryPointsAgainst !== "number")
        errors.push(`${prefix}: 'victoryPointsAgainst' must be a number`);
      if (typeof player.totalTournamentPoints !== "number")
        errors.push(`${prefix}: 'totalTournamentPoints' must be a number`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
