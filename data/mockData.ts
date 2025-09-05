// FIX: Import the 'Standing' type to resolve type errors.
import { Team, Player, Match, Standing } from '../types';

export const teams: Team[] = [
    { id: 'T01', name: 'Atlético Majadahonda', logoUrl: 'https://i.imgur.com/8G1Z2aH.png', shirtColor: 'Rojo/Blanco', delegate: 'Carlos Pérez', category: 'Primera División' },
    { id: 'T02', name: 'Majadahonda United', logoUrl: 'https://i.imgur.com/sK7tH0b.png', shirtColor: 'Rojo', delegate: 'Lucía Fernández', category: 'Primera División' },
    { id: 'T03', name: 'CF Rayo', logoUrl: 'https://i.imgur.com/O1f4xJT.png', shirtColor: 'Blanco', delegate: 'Javier Gómez', category: 'Primera División' },
    { id: 'T04', name: 'Real Majadahonda', logoUrl: 'https://i.imgur.com/U5g1sYg.png', shirtColor: 'Azul', delegate: 'Ana Martínez', category: 'Primera División' },
    { id: 'T05', name: 'Inter Majadahonda', logoUrl: 'https://i.imgur.com/dJ8oW2I.png', shirtColor: 'Negro/Azul', delegate: 'David Sánchez', category: 'Primera División' },
    { id: 'T06', name: 'Majadahonda City', logoUrl: 'https://i.imgur.com/tG3Xz5N.png', shirtColor: 'Celeste', delegate: 'Sofía Rodríguez', category: 'Primera División' },
    { id: 'T07', name: 'Equipo Histórico', logoUrl: 'https://i.imgur.com/Vf1c3fE.png', shirtColor: 'Blanco y Negro', delegate: 'Juan Antiguo', category: 'Leyendas' },
];

export const players: Player[] = [
    // Team T01
    { id: 'P01', name: 'Adrián López', dob: '1995-03-12', jerseyNumber: 10, photoUrl: 'https://picsum.photos/seed/P01/200', stats: { aperturaGoals: 12, clausuraGoals: 5 }, teamId: 'T01' },
    { id: 'P02', name: 'Bruno García', dob: '1998-07-25', jerseyNumber: 7, photoUrl: 'https://picsum.photos/seed/P02/200', stats: { aperturaGoals: 8, clausuraGoals: 2 }, teamId: 'T01' },
    // Team T02
    { id: 'P03', name: 'César Ramos', dob: '1992-11-01', jerseyNumber: 9, photoUrl: 'https://picsum.photos/seed/P03/200', stats: { aperturaGoals: 15, clausuraGoals: 8 }, teamId: 'T02' },
    { id: 'P04', name: 'Daniel Vega', dob: '1996-01-30', jerseyNumber: 11, photoUrl: 'https://picsum.photos/seed/P04/200', stats: { aperturaGoals: 9, clausuraGoals: 3 }, teamId: 'T02' },
     // Team T03
    { id: 'P05', name: 'Esteban Soler', dob: '1994-06-15', jerseyNumber: 5, photoUrl: 'https://picsum.photos/seed/P05/200', stats: { aperturaGoals: 3, clausuraGoals: 1 }, teamId: 'T03' },
    { id: 'P06', name: 'Felipe Navarro', dob: '1999-09-09', jerseyNumber: 2, photoUrl: 'https://picsum.photos/seed/P06/200', stats: { aperturaGoals: 1, clausuraGoals: 0 }, teamId: 'T03' },
    // Team T04
    { id: 'P07', name: 'Gabriel Alonso', dob: '1993-02-18', jerseyNumber: 8, photoUrl: 'https://picsum.photos/seed/P07/200', stats: { aperturaGoals: 7, clausuraGoals: 4 }, teamId: 'T04' },
    { id: 'P08', name: 'Hugo Moreno', dob: '1997-12-05', jerseyNumber: 6, photoUrl: 'https://picsum.photos/seed/P08/200', stats: { aperturaGoals: 5, clausuraGoals: 2 }, teamId: 'T04' },
    // Team T05
    { id: 'P09', name: 'Iván Castillo', dob: '1991-08-22', jerseyNumber: 1, photoUrl: 'https://picsum.photos/seed/P09/200', stats: { aperturaGoals: 0, clausuraGoals: 0 }, teamId: 'T05' },
    { id: 'P10', name: 'Jorge Romero', dob: '1995-10-10', jerseyNumber: 4, photoUrl: 'https://picsum.photos/seed/P10/200', stats: { aperturaGoals: 2, clausuraGoals: 1 }, teamId: 'T05' },
    // Team T06
    { id: 'P11', name: 'Kevin Ruiz', dob: '1996-04-14', jerseyNumber: 14, photoUrl: 'https://picsum.photos/seed/P11/200', stats: { aperturaGoals: 6, clausuraGoals: 6 }, teamId: 'T06' },
    { id: 'P12', name: 'Leo Jiménez', dob: '2000-01-01', jerseyNumber: 21, photoUrl: 'https://picsum.photos/seed/P12/200', stats: { aperturaGoals: 10, clausuraGoals: 1 }, teamId: 'T06' },
    // Team T07 (Historical)
    { id: 'P99', name: 'Leyenda Martinez', dob: '1980-01-01', jerseyNumber: 9, photoUrl: 'https://picsum.photos/seed/P99/200', stats: { aperturaGoals: 150, clausuraGoals: 200 }, teamId: 'T07' },
];

const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
}

const getPastDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
}


export const matches: Match[] = [
    // Finished Matches - Jornada 1
    { id: 'M01', date: getPastDate(7), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T01', awayTeamId: 'T02', tournament: 'Apertura', matchday: 1, status: 'finished', score: { home: 3, away: 2 } },
    { id: 'M02', date: getPastDate(7), field: 'Campo 2 - Cerro del Espino', fieldLocationUrl: 'https://maps.google.com/?q=40.4688,-3.8600', homeTeamId: 'T03', awayTeamId: 'T04', tournament: 'Apertura', matchday: 1, status: 'finished', score: { home: 1, away: 1 } },
    { id: 'M03', date: getPastDate(7), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T05', awayTeamId: 'T06', tournament: 'Apertura', matchday: 1, status: 'finished', score: { home: 0, away: 2 } },
    
    // Finished Matches - Jornada 2
    { id: 'M04', date: getPastDate(1), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T02', awayTeamId: 'T05', tournament: 'Apertura', matchday: 2, status: 'finished', score: { home: 4, away: 1 } },
    { id: 'M05', date: getPastDate(1), field: 'Campo 2 - Cerro del Espino', fieldLocationUrl: 'https://maps.google.com/?q=40.4688,-3.8600', homeTeamId: 'T04', awayTeamId: 'T01', tournament: 'Apertura', matchday: 2, status: 'finished', score: { home: 2, away: 2 } },
    { id: 'M06', date: getPastDate(1), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T06', awayTeamId: 'T03', tournament: 'Apertura', matchday: 2, status: 'finished', score: { home: 3, away: 0 } },

    // Scheduled Matches - Jornada 3
    { id: 'M07', date: getFutureDate(6), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T01', awayTeamId: 'T03', tournament: 'Apertura', matchday: 3, status: 'scheduled' },
    { id: 'M08', date: getFutureDate(6), field: 'Campo 2 - Cerro del Espino', fieldLocationUrl: 'https://maps.google.com/?q=40.4688,-3.8600', homeTeamId: 'T02', awayTeamId: 'T06', tournament: 'Apertura', matchday: 3, status: 'scheduled' },
    { id: 'M09', date: getFutureDate(6), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T04', awayTeamId: 'T05', tournament: 'Apertura', matchday: 3, status: 'scheduled' },
    
    // Scheduled Matches - Jornada 4
    { id: 'M10', date: getFutureDate(13), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T06', awayTeamId: 'T01', tournament: 'Apertura', matchday: 4, status: 'scheduled' },
    { id: 'M11', date: getFutureDate(13), field: 'Campo 2 - Cerro del Espino', fieldLocationUrl: 'https://maps.google.com/?q=40.4688,-3.8600', homeTeamId: 'T05', awayTeamId: 'T03', tournament: 'Apertura', matchday: 4, status: 'scheduled' },
    { id: 'M12', date: getFutureDate(13), field: 'Campo 1 - La Oliva', fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736', homeTeamId: 'T02', awayTeamId: 'T04', tournament: 'Apertura', matchday: 4, status: 'scheduled' },
];

// Helper to get team by ID
export const getTeamById = (id: string, teams: Team[]) => teams.find(t => t.id === id);

// Helper to get player by ID
export const getPlayerById = (id: string, players: Player[]) => players.find(p => p.id === id);

// Helper to get players by team ID
export const getPlayersByTeam = (teamId: string, players: Player[]) => players.filter(p => p.teamId === teamId);

// Calculate standings from finished matches
export const calculateStandings = (tournament: 'Apertura' | 'Clausura', teams: Team[], matches: Match[]): Standing[] => {
    const teamStats: { [key: string]: Standing } = {};
    teams.forEach(team => {
        teamStats[team.id] = {
            teamId: team.id,
            points: 0,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            yellowCards: Math.floor(Math.random() * 10), // dummy data
            redCards: Math.floor(Math.random() * 3), // dummy data
        };
    });

    matches
        .filter(m => m.status === 'finished' && m.tournament === tournament && m.score)
        .forEach(match => {
            const home = teamStats[match.homeTeamId];
            const away = teamStats[match.awayTeamId];
            const homeScore = match.score!.home;
            const awayScore = match.score!.away;

            home.played++;
            away.played++;
            home.goalsFor += homeScore;
            away.goalsFor += awayScore;
            home.goalsAgainst += awayScore;
            away.goalsAgainst += homeScore;
            home.goalDifference = home.goalsFor - home.goalsAgainst;
            away.goalDifference = away.goalsFor - away.goalsAgainst;

            if (homeScore > awayScore) {
                home.wins++;
                home.points += 3;
                away.losses++;
            } else if (awayScore > homeScore) {
                away.wins++;
                away.points += 3;
                home.losses++;
            } else {
                home.draws++;
                away.draws++;
                home.points++;
                away.points++;
            }
        });

    const sortedStandings = Object.values(teamStats).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.teamId.localeCompare(b.teamId);
    });

    return sortedStandings.map((standing, index) => ({ ...standing, position: index + 1 }));
};