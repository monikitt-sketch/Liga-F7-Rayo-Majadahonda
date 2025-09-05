import React, { useState, useMemo, useContext } from 'react';
import { getTeamById } from '../data/mockData';
import { Match } from '../types';
import { DataContext } from '../App';

const CalendarPage: React.FC = () => {
    const context = useContext(DataContext);
    const [tournament, setTournament] = useState<'Apertura' | 'Clausura'>('Apertura');
    const [selectedMatchday, setSelectedMatchday] = useState<number | 'all'>('all');

    const filteredMatches = useMemo(() => {
        if (!context) return [];
        return context.matches
            .filter(m => m.tournament === tournament)
            .filter(m => selectedMatchday === 'all' || m.matchday === selectedMatchday)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [tournament, selectedMatchday, context]);

    const matchdays = useMemo(() => {
        if (!context) return [];
        const allMatchdays = [...new Set(context.matches.filter(m => m.tournament === tournament).map(m => m.matchday))];
        return allMatchdays.sort((a,b) => a-b);
    }, [tournament, context]);

    if (!context) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold mb-6 text-secondary-blue border-b-4 border-primary-red pb-2">Calendario de Partidos</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-light-gray rounded-md">
                {/* Tournament Filter */}
                <div>
                    <label htmlFor="tournament-filter" className="block text-sm font-medium text-gray-700">Torneo</label>
                    <select
                        id="tournament-filter"
                        value={tournament}
                        onChange={(e) => setTournament(e.target.value as 'Apertura' | 'Clausura')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue sm:text-sm rounded-md"
                    >
                        <option value="Apertura">Apertura</option>
                        <option value="Clausura">Clausura</option>
                    </select>
                </div>
                {/* Matchday Filter */}
                <div>
                    <label htmlFor="matchday-filter" className="block text-sm font-medium text-gray-700">Jornada</label>
                    <select
                        id="matchday-filter"
                        value={selectedMatchday}
                        onChange={(e) => setSelectedMatchday(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue sm:text-sm rounded-md"
                    >
                        <option value="all">Todas las Jornadas</option>
                        {matchdays.map(day => <option key={day} value={day}>Jornada {day}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredMatches.length > 0 ? filteredMatches.map(match => (
                    <MatchDetailCard key={match.id} match={match} />
                )) : (
                    <p className="text-center text-gray-500 py-8">No hay partidos que coincidan con los filtros seleccionados.</p>
                )}
            </div>
        </div>
    );
};

const MatchDetailCard: React.FC<{ match: Match }> = ({ match }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { teams } = context;

    const homeTeam = getTeamById(match.homeTeamId, teams);
    const awayTeam = getTeamById(match.awayTeamId, teams);

    if (!homeTeam || !awayTeam) return null;

    const matchDate = new Date(match.date);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="w-full md:w-1/4 flex flex-col items-center justify-center text-center">
                     <span className="font-bold text-lg text-secondary-blue">Jornada {match.matchday}</span>
                     <span className="text-sm text-gray-600">{matchDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                     <span className="font-semibold text-primary-red">{matchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h</span>
                </div>

                <div className="w-full md:w-1/2 flex items-center justify-center gap-2">
                     <div className="flex-1 flex items-center justify-end gap-3 text-right min-w-0">
                        <span className="font-bold text-lg truncate">{homeTeam.name}</span>
                        <img src={homeTeam.logoUrl} alt={homeTeam.name} className="h-14 w-14 object-contain flex-shrink-0"/>
                    </div>
                     <div className="text-3xl font-extrabold text-gray-400 px-2">VS</div>
                    <div className="flex-1 flex items-center justify-start gap-3 text-left min-w-0">
                        <img src={awayTeam.logoUrl} alt={awayTeam.name} className="h-14 w-14 object-contain flex-shrink-0"/>
                        <span className="font-bold text-lg truncate">{awayTeam.name}</span>
                    </div>
                </div>

                <div className="w-full md:w-1/4 flex flex-col items-center justify-center text-center">
                    <span className="font-semibold text-gray-800">Campo de Juego</span>
                    <a 
                        href={match.fieldLocationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-red hover:underline font-bold"
                    >
                       {match.field} 📍
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;