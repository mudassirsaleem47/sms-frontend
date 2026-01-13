import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, BookOpen, Users } from 'lucide-react';

const SchedulePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600 mt-2">View your assigned classes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Assigned Classes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{currentUser?.assignedClasses?.length || 0}</p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Subject</p>
              <p className="text-xl font-bold text-purple-600 mt-1">{currentUser?.subject || 'N/A'}</p>
            </div>
            <BookOpen className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Assigned Classes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Your Assigned Classes
          </h3>
        </div>
        <div className="p-6">
          {currentUser?.assignedClasses && currentUser.assignedClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUser.assignedClasses.map((cls, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-md transition">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-600">Class</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{cls.sclassName}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{currentUser?.subject || 'Subject'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Classes Assigned</h3>
              <p className="text-gray-500">You don't have any classes assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
