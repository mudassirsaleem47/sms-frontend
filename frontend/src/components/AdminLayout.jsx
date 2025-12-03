import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/AdminLogin');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* 1. Fixed Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header/Navbar */}
        <header className="bg-white  border-b border-gray-100 px-7 py-5 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Welcome Back! 👋
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <div onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition font-500 text-sm py-2 px-4">
              <LogOut size={17} />
                  Logout
            </div>
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