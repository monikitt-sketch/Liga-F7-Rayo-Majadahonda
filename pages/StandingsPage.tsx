import React, { useState, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { calculateStandings, getTeamById } from '../data/mockData';
import { Standing, Match } from '../types';
import { DataContext } from '../App';

const StandingsPage: React.FC = () => {
    const context = useContext(DataContext);
    const [activeTab, setActiveTab] = useState<'standings' | 'results'>('standings');
    const [tournament, setTournament] = useState<'Apertura' | 'Clausura'>('Apertura');

    const standings = useMemo(() => {
        if (!context) return [];
        return calculateStandings(tournament, context.teams, context.matches);
    }, [tournament, context]);
    
    const results = useMemo(() => {
        if (!context) return [];
        return context.matches
            .filter(m => m.status === 'finished' && m.tournament === tournament)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [tournament, context]);

    if (!context) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold mb-6 text-secondary-blue border-b-4 border-primary-red pb-2">Resultados y Clasificación</h1>
            
            <div className="flex border-b mb-4">
                <button 
                    className={`py-2 px-4 font-semibold ${activeTab === 'standings' ? 'border-b-2 border-primary-red text-primary-red' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('standings')}
                >
                    Clasificación
                </button>
                <button 
                    className={`py-2 px-4 font-semibold ${activeTab === 'results' ? 'border-b-2 border-primary-red text-primary-red' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('results')}
                >
                    Resultados
                </button>
            </div>

            <div className="flex justify-end mb-4">
                 <select
                    value={tournament}
                    onChange={(e) => setTournament(e.target.value as 'Apertura' | 'Clausura')}
                    className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue sm:text-sm rounded-md"
                >
                    <option value="Apertura">Torneo Apertura</option>
                    <option value="Clausura">Torneo Clausura</option>
                </select>
            </div>

            {activeTab === 'standings' ? <StandingsTable standings={standings} /> : <ResultsList results={results} />}
        </div>
    );
};

const StandingsTable: React.FC<{ standings: Standing[] }> = ({ standings }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { teams } = context;

    return (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-light-gray">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pos</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Equipo</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Puntos">Pts</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Partidos Jugados">PJ</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Victorias">V</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Empates">E</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Derrotas">D</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Goles a Favor">GF</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Goles en Contra">GC</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Diferencia de Goles">DG</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Tarjetas Amarillas">TA</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider" title="Tarjetas Rojas">TR</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {standings.map((s) => {
                    const team = getTeamById(s.teamId, teams);
                    return (
                        <tr key={s.teamId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <Link to={`/teams/${team?.id}`} className="flex items-center hover:text-primary-red">
                                    <img src={team?.logoUrl} alt={team?.name} className="h-8 w-8 mr-3"/>
                                    {team?.name}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold">{s.points}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.played}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.wins}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.draws}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.losses}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.goalsFor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.goalsAgainst}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.goalDifference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.yellowCards}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{s.redCards}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    );
};

const ResultsList: React.FC<{ results: Match[] }> = ({ results }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { teams } = context;

    return (
    <div className="space-y-3">
        {results.map(match => {
            const homeTeam = getTeamById(match.homeTeamId, teams);
            const awayTeam = getTeamById(match.awayTeamId, teams);
            if (!homeTeam || !awayTeam) return null;
            return (
                 <div key={match.id} className="bg-light-gray p-4 rounded-lg flex items-center justify-between">
                    <div className="text-sm text-gray-600">Jornada {match.matchday}</div>
                    <div className="flex-grow flex items-center justify-center gap-4">
                        <span className="font-semibold w-1/3 text-right">{homeTeam.name}</span>
                        <img src={homeTeam.logoUrl} alt={homeTeam.name} className="h-8 w-8"/>
                        <span className="text-xl font-bold bg-secondary-blue text-white px-3 py-1 rounded">{match.score?.home} - {match.score?.away}</span>
                        <img src={awayTeam.logoUrl} alt={awayTeam.name} className="h-8 w-8"/>
                        <span className="font-semibold w-1/3 text-left">{awayTeam.name}</span>
                    </div>
                     <div className="text-sm text-gray-600">{new Date(match.date).toLocaleDateString('es-ES')}</div>
                 </div>
            )
        })}
    </div>
    );
};


export default StandingsPage;
