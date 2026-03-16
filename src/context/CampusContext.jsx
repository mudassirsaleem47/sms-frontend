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

    // isMainAdmin means school owner (Admin model) OR staff assigned to a Main campus
    // We distinguish school owner by checking if they have a 'designation' (only staff/principals have it)
    const isMainAdmin = (currentUser?.userType === 'admin' && !currentUser?.designation) || 
                        (currentUser?.campus && (currentUser.campus.isMain === true || currentUser.campus === 'main'));

    // Load selected campus from localStorage on mount
    useEffect(() => {
        // If not main admin, force their assigned campus
        if (currentUser && !isMainAdmin && currentUser.campus) {
            setSelectedCampus(currentUser.campus);
            return;
        }

        const savedCampus = localStorage.getItem('selectedCampus');
        if (savedCampus && savedCampus !== 'null') {
            try {
                setSelectedCampus(JSON.parse(savedCampus));
            } catch (error) {
                console.error('Failed to parse saved campus:', error);
            }
        }
    }, [currentUser, isMainAdmin]);

    // Fetch campuses when user changes
    useEffect(() => {
        if (currentUser) {
            const schoolId = currentUser.school?._id || currentUser.school || currentUser._id;
            fetchCampuses(schoolId);
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

    const fetchCampuses = async (schoolId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/Campuses/${schoolId}`);
            if (response.data.success) {
                setCampuses(response.data.campuses);
                
                // If restricted to a campus, find and set the full object from the list
                if (!isMainAdmin && currentUser?.campus) {
                    const myCampus = response.data.campuses.find(c => c._id === (currentUser.campus._id || currentUser.campus));
                    if (myCampus) setSelectedCampus(myCampus);
                } 
                // Auto-select first campus for admin if none selected
                else if (!selectedCampus && response.data.campuses.length > 0) {
                    const mainCampus = response.data.campuses.find(c => c.isMain) || response.data.campuses[0];
                    setSelectedCampus(mainCampus);
                }
            }
        } catch (error) {
            console.error('Error fetching campuses:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeCampus = (campus) => {
        if (!isMainAdmin) return; // Prevent change if not main admin
        setSelectedCampus(campus);
    };

    const clearCampusSelection = () => {
        if (!isMainAdmin) return; // Prevent clear if not main admin
        setSelectedCampus(null);
    };

    return (
        <CampusContext.Provider value={{
            campuses,
            selectedCampus,
            isMainAdmin,
            changeCampus,
            clearCampusSelection,
            fetchCampuses,
            loading
        }}>
            {children}
        </CampusContext.Provider>
    );
};
