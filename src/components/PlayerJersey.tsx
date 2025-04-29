
import React from 'react';
import { Player } from '@/types/models';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlayerJerseyProps {
  player: Player;
  name: string;
  teamColor: 'primary' | 'secondary';
  onClick?: () => void;
}

const PlayerJersey: React.FC<PlayerJerseyProps> = ({ player, name, teamColor, onClick }) => {
  return (
    <div 
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className={cn(
        "w-12 h-14 flex flex-col items-center justify-center rounded-md transform transition-all duration-200 text-white text-xs font-bold shadow-md group-hover:scale-110",
        teamColor === 'primary' ? "bg-primary" : "bg-secondary"
      )}>
        {/* Gola da camisa */}
        <div className={cn(
          "w-4 h-2 rounded-b-full absolute -top-0.5",
          teamColor === 'primary' ? "bg-primary/80" : "bg-secondary/80"
        )}></div>
        
        {/* Mangas da camisa */}
        <div className={cn(
          "absolute top-1 -left-1 w-2 h-4 rounded-l-full",
          teamColor === 'primary' ? "bg-primary/90" : "bg-secondary/90"
        )}></div>
        <div className={cn(
          "absolute top-1 -right-1 w-2 h-4 rounded-r-full",
          teamColor === 'primary' ? "bg-primary/90" : "bg-secondary/90"
        )}></div>
        
        {/* Número ou nome do jogador */}
        <span className="text-[10px] opacity-80 mt-0.5">{player.skillLevel}</span>
        <span className="text-[8px] font-semibold leading-tight">{name}</span>
        
        {/* Cartões */}
        <div className="absolute -top-1 -right-1 flex">
          {player.yellowCard && (
            <div className="w-2 h-3 bg-yellow-400 rounded-sm border border-yellow-500"></div>
          )}
          {player.redCard && (
            <div className="w-2 h-3 bg-red-500 rounded-sm border border-red-600 ml-0.5"></div>
          )}
        </div>
      </div>
      
      {/* Posição do jogador */}
      {player.position && (
        <Badge variant="secondary" className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-[8px] py-0 px-1">
          {player.position === 'Goleiro' ? 'GK' : player.position.substring(0, 2)}
        </Badge>
      )}
    </div>
  );
};

export default PlayerJersey;
