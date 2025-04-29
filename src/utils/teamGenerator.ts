
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
  
  // Ordena por nível de habilidade (decrescente)
  availablePlayers.sort((a, b) => b.skillLevel - a.skillLevel);
  
  // Limita ao número máximo de jogadores necessários
  const neededPlayers = availablePlayers.slice(0, playersPerTeam * 2);
  
  const teamA: Player[] = [];
  const teamB: Player[] = [];
  
  // Algoritmo de distribuição alternada "snake draft"
  // Coloca o melhor jogador no time A, o segundo melhor no time B,
  // o terceiro melhor no time B, o quarto melhor no time A, e assim por diante.
  neededPlayers.forEach((player, index) => {
    if (index % 4 === 0 || index % 4 === 3) {
      teamA.push(player);
    } else {
      teamB.push(player);
    }
  });
  
  const calculateAverageSkill = (players: Player[]): number => {
    if (players.length === 0) return 0;
    const sum = players.reduce((acc, player) => acc + player.skillLevel, 0);
    return parseFloat((sum / players.length).toFixed(1));
  };
  
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
