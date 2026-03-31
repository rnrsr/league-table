<script>
  import { onMount } from 'svelte';
  import { leagueStore } from './stores/leagueStore.js';
  import Header from './components/Header.svelte';
  import TabContainer from './components/TabContainer.svelte';
  import LeagueStandings from './components/LeagueStandings.svelte';
  import FixturesGrid from './components/FixturesGrid.svelte';
  import './styles/global.css';

  let leagueData;
  let isLoading = true;
  let hasError = false;
  let activeTab = 'standings';

  onMount(() => {
    leagueStore.load();
  });

  leagueStore.subscribe(data => {
    leagueData = data;
    isLoading = data.loading;
    hasError = data.error !== null;
  });

  function handleTabChange(tab) {
    activeTab = tab;
  }
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
    <TabContainer {activeTab} onChange={handleTabChange}>
      {#if activeTab === 'standings'}
        <LeagueStandings players={leagueData.players} />
      {:else if activeTab === 'fixtures'}
        <FixturesGrid players={leagueData.players} matches={leagueData.matches} />
      {/if}
    </TabContainer>
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

