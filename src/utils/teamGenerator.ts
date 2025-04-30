  import { Player, Team } from "../types/models";

  export const generateBalancedTeams = (players: Player[], playersPerTeam: number = 5): [Team, Team] => {
    const availablePlayers = [...players].filter(player => player.attendance);
  
    const goalkeepers = availablePlayers.filter(player => player.position?.toLowerCase() === 'goleiro');
    const fieldPlayers = availablePlayers.filter(player => player.position?.toLowerCase() !== 'goleiro');
  
    goalkeepers.sort((a, b) => b.skillLevel - a.skillLevel);
    fieldPlayers.sort((a, b) => b.skillLevel - a.skillLevel);
  
    const teamA: Player[] = [];
    const teamB: Player[] = [];
  
    if (goalkeepers.length >= 2) {
      teamA.push(goalkeepers[0]);
      teamB.push(goalkeepers[1]);
    
      if (goalkeepers.length > 2) {
        fieldPlayers.push(...goalkeepers.slice(2));
      }
    } else if (goalkeepers.length === 1) {
      teamA.push(goalkeepers[0]);
    }
  
    const maxFieldPlayersTeamA = playersPerTeam - teamA.length;
    const maxFieldPlayersTeamB = playersPerTeam - teamB.length;
  
    const calculateAverageSkill = (players: Player[]): number => {
      if (players.length === 0) return 0;
      const sum = players.reduce((acc, player) => acc + player.skillLevel, 0);
      return parseFloat((sum / players.length).toFixed(1));
    };
  
    let index = 0;
    while ((teamA.length < playersPerTeam || teamB.length < playersPerTeam) && index < fieldPlayers.length) {
      const player = fieldPlayers[index];
    
      const teamAAverage = calculateAverageSkill(teamA);
      const teamBAverage = calculateAverageSkill(teamB);
    
      if (teamA.length < maxFieldPlayersTeamA && 
          (teamB.length >= maxFieldPlayersTeamB || teamAAverage <= teamBAverage)) {
        teamA.push(player);
      } else if (teamB.length < maxFieldPlayersTeamB) {
        teamB.push(player);
      }
    
      index++;
    }
  
    return [
      {
        id: "team-a",
        name: "Time A",
        players: teamA,
        averageSkill: calculateAverageSkill(teamA)
      },
      {
        id: "team-b",
        name: "Time B",
        players: teamB,
        averageSkill: calculateAverageSkill(teamB)
      }
    ];
  };
