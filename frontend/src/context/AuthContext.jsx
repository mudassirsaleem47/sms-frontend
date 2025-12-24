import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = "http://localhost:5000/AdminLogin"; 

// Local Storage se data load karne ka function
const getInitialUser = () => {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.warn("LocalStorage access denied:", error);
        return null;
    }
};

export const AuthContextProvider = ({ children }) => {
    // Initial state Local Storage se load kiya
    const [currentUser, setCurrentUser] = useState(getInitialUser); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- EFFECT: currentUser change hone par Local Storage update karna ---
    useEffect(() => {
        try {
            if (currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                // Debug logging to track which school is active
                console.log('🏫 Current School:', currentUser.schoolName);
                console.log('👤 Current Admin:', currentUser.name, `(${currentUser.email})`);
                console.log('🔑 School ID:', currentUser._id);
            } else {
                localStorage.removeItem('currentUser');
                console.log('🚪 User logged out - localStorage cleared');
            }
        } catch (error) {
            console.warn("LocalStorage access denied:", error);
        }
    }, [currentUser]);
    // ----------------------------------------------------------------------

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(API_URL, credentials);
            
            console.log('✅ Login successful!');
            setCurrentUser(res.data);
            setLoading(false);
            return res.data; 

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Check server status.");
            setLoading(false);
            throw err; 
        }
    };

    const logout = () => {
        console.log('🔴 Logging out and clearing all data...');
        setCurrentUser(null);
        setError(null);
        
        // Clear all localStorage items related to app
        try {
            localStorage.clear();
        } catch (error) {
            console.warn("LocalStorage clear failed:", error);
        }
        
        // Force page reload to ensure all state is cleared
        setTimeout(() => {
            window.location.href = '/AdminLogin';
        }, 100);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};