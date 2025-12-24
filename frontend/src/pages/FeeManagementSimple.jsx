import React from 'react';
import { useAuth } from '../context/AuthContext';

const FeeManagement = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Fee Management (Simple Test)</h1>
        <p className="text-gray-600">Testing if this page loads...</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-lg">✓ Page is loading successfully!</p>
        <p className="mt-2">Logged in as: {currentUser?.schoolName || 'Unknown'}</p>
        <p className="mt-2">School ID: {currentUser?._id || 'No ID'}</p>
      </div>
    </div>
  );
};

export default FeeManagement;
