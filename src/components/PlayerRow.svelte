<script>
  export let player = null;
  export let rank = 0;

  // Calculate derived stats
  $: totalMatches = player.wins + player.draws + player.losses;
  $: winRate = totalMatches > 0 ? ((player.wins / totalMatches) * 100).toFixed(1) : 0;
</script>

<tr class="player-row">
  <td class="rank">#{rank}</td>
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
  <td class="points vp">{player.totalVictoryPoints}</td>
  <td class="points tp">{player.totalTournamentPoints}</td>
</tr>

<style>
  .player-row {
    background-color: var(--color-dark);
    border-bottom: 1px solid var(--color-border);
    transition: all 0.3s ease;
  }

  .player-row:hover {
    background-color: var(--color-bg-secondary);
    border-left: 3px solid var(--color-gold);
  }

  td {
    padding: var(--spacing-md);
    text-align: left;
  }

  .rank {
    font-weight: 700;
    color: var(--color-gold);
    text-align: center;
    width: 60px;
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
    width: 100px;
  }

  .points.vp {
    color: var(--color-text-secondary);
  }

  .points.tp {
    color: var(--color-gold);
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    td {
      padding: var(--spacing-sm);
      font-size: 0.9rem;
    }

    .rank {
      width: 45px;
    }

    .points {
      width: 70px;
    }

    .army {
      display: none;
    }
  }
</style>
