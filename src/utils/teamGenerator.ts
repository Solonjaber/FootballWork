
import { Player, Team } from "../types/models";

/**
 * Gera dois times equilibrados com base nas habilidades dos jogadores
 * @param players Lista de jogadores presentes
 * @param playersPerTeam Número de jogadores por time
 * @returns Dois times equilibrados
 */
export const generateBalancedTeams = (players: Player[], playersPerTeam: number = 5): [Team, Team] => {
  // Filtra apenas jogadores presentes
  const availablePlayers = [...players].filter(player => player.attendance);
  
  // Separa goleiros e jogadores de linha
  const goalkeepers = availablePlayers.filter(player => player.position?.toLowerCase() === 'goleiro');
  const fieldPlayers = availablePlayers.filter(player => player.position?.toLowerCase() !== 'goleiro');
  
  // Ordena por nível de habilidade (decrescente)
  goalkeepers.sort((a, b) => b.skillLevel - a.skillLevel);
  fieldPlayers.sort((a, b) => b.skillLevel - a.skillLevel);
  
  // Inicia times vazios
  const teamA: Player[] = [];
  const teamB: Player[] = [];
  
  // Distribui goleiros (um para cada time, se disponível)
  if (goalkeepers.length >= 2) {
    teamA.push(goalkeepers[0]);
    teamB.push(goalkeepers[1]);
    
    // Se houver mais goleiros, adiciona-os aos jogadores de linha
    if (goalkeepers.length > 2) {
      fieldPlayers.push(...goalkeepers.slice(2));
    }
  } else if (goalkeepers.length === 1) {
    // Se só há um goleiro, coloca no time A
    teamA.push(goalkeepers[0]);
  }
  
  // Limita ao número máximo de jogadores necessários por time
  const maxFieldPlayersTeamA = playersPerTeam - teamA.length;
  const maxFieldPlayersTeamB = playersPerTeam - teamB.length;
  
  // Define a função para calcular a média de habilidade
  const calculateAverageSkill = (players: Player[]): number => {
    if (players.length === 0) return 0;
    const sum = players.reduce((acc, player) => acc + player.skillLevel, 0);
    return parseFloat((sum / players.length).toFixed(1));
  };
  
  // Algoritmo de distribuição alternada "snake draft" para jogadores de linha
  // Coloca o melhor jogador disponível no time com menos habilidade total
  let index = 0;
  while ((teamA.length < playersPerTeam || teamB.length < playersPerTeam) && index < fieldPlayers.length) {
    const player = fieldPlayers[index];
    
    // Calcula a média de habilidade atual de cada time
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
