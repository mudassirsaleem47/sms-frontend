import React from 'react';
import { useCampus } from '../context/CampusContext';
import { Building2, ChevronDown } from 'lucide-react';

const CampusSelector = () => {
    const { campuses, selectedCampus, changeCampus, clearCampusSelection, loading } = useCampus();

    // Show placeholder if no campuses yet
    if (loading) {
        return (
            <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-400 min-w-[200px] animate-pulse">
                Loading campuses...
            </div>
        );
    }

    return (
        <div className="relative">
            <select
                value={selectedCampus?._id || ''}
                onChange={(e) => {
                    if (e.target.value === '') {
                        clearCampusSelection();
                    } else {
                        const campus = campuses.find(c => c._id === e.target.value);
                        changeCampus(campus);
                    }
                }}
                disabled={campuses.length === 0}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-2 text-sm font-medium text-gray-700 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer min-w-[200px] disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                {campuses.length === 0 ? (
                    <option value="">No campuses available</option>
                ) : (
                    <>
                        <option value="">All Campuses</option>
                        {campuses.map(campus => (
                            <option key={campus._id} value={campus._id}>
                                {campus.campusName} {campus.isMain ? '(Main)' : ''}
                            </option>
                        ))}
                    </>
                )}
            </select>
            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    );
};

export default CampusSelector;
