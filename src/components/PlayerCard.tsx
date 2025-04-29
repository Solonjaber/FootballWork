
import React from 'react';
import { Player } from '../types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, X, Check } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onToggleAttendance: (id: string) => void;
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onToggleAttendance,
  onEdit,
  onDelete
}) => {
  const getSkillColor = (level: number) => {
    if (level >= 8) return "bg-green-500";
    if (level >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className={`player-card ${player.attendance ? '' : 'opacity-60'}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{player.name}</h3>
          {player.position && (
            <p className="text-sm text-muted-foreground">{player.position}</p>
          )}
        </div>
        <div className="flex space-x-1">
          <Badge variant="outline" className={`skill-badge ${getSkillColor(player.skillLevel)}`}>
            {player.skillLevel}
          </Badge>
        </div>
      </div>
      
      <div className="flex justify-between mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          className={`${player.attendance ? 'bg-primary text-white' : 'bg-muted'}`}
          onClick={() => onToggleAttendance(player.id)}
        >
          {player.attendance ? <Check size={16} /> : 'Ausente'}
        </Button>
        
        <div className="space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(player)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(player.id)} className="text-destructive">
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
