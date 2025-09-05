
export interface Player {
  id: string;
  name: string;
  dob: string; // "YYYY-MM-DD"
  jerseyNumber: number;
  photoUrl: string;
  stats: {
    aperturaGoals: number;
    clausuraGoals: number;
  };
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  shirtColor: string;
  delegate: string;
  category: string;
}

export interface Match {
  id: string;
  date: string; // ISO 8601 format
  field: string;
  fieldLocationUrl: string;
  homeTeamId: string;
  awayTeamId: string;
  tournament: 'Apertura' | 'Clausura';
  matchday: number;
  status: 'scheduled' | 'finished';
  score?: {
    home: number;
    away: number;
  };
}

export interface Standing {
    teamId: string;
    position?: number;
    points: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    yellowCards: number; // Simplified for demo
    redCards: number; // Simplified for demo
}
