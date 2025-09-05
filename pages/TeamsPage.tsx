import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../App';
import { Player } from '../types';
import { getTeamById } from '../data/mockData';

const PlayerSearchResultCard: React.FC<{ player: Player }> = ({ player }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { teams } = context;
    const team = getTeamById(player.teamId, teams);

    return (
        <Link to={`/players/${player.id}`} className="group h-full">
            <div className="bg-white h-full flex flex-col items-center justify-start p-4 rounded-lg shadow-md border border-gray-200 group-hover:shadow-xl group-hover:border-primary-red transition-all duration-300 transform group-hover:-translate-y-1 text-center">
                <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="h-24 w-24 mx-auto mb-3 rounded-full object-cover"
                />
                <h3 className="font-bold text-secondary-blue group-hover:text-primary-red">{player.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{team ? team.name : 'Sin equipo'}</p>
            </div>
        </Link>
    );
};

const TeamsPage: React.FC = () => {
    const context = useContext(DataContext);
    const [searchQuery, setSearchQuery] = useState('');

    if (!context) {
        return <div>Cargando...</div>;
    }
    const { teams, players } = context;

    const filteredPlayers = searchQuery.trim() !== ''
        ? players.filter(player => {
              const query = searchQuery.toLowerCase().trim();
              const team = teams.find(t => t.id === player.teamId);
              return player.name.toLowerCase().includes(query) ||
                     (team && team.name.toLowerCase().includes(query));
          })
        : [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold mb-6 text-secondary-blue border-b-4 border-primary-red pb-2">Equipos y Jugadores</h1>

            <div className="mb-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar jugador por nombre o equipo..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue transition-shadow"
                    aria-label="Buscar jugador por nombre o equipo"
                />
            </div>

            {searchQuery.trim() === '' ? (
                <div>
                    <h2 className="text-2xl font-bold text-secondary-blue mb-4">Equipos Participantes</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {teams.map(team => (
                            <Link to={`/teams/${team.id}`} key={team.id} className="group">
                                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 group-hover:shadow-xl group-hover:border-primary-red transition-all duration-300 transform group-hover:-translate-y-1">
                                    <img 
                                        src={team.logoUrl} 
                                        alt={`${team.name} logo`} 
                                        className="h-24 w-24 mx-auto mb-3 object-contain"
                                    />
                                    <h2 className="text-center font-bold text-secondary-blue group-hover:text-primary-red">
                                        {team.name}
                                    </h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-secondary-blue mb-4">Resultados de la Búsqueda ({filteredPlayers.length})</h2>
                    {filteredPlayers.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredPlayers.map(player => (
                                <PlayerSearchResultCard key={player.id} player={player} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No se encontraron jugadores que coincidan con la búsqueda.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeamsPage;