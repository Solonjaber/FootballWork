
import React from 'react';
import { Team, Player } from '@/types/models';
import PlayerJersey from '@/components/PlayerJersey';
import { cn } from '@/lib/utils';

interface FootballFieldProps {
  teamA: Team;
  teamB: Team;
  onPlayerClick?: (player: Player) => void;
}

const FootballField: React.FC<FootballFieldProps> = ({ teamA, teamB, onPlayerClick }) => {
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
          return (
            <div 
              key={player.id} 
              className={cn(
                "transition-all duration-200 absolute",
                isGoalkeeper ? "top-0 left-1/2 -translate-x-1/2" : ""
              )}
              style={{
                top: isGoalkeeper ? '5%' : `${20 + (idx % 2) * 30}%`,
                left: isGoalkeeper ? '50%' : `${10 + Math.floor(idx / 2) * 30}%`,
                transform: isGoalkeeper ? 'translateX(-50%)' : 'none'
              }}
            >
              <PlayerJersey 
                player={player} 
                name={abbreviateName(player.name)} 
                teamColor="primary" 
                onClick={() => onPlayerClick && onPlayerClick(player)}
              />
            </div>
          );
        })}
      </div>
      
      {/* Time B (baixo) */}
      <div className="absolute bottom-4 left-0 w-full h-[calc(50%-4px)] flex flex-wrap justify-evenly items-center px-2">
        {teamBPositions.map((player, idx) => {
          const isGoalkeeper = player.position?.toLowerCase() === 'goleiro';
          return (
            <div 
              key={player.id} 
              className={cn(
                "transition-all duration-200 absolute",
                isGoalkeeper ? "bottom-0 left-1/2 -translate-x-1/2" : ""
              )}
              style={{
                bottom: isGoalkeeper ? '5%' : `${20 + (idx % 2) * 30}%`,
                left: isGoalkeeper ? '50%' : `${10 + Math.floor(idx / 2) * 30}%`,
                transform: isGoalkeeper ? 'translateX(-50%)' : 'none'
              }}
            >
              <PlayerJersey 
                player={player} 
                name={abbreviateName(player.name)} 
                teamColor="secondary" 
                onClick={() => onPlayerClick && onPlayerClick(player)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FootballField;
