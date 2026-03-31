<script>
  export let activeTab = 'standings';
  export let onChange = () => {};
</script>

<div class="tab-container">
  <div class="tabs-header">
    <button
      class="tab-button"
      class:active={activeTab === 'standings'}
      on:click={() => onChange('standings')}
    >
      Standings
    </button>
    <button
      class="tab-button"
      class:active={activeTab === 'fixtures'}
      on:click={() => onChange('fixtures')}
    >
      Fixtures
    </button>
  </div>
  <div class="tab-content">
    <slot />
  </div>
</div>

<style>
  .tab-container {
    width: 100%;
  }

  .tabs-header {
    display: flex;
    gap: 0;
    border-bottom: 2px solid var(--color-border);
    max-width: 1200px;
    margin: 0 auto;
  }

  .tab-button {
    background-color: var(--color-dark);
    color: var(--color-text);
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: var(--font-display);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 3px solid transparent;
    font-size: 0.95rem;
  }

  .tab-button:hover {
    background-color: var(--color-bg-secondary);
  }

  .tab-button.active {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
    background-color: var(--color-bg-secondary);
  }

  .tab-content {
    padding: 0;
  }

  @media (max-width: 768px) {
    .tab-button {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: 0.85rem;
    }
  }
</style>
