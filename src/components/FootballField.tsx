
import React, { useState } from 'react';
import { Team, Player } from '@/types/models';
import PlayerJersey from '@/components/PlayerJersey';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/store/playerStore';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface FootballFieldProps {
  teamA: Team;
  teamB: Team;
  onPlayerClick?: (player: Player) => void;
  onPlayerMove?: (player: Player, newPosition: {x: number, y: number}) => void;
}

const FootballField: React.FC<FootballFieldProps> = ({ 
  teamA, 
  teamB, 
  onPlayerClick, 
  onPlayerMove 
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { players, updatePlayer } = usePlayerStore();

  // Função para abreviar o nome (pega a primeira palavra e a primeira letra do sobrenome se houver)
  const abbreviateName = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 6);
    return `${parts[0].substring(0, 1)}. ${parts[parts.length - 1].substring(0, 5)}`;
  };

  // Função para determinar posições no campo
  const getPositions = (team: Team, isTeamA: boolean): Player[] => {
    const players = [...team.players];
    const positions = [];
    
    // Encontra o goleiro, se houver
    const goalkeeper = players.find(p => p.position?.toLowerCase() === 'goleiro');
    if (goalkeeper) {
      positions.push(goalkeeper);
      players.splice(players.indexOf(goalkeeper), 1);
    }
    
    // Distribui os jogadores restantes
    positions.push(...players);
    
    return positions;
  };

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayer && selectedPlayer.id === player.id) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(player);
      if (onPlayerClick) onPlayerClick(player);
    }
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedPlayer) return;
    
    // Encontra o jogador atual no estado global
    const currentPlayer = players.find(p => p.id === selectedPlayer.id);
    if (!currentPlayer) return;
    
    // Cria uma cópia do jogador para modificar
    const updatedPlayer = {...currentPlayer};
    
    // Inicializa a posição do campo se não existir
    if (!updatedPlayer.fieldPosition) {
      updatedPlayer.fieldPosition = { x: 50, y: 50 };
    }
    
    // Ajusta a posição com base na direção
    const step = 5; // Tamanho do passo em porcentagem
    switch (direction) {
      case 'up':
        updatedPlayer.fieldPosition.y = Math.max(0, updatedPlayer.fieldPosition.y - step);
        break;
      case 'down':
        updatedPlayer.fieldPosition.y = Math.min(100, updatedPlayer.fieldPosition.y + step);
        break;
      case 'left':
        updatedPlayer.fieldPosition.x = Math.max(0, updatedPlayer.fieldPosition.x - step);
        break;
      case 'right':
        updatedPlayer.fieldPosition.x = Math.min(100, updatedPlayer.fieldPosition.x + step);
        break;
    }
    
    // Atualiza o jogador
    updatePlayer(updatedPlayer);
    setSelectedPlayer(updatedPlayer);
    
    if (onPlayerMove) {
      onPlayerMove(updatedPlayer, updatedPlayer.fieldPosition);
    }
  };

  const teamAPositions = getPositions(teamA, true);
  const teamBPositions = getPositions(teamB, false);

  return (
    <div className="w-full aspect-[4/3] bg-gradient-to-b from-green-500 to-green-700 rounded-lg relative overflow-hidden my-6">
      {/* Linhas do campo */}
      <div className="absolute inset-0 flex flex-col">
        {/* Linha central */}
        <div className="h-1/2 border-b-2 border-white/70"></div>
        
        {/* Círculo central */}
        <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/70 rounded-full -translate-x-8 -translate-y-8"></div>
        
        {/* Áreas */}
        <div className="absolute top-0 left-1/2 w-40 h-16 border-2 border-white/70 -translate-x-20"></div>
        <div className="absolute bottom-0 left-1/2 w-40 h-16 border-2 border-white/70 -translate-x-20"></div>
        
        {/* Pequenas áreas */}
        <div className="absolute top-0 left-1/2 w-16 h-6 border-2 border-white/70 -translate-x-8"></div>
        <div className="absolute bottom-0 left-1/2 w-16 h-6 border-2 border-white/70 -translate-x-8"></div>
      </div>
      
      {/* Time A (cima) */}
      <div className="absolute top-4 left-0 w-full h-[calc(50%-4px)] flex flex-wrap justify-evenly items-center px-2">
        {teamAPositions.map((player, idx) => {
          const isGoalkeeper = player.position?.toLowerCase() === 'goleiro';
          const isSelected = selectedPlayer?.id === player.id;
          const fieldPos = player.fieldPosition || { 
            x: isGoalkeeper ? 50 : 10 + Math.floor(idx / 2) * 30, 
            y: isGoalkeeper ? 5 : 20 + (idx % 2) * 30 
          };

          return (
            <div 
              key={player.id} 
              className={cn(
                "transition-all duration-200 absolute",
                isSelected ? "z-10" : "z-0"
              )}
              style={{
                top: `${fieldPos.y}%`,
                left: `${fieldPos.x}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <PlayerJersey 
                player={player} 
                name={abbreviateName(player.name)} 
                teamColor="primary" 
                onClick={() => handlePlayerSelect(player)}
                selected={isSelected}
              />
            </div>
          );
        })}
      </div>
      
      {/* Time B (baixo) */}
      <div className="absolute bottom-4 left-0 w-full h-[calc(50%-4px)] flex flex-wrap justify-evenly items-center px-2">
        {teamBPositions.map((player, idx) => {
          const isGoalkeeper = player.position?.toLowerCase() === 'goleiro';
          const isSelected = selectedPlayer?.id === player.id;
          const fieldPos = player.fieldPosition || { 
            x: isGoalkeeper ? 50 : 10 + Math.floor(idx / 2) * 30, 
            y: isGoalkeeper ? 95 : 80 - (idx % 2) * 30 
          };

          return (
            <div 
              key={player.id} 
              className={cn(
                "transition-all duration-200 absolute",
                isSelected ? "z-10" : "z-0"
              )}
              style={{
                bottom: `${100 - fieldPos.y}%`,
                left: `${fieldPos.x}%`,
                transform: 'translate(-50%, 50%)'
              }}
            >
              <PlayerJersey 
                player={player} 
                name={abbreviateName(player.name)} 
                teamColor="secondary" 
                onClick={() => handlePlayerSelect(player)}
                selected={isSelected}
              />
            </div>
          );
        })}
      </div>

      {/* Controles de movimento para jogadores selecionados */}
      {selectedPlayer && (
        <div className="absolute top-4 right-4 bg-background/90 p-2 rounded-lg shadow-lg">
          <div className="grid grid-cols-3 gap-1">
            <div className="col-start-2">
              <button 
                className="p-2 bg-primary/20 rounded-full hover:bg-primary/50 transition-all"
                onClick={() => movePlayer('up')}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            <div className="col-start-1 flex justify-center">
              <button 
                className="p-2 bg-primary/20 rounded-full hover:bg-primary/50 transition-all"
                onClick={() => movePlayer('left')}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="col-start-3 flex justify-center">
              <button 
                className="p-2 bg-primary/20 rounded-full hover:bg-primary/50 transition-all"
                onClick={() => movePlayer('right')}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="col-start-2">
              <button 
                className="p-2 bg-primary/20 rounded-full hover:bg-primary/50 transition-all"
                onClick={() => movePlayer('down')}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootballField;
