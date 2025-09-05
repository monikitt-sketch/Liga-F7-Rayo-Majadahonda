
import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import StandingsPage from './pages/StandingsPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import ManagementPage from './pages/ManagementPage';
import { Team, Player, Match } from './types';
import { teams as initialTeams, players as initialPlayers, matches as initialMatches } from './data/mockData';
import AuthProvider, { useAuth } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

// --- Global Data Context ---
interface IDataContext {
    teams: Team[];
    players: Player[];
    matches: Match[];
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [matches, setMatches] = useState<Match[]>(initialMatches);

    const value = useMemo(() => ({ 
        teams, players, matches, setTeams, setPlayers, setMatches 
    }), [teams, players, matches]);


    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
// --- End of Data Context ---


const App: React.FC = () => {
    return (
        <HashRouter>
            <AuthProvider>
                <DataProvider>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow container mx-auto px-4 py-8">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/calendar" element={<CalendarPage />} />
                                <Route path="/standings" element={<StandingsPage />} />
                                <Route path="/teams" element={<TeamsPage />} />
                                <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                                <Route path="/players/:playerId" element={<PlayerDetailPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/management" element={
                                    <ProtectedRoute>
                                        <ManagementPage />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </DataProvider>
            </AuthProvider>
        </HashRouter>
    );
};

const Navbar: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-red/80 transition-colors";
    const activeNavLinkClasses = "bg-primary-red";

    return (
        <nav className="bg-secondary-blue shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                         <NavLink to="/" className="flex-shrink-0 text-white font-bold text-xl flex items-center">
                            <img src="https://i.imgur.com/gA4k3v7.png" alt="Logo Rayo Majadahonda" className="h-10 w-10 mr-2"/>
                            <span>Rayo Majadahonda F7</span>
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} end>Inicio</NavLink>
                            <NavLink to="/calendar" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Calendario</NavLink>
                            <NavLink to="/standings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Clasificación</NavLink>
                            <NavLink to="/teams" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Equipos</NavLink>
                            {currentUser ? (
                                <>
                                    <NavLink to="/management" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Admin</NavLink>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-sm">Hola, {currentUser.username}</span>
                                        <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium bg-primary-red text-white hover:bg-primary-red/80">
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <NavLink to="/management" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Admin</NavLink>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary-blue text-white mt-12">
            <div className="container mx-auto py-6 px-4 text-center">
                <p>&copy; {new Date().getFullYear()} Liga de Fútbol 7 Rayo Majadahonda. Todos los derechos reservados.</p>
                <p className="text-sm text-gray-300 mt-2">Diseñado para la comunidad de la liga.</p>
            </div>
        </footer>
    );
};


export default App;
