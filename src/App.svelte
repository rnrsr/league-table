<script>
  import { onMount } from 'svelte';
  import { leagueStore } from './stores/leagueStore.js';
  import Header from './components/Header.svelte';
  import LeagueStandings from './components/LeagueStandings.svelte';
  import './styles/global.css';

  let leagueData;
  let isLoading = true;
  let hasError = false;

  onMount(() => {
    leagueStore.load();
  });

  leagueStore.subscribe(data => {
    leagueData = data;
    isLoading = data.loading;
    hasError = data.error !== null;
  });
</script>

<main>
  {#if isLoading}
    <div class="loading">
      <p>Loading league data...</p>
    </div>
  {:else if hasError}
    <div class="error">
      <p>⚠️ Error loading league: {leagueData.error}</p>
    </div>
  {:else}
    <Header league={leagueData.league} />
    <LeagueStandings players={leagueData.players} />
  {/if}
</main>

<style>
  :global(body) {
    background-color: var(--color-dark);
  }

  main {
    min-height: 100vh;
    background-color: var(--color-dark);
  }

  .loading,
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    color: var(--color-text);
    font-size: 1.2rem;
  }

  .error {
    color: #f44336;
  }
</style>
