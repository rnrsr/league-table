import { writable } from 'svelte/store';
import { validateFixturesData } from '../utils/dataValidation.js';
import { derivePlayerStats } from '../utils/fixtures.js';

function createLeagueStore() {
  const { subscribe, set } = writable({
    league: null,
    players: [],
    matches: [],
    loading: true,
    error: null
  });

  async function load() {
    try {
      const response = await fetch('/data/fixtures.json');
      if (!response.ok) throw new Error(`Failed to load fixtures data: ${response.status}`);

      const data = await response.json();
      const validation = validateFixturesData(data);

      if (!validation.isValid) {
        throw new Error(`Invalid fixtures data: ${validation.errors.join(', ')}`);
      }

      // Derive player standings from matches
      const derivedPlayers = derivePlayerStats(data.players, data.matches);

      set({
        league: data.league,
        players: derivedPlayers,
        matches: data.matches,
        loading: false,
        error: null
      });
    } catch (err) {
      set({
        league: null,
        players: [],
        matches: [],
        loading: false,
        error: err.message
      });
    }
  }

  return {
    subscribe,
    load
  };
}

export const leagueStore = createLeagueStore();
