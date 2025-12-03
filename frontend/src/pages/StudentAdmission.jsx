import React from 'react';
import StudentAdmissionForm from '../components/forms/StudentAdmissionForm';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const StudentAdmission = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors mb-6 group font-medium"
                >
                    <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-3">
                        Student Admission
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Complete the form below to admit a new student. Please ensure all required fields are filled correctly.
                    </p>
                </div>
                
                <StudentAdmissionForm onSuccess={() => navigate('/admin/students')} />
            </div>
        </div>
    );
};

export default StudentAdmission;
