import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataContext } from '../App';
import { getTeamById, getPlayersByTeam } from '../data/mockData';
import { Player } from '../types';

const TeamDetailPage: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const context = useContext(DataContext);

    if (!context) {
        return <div>Cargando...</div>;
    }
    const { teams, players } = context;

    const team = teamId ? getTeamById(teamId, teams) : undefined;
    const teamPlayers = teamId ? getPlayersByTeam(teamId, players) : [];

    if (!team) {
        return <div className="text-center text-red-500 font-bold text-xl">Equipo no encontrado</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6 border-b-4 border-primary-red pb-6 mb-6">
                <img src={team.logoUrl} alt={`${team.name} logo`} className="h-32 w-32 object-contain" />
                <div>
                    <h1 className="text-4xl font-extrabold text-secondary-blue">{team.name}</h1>
                    <p className="text-lg text-gray-600"><strong>Delegado:</strong> {team.delegate}</p>
                    <p className="text-lg text-gray-600"><strong>Color Camiseta:</strong> {team.shirtColor}</p>
                    <p className="text-lg text-gray-600"><strong>Categoría:</strong> {team.category}</p>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-secondary-blue mb-4">Plantilla del Equipo</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {teamPlayers.length > 0 ? (
                        teamPlayers.map(player => (
                            <PlayerCard key={player.id} player={player} />
                        ))
                    ) : (
                        <p>No hay jugadores registrados para este equipo.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
    <Link to={`/players/${player.id}`} className="group">
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 group-hover:shadow-xl group-hover:border-primary-red transition-all duration-300 transform group-hover:-translate-y-1 text-center">
            <img 
                src={player.photoUrl} 
                alt={player.name} 
                className="h-24 w-24 mx-auto mb-3 rounded-full object-cover"
            />
            <h3 className="font-bold text-secondary-blue group-hover:text-primary-red">{player.name}</h3>
            <p className="text-gray-500">#{player.jerseyNumber}</p>
        </div>
    </Link>
);

export default TeamDetailPage;
