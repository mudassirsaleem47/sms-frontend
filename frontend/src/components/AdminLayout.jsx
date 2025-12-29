import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CampusSelector from './CampusSelector';
import NotificationCenter from './NotificationCenter';
import { LogOut, User, Settings, Mail, Lock, Globe, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
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
      
      {/* 1. Sidebar - Now responsive */}
      <Sidebar onLogout={handleLogout} isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header/Navbar - Mobile responsive */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-7 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu for Mobile */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <div className="text-sm text-gray-600 hidden sm:block">
              Welcome Back! 👋
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <CampusSelector />
            <NotificationCenter />
            
            {/* Profile Dropdown */}
            {currentUser && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 md:w-9 h-8 md:h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-4 md:w-5 h-4 md:h-5 text-indigo-600" />
                  </div>
                  <ChevronDown className={`w-3 md:w-4 h-3 md:h-4 text-gray-500 transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 md:w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
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
          <div className="p-4 md:p-6">
            <Outlet /> {/* <-- Ye component child routes ko load karega */}
          </div>
        </main>
      </div>
    </div>
  );
}; 

export default AdminLayout;