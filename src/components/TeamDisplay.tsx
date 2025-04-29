
import React from 'react';
import { Team } from '@/types/models';
import { Badge } from '@/components/ui/badge';

interface TeamDisplayProps {
  team: Team;
  className?: string;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, className }) => {
  return (
    <div className={`team-card animate-fade-in ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold">{team.name}</h3>
        <Badge variant="outline" className="bg-white/20 text-white">
          Média: {team.averageSkill}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {team.players.map((player) => (
          <div key={player.id} className="bg-white/10 p-2 rounded flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <p className="font-medium">{player.name}</p>
                {player.yellowCard && (
                  <span className="ml-2 w-3 h-4 bg-yellow-400 rounded-sm inline-block"></span>
                )}
                {player.redCard && (
                  <span className="ml-1 w-3 h-4 bg-red-500 rounded-sm inline-block"></span>
                )}
              </div>
              {player.position && (
                <p className="text-xs opacity-80">{player.position}</p>
              )}
            </div>
            <Badge className="bg-white/20">{player.skillLevel}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;
