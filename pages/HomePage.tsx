import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { calculateStandings, getTeamById } from '../data/mockData';
import { Team, Match as MatchType, Standing } from '../types';
import { DataContext } from '../App';

const HomePage: React.FC = () => {
    const context = useContext(DataContext);

    if (!context) {
        return <div>Cargando...</div>;
    }
    const { matches, teams } = context;

    const upcomingMatches = matches
        .filter(m => m.status === 'scheduled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4);

    const recentResults = matches
        .filter(m => m.status === 'finished')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

    const standings = calculateStandings('Apertura', teams, matches).slice(0, 5);

    return (
        <div className="space-y-12">
            <Banner />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <UpcomingMatches matches={upcomingMatches} />
                    <RecentResults results={recentResults} />
                </div>
                <div className="space-y-8">
                    <StandingsSummary standings={standings} />
                    <DelegateAccess />
                </div>
            </div>
        </div>
    );
};

const Banner: React.FC = () => (
    <div className="bg-cover bg-center rounded-lg shadow-lg p-8 md:p-12 text-white" style={{ backgroundImage: "url('https://picsum.photos/seed/stadium/1200/400')" }}>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Bienvenido a la Liga Rayo Majadahonda F7</h1>
            <p className="text-lg md:text-xl">El corazón del fútbol 7 en nuestra comunidad. Sigue a tu equipo, consulta los resultados y no te pierdas ni un partido.</p>
        </div>
    </div>
);

const MatchCard: React.FC<{ match: MatchType, showScore?: boolean }> = ({ match, showScore = false }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { teams } = context;

    const homeTeam = getTeamById(match.homeTeamId, teams);
    const awayTeam = getTeamById(match.awayTeamId, teams);

    if (!homeTeam || !awayTeam) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-center text-sm text-gray-500 mb-3">
                {new Date(match.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} - {new Date(match.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={homeTeam.logoUrl} alt={homeTeam.name} className="h-10 w-10 object-contain flex-shrink-0" />
                    <span className="font-semibold text-left truncate">{homeTeam.name}</span>
                </div>
                <div className="text-2xl font-bold text-secondary-blue px-2">
                    {showScore && match.score ? `${match.score.home} - ${match.score.away}` : 'vs'}
                </div>
                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                    <span className="font-semibold text-right truncate">{awayTeam.name}</span>
                    <img src={awayTeam.logoUrl} alt={awayTeam.name} className="h-10 w-10 object-contain flex-shrink-0" />
                </div>
            </div>
        </div>
    );
};

const UpcomingMatches: React.FC<{ matches: MatchType[] }> = ({ matches }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-secondary-blue">Próximos Partidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(match => <MatchCard key={match.id} match={match} />)}
        </div>
    </div>
);

const RecentResults: React.FC<{ results: MatchType[] }> = ({ results }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-secondary-blue">Resultados Recientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(match => <MatchCard key={match.id} match={match} showScore={true} />)}
        </div>
    </div>
);

const StandingsSummary: React.FC<{ standings: Standing[] }> = ({ standings }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { teams } = context;
    
    return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-secondary-blue">Clasificación</h2>
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-gray-500">
                    <th className="pb-2 font-semibold">Pos</th>
                    <th className="pb-2 font-semibold">Equipo</th>
                    <th className="pb-2 font-semibold text-center">Pts</th>
                    <th className="pb-2 font-semibold text-center">PJ</th>
                </tr>
            </thead>
            <tbody>
                {standings.map(s => {
                    const team = getTeamById(s.teamId, teams);
                    return (
                        <tr key={s.teamId} className="border-t">
                            <td className="py-2 font-bold">{s.position}</td>
                            <td className="py-2 flex items-center">
                                <img src={team?.logoUrl} alt={team?.name} className="h-6 w-6 mr-2" />
                                <span className="font-medium">{team?.name}</span>
                            </td>
                            <td className="py-2 text-center font-bold">{s.points}</td>
                            <td className="py-2 text-center">{s.played}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        <Link to="/standings" className="block text-center mt-4 text-primary-red font-semibold hover:underline">Ver clasificación completa</Link>
    </div>
    );
};

const DelegateAccess: React.FC = () => (
    <div className="bg-secondary-blue text-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-3">Espacio Delegados</h2>
        <p className="mb-4">Actualiza los jugadores de tu equipo en el formulario web. La información será revisada por el administrador del sitio antes de ser publicada. Los delegados pueden registrar jugadores de Lunes a Viernes hasta las 21:00 horas.</p>
        <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSfwgL5pZ0i5f5n1j2b3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary-red text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-red/80 transition-transform duration-300 transform hover:scale-105"
        >
            Acceder al Formulario
        </a>
    </div>
);

export default HomePage;