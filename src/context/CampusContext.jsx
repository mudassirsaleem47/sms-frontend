import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import API_URL from '../config/api.js';

const CampusContext = createContext();

export const useCampus = () => useContext(CampusContext);

export const CampusProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [campuses, setCampuses] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState(null); // null means "All Campuses"
    const [loading, setLoading] = useState(false);

    // Load selected campus from localStorage on mount
    useEffect(() => {
        const savedCampus = localStorage.getItem('selectedCampus');
        if (savedCampus && savedCampus !== 'null') {
            try {
                setSelectedCampus(JSON.parse(savedCampus));
            } catch (error) {
                console.error('Failed to parse saved campus:', error);
            }
        }
    }, []);

    // Fetch campuses when user changes
    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchCampuses();
        } else {
            setCampuses([]);
            setSelectedCampus(null);
        }
    }, [currentUser]);

    // Save selected campus to localStorage
    useEffect(() => {
        if (selectedCampus) {
            localStorage.setItem('selectedCampus', JSON.stringify(selectedCampus));
        } else {
            localStorage.removeItem('selectedCampus');
        }
    }, [selectedCampus]);

    const fetchCampuses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/Campuses/${currentUser._id}`);
            if (response.data.success) {
                setCampuses(response.data.campuses);
                
                // Auto-select main campus if no campus is selected
                if (!selectedCampus && response.data.campuses.length > 0) {
                    const mainCampus = response.data.campuses.find(c => c.isMain);
                    if (mainCampus) {
                        setSelectedCampus(mainCampus);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching campuses:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeCampus = (campus) => {
        setSelectedCampus(campus);
    };

    const clearCampusSelection = () => {
        setSelectedCampus(null);
    };

    return (
        <CampusContext.Provider value={{
            campuses,
            selectedCampus,
            changeCampus,
            clearCampusSelection,
            fetchCampuses,
            loading
        }}>
            {children}
        </CampusContext.Provider>
    );
};
