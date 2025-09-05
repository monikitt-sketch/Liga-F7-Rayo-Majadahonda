

import React, { useState, useContext, ChangeEvent, FormEvent, useMemo, useEffect } from 'react';
import { DataContext } from '../App';
import { Team, Player, Match } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from '../auth/AuthContext';
import { User, Permission, ALL_PERMISSIONS, PERMISSION_LABELS } from '../auth/types';

const ManagementPage: React.FC = () => {
    return <AdminDashboard />;
};

const AdminDashboard: React.FC = () => {
    const { hasPermission } = useAuth();

    const availableTabs = useMemo(() => {
        const tabs: { key: string, label: string }[] = [];
        if (hasPermission('manage_teams')) tabs.push({ key: 'teams', label: 'Gestión de Equipos y Jugadores' });
        if (hasPermission('manage_matches')) tabs.push({ key: 'matches', label: 'Gestión de Calendario' });
        if (hasPermission('manage_results')) tabs.push({ key: 'results', label: 'Gestión de Resultados' });
        if (hasPermission('manage_users')) tabs.push({ key: 'users', label: 'Gestión de Usuarios' });
        return tabs;
    }, [hasPermission]);

    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        if (availableTabs.length > 0 && !activeTab) {
            setActiveTab(availableTabs[0].key);
        }
    }, [availableTabs, activeTab]);

    if (availableTabs.length === 0) {
        return (
             <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                 <h1 className="text-3xl font-extrabold text-secondary-blue">Panel de Administración</h1>
                 <p className="mt-4 text-gray-600">No tienes permisos para gestionar ninguna sección. Por favor, contacta a un administrador.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b-4 border-primary-red pb-4 mb-6">
                <h1 className="text-3xl font-extrabold text-secondary-blue">Panel de Administración</h1>
            </div>

            <div className="flex border-b mb-6 flex-wrap">
                {availableTabs.map(tab => (
                    <TabButton key={tab.key} title={tab.label} isActive={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
                ))}
            </div>

            <div>
                {activeTab === 'teams' && <TeamPlayerManagementTab />}
                {activeTab === 'matches' && <MatchManagementTab />}
                {activeTab === 'results' && <ResultsManagementTab />}
                {activeTab === 'users' && <UserManagementTab />}
            </div>
             <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                <p><strong>Aviso de Seguridad:</strong> Este panel de administración es una demostración. En una aplicación real, la gestión de usuarios y contraseñas debe ser manejada por un servidor seguro (backend) para proteger la información sensible.</p>
            </div>
        </div>
    );
};

const TabButton: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
    <button
        className={`py-2 px-4 font-semibold text-sm md:text-base ${isActive ? 'border-b-2 border-primary-red text-primary-red' : 'text-gray-500 hover:text-gray-700'}`}
        onClick={onClick}
        aria-pressed={isActive}
    >
        {title}
    </button>
);


// --- START: MODAL COMPONENT ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-2xl font-bold text-secondary-blue">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};
// --- END: MODAL COMPONENT ---


// --- START: CONFIRMATION MODAL ---
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                 <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg className="h-6 w-6 text-primary-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-bold text-secondary-blue" id="modal-title">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-red text-base font-medium text-white hover:bg-primary-red/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                        onClick={onConfirm}
                    >
                        Confirmar
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-blue sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- END: CONFIRMATION MODAL ---


// --- TEAM & PLAYER MANAGEMENT ---
const TeamPlayerManagementTab: React.FC = () => {
    const context = useContext(DataContext);
    
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

    if (!context) return <div>Cargando...</div>;
    const { teams, players, setTeams, setPlayers, setMatches } = context;

    React.useEffect(() => {
        if (selectedTeamId && !teams.find(t => t.id === selectedTeamId)) {
            setSelectedTeamId(null);
        }
    }, [teams, selectedTeamId]);

    const selectedTeam = useMemo(() => teams.find(t => t.id === selectedTeamId), [teams, selectedTeamId]);
    const teamPlayers = useMemo(() => players.filter(p => p.teamId === selectedTeamId), [players, selectedTeamId]);

    const handleOpenAddTeamModal = () => {
        setEditingTeam(null);
        setIsTeamModalOpen(true);
    };

    const handleOpenEditTeamModal = (team: Team) => {
        setEditingTeam(team);
        setIsTeamModalOpen(true);
    };

    const handleOpenAddPlayerModal = () => {
        if (!selectedTeamId) return;
        setEditingPlayer(null);
        setIsPlayerModalOpen(true);
    };

    const handleOpenEditPlayerModal = (player: Player) => {
        setEditingPlayer(player);
        setIsPlayerModalOpen(true);
    };
    
    const handleCloseModals = () => {
        setIsTeamModalOpen(false);
        setIsPlayerModalOpen(false);
        setEditingTeam(null);
        setEditingPlayer(null);
    };

    const handleSaveTeam = (teamData: Omit<Team, 'id'>) => {
        if (editingTeam) {
            setTeams(currentTeams =>
                currentTeams.map(t => (t.id === editingTeam.id ? { ...t, ...teamData } : t))
            );
        } else {
            const newTeam: Team = {
                id: `T-${crypto.randomUUID()}`,
                ...teamData,
                logoUrl: teamData.logoUrl || 'https://i.imgur.com/8G1Z2aH.png', // Use provided or default
            };
            setTeams(currentTeams => [...currentTeams, newTeam]);
        }
        handleCloseModals();
    };

    const handleInitiateDeleteTeam = (teamId: string) => {
        setTeamToDelete(teamId);
    };

    const handleConfirmDeleteTeam = () => {
        if (!teamToDelete) return;
        setTeams(currentTeams => currentTeams.filter(t => t.id !== teamToDelete));
        setPlayers(currentPlayers => currentPlayers.filter(p => p.teamId !== teamToDelete));
        setMatches(currentMatches => currentMatches.filter(m => m.homeTeamId !== teamToDelete && m.awayTeamId !== teamToDelete));
        setTeamToDelete(null);
    };

    const handleCancelDeleteTeam = () => {
        setTeamToDelete(null);
    };

    const handleSavePlayer = (playerData: Omit<Player, 'id' | 'teamId' | 'photoUrl'>) => {
        if (!selectedTeamId) return;
        if (editingPlayer) {
            setPlayers(currentPlayers =>
                currentPlayers.map(p => (p.id === editingPlayer.id ? { ...p, ...playerData } : p))
            );
        } else {
            const newPlayer: Player = {
                id: `P-${crypto.randomUUID()}`,
                teamId: selectedTeamId,
                photoUrl: `https://picsum.photos/seed/P${crypto.randomUUID()}/200`,
                ...playerData,
            };
            setPlayers(currentPlayers => [...currentPlayers, newPlayer]);
        }
        handleCloseModals();
    };

    const handleDeletePlayer = (playerId: string) => {
        if (!playerId) return;
        if (window.confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
            setPlayers(currentPlayers => currentPlayers.filter(p => p.id !== playerId));
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- TEAMS COLUMN (MASTER) --- */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-secondary-blue">Equipos</h2>
                        <button onClick={handleOpenAddTeamModal} className="bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition-colors">
                            Añadir Equipo
                        </button>
                    </div>
                    <div className="space-y-2 border rounded-lg p-2 max-h-[60vh] overflow-y-auto">
                        {teams.map(team => (
                            <div 
                                key={team.id}
                                onClick={() => setSelectedTeamId(team.id)}
                                className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${selectedTeamId === team.id ? 'bg-secondary-blue text-white shadow-md' : 'bg-light-gray hover:bg-gray-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={team.logoUrl} alt={team.name} className="h-10 w-10 rounded-full object-contain bg-white" />
                                    <span className="font-semibold">{team.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenEditTeamModal(team); }} className="bg-yellow-500 text-white text-xs py-1 px-2 rounded hover:bg-yellow-600">Editar</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleInitiateDeleteTeam(team.id); }} className="bg-primary-red text-white text-xs py-1 px-2 rounded hover:bg-primary-red/80">Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- PLAYERS COLUMN (DETAIL) --- */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-secondary-blue truncate">
                            {selectedTeam ? `Jugadores de: ${selectedTeam.name}` : 'Jugadores'}
                        </h2>
                        <button onClick={handleOpenAddPlayerModal} disabled={!selectedTeamId} className="bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Añadir Jugador
                        </button>
                    </div>
                     <div className="border rounded-lg p-2 min-h-[60vh]">
                        {!selectedTeamId ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                                <p className="mt-2 font-semibold">Selecciona un equipo</p>
                                <p className="text-sm">Elige un equipo de la lista para ver sus jugadores.</p>
                            </div>
                        ) : (
                             <div className="space-y-2 max-h-[calc(60vh-1rem)] overflow-y-auto">
                                {teamPlayers.map(player => (
                                    <div key={player.id} className="bg-light-gray p-3 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={player.photoUrl} alt={player.name} className="h-10 w-10 rounded-full object-cover" />
                                            <div>
                                                <span className="font-semibold">{player.name}</span>
                                                <span className="text-gray-500 text-sm block">Dorsal: #{player.jerseyNumber}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenEditPlayerModal(player)} className="bg-yellow-500 text-white text-xs py-1 px-2 rounded hover:bg-yellow-600">Editar</button>
                                            <button onClick={() => handleDeletePlayer(player.id)} className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600">Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                                {teamPlayers.length === 0 && (
                                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-8">
                                        <p className="font-semibold">Este equipo no tiene jugadores.</p>
                                        <p className="text-sm">Puedes empezar añadiendo uno.</p>
                                     </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TeamFormModal isOpen={isTeamModalOpen} onClose={handleCloseModals} onSave={handleSaveTeam} team={editingTeam} />
            <PlayerFormModal isOpen={isPlayerModalOpen} onClose={handleCloseModals} onSave={handleSavePlayer} player={editingPlayer} />
             <ConfirmationModal
                isOpen={!!teamToDelete}
                onClose={handleCancelDeleteTeam}
                onConfirm={handleConfirmDeleteTeam}
                title="Eliminar Equipo"
                message="¿Estás seguro de que quieres eliminar este equipo? Se borrarán también todos sus jugadores y partidos asociados. Esta acción no se puede deshacer."
            />
            <SmartImportSection />
        </>
    );
};


// Team Form Modal
const TeamFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: Omit<Team, 'id'>) => void; team: Team | null }> = ({ isOpen, onClose, onSave, team }) => {
    const [formData, setFormData] = useState({
        name: '',
        delegate: '',
        shirtColor: '',
        category: 'Primera División',
        logoUrl: ''
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: team?.name || '',
                delegate: team?.delegate || '',
                shirtColor: team?.shirtColor || '',
                category: team?.category || 'Primera División',
                logoUrl: team?.logoUrl || ''
            });
        }
    }, [team, isOpen]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={team ? 'Editar Equipo' : 'Añadir Equipo'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                <div>
                    <label htmlFor="delegate" className="block text-sm font-medium text-gray-700">Delegado</label>
                    <input type="text" name="delegate" id="delegate" value={formData.delegate} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                <div>
                    <label htmlFor="shirtColor" className="block text-sm font-medium text-gray-700">Color Camiseta</label>
                    <input type="text" name="shirtColor" id="shirtColor" value={formData.shirtColor} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">URL del Logo</label>
                    <input type="url" name="logoUrl" id="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://ejemplo.com/logo.png" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};

// Player Form Modal
const PlayerFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: Omit<Player, 'id' | 'teamId' | 'photoUrl'>) => void; player: Player | null }> = ({ isOpen, onClose, onSave, player }) => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        jerseyNumber: 0,
        stats: { aperturaGoals: 0, clausuraGoals: 0 }
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: player?.name || '',
                dob: player?.dob || '',
                jerseyNumber: player?.jerseyNumber || 0,
                stats: {
                    aperturaGoals: player?.stats.aperturaGoals || 0,
                    clausuraGoals: player?.stats.clausuraGoals || 0,
                }
            });
        }
    }, [player, isOpen]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (name === 'stats.aperturaGoals' || name === 'stats.clausuraGoals') {
            const goalType = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                stats: { ...prev.stats, [goalType]: type === 'number' ? parseInt(value, 10) || 0 : value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={player ? 'Editar Jugador' : 'Añadir Jugador'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="p-name" className="block text-sm font-medium text-gray-700">Nombre del Jugador</label>
                    <input type="text" name="name" id="p-name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                    <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                 <div>
                    <label htmlFor="jerseyNumber" className="block text-sm font-medium text-gray-700">Número de Camiseta</label>
                    <input type="number" name="jerseyNumber" id="jerseyNumber" value={formData.jerseyNumber} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                 <div>
                    <label htmlFor="stats.aperturaGoals" className="block text-sm font-medium text-gray-700">Goles Apertura</label>
                    <input type="number" name="stats.aperturaGoals" id="stats.aperturaGoals" value={formData.stats.aperturaGoals} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                 <div>
                    <label htmlFor="stats.clausuraGoals" className="block text-sm font-medium text-gray-700">Goles Clausura</label>
                    <input type="number" name="stats.clausuraGoals" id="stats.clausuraGoals" value={formData.stats.clausuraGoals} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};


// --- START: SMART IMPORT SECTION (AI-POWERED) ---
const SmartImportSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dataType, setDataType] = useState<'teams' | 'players'>('teams');
    const [pastedText, setPastedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const context = useContext(DataContext);

    if (!context) return null;
    const { teams, players, setTeams, setPlayers } = context;

    const teamSchema = {
        type: Type.ARRAY, description: "List of football teams.", items: {
            type: Type.OBJECT, properties: {
                id: { type: Type.STRING, description: "Unique ID for the team (e.g., T08)." },
                name: { type: Type.STRING, description: "Team name." },
                delegate: { type: Type.STRING, description: "Delegate's name." },
                shirtColor: { type: Type.STRING, description: "Team's shirt color." },
                category: { type: Type.STRING, description: "Team's category (e.g., Primera División)." },
            }, required: ["id", "name", "delegate", "shirtColor", "category"],
        }
    };
    
    const playerSchema = {
        type: Type.ARRAY, description: "List of football players.", items: {
            type: Type.OBJECT, properties: {
                id: { type: Type.STRING, description: "Unique ID for the player (e.g., P13)." },
                name: { type: Type.STRING, description: "Player's full name." },
                dob: { type: Type.STRING, description: "Date of birth in YYYY-MM-DD format." },
                jerseyNumber: { type: Type.INTEGER, description: "Player's jersey number." },
                teamId: { type: Type.STRING, description: "ID of the team the player belongs to." },
                aperturaGoals: { type: Type.INTEGER, description: "Goals scored in the Apertura tournament." },
                clausuraGoals: { type: Type.INTEGER, description: "Goals scored in the Clausura tournament." },
            }, required: ["id", "name", "dob", "jerseyNumber", "teamId", "aperturaGoals", "clausuraGoals"],
        }
    };

    const handleProcessWithAI = async () => {
        if (!pastedText.trim()) {
            setErrorMessage("Por favor, pega los datos que quieres importar.");
            return;
        }
        setIsProcessing(true);
        setErrorMessage('');
        setSuccessMessage('');
        setPreviewData([]);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const schema = dataType === 'teams' ? teamSchema : playerSchema;
            const prompt = `Analiza el siguiente texto que contiene una lista de ${dataType === 'teams' ? 'equipos' : 'jugadores'} de fútbol. Extrae los datos de cada entrada y devuélvelos como un array JSON válido. Ignora cualquier línea que no sea una entrada válida o que parezca una cabecera. Asegúrate de que las fechas de nacimiento estén en formato YYYY-MM-DD.\n\nDatos:\n${pastedText}`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema },
            });
            
            const parsedJson = JSON.parse(response.text);

            if (!Array.isArray(parsedJson)) {
                throw new Error("La respuesta de la IA no es un array válido.");
            }
            
            const existingTeamIds = new Set(teams.map(t => t.id));
            const existingPlayerIds = new Set(players.map(p => p.id));
            
            const validatedData = parsedJson.map(item => {
                if (dataType === 'teams') {
                    if (existingTeamIds.has(item.id)) {
                        return { ...item, status: 'duplicate' };
                    }
                    return { ...item, status: 'new' };
                } else { // players
                    if (existingPlayerIds.has(item.id)) {
                        return { ...item, status: 'duplicate' };
                    }
                    if (!existingTeamIds.has(item.teamId)) {
                        return { ...item, status: 'error', message: `El equipo con ID '${item.teamId}' no existe.` };
                    }
                     if (!/^\d{4}-\d{2}-\d{2}$/.test(item.dob)) {
                        return { ...item, status: 'error', message: `Formato de fecha inválido: '${item.dob}'.` };
                    }
                    return { ...item, status: 'new' };
                }
            });
            
            setPreviewData(validatedData);
            
        } catch (error: any) {
            console.error("Error processing with AI:", error);
            setErrorMessage(`Error al procesar los datos con la IA. Asegúrate de que los datos pegados sean correctos. Detalle: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmImport = () => {
        const newData = previewData.filter(item => item.status === 'new');
        if (newData.length === 0) {
            setErrorMessage("No hay nuevos datos válidos para importar.");
            return;
        }
        
        if (dataType === 'teams') {
            const newTeams: Team[] = newData.map(item => ({
                id: item.id,
                name: item.name,
                delegate: item.delegate,
                shirtColor: item.shirtColor,
                category: item.category,
                logoUrl: 'https://i.imgur.com/8G1Z2aH.png',
            }));
            setTeams(prev => [...prev, ...newTeams]);
        } else {
            const newPlayers: Player[] = newData.map(item => ({
                id: item.id,
                name: item.name,
                dob: item.dob,
                jerseyNumber: item.jerseyNumber,
                teamId: item.teamId,
                stats: {
                    aperturaGoals: item.aperturaGoals,
                    clausuraGoals: item.clausuraGoals
                },
                photoUrl: `https://picsum.photos/seed/${item.id}/200`,
            }));
            setPlayers(prev => [...prev, ...newPlayers]);
        }
        
        setSuccessMessage(`${newData.length} ${dataType === 'teams' ? 'equipos' : 'jugadores'} importados con éxito.`);
        setPreviewData([]);
        setPastedText('');
    };
    
    const getStatusBadge = (status: 'new' | 'duplicate' | 'error', message?: string) => {
        switch (status) {
            case 'new': return <span title="Se añadirá al confirmar" className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Nuevo</span>;
            case 'duplicate': return <span title="Este ID ya existe y se ignorará" className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Duplicado</span>;
            case 'error': return <span title={message} className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Error</span>;
            default: return null;
        }
    };

    return (
        <div className="mt-8 border-t pt-6">
            <button onClick={() => setIsOpen(!isOpen)} className="text-lg font-bold text-secondary-blue w-full text-left flex justify-between items-center">
                <span>Importación Inteligente con IA</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <p className="mb-4 text-gray-600">Pega los datos de equipos o jugadores desde una hoja de cálculo, documento o texto simple. La IA los analizará y preparará para la importación.</p>
                    
                    {errorMessage && <div className="p-3 mb-4 rounded bg-red-100 text-red-800">{errorMessage}</div>}
                    {successMessage && <div className="p-3 mb-4 rounded bg-green-100 text-green-800">{successMessage}</div>}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">1. Selecciona el tipo de datos</label>
                        <div className="flex gap-4">
                           <label className="flex items-center"><input type="radio" name="dataType" value="teams" checked={dataType === 'teams'} onChange={() => setDataType('teams')} className="mr-2"/>Equipos</label>
                           <label className="flex items-center"><input type="radio" name="dataType" value="players" checked={dataType === 'players'} onChange={() => setDataType('players')} className="mr-2"/>Jugadores</label>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="pasted-text" className="block text-sm font-medium text-gray-700 mb-2">2. Pega aquí los datos</label>
                        <textarea 
                            id="pasted-text"
                            rows={8}
                            value={pastedText}
                            onChange={(e) => setPastedText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"
                            placeholder={dataType === 'teams' ? "Ej: T08, Leones FC, Juan Díaz, Azul, Primera División" : "Ej: P15, Alex García, 1999-05-20, 10, T08, 5, 2"}
                        />
                    </div>

                    <button onClick={handleProcessWithAI} disabled={isProcessing} className="w-full bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                        {isProcessing ? <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Procesando...</> : "3. Analizar datos con IA"}
                    </button>
                    
                    {previewData.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-secondary-blue mb-2">Vista Previa de Importación</h3>
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-light-gray">
                                        <tr>
                                            <th className="p-2 text-left">Estado</th>
                                            {Object.keys(previewData[0]).filter(k => k !== 'status' && k !== 'message').map(key => <th key={key} className="p-2 text-left">{key}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {previewData.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-2">{getStatusBadge(item.status, item.message)}</td>
                                                {Object.keys(item).filter(k => k !== 'status' && k !== 'message').map(key => <td key={key} className="p-2">{String(item[key])}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                             <button onClick={handleConfirmImport} className="mt-4 w-full bg-primary-red text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors">
                                4. Confirmar y Añadir Nuevos Datos
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
// --- END: SMART IMPORT SECTION ---


const MatchManagementTab = () => {
    const context = useContext(DataContext);
    const [formState, setFormState] = useState({ homeTeamId: '', awayTeamId: '', date: '', field: 'Campo 1 - La Oliva', tournament: 'Apertura', matchday: 1 });
    const [matchToDelete, setMatchToDelete] = useState<string | null>(null);

    if (!context) return null;
    const { teams, matches, setMatches } = context;

    const handleAddMatch = () => {
        if (!formState.homeTeamId || !formState.awayTeamId || !formState.date) {
            alert('Completa todos los campos obligatorios: Equipo Local, Equipo Visitante y Fecha.');
            return;
        }
        if (formState.homeTeamId === formState.awayTeamId) {
            alert('El equipo local y el visitante no pueden ser el mismo.');
            return;
        }
        const newMatch: Match = {
            id: `M-${crypto.randomUUID()}`,
            date: new Date(formState.date).toISOString(),
            field: formState.field,
            fieldLocationUrl: 'https://maps.google.com/?q=40.4721,-3.8736',
            homeTeamId: formState.homeTeamId,
            awayTeamId: formState.awayTeamId,
            tournament: formState.tournament as 'Apertura' | 'Clausura',
            matchday: Number(formState.matchday),
            status: 'scheduled',
        };
        setMatches(prev => [...prev, newMatch].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        alert('Partido añadido correctamente.');
    };

    const handleConfirmDeleteMatch = () => {
        if (!matchToDelete) return;
        setMatches(prev => prev.filter(m => m.id !== matchToDelete));
        setMatchToDelete(null);
    };

    return (
         <div>
            <h2 className="text-xl font-bold text-secondary-blue mb-4">Añadir Nuevo Partido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 border rounded">
                <select aria-label="Equipo Local" value={formState.homeTeamId} onChange={e => setFormState({...formState, homeTeamId: e.target.value})} className="p-2 border rounded"><option value="">-- Equipo Local --</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                <select aria-label="Equipo Visitante" value={formState.awayTeamId} onChange={e => setFormState({...formState, awayTeamId: e.target.value})} className="p-2 border rounded"><option value="">-- Equipo Visitante --</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                <input aria-label="Fecha y Hora del Partido" type="datetime-local" value={formState.date} onChange={e => setFormState({...formState, date: e.target.value})} className="p-2 border rounded"/>
                <input aria-label="Jornada" type="number" placeholder="Jornada" min="1" value={formState.matchday} onChange={e => setFormState({...formState, matchday: Number(e.target.value)})} className="p-2 border rounded"/>
                <select aria-label="Campo de juego" value={formState.field} onChange={e => setFormState({...formState, field: e.target.value})} className="p-2 border rounded">
                    <option>Campo 1 - La Oliva</option>
                    <option>Campo 2 - Cerro del Espino</option>
                </select>
                <select aria-label="Torneo" value={formState.tournament} onChange={e => setFormState({...formState, tournament: e.target.value as 'Apertura' | 'Clausura'})} className="p-2 border rounded">
                    <option value="Apertura">Apertura</option>
                    <option value="Clausura">Clausura</option>
                </select>
                <button onClick={handleAddMatch} className="md:col-span-2 lg:col-span-3 bg-secondary-blue text-white p-2 rounded hover:bg-blue-800 font-semibold">Añadir Partido</button>
            </div>
            <h2 className="text-xl font-bold text-secondary-blue mb-4">Partidos Existentes</h2>
            <div className="space-y-2">
                {matches.filter(m => m.status === 'scheduled').map(m => {
                    const home = teams.find(t=>t.id === m.homeTeamId);
                    const away = teams.find(t=>t.id === m.awayTeamId);
                    return (<div key={m.id} className="flex items-center justify-between p-2 bg-light-gray rounded">
                        <span><strong>{home?.name || 'N/A'}</strong> vs <strong>{away?.name || 'N/A'}</strong> ({new Date(m.date).toLocaleString('es-ES')})</span>
                        <button onClick={() => setMatchToDelete(m.id)} className="bg-primary-red text-white text-xs py-1 px-2 rounded hover:bg-red-700">Eliminar</button>
                    </div>);
                })}
            </div>
            <ConfirmationModal
                isOpen={!!matchToDelete}
                onClose={() => setMatchToDelete(null)}
                onConfirm={handleConfirmDeleteMatch}
                title="Eliminar Partido"
                message="¿Estás seguro de que quieres eliminar este partido programado? Esta acción no se puede deshacer."
            />
        </div>
    );
};

const ResultsManagementTab = () => {
    const context = useContext(DataContext);
    const [scores, setScores] = useState<{ [key: string]: { home: string, away: string } }>({});
    
    if (!context) return null;
    const { teams, matches, setMatches } = context;

    const matchesToManage = useMemo(() => {
        return matches
            .filter(m => (m.status === 'scheduled' && new Date(m.date) < new Date()) || m.status === 'finished')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [matches]);

    useEffect(() => {
        const initialScores = matchesToManage.reduce((acc, match) => {
            if (match.status === 'finished' && match.score) {
                acc[match.id] = {
                    home: String(match.score.home),
                    away: String(match.score.away)
                };
            }
            return acc;
        }, {} as { [key: string]: { home: string, away: string } });
        
        setScores(prevScores => ({ ...initialScores, ...prevScores }));
    }, [matches, matchesToManage]);

    const handleScoreChange = (id: string, team: 'home' | 'away', value: string) => {
        const scoreValue = value.replace(/[^0-9]/g, '');
        setScores(prev => ({
            ...prev,
            [id]: { ...(prev[id] || { home: '', away: '' }), [team]: scoreValue }
        }));
    };
    
    const handleSaveResult = (matchId: string) => {
        const score = scores[matchId];
        if (!score || score.home === '' || score.away === '') {
            alert('Introduce ambos marcadores.');
            return;
        }
        setMatches(prevMatches => prevMatches.map(m => {
            if (m.id === matchId) {
                return { ...m, status: 'finished', score: { home: parseInt(score.home, 10), away: parseInt(score.away, 10) } };
            }
            return m;
        }));
        alert(`Resultado guardado para el partido ${matchId}.`);
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-secondary-blue mb-4">Gestionar Resultados de Partidos</h2>
            <div className="space-y-4">
                {matchesToManage.map(m => {
                    const home = teams.find(t => t.id === m.homeTeamId);
                    const away = teams.find(t => t.id === m.awayTeamId);
                    const isFinished = m.status === 'finished';
                    return (
                        <div key={m.id} className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded ${isFinished ? 'bg-green-50' : ''}`}>
                            <div className="md:col-span-2">
                                <p className="font-bold">{home?.name} vs {away?.name}</p>
                                <p className="text-sm text-gray-500">{new Date(m.date).toLocaleString('es-ES')}</p>
                                {isFinished && <span className="text-xs font-bold text-green-700">RESULTADO GUARDADO</span>}
                            </div>
                            <div className="flex gap-2 items-center">
                                <input type="number" min="0" placeholder="Local" aria-label={`Goles ${home?.name}`} className="w-full p-2 border rounded" value={scores[m.id]?.home ?? ''} onChange={e => handleScoreChange(m.id, 'home', e.target.value)} />
                                <span>-</span>
                                <input type="number" min="0" placeholder="Visitante" aria-label={`Goles ${away?.name}`} className="w-full p-2 border rounded" value={scores[m.id]?.away ?? ''} onChange={e => handleScoreChange(m.id, 'away', e.target.value)} />
                            </div>
                            <button onClick={() => handleSaveResult(m.id)} className={`${isFinished ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded`}>
                                {isFinished ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    );
                })}
                 {matchesToManage.length === 0 && <p className="text-gray-500 text-center py-4">No hay partidos pendientes de resultado o finalizados para gestionar.</p>}
            </div>
        </div>
    );
};

// --- USER MANAGEMENT ---

const UserManagementTab: React.FC = () => {
    const { currentUser, users, addUser, updateUserPermissions, deleteUser, changePassword } = useAuth();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [error, setError] = useState('');

    const handleOpenAddUser = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
        setError('');
    };
    
    const handleOpenEditUser = (user: User) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
        setError('');
    };

    const handleCloseModals = () => {
        setIsUserModalOpen(false);
        setIsPasswordModalOpen(false);
        setEditingUser(null);
        setError('');
    };

    // FIX: Corrected typo in userData parameter type from 'password; string' to 'password: string'.
    const handleSaveUser = (userData: { username: string; password: string; permissions: Permission[] }) => {
        try {
            if (editingUser) {
                updateUserPermissions(editingUser.id, userData.permissions);
            } else {
                // FIX: Correctly pass the user data object to the addUser function.
                addUser({ username: userData.username, password: userData.password, permissions: userData.permissions });
            }
            handleCloseModals();
        } catch(e: any) {
            setError(e.message);
        }
    };
    
    const handleDeleteUser = () => {
        if (!userToDelete) return;
        try {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
        } catch (e: any) {
            alert(e.message);
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-secondary-blue">Usuarios del Sistema</h2>
                 <div>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors mr-2">Cambiar mi Contraseña</button>
                    <button onClick={handleOpenAddUser} className="bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition-colors">Añadir Usuario</button>
                </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-light-gray">
                        <tr>
                            <th className="p-3 text-left font-bold">Usuario</th>
                            <th className="p-3 text-left font-bold">Permisos</th>
                            <th className="p-3 text-left font-bold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="p-3 font-semibold">{user.username} {currentUser?.id === user.id && '(Tú)'}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                    {user.permissions.length > 0 ? user.permissions.map(p => (
                                        <span key={p} className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{PERMISSION_LABELS[p]}</span>
                                    )) : <span className="text-xs text-gray-500">Ninguno</span>}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenEditUser(user)} className="bg-yellow-500 text-white text-xs py-1 px-2 rounded hover:bg-yellow-600">Editar Permisos</button>
                                        {currentUser?.id !== user.id && (
                                            <button onClick={() => setUserToDelete(user)} className="bg-primary-red text-white text-xs py-1 px-2 rounded hover:bg-red-700">Eliminar</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <UserFormModal 
                isOpen={isUserModalOpen} 
                onClose={handleCloseModals} 
                onSave={handleSaveUser} 
                user={editingUser}
                error={error}
            />

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={handleCloseModals}
            />
            
            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDeleteUser}
                title="Eliminar Usuario"
                message={`¿Estás seguro de que quieres eliminar al usuario '${userToDelete?.username}'? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

const UserFormModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (data: any) => void, user: User | null, error: string}> = ({ isOpen, onClose, onSave, user, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [permissions, setPermissions] = useState<Set<Permission>>(new Set());
    
    useEffect(() => {
        if (isOpen) {
            setUsername(user?.username || '');
            setPassword('');
            setPermissions(new Set(user?.permissions || []));
        }
    }, [user, isOpen]);

    const handlePermissionChange = (permission: Permission) => {
        const newPermissions = new Set(permissions);
        if (newPermissions.has(permission)) {
            newPermissions.delete(permission);
        } else {
            newPermissions.add(permission);
        }
        setPermissions(newPermissions);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!user && !password) {
            alert('La contraseña es obligatoria para nuevos usuarios.');
            return;
        }
        onSave({ username, password, permissions: Array.from(permissions) });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Editar Permisos' : 'Añadir Usuario'}>
             <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 mb-4 rounded bg-red-100 text-red-800">{error}</div>}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                    <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} required disabled={!!user} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue disabled:bg-gray-100"/>
                </div>
                {!user && (
                     <div>
                        <label htmlFor="password-field" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input type="password" id="password-field" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary-blue focus:border-secondary-blue"/>
                    </div>
                )}
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Permisos</label>
                    <div className="mt-2 space-y-2">
                        {ALL_PERMISSIONS.map(p => (
                            <label key={p} className="flex items-center">
                                <input type="checkbox" checked={permissions.has(p)} onChange={() => handlePermissionChange(p)} className="h-4 w-4 text-secondary-blue border-gray-300 rounded focus:ring-secondary-blue"/>
                                <span className="ml-2 text-gray-700">{PERMISSION_LABELS[p]}</span>
                            </label>
                        ))}
                    </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800">Guardar</button>
                </div>
            </form>
        </Modal>
    );
};

const ChangePasswordModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { currentUser, changePassword } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const resetForm = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setIsLoading(false);
    }
    
    const handleClose = () => {
        resetForm();
        onClose();
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }
        if (!currentUser) {
            setError('No se ha encontrado el usuario actual.');
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(currentUser.id, oldPassword, newPassword);
            setSuccess('¡Contraseña cambiada con éxito!');
            setTimeout(handleClose, 2000);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar Contraseña">
             <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 rounded bg-red-100 text-red-800 text-sm">{error}</div>}
                {success && <div className="p-3 rounded bg-green-100 text-green-800 text-sm">{success}</div>}
                <div>
                    <label htmlFor="oldPassword"className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                    <input type="password" id="oldPassword" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                </div>
                 <div>
                    <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                </div>
                 <div>
                    <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="bg-secondary-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800 disabled:bg-gray-400">{isLoading ? 'Guardando...' : 'Guardar Cambios'}</button>
                </div>
             </form>
        </Modal>
    );
};


export default ManagementPage;