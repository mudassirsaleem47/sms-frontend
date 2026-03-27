import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api.js';

export const AuthContext = createContext();

const LOGIN_URL = `${API_URL}/AdminLogin`; 
const TEACHER_LOGIN_URL = `${API_URL}/TeacherLogin`;
const STUDENT_LOGIN_URL = `${API_URL}/StudentLogin`;
const AUTH_TOKEN_KEY = 'authToken';

const setAxiosAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common.Authorization;
    }
};

const getInitialToken = () => {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY) || '';
    } catch {
        return '';
    }
};

// Ensure authenticated requests on first render before effects run.
const INITIAL_AUTH_TOKEN = getInitialToken();
setAxiosAuthHeader(INITIAL_AUTH_TOKEN);

const isValidObjectId = (value) => (
    typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
);

const normalizeSchoolId = (value) => {
    if (!value) return null;
    if (typeof value === 'string') {
        return isValidObjectId(value) ? value : null;
    }
    if (typeof value === 'object') {
        const candidate = value._id;
        return isValidObjectId(candidate) ? candidate : null;
    }
    return null;
};

const getSchoolIdFromUser = (user) => {
    if (!user) return null;
    if (user.userType === 'admin') return normalizeSchoolId(user._id);
    if (typeof user.school === 'string') return normalizeSchoolId(user.school);
    if (user.school?._id) return normalizeSchoolId(user.school._id);
    return null;
};

const persistSchoolSettingsToStorage = (settings) => {
    if (!settings) return;
    if (settings.notifications) localStorage.setItem('sms_notificationPrefs', JSON.stringify(settings.notifications));
    if (settings.accentColor) localStorage.setItem('sms_accentColor', JSON.stringify(settings.accentColor));
    if (settings.borderRadius) localStorage.setItem('sms_borderRadius', settings.borderRadius);
    if (settings.fontSize) localStorage.setItem('sms_fontSize', settings.fontSize);
    if (settings.sidebarCompact !== undefined) localStorage.setItem('sms_sidebarCompact', String(settings.sidebarCompact));
    if (settings.animationsEnabled !== undefined) localStorage.setItem('sms_animations', String(settings.animationsEnabled));
    if (settings.preferences) localStorage.setItem('sms_appPreferences', JSON.stringify(settings.preferences));
};

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
    const [currentUser, setCurrentUser] = useState(getInitialUser); 
    const [authToken, setAuthToken] = useState(INITIAL_AUTH_TOKEN);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        setAxiosAuthHeader(authToken);
        try {
            if (authToken) localStorage.setItem(AUTH_TOKEN_KEY, authToken);
            else localStorage.removeItem(AUTH_TOKEN_KEY);
        } catch {
            // ignore storage failures
        }
    }, [authToken]);

    const [activeSession, setActiveSession] = useState(null);

    // --- EFFECT: currentUser change hone par Local Storage update karna ---
    useEffect(() => {
        try {
            if (currentUser) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.warn("LocalStorage access denied:", error);
        }
    }, [currentUser]);

    // Session system disabled intentionally.

    // Keep school branding/settings in sync for all login roles
    useEffect(() => {
        const hydrateSchoolSettings = async () => {
            if (!currentUser) return;

            const schoolId = getSchoolIdFromUser(currentUser);
            if (!schoolId) return;

            try {
                const res = await axios.get(`${API_URL}/Admin/${schoolId}`);
                const admin = res.data;
                if (!admin || !admin._id) return;

                persistSchoolSettingsToStorage(admin.settings);

                setCurrentUser((prev) => {
                    if (!prev) return prev;
                    const prevSchoolId = getSchoolIdFromUser(prev);
                    if (prevSchoolId !== schoolId) return prev;

                    const nextSchoolName = prev.schoolName || admin.schoolName || prev.school?.schoolName || '';
                    const nextSchoolLogo = admin.schoolLogo || prev.schoolLogo || '';
                    const nextFavicon = admin.favicon || prev.favicon || '';
                    const nextSchoolObj = prev.school && typeof prev.school === 'object'
                        ? {
                            ...prev.school,
                            schoolName: prev.school.schoolName || admin.schoolName || prev.school.schoolName,
                            schoolLogo: admin.schoolLogo || prev.school.schoolLogo,
                            favicon: admin.favicon || prev.school.favicon,
                        }
                        : prev.school;

                    const isSame =
                        prev.schoolName === nextSchoolName &&
                        prev.schoolLogo === nextSchoolLogo &&
                        prev.favicon === nextFavicon &&
                        JSON.stringify(prev.school) === JSON.stringify(nextSchoolObj);

                    if (isSame) return prev;

                    return {
                        ...prev,
                        schoolName: nextSchoolName,
                        schoolLogo: nextSchoolLogo,
                        favicon: nextFavicon,
                        school: nextSchoolObj,
                        schoolAddress: admin.address || prev.schoolAddress,
                        schoolPhoneNumber: admin.phoneNumber || prev.schoolPhoneNumber,
                        schoolWebsite: admin.website || prev.schoolWebsite,
                    };
                });
            } catch (err) {
                if (err.response?.status !== 404) {
                    console.error('Failed to sync school settings:', err);
                }
            }
        };

        hydrateSchoolSettings();
    }, [currentUser?.userType, currentUser?._id, currentUser?.school, currentUser?.school?._id]);
    // ----------------------------------------------------------------------

    // Admin Login
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(LOGIN_URL, credentials);
            const token = res.data?.token || '';
            const { token: _token, ...adminPayload } = res.data || {};
            const userData = { ...adminPayload, userType: 'admin' };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            setAuthToken(token);

            // Populate LocalStorage with DB Settings
            persistSchoolSettingsToStorage(res.data.settings);

            setCurrentUser(userData);
            setLoading(false);
            return userData; // Return full user data including type
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            setLoading(false);
            throw err;
        }
    };

    // Teacher Login
    const teacherLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(TEACHER_LOGIN_URL, credentials);
            const token = res.data?.token || '';
            // res.data.teacher already contains populated campus from backend teacherLogin controller? 
            // Let's check backend teacherLogin controller first.
            const userData = { ...res.data.teacher, userType: 'teacher' };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            setAuthToken(token);
            setCurrentUser(userData);
            setLoading(false);
            return userData; 
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            setLoading(false);
            throw err; 
        }
    };

    // Parent/Student Login
    const parentLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(STUDENT_LOGIN_URL, credentials);
            const token = res.data?.token || '';
            const { token: _token, ...studentPayload } = res.data || {};
            const userData = { ...studentPayload, userType: 'parent' }; // Treat student login as parent view
            localStorage.setItem('currentUser', JSON.stringify(userData));
            setAuthToken(token);
            setCurrentUser(userData);
            setLoading(false);
            return userData;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            setLoading(false);
            throw err;
        }
    };

    // Staff Login (Accountant, etc.)
    const staffLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/StaffLogin`, credentials);
            const token = res.data?.token || '';
            const staff = res.data.staff;
            const role = staff.role || staff.designation;

            // Determine userType based on role for frontend routing (Case Insensitive)
            let userType = 'staff';
            const normalizeRole = role ? role.toLowerCase() : '';

            if (normalizeRole === 'accountant') userType = 'accountant';
            else if (normalizeRole === 'teacher') userType = 'teacher';
            else if (normalizeRole === 'receptionist') userType = 'receptionist';
            else if (normalizeRole === 'admin' || normalizeRole === 'principal') userType = 'admin';

            const userData = { ...staff, userType: userType };
            localStorage.setItem('currentUser', JSON.stringify(userData));
            setAuthToken(token);
            setCurrentUser(userData);
            setLoading(false);
            return userData;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('currentUser');
            localStorage.removeItem(AUTH_TOKEN_KEY);
        } catch (e) {
            console.warn("LocalStorage clear failed:", e);
        }
        setAuthToken('');
        setCurrentUser(null);
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, activeSession, setActiveSession, loading, error, login, teacherLogin, parentLogin, staffLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};