<script>
  import { getMatchMatrix, getWinLevel } from '../utils/fixtures.js';

  export let players = [];
  export let matches = [];

  let matchMatrix = {};

  $: matchMatrix = getMatchMatrix(players, matches);

  $: playerMap = players.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  $: playedMatches = matches
    .filter(m => m.played)
    .map(m => {
      const p1 = playerMap[m.player1Id];
      const p2 = playerMap[m.player2Id];
      const matrixMatch = matchMatrix[m.player1Id]?.[m.player2Id];
      const p1Wins = m.player1VP > m.player2VP;
      const p2Wins = m.player2VP > m.player1VP;
      const vpDiff = Math.abs(m.player1VP - m.player2VP);
      return {
        highPlayer: p1Wins ? (p1?.name || m.player1Id) : (p2?.name || m.player2Id),
        lowPlayer: p1Wins ? (p2?.name || m.player2Id) : (p1?.name || m.player1Id),
        highVP: Math.max(m.player1VP, m.player2VP),
        lowVP: Math.min(m.player1VP, m.player2VP),
        scenario: matrixMatch?.scenario,
        result: p1Wins ? matrixMatch?.player1Result : (p2Wins ? matrixMatch?.player2Result : 'draw'),
        winner: p1Wins ? (p1?.name || m.player1Id) : (p2Wins ? (p2?.name || m.player2Id) : null),
        winLevel: getWinLevel(m.player1VP - m.player2VP)
      };
    });
</script>

<div class="fixtures-container">
  <div class="matrix-wrapper">
    <table class="fixtures-matrix">
      <thead>
        <tr>
          <th class="player-header"></th>
          {#each players as player}
            <th class="opponent-header">{player.name}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each players as rowPlayer}
          <tr>
            <td class="player-header">{rowPlayer.name}</td>
            {#each players as colPlayer}
              <td
                class="match-cell"
                class:same-player={rowPlayer.id === colPlayer.id}
                class:has-match={matchMatrix[rowPlayer.id] && matchMatrix[rowPlayer.id][colPlayer.id]}
              >
                {#if rowPlayer.id !== colPlayer.id && matchMatrix[rowPlayer.id] && matchMatrix[rowPlayer.id][colPlayer.id]}
                  {@const match = matchMatrix[rowPlayer.id][colPlayer.id]}
                  <div
                    class="match-result"
                    class:win={match.player1Result === 'win'}
                    class:loss={match.player1Result === 'loss'}
                    class:draw={match.player1Result === 'draw'}
                  >
                    <span class="vp">{match.player1VP}-{match.player2VP}</span>
                    <span class="tp">({match.player1TP})</span>
                  </div>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if playedMatches.length > 0}
    <div class="played-matches">
      <h3>Played Fixtures</h3>
      <ul class="match-list">
        {#each playedMatches as match}
          <li class="match-item" class:win={match.result === 'win'} class:loss={match.result === 'loss'} class:draw={match.result === 'draw'}>
            <span class="players">{match.highPlayer} {match.highVP} - {match.lowVP} {match.lowPlayer}</span>
            {#if match.scenario}
              <span class="match-scenario">({match.scenario})</span>
            {/if}
            <span class="result">
              {#if match.result === 'win'}{match.winner} - {match.winLevel}
              {:else if match.result === 'draw'}Draw{/if}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if players.length === 0}
    <div class="no-data">
      <p>No fixture data available</p>
    </div>
  {/if}
</div>

<style>
  .fixtures-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md);
  }

  .matrix-wrapper {
    overflow-x: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(92, 46, 15, 0.2);
  }

  .fixtures-matrix {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--color-dark);
    font-size: 0.9rem;
  }

  thead {
    background: linear-gradient(90deg, #d7ccb8 0%, #e8dcc8 100%);
    border-bottom: 2px solid var(--color-accent);
  }

  th {
    padding: var(--spacing-sm);
    text-align: center;
    color: var(--color-accent);
    font-weight: 700;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  th.player-header {
    text-align: left;
  }

  th.opponent-header {
    writing-mode: horizontal-tb;
    text-orientation: unset;
    width: 120px;
    font-size: 0.85rem;
  }

  tbody tr {
    border-bottom: 1px solid var(--color-border);
  }

  tbody tr:hover {
    background-color: var(--color-bg-secondary);
  }

  td {
    padding: var(--spacing-sm);
    border-right: 1px solid var(--color-border);
    text-align: center;
    width: 120px;
    min-width: 120px;
    height: 80px;
  }

  td.player-header {
    background-color: var(--color-bg-secondary);
    border-right: 2px solid var(--color-accent);
    font-weight: 700;
    color: var(--color-text);
    text-align: left;
    vertical-align: middle;
    width: 120px;
    min-width: 120px;
    height: auto;
  }

  td.same-player {
    background-color: #f0f0f0;
    opacity: 0.5;
  }

  .match-cell {
    display: table-cell;
    padding: 0;
    vertical-align: middle;
  }

  .match-result {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    background-color: transparent;
  }

  .match-result.win {
    background-color: rgba(139, 69, 19, 0.25);
    border-color: var(--color-accent);
  }

  .match-result.loss {
    background-color: rgba(92, 46, 15, 0.3);
    border-color: rgba(45, 24, 16, 0.5);
  }

  .match-result.draw {
    background-color: rgba(107, 84, 71, 0.25);
    border-color: rgba(107, 84, 71, 0.5);
  }

  .vp {
    font-weight: 700;
    color: var(--color-text);
    font-size: 0.9rem;
  }

  .tp {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .no-data {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text-secondary);
  }

  .played-matches {
    margin-top: var(--spacing-xl);
  }

  .played-matches h3 {
    color: var(--color-accent);
    font-size: 1.1rem;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border);
  }

  .match-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .match-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .match-item.win {
    border-left: 3px solid var(--color-accent);
  }

  .match-item.loss {
    border-left: 3px solid rgba(45, 24, 16, 0.5);
  }

  .match-item.draw {
    border-left: 3px solid rgba(107, 84, 71, 0.5);
  }

  .players {
    font-weight: 600;
    color: var(--color-text);
  }

  .match-scenario {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    font-style: italic;
  }

  .result {
    margin-left: auto;
    font-weight: 600;
    color: var(--color-accent);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .fixtures-container {
      padding: var(--spacing-sm);
    }

    th,
    td {
      padding: var(--spacing-xs);
      font-size: 0.8rem;
    }

    td {
      width: 80px;
      min-width: 80px;
      height: 60px;
    }

    td.player-header {
      width: 80px;
      min-width: 80px;
    }

    th.opponent-header {
      width: 80px;
    }

    .vp {
      font-size: 0.8rem;
    }

    .tp {
      font-size: 0.7rem;
    }
  }
</style>
