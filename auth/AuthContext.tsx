

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Permission } from './types';

const AUTH_STORAGE_KEY = 'liga-futbol-auth';

interface IAuthContext {
    currentUser: User | null;
    users: User[];
    loading: boolean;
    // FIX: Corrected typo in password parameter type.
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
    addUser: (userData: Omit<User, 'id'>) => void;
    updateUserPermissions: (userId: string, permissions: Permission[]) => void;
    deleteUser: (userId: string) => void;
    // FIX: Corrected typo in oldPassword parameter type.
    changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setUsers(parsedData.users || []);
            } else {
                // Initialize with a default admin user if no data exists
                const defaultAdmin: User = { 
                    id: 'u1', 
                    username: 'admin', 
                    password: 'password', // NOTE: Plain text password for demo purposes only.
                    permissions: ['manage_teams', 'manage_matches', 'manage_results', 'manage_users'] 
                };
                setUsers([defaultAdmin]);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ users: [defaultAdmin] }));
            }
        } catch (error) {
            console.error("Failed to load auth data from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const persistUsers = (updatedUsers: User[]) => {
        setUsers(updatedUsers);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ users: updatedUsers }));
    };

    // FIX: Corrected typo in password parameter type.
    const login = (username: string, password: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                setCurrentUser(user);
                resolve();
            } else {
                reject(new Error('Usuario o contraseña incorrectos.'));
            }
        });
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const hasPermission = (permission: Permission): boolean => {
        return !!currentUser?.permissions.includes(permission);
    };
    
    const addUser = (userData: Omit<User, 'id'>) => {
        if (users.some(u => u.username === userData.username)) {
            throw new Error('El nombre de usuario ya existe.');
        }
        const newUser: User = { ...userData, id: `u-${crypto.randomUUID()}` };
        persistUsers([...users, newUser]);
    };

    const updateUserPermissions = (userId: string, permissions: Permission[]) => {
        const updatedUsers = users.map(u => u.id === userId ? { ...u, permissions } : u);
        persistUsers(updatedUsers);
    };
    
    const deleteUser = (userId: string) => {
        if (currentUser?.id === userId) {
            throw new Error('No puedes eliminar tu propia cuenta.');
        }
        const updatedUsers = users.filter(u => u.id !== userId);
        persistUsers(updatedUsers);
    };
    
    // FIX: Corrected typo in oldPassword parameter type.
    const changePassword = (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) return reject(new Error('Usuario no encontrado.'));

            const user = users[userIndex];
            if (user.password !== oldPassword) {
                return reject(new Error('La contraseña actual es incorrecta.'));
            }

            const updatedUser = { ...user, password: newPassword };
            const updatedUsers = [...users];
            updatedUsers[userIndex] = updatedUser;
            persistUsers(updatedUsers);
            
            // Also update the current user in state if they are the one changing the password
            if (currentUser?.id === userId) {
                setCurrentUser(updatedUser);
            }
            resolve();
        });
    };

    const value = { currentUser, users, loading, login, logout, hasPermission, addUser, updateUserPermissions, deleteUser, changePassword };

    // FIX: Moved all context logic inside the component scope and added the missing return statement.
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;