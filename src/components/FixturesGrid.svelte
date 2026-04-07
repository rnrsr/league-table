<script>
  import { getMatchMatrix, getWinLevel, getGameImages } from '../utils/fixtures.js';

  export let players = [];
  export let matches = [];

  let matchMatrix = {};
  let hoveredMatch = null;
  let selectedMatch = null;
  let currentImageIndex = 0;

  $: matchMatrix = getMatchMatrix(players, matches);

  $: playerMap = players.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  async function checkImageExists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) return false;
      const contentType = res.headers.get('content-type');
      return contentType && contentType.startsWith('image/');
    } catch {
      return false;
    }
  }

  async function getAvailableImages(matchId) {
    const urls = getGameImages(matchId);
    const available = [];
    for (const url of urls) {
      if (await checkImageExists(url)) {
        available.push(url);
      }
    }
    return available;
  }

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
        matchId: m.id,
        highPlayer: p1Wins ? (p1?.name || m.player1Id) : (p2?.name || m.player2Id),
        lowPlayer: p1Wins ? (p2?.name || m.player2Id) : (p1?.name || m.player1Id),
        highVP: Math.max(m.player1VP, m.player2VP),
        lowVP: Math.min(m.player1VP, m.player2VP),
        scenario: matrixMatch?.scenario,
        result: p1Wins ? matrixMatch?.player1Result : (p2Wins ? matrixMatch?.player2Result : 'draw'),
        winner: p1Wins ? (p1?.name || m.player1Id) : (p2Wins ? (p2?.name || m.player2Id) : null),
        winLevel: getWinLevel(m.player1VP - m.player2VP),
        imageUrls: getGameImages(m.id)
      };
    });

  function handleMouseEnter(matchId) {
    hoveredMatch = matchId;
  }

  function handleMouseLeave() {
    hoveredMatch = null;
  }

  async function openModal(matchId) {
    const match = playedMatches.find(m => m.matchId === matchId);
    if (match) {
      const available = await getAvailableImages(matchId);
      if (available.length > 0) {
        selectedMatch = { ...match, availableImages: available };
        currentImageIndex = 0;
      }
    }
  }

  function closeModal() {
    selectedMatch = null;
    currentImageIndex = 0;
  }

  function prevImage() {
    if (selectedMatch) {
      currentImageIndex = (currentImageIndex - 1 + selectedMatch.availableImages.length) % selectedMatch.availableImages.length;
    }
  }

  function nextImage() {
    if (selectedMatch) {
      currentImageIndex = (currentImageIndex + 1) % selectedMatch.availableImages.length;
    }
  }

  function handleKeydown(e) {
    if (!selectedMatch) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

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
                     class:hovered={hoveredMatch === match.matchId}
                     on:mouseenter={() => handleMouseEnter(match.matchId)}
                     on:mouseleave={handleMouseLeave}
                     role="button"
                     tabindex="0"
                     on:click={() => openModal(match.matchId)}
                     on:keydown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         openModal(match.matchId);
                       }
                     }}
                   >
                     <span class="vp">{match.player1VP}-{match.player2VP}</span>
                     <span class="tp">({match.player1TP})</span>
                     <button class="image-icon" aria-label="View game photos" on:click|stopPropagation={() => openModal(match.matchId)}>
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                         <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                         <circle cx="8.5" cy="8.5" r="1.5"></circle>
                         <polyline points="21 15 16 10 5 21"></polyline>
                       </svg>
                      </button>
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
           <li 
             class="match-item" 
             class:win={match.result === 'win'} 
             class:loss={match.result === 'loss'} 
             class:draw={match.result === 'draw'}
             class:hovered={hoveredMatch === match.matchId}
             on:mouseenter={() => handleMouseEnter(match.matchId)}
             on:mouseleave={handleMouseLeave}
           >
            <span class="players">{match.highPlayer} {match.highVP} - {match.lowVP} {match.lowPlayer}</span>
            {#if match.scenario}
              <span class="match-scenario">({match.scenario})</span>
            {/if}
            <span class="result">
              {#if match.result === 'win'}{match.winner} - {match.winLevel}
              {:else if match.result === 'draw'}Draw{/if}
            </span>
             <button class="image-icon-small" aria-label="View game photos" on:click={() => openModal(match.matchId)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
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

   {#if selectedMatch}
     <div class="modal-overlay" on:click={closeModal} on:keydown={(e) => {
       if (e.key === 'Escape') closeModal();
     }} role="dialog" aria-modal="true" tabindex="-1">
       <div class="modal-content" on:click|stopPropagation role="presentation">
        <button class="modal-close" on:click={closeModal} aria-label="Close">&times;</button>
        
        {#if selectedMatch.availableImages.length > 1}
          <button class="carousel-btn prev" on:click={prevImage} aria-label="Previous image">&#10094;</button>
        {/if}
        
        <img 
          src={selectedMatch.availableImages[currentImageIndex]} 
          alt="Game photo {currentImageIndex + 1} of {selectedMatch.matchId}"
          class="modal-image"
        />
        
        {#if selectedMatch.availableImages.length > 1}
          <button class="carousel-btn next" on:click={nextImage} aria-label="Next image">&#10095;</button>
        {/if}
        
        {#if selectedMatch.availableImages.length > 1}
          <div class="carousel-dots">
           {#each selectedMatch.availableImages as _, i}
               <button
                 type="button"
                 class="dot" 
                 class:active={i === currentImageIndex}
                 on:click={() => currentImageIndex = i}
                 aria-label="Go to image {i + 1}"
               ></button>
             {/each}
          </div>
        {/if}
      </div>
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
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
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

  .match-result.hovered {
    outline: 2px solid var(--color-accent);
    outline-offset: -2px;
    box-shadow: 0 0 8px rgba(139, 69, 19, 0.4);
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

  .image-icon {
    position: absolute;
    bottom: 2px;
    right: 2px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 2px;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .image-icon:hover {
    opacity: 1;
  }

  .match-result {
    position: relative;
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
    cursor: pointer;
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

  .match-item.hovered {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    box-shadow: 0 0 8px rgba(139, 69, 19, 0.4);
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

  .image-icon-small {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 4px;
    opacity: 0.6;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
  }

  .image-icon-small:hover {
    opacity: 1;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .modal-image {
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 4px;
  }

  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 1.5rem;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .carousel-btn:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .carousel-btn.prev {
    left: -60px;
  }

  .carousel-btn.next {
    right: -60px;
  }

  .carousel-dots {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: background 0.2s;
  }

  .dot.active {
    background: white;
  }

  .dot:hover {
    background: rgba(255, 255, 255, 0.7);
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
