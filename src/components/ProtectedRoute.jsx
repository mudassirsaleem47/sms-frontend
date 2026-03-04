import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ye component check karega ke user login hai ya nahi
const ProtectedRoute = () => {
    const { currentUser } = useAuth();
    
    if (!currentUser) {
        // Agar user logged in nahi hai, toh usey Login page par bhej do
        return <Navigate to="/AdminLogin" replace />;
    }

    // Agar logged in hai, toh child routes (Outlet) dikhao
    return <Outlet />;
};

export default ProtectedRoute;