/**
 * Fixture and standings calculation utilities
 */

const scenarios = [
  "Upon the Field of Glory",
  "King of the Hill",
  "Drawn Battle Lines",
  "Close Quarters",
  "A Chance Encounter",
  "Encirclement"
];

export function getScenarioName(scenarioNum) {
  if (!scenarioNum) return null;
  const idx = parseInt(scenarioNum) - 1;
  return scenarios[idx] || null;
}

export function calculateTournamentPoints(vpDiff) {
  // Determine TP based on VP differential
  const absDiff = Math.abs(vpDiff);

  if (absDiff <= 300) {
    return { tp: 3, result: 'draw' };
  } else if (absDiff <= 750) {
    return { tp: vpDiff > 0 ? 4 : 2, result: vpDiff > 0 ? 'win' : 'loss' };
  } else if (absDiff <= 1400) {
    return { tp: vpDiff > 0 ? 5 : 1, result: vpDiff > 0 ? 'win' : 'loss' };
  } else {
    return { tp: vpDiff > 0 ? 6 : 0, result: vpDiff > 0 ? 'win' : 'loss' };
  }
}

export function getWinLevel(vpDiff) {
  const absDiff = Math.abs(vpDiff);

  if (absDiff <= 300) return 'Draw';
  if (absDiff <= 750) return 'Marginal Victory';
  if (absDiff <= 1400) return 'Resounding Victory';
  return 'Crushing Victory';
}

export function derivePlayerStats(players, matches) {
  // Initialize player stats
  const playerMap = {};
  players.forEach(player => {
    playerMap[player.id] = {
      ...player,
      wins: 0,
      draws: 0,
      losses: 0,
      victoryPointsFor: 0,
      victoryPointsAgainst: 0,
      victoryPointDiff: 0,
      totalTournamentPoints: 0
    };
  });

  // Process only played matches
  const playedMatches = matches.filter(m => m.played);

  playedMatches.forEach(match => {
    const p1 = playerMap[match.player1Id];
    const p2 = playerMap[match.player2Id];

    // Add VP
    p1.victoryPointsFor += match.player1VP;
    p1.victoryPointsAgainst += match.player2VP;
    p2.victoryPointsFor += match.player2VP;
    p2.victoryPointsAgainst += match.player1VP;

    // Calculate TP and result
    const vpDiff = match.player1VP - match.player2VP;
    const p1Result = calculateTournamentPoints(vpDiff);
    const p2Result = calculateTournamentPoints(-vpDiff);

    p1.totalTournamentPoints += p1Result.tp;
    p2.totalTournamentPoints += p2Result.tp;

    // Update wins/draws/losses
    if (p1Result.result === 'win') {
      p1.wins++;
      p2.losses++;
    } else if (p1Result.result === 'loss') {
      p1.losses++;
      p2.wins++;
    } else {
      p1.draws++;
      p2.draws++;
    }
  });

  // Calculate VP diff for all players
  Object.values(playerMap).forEach(player => {
    player.victoryPointDiff = player.victoryPointsFor - player.victoryPointsAgainst;
  });

  return Object.values(playerMap);
}

export function getMatchMatrix(players, matches) {
  // Create a matrix lookup for quick access to match results
  const matrix = {};

  players.forEach(p1 => {
    matrix[p1.id] = {};
    players.forEach(p2 => {
      matrix[p1.id][p2.id] = null;
    });
  });

  // Only include played matches
  const playedMatches = matches.filter(m => m.played);

  playedMatches.forEach(match => {
    const vpDiff = match.player1VP - match.player2VP;
    const p1Result = calculateTournamentPoints(vpDiff);
    const p2Result = calculateTournamentPoints(-vpDiff);

    matrix[match.player1Id][match.player2Id] = {
      matchId: match.id,
      player1VP: match.player1VP,
      player2VP: match.player2VP,
      player1TP: p1Result.tp,
      player2TP: p2Result.tp,
      player1Result: p1Result.result,
      player2Result: p2Result.result,
      vpDiff: vpDiff,
      scenario: getScenarioName(match.scenario)
    };

    matrix[match.player2Id][match.player1Id] = {
      matchId: match.id,
      player1VP: match.player2VP,
      player2VP: match.player1VP,
      player1TP: p2Result.tp,
      player2TP: p1Result.tp,
      player1Result: p2Result.result,
      player2Result: p1Result.result,
      vpDiff: -vpDiff,
      scenario: getScenarioName(match.scenario)
    };
  });

  return matrix;
}

export function getGameImages(matchId) {
  const images = [];
  const basePath = '/images/games/';
  
  for (let i = 1; i <= 10; i++) {
    images.push(`${basePath}${matchId}_${i}.jpg`);
  }
  
  return images;
}
