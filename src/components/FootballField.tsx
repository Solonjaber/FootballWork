
import React, { useState, useRef, useEffect } from 'react';
import { Team, Player } from '@/types/models';
import PlayerJersey from '@/components/PlayerJersey';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/store/playerStore';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [isDragging, setIsDragging] = useState(false);
  const { players, updatePlayer } = usePlayerStore();
  const fieldRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
    if (!isDragging) {
      setSelectedPlayer(player);
      if (onPlayerClick) onPlayerClick(player);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, player: Player) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPlayer(player);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !selectedPlayer || !fieldRef.current) return;
    
    const rect = fieldRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    // Obtém as coordenadas com base no tipo de evento (touch ou mouse)
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calcula a posição relativa em porcentagem
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    
    // Encontra e atualiza o jogador
    const currentPlayer = players.find(p => p.id === selectedPlayer.id);
    if (currentPlayer) {
      const updatedPlayer = {...currentPlayer, fieldPosition: {x, y}};
      updatePlayer(updatedPlayer);
      
      if (onPlayerMove) {
        onPlayerMove(updatedPlayer, updatedPlayer.fieldPosition);
      }
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Manipulador de eventos para todo o documento
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e as unknown as React.MouseEvent);
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e as unknown as React.TouchEvent);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchEnd = () => handleDragEnd();

      // Adiciona os listeners em todo o documento
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      // Remove os listeners quando o componente é desmontado ou o arrastar termina
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, selectedPlayer]);

  // Impedir comportamento padrão de eventos de toque para evitar o scroll durante o arrasto
  useEffect(() => {
    const preventTouchDefault = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventTouchDefault, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventTouchDefault);
    };
  }, [isDragging]);

  const teamAPositions = getPositions(teamA, true);
  const teamBPositions = getPositions(teamB, false);

  return (
    <div 
      ref={fieldRef}
      className="w-full aspect-[4/3] bg-gradient-to-b from-green-500 to-green-700 rounded-lg relative overflow-hidden my-6 touch-none"
    >
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
              onTouchStart={(e) => handleDragStart(e, player)}
              onMouseDown={(e) => handleDragStart(e, player)}
            >
              <PlayerJersey 
                player={player} 
                name={abbreviateName(player.name)} 
                teamColor="primary" 
                onClick={() => handlePlayerSelect(player)}
                selected={isSelected}
                draggable={true}
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
              onTouchStart={(e) => handleDragStart(e, player)}
              onMouseDown={(e) => handleDragStart(e, player)}
            >
              <PlayerJersey 
                player={player} 
                name={abbreviateName(player.name)} 
                teamColor="secondary" 
                onClick={() => handlePlayerSelect(player)}
                selected={isSelected}
                draggable={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FootballField;
