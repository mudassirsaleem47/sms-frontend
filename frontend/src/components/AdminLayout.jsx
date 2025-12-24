import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';
import { LogOut, User, Settings, Mail, Lock, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const menuItems = [
    { icon: User, label: 'Profile', action: () => navigate('/admin/profile') },
    { icon: Lock, label: 'Reset Password', action: () => navigate('/admin/reset-password') },
    { icon: Mail, label: 'Mailbox', action: () => navigate('/admin/mailbox') },
    { icon: Globe, label: 'Global Settings', action: () => navigate('/admin/settings') },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* 1. Fixed Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header/Navbar */}
        <header className="bg-white border-b border-gray-100 px-7 py-5 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Welcome Back! 👋
          </div>
          
          <div className="flex items-center gap-3">
            <NotificationCenter />
            
            {/* Profile Dropdown */}
            {currentUser && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-indigo-600">
                            {currentUser.schoolName?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {currentUser.schoolName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setShowDropdown(false);
                            item.action();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                        >
                          <item.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content (Jahan Dashboard, Students, Fees load honge) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet /> {/* <-- Ye component child routes ko load karega */}
          </div>
        </main>
      </div>
    </div>
  );
}; 

export default AdminLayout;