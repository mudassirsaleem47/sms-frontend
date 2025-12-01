import React, { createContext, useState, useContext, useEffect } from 'react'; // useEffect import kiya
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = "http://localhost:5000/AdminLogin"; 

// Local Storage se data load karne ka function
const getInitialUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

export const AuthContextProvider = ({ children }) => {
    // Initial state Local Storage se load kiya
    const [currentUser, setCurrentUser] = useState(getInitialUser); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- EFFECT: currentUser change hone par Local Storage update karna ---
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);
    // ----------------------------------------------------------------------

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(API_URL, credentials);
            
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
        setCurrentUser(null);
        // localStorage.removeItem('currentUser'); // Ye kaam ab useEffect mein ho raha hai
    };

    return (
        <AuthContext.Provider value={{ currentUser, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};