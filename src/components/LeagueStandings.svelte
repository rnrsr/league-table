<script>
  import { calculateRankings } from '../utils/calculations.js';

  export let players = [];

  let rankedPlayers = [];

  $: rankedPlayers = calculateRankings(players);
</script>

<div class="standings-container">
  <div class="table-wrapper">
    <table class="standings-table">
      <thead>
        <tr>
          <th class="rank">Rank</th>
          <th class="name">Player</th>
          <th class="record">Record</th>
          <th class="points vpf">VP For</th>
          <th class="points vpa">VP Against</th>
          <th class="points vpd">VP Diff</th>
          <th class="points tp">TP</th>
        </tr>
      </thead>
      <tbody>
        {#each rankedPlayers as player (player.id)}
          <tr class="player-row" class:top-rank={player.rank <= 3}>
            <td class="rank">#{player.rank}</td>
            <td class="name">
              <div class="name-cell">
                <strong>{player.name}</strong>
                <span class="army">{player.army}</span>
              </div>
            </td>
            <td class="record">
              <span class="stat win">{player.wins}</span>
              <span class="stat draw">{player.draws}</span>
              <span class="stat loss">{player.losses}</span>
            </td>
            <td class="points vpf">{player.victoryPointsFor}</td>
            <td class="points vpa">{player.victoryPointsAgainst}</td>
            <td class="points vpd">{player.victoryPointDiff}</td>
            <td class="points tp">{player.totalTournamentPoints}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if rankedPlayers.length === 0}
    <div class="no-players">
      <p>No players found</p>
    </div>
  {/if}
</div>

<style>
  .standings-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-md);
  }

  .table-wrapper {
    overflow-x: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(92, 46, 15, 0.2);
  }

  .standings-table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--color-dark);
  }

  thead tr {
    background: linear-gradient(90deg, #d7ccb8 0%, #e8dcc8 100%);
    border-bottom: 2px solid var(--color-accent);
  }

  th {
    padding: var(--spacing-md);
    text-align: left;
    color: var(--color-accent);
    font-weight: 700;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  tbody tr {
    background-color: var(--color-dark);
    border-bottom: 1px solid var(--color-border);
    transition: all 0.3s ease;
  }

  tbody tr:hover {
    background-color: var(--color-bg-secondary);
    border-left: 3px solid var(--color-accent);
  }

  tbody tr.top-rank {
    border-left: 3px solid var(--color-accent);
  }

  td {
    padding: var(--spacing-md);
    text-align: left;
  }

  .rank {
    width: 60px;
    text-align: center;
    font-weight: 700;
    color: var(--color-accent);
  }

  .name-cell {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .name-cell strong {
    color: var(--color-light);
  }

  .army {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    font-weight: 400;
  }

  .record {
    display: flex;
    gap: var(--spacing-xs);
    font-family: monospace;
  }

  .stat {
    display: inline-block;
    width: 30px;
    text-align: center;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    font-weight: 700;
    font-size: 0.9rem;
  }

  .stat.win {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .stat.draw {
    background-color: rgba(255, 193, 7, 0.2);
    color: #ffc107;
  }

  .stat.loss {
    background-color: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .points {
    text-align: right;
    font-weight: 700;
    width: 85px;
  }

  .points.vpf,
  .points.vpa,
  .points.vpd {
    color: var(--color-text-secondary);
    width: 80px;
  }

  .points.vpd {
    font-weight: 700;
    color: var(--color-accent);
  }

  .points.tp {
    color: var(--color-accent);
    font-size: 1.1rem;
  }

  .no-players {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text-secondary);
  }

  @media (max-width: 768px) {
    .standings-container {
      padding: var(--spacing-sm);
    }

    th, td {
      padding: var(--spacing-sm);
      font-size: 0.9rem;
    }

    .rank {
      width: 45px;
    }

    .points {
      width: 60px;
      font-size: 0.85rem;
    }

    .points.vpf,
    .points.vpa,
    .points.vpd {
      width: 55px;
    }

    .army {
      display: none;
    }
  }
</style>
