import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config/api.js';
import { Users, Plus, Edit, Trash2, UserCheck, UserX, Building2, GraduationCap, Calculator, Phone as PhoneIcon } from 'lucide-react';
import StaffModal from '../components/form-popup/StaffModal';
import ConfirmationModal from '../components/ConfirmationModal';

const StaffManagement = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [filterRole, setFilterRole] = useState('');

    // Fetch staff
    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchStaff();
        }
    }, [currentUser]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/Staff/${currentUser._id}`);
            if (response.data.success) {
                setStaff(response.data.staff);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            showToast('Failed to load staff', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = () => {
        setSelectedStaff(null);
        setShowModal(true);
    };

    const handleEditStaff = (staffMember) => {
        setSelectedStaff(staffMember);
        setShowModal(true);
    };

    const handleDeleteClick = (staffMember) => {
        setStaffToDelete(staffMember);
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`${API_URL}/Staff/${staffToDelete._id}`);
            if (response.data.success) {
                showToast('Staff member deleted successfully', 'success');
                fetchStaff();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete staff member';
            showToast(errorMsg, 'error');
        } finally {
            setShowConfirmation(false);
            setStaffToDelete(null);
        }
    };

    const handleModalClose = (refresh = false) => {
        setShowModal(false);
        setSelectedStaff(null);
        if (refresh) {
            fetchStaff();
        }
    };

    // Filter staff by role
    const filteredStaff = filterRole 
        ? staff.filter(s => s.role === filterRole)
        : staff;

    // Get role icon
    const getRoleIcon = (role) => {
        switch (role) {
            case 'Teacher': return <GraduationCap className="w-5 h-5" />;
            case 'Accountant': return <Calculator className="w-5 h-5" />;
            case 'Receptionist': return <PhoneIcon className="w-5 h-5" />;
            default: return <Users className="w-5 h-5" />;
        }
    };

    // Get role color
    const getRoleColor = (role) => {
        switch (role) {
            case 'Teacher': return 'bg-blue-100 text-blue-700';
            case 'Accountant': return 'bg-green-100 text-green-700';
            case 'Receptionist': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-8 h-8 text-indigo-600" />
                                Staff Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage teachers, accountants, and receptionists</p>
                        </div>
                        <button
                            onClick={handleAddStaff}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Staff
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => setFilterRole('')}
                            className={`px-4 py-2 rounded-lg transition ${!filterRole ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            All ({staff.length})
                        </button>
                        <button
                            onClick={() => setFilterRole('Teacher')}
                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${filterRole === 'Teacher' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Teachers ({staff.filter(s => s.role === 'Teacher').length})
                        </button>
                        <button
                            onClick={() => setFilterRole('Accountant')}
                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${filterRole === 'Accountant' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <Calculator className="w-4 h-4" />
                            Accountants ({staff.filter(s => s.role === 'Accountant').length})
                        </button>
                        <button
                            onClick={() => setFilterRole('Receptionist')}
                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${filterRole === 'Receptionist' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <PhoneIcon className="w-4 h-4" />
                            Receptionists ({staff.filter(s => s.role === 'Receptionist').length})
                        </button>
                    </div>
                </div>

                {/* Staff Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredStaff.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-600 text-gray-900 mb-2">No Staff Members Found</h3>
                        <p className="text-gray-600 mb-4">Start by adding your first staff member</p>
                        <button
                            onClick={handleAddStaff}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Add Staff
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaff.map(staffMember => (
                            <div key={staffMember._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
                                {/* Card Header */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                {staffMember.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{staffMember.name}</h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-600 ${getRoleColor(staffMember.role)}`}>
                                                    {getRoleIcon(staffMember.role)}
                                                    {staffMember.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-4 space-y-2">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Email:</span>
                                        <p className="text-gray-900 font-500">{staffMember.email}</p>
                                    </div>
                                    {staffMember.phone && (
                                        <div className="text-sm">
                                            <span className="text-gray-500">Phone:</span>
                                            <p className="text-gray-900 font-500">{staffMember.phone}</p>
                                        </div>
                                    )}
                                    {staffMember.campus && (
                                        <div className="text-sm flex items-center gap-1">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700">{staffMember.campus.campusName}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        {staffMember.status === 'active' ? (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <UserCheck className="w-4 h-4" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-600">
                                                <UserX className="w-4 h-4" />
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-4 border-t border-gray-200 flex gap-2">
                                    <button
                                        onClick={() => handleEditStaff(staffMember)}
                                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(staffMember)}
                                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Staff Modal */}
            {showModal && (
                <StaffModal
                    staff={selectedStaff}
                    onClose={handleModalClose}
                />
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
                <ConfirmationModal
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Staff Member"
                    message={`Are you sure you want to delete ${staffToDelete?.name}? This action cannot be undone.`}
                />
            )}
        </div>
    );
};

export default StaffManagement;
