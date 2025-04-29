
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
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      players: [],
      
      addPlayer: (playerData) => set((state) => {
        const newPlayer: Player = {
          ...playerData,
          id: `player-${Date.now()}`,
          attendance: true // Por padrão, quando adicionado, o jogador está presente
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
    }),
    {
      name: 'craque-sorteio-storage',
      partialize: (state) => ({ players: state.players }),
    }
  )
);
