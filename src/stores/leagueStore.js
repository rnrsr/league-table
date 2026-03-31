import { writable } from 'svelte/store';
import { validateLeagueData } from '../utils/dataValidation.js';

function createLeagueStore() {
  const { subscribe, set } = writable({
    league: null,
    players: [],
    loading: true,
    error: null
  });

  async function loadLeague() {
    try {
      const response = await fetch('/data/league.json');
      if (!response.ok) throw new Error(`Failed to load league data: ${response.status}`);

      const data = await response.json();
      const validation = validateLeagueData(data);

      if (!validation.isValid) {
        throw new Error(`Invalid league data: ${validation.errors.join(', ')}`);
      }

      set({
        league: data.league,
        players: data.players,
        loading: false,
        error: null
      });
    } catch (err) {
      set({
        league: null,
        players: [],
        loading: false,
        error: err.message
      });
    }
  }

  return {
    subscribe,
    load: loadLeague
  };
}

export const leagueStore = createLeagueStore();
