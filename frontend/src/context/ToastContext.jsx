import React, { createContext, useState, useContext, useEffect } from 'react';
import Toast from '../components/Toast';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(null);
    
    const { currentUser } = useAuth();

    // Get userId from AuthContext
    useEffect(() => {
        if (currentUser && currentUser._id) {
            setUserId(currentUser._id);
        } else {
            setUserId(null);
        }
    }, [currentUser]);

    // Fetch notifications from backend when userId is available
    useEffect(() => {
        if (userId) {
            fetchNotifications();
        } else {
            setNotifications([]);
        }
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            if (!userId) return;
            
            const response = await axios.get(`http://localhost:5000/Notifications/${userId}`);
            if (response.data.success) {
                // Convert backend format to frontend format
                const formattedNotifications = response.data.notifications.map(notif => ({
                    id: notif._id,
                    message: notif.message,
                    type: notif.type,
                    timestamp: notif.timestamp,
                    read: notif.read
                }));
                setNotifications(formattedNotifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const showToast = async (message, type = 'success') => {
        setToast({ message, type });
        
        // Add to notification history in backend
        try {
            if (userId) {
                const response = await axios.post('http://localhost:5000/NotificationCreate', {
                    userId,
                    message,
                    type
                });

                if (response.data.success) {
                    // Add to local state immediately
                    const newNotification = {
                        id: response.data.notification._id,
                        message: response.data.notification.message,
                        type: response.data.notification.type,
                        timestamp: response.data.notification.timestamp,
                        read: false
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                }
            }
        } catch (error) {
            console.error('Failed to save notification:', error);
            // Fallback to local state if backend fails (no persistence)
            const newNotification = {
                id: Date.now() + Math.random(),
                message,
                type,
                timestamp: new Date().toISOString(),
                read: false
            };
            setNotifications(prev => [newNotification, ...prev]);
        }
    };

    const hideToast = () => {
        setToast(null);
    };

    const markAsRead = async (id) => {
        try {
            // Update backend
            await axios.put(`http://localhost:5000/Notification/${id}/read`);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            // Still update local state even if backend fails
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
        }
    };

    const clearNotifications = async () => {
        try {
            if (userId) {
                // Clear from backend
                await axios.delete(`http://localhost:5000/Notifications/clear-all/${userId}`);
            }
            // Clear local state
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            // Still clear local state even if backend fails
            setNotifications([]);
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, notifications, markAsRead, clearNotifications, fetchNotifications }}>
            {children}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={hideToast} 
                />
            )}
        </ToastContext.Provider>
    );
};
