import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import API_URL from '../config/api.js';

const CampusContext = createContext();
const isValidObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

export const useCampus = () => useContext(CampusContext);

export const CampusProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [campuses, setCampuses] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState(null); // null means "All Campuses"
    const [loading, setLoading] = useState(false);

    const getAuthConfig = () => {
        try {
            const token = localStorage.getItem('authToken');
            return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        } catch {
            return {};
        }
    };

    const getSchoolId = () => (
        currentUser?.school?._id ||
        currentUser?.school ||
        currentUser?.schoolId ||
        currentUser?._id ||
        ''
    );

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
                const parsedCampus = JSON.parse(savedCampus);
                if (parsedCampus && typeof parsedCampus === 'object' && isValidObjectId(parsedCampus._id)) {
                    setSelectedCampus(parsedCampus);
                } else {
                    localStorage.removeItem('selectedCampus');
                }
            } catch (error) {
                console.error('Failed to parse saved campus:', error);
                localStorage.removeItem('selectedCampus');
            }
        }
    }, [currentUser, isMainAdmin]);

    // Fetch campuses when user changes
    useEffect(() => {
        if (currentUser) {
            const schoolId = getSchoolId();
            if (!schoolId) {
                setCampuses([]);
                setSelectedCampus(null);
                return;
            }
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
            const response = await axios.get(`${API_URL}/Campuses/${schoolId}`, getAuthConfig());
            const campusesData = Array.isArray(response.data)
                ? response.data
                : (response.data?.campuses || []);

            if (!Array.isArray(campusesData)) {
                setCampuses([]);
                return;
            }

            setCampuses(campusesData);

            // If restricted to a campus, find and set the full object from the list
            if (!isMainAdmin && currentUser?.campus) {
                const assignedCampusId = currentUser.campus?._id || currentUser.campus;
                const myCampus = campusesData.find(c => c._id === assignedCampusId);
                if (myCampus) setSelectedCampus(myCampus);
            }
            // Auto-select first campus for admin if none selected or invalid selected campus
            else if ((!selectedCampus || !isValidObjectId(selectedCampus?._id)) && campusesData.length > 0) {
                const mainCampus = campusesData.find(c => c.isMain) || campusesData[0];
                setSelectedCampus(mainCampus);
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
