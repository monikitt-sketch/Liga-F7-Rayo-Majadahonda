import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataContext } from '../App';
import { getPlayerById, getTeamById } from '../data/mockData';

const PlayerDetailPage: React.FC = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const context = useContext(DataContext);

    if (!context) {
        return <div>Cargando...</div>;
    }
    const { players, teams } = context;

    const player = playerId ? getPlayerById(playerId, players) : undefined;

    if (!player) {
        return <div className="text-center text-red-500 font-bold text-xl">Jugador no encontrado</div>;
    }

    const team = getTeamById(player.teamId, teams);

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                    <img src={player.photoUrl} alt={player.name} className="h-48 w-48 rounded-full object-cover border-4 border-primary-red shadow-lg" />
                </div>
                <div className="flex-grow">
                    <div className="flex items-baseline gap-4">
                         <h1 className="text-4xl font-extrabold text-secondary-blue">{player.name}</h1>
                         <span className="text-4xl font-bold text-gray-400">#{player.jerseyNumber}</span>
                    </div>
                   
                    <p className="text-lg text-gray-600 mt-2">
                        <strong>Fecha de Nacimiento:</strong> {new Date(player.dob).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} ({calculateAge(player.dob)} años)
                    </p>
                    
                    {team && (
                         <div className="mt-4">
                            <strong>Equipo:</strong>
                            <Link to={`/teams/${team.id}`} className="ml-2 inline-flex items-center gap-2 text-secondary-blue font-semibold hover:text-primary-red">
                                <img src={team.logoUrl} alt={team.name} className="h-6 w-6" />
                                <span>{team.name}</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 border-t pt-6">
                <h2 className="text-2xl font-bold text-secondary-blue mb-4">Estadísticas de Goles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="bg-light-gray p-4 rounded-lg">
                        <p className="text-gray-500 font-semibold">Torneo Apertura</p>
                        <p className="text-3xl font-bold text-primary-red">{player.stats.aperturaGoals}</p>
                    </div>
                    <div className="bg-light-gray p-4 rounded-lg">
                        <p className="text-gray-500 font-semibold">Torneo Clausura</p>
                        <p className="text-3xl font-bold text-primary-red">{player.stats.clausuraGoals}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailPage;
