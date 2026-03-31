<script>
  export let league = null;
</script>

<header class="league-header">
  <div class="header-content">
    <h1>{league?.name || 'Warhammer League'}</h1>
    <div class="header-meta">
      <p><strong>Season {league?.season || 1}</strong></p>
      <p class="updated">Last updated: {league?.updated || 'Never'}</p>
    </div>
  </div>
</header>

<style>
  .league-header {
    background: linear-gradient(135deg, #e8dcc8 0%, #d7ccb8 100%);
    border-bottom: 3px solid var(--color-accent);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    box-shadow: 0 4px 20px rgba(92, 46, 15, 0.2);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: var(--spacing-sm);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .header-meta {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
    color: var(--color-text-secondary);
    font-size: 0.95rem;
  }

  .header-meta strong {
    color: var(--color-accent);
  }
</style>
