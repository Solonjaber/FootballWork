
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Match, Team } from '../types/models';

interface MatchStore {
  matchHistory: Match[];
  currentTeams: [Team | null, Team | null];
  setCurrentTeams: (teams: [Team, Team]) => void;
  saveMatch: (location?: string, notes?: string) => void;
  clearCurrentTeams: () => void;
  useTeamsFromMatch: (match: Match) => void;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set) => ({
      matchHistory: [],
      currentTeams: [null, null],
      
      setCurrentTeams: (teams: [Team, Team]) => set({ currentTeams: teams }),
      
      saveMatch: (location?: string, notes?: string) => set((state) => {
        if (!state.currentTeams[0] || !state.currentTeams[1]) return state;
        
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          date: new Date(),
          teamA: state.currentTeams[0],
          teamB: state.currentTeams[1],
          location,
          notes
        };
        
        return { 
          matchHistory: [newMatch, ...state.matchHistory],
        };
      }),
      
      clearCurrentTeams: () => set({ currentTeams: [null, null] }),

      useTeamsFromMatch: (match: Match) => set({ 
        currentTeams: [match.teamA, match.teamB] 
      }),
    }),
    {
      name: 'craque-sorteio-matches',
      partialize: (state) => ({ 
        matchHistory: state.matchHistory,
      }),
    }
  )
);
