
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player } from '../types/models';

interface PlayerStore {
  players: Player[];
  addPlayer: (player: Omit<Player, 'id'>) => void;
  removePlayer: (id: string) => void;
  updatePlayer: (player: Player) => void;
  toggleAttendance: (id: string) => void;
  updateSkillLevel: (id: string, skillLevel: number) => void;
  toggleYellowCard: (id: string) => void;
  toggleRedCard: (id: string) => void;
  resetCards: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      players: [],
      
      addPlayer: (playerData) => set((state) => {
        const newPlayer: Player = {
          ...playerData,
          id: `player-${Date.now()}`,
          attendance: true,
          yellowCard: false,
          redCard: false
        };
        return { players: [...state.players, newPlayer] };
      }),
      
      removePlayer: (id) => set((state) => ({
        players: state.players.filter(player => player.id !== id)
      })),
      
      updatePlayer: (updatedPlayer) => set((state) => ({
        players: state.players.map(player => 
          player.id === updatedPlayer.id ? updatedPlayer : player
        )
      })),
      
      toggleAttendance: (id) => set((state) => ({
        players: state.players.map(player => 
          player.id === id 
            ? { ...player, attendance: !player.attendance } 
            : player
        )
      })),
      
      updateSkillLevel: (id, skillLevel) => set((state) => ({
        players: state.players.map(player => 
          player.id === id 
            ? { ...player, skillLevel } 
            : player
        )
      })),

      toggleYellowCard: (id) => set((state) => ({
        players: state.players.map(player => 
          player.id === id 
            ? { ...player, yellowCard: !player.yellowCard } 
            : player
        )
      })),

      toggleRedCard: (id) => set((state) => ({
        players: state.players.map(player => 
          player.id === id 
            ? { ...player, redCard: !player.redCard } 
            : player
        )
      })),

      resetCards: () => set((state) => ({
        players: state.players.map(player => ({ 
          ...player, 
          yellowCard: false, 
          redCard: false 
        }))
      })),
    }),
    {
      name: 'craque-sorteio-storage',
      partialize: (state) => ({ players: state.players }),
    }
  )
);
