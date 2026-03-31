/**
 * Calculation utilities for league standings
 */

export function calculateRankings(players) {
  // Sort by Tournament Points (descending), then Victory Points Diff as tiebreaker
  return [...players]
    .sort((a, b) => {
      if (b.totalTournamentPoints !== a.totalTournamentPoints) {
        return b.totalTournamentPoints - a.totalTournamentPoints;
      }
      return b.victoryPointDiff - a.victoryPointDiff;
    })
    .map((player, index) => ({
      ...player,
      rank: index + 1
    }));
}

export function calculateStats(player) {
  const totalMatches = player.wins + player.draws + player.losses;

  return {
    totalMatches,
    winRate: totalMatches > 0 ? ((player.wins / totalMatches) * 100).toFixed(1) : 0,
    avgVictoryPointsFor: totalMatches > 0 ? (player.victoryPointsFor / totalMatches).toFixed(1) : 0,
    avgVictoryPointsAgainst: totalMatches > 0 ? (player.victoryPointsAgainst / totalMatches).toFixed(1) : 0,
    avgVictoryPointDiff: totalMatches > 0 ? (player.victoryPointDiff / totalMatches).toFixed(1) : 0,
    avgTournamentPoints: totalMatches > 0 ? (player.totalTournamentPoints / totalMatches).toFixed(1) : 0
  };
}

export function calculateLeagueStats(players) {
  const totalPlayers = players.length;
  const totalMatches = players.reduce((sum, p) => sum + p.wins + p.draws + p.losses, 0) / 2; // Each match is counted twice

  return {
    totalPlayers,
    totalMatches: Math.round(totalMatches),
    highestScore: Math.max(...players.map(p => p.totalTournamentPoints)),
    lowestScore: Math.min(...players.map(p => p.totalTournamentPoints))
  };
}
