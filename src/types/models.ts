
export interface Player {
  id: string;
  name: string;
  skillLevel: number; // 1-10
  attendance: boolean;
  position?: string;
  avatar?: string;
  yellowCard?: boolean;
  redCard?: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  averageSkill: number;
}

export interface Match {
  id: string;
  date: Date;
  teamA: Team;
  teamB: Team;
  location?: string;
  notes?: string;
}

export interface MatchHistory {
  matches: Match[];
}
