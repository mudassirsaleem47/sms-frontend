import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config/api.js';
import { Briefcase, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import DesignationModal from '../components/form-popup/DesignationModal';
import ConfirmationModal from '../components/ConfirmationModal';

const DesignationManagement = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [designationToDelete, setDesignationToDelete] = useState(null);

    // Fetch designations
    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchDesignations();
        }
    }, [currentUser]);

    const fetchDesignations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/Designations/${currentUser._id}`);
            if (response.data.success) {
                setDesignations(response.data.designations);
            }
        } catch (error) {
            console.error('Error fetching designations:', error);
            showToast('Failed to load designations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDesignation = () => {
        setSelectedDesignation(null);
        setShowModal(true);
    };

    const handleEditDesignation = (designation) => {
        setSelectedDesignation(designation);
        setShowModal(true);
    };

    const handleDeleteClick = (designation) => {
        setDesignationToDelete(designation);
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`${API_URL}/Designation/${designationToDelete._id}`);
            if (response.data.success) {
                showToast('Designation deleted successfully', 'success');
                fetchDesignations();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete designation';
            showToast(errorMsg, 'error');
        } finally {
            setShowConfirmation(false);
            setDesignationToDelete(null);
        }
    };

    const handleModalClose = (refresh = false) => {
        setShowModal(false);
        setSelectedDesignation(null);
        if (refresh) {
            fetchDesignations();
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
                                <Briefcase className="w-8 h-8 text-indigo-600" />
                                Designation Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage staff designations and roles</p>
                        </div>
                        <button
                            onClick={handleAddDesignation}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Designation
                        </button>
                    </div>
                </div>

                {/* Designations Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : designations.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-600 text-gray-900 mb-2">No Designations Found</h3>
                        <p className="text-gray-600 mb-4">Start by adding your first designation</p>
                        <button
                            onClick={handleAddDesignation}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Add Designation
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {designations.map(designation => (
                            <div key={designation._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
                                {/* Card Header */}
                                <div className="p-5 border-b border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <Briefcase className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{designation.name}</h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-600 mt-1 ${
                                                    designation.isActive === 'active' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {designation.isActive === 'active' ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3 h-3" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    {designation.description ? (
                                        <p className="text-sm text-gray-600 mb-4">{designation.description}</p>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic mb-4">No description provided</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="p-4 border-t border-gray-200 flex gap-2">
                                    <button
                                        onClick={() => handleEditDesignation(designation)}
                                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(designation)}
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

            {/* Designation Modal */}
            {showModal && (
                <DesignationModal
                    designation={selectedDesignation}
                    onClose={handleModalClose}
                />
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
                <ConfirmationModal
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Designation"
                    message={`Are you sure you want to delete "${designationToDelete?.name}"? This action cannot be undone if no staff members are assigned to this designation.`}
                />
            )}
        </div>
    );
};

export default DesignationManagement;
