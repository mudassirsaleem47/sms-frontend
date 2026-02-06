import React from 'react';
import StudentAdmissionForm from '../components/forms/StudentAdmissionForm';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentAdmission = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex flex-col gap-4">


                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <GraduationCap className="h-8 w-8 text-primary" />
                            </div>
                            Student Admission
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Complete the admission form below to register a new student. Ensure all required documents and details are accurate.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="grid gap-6">
                <StudentAdmissionForm
                    onSuccess={() => navigate('/admin/students')}
                    onCancel={() => navigate(-1)}
                />
            </div>
        </div>
    );
};

export default StudentAdmission;
