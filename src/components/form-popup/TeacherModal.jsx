import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/DatePicker";
import { PasswordField } from '@/components/ui/email-pass';
import { useCampus } from '@/context/CampusContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TeacherModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const { campuses, selectedCampus, isMainAdmin } = useCampus();
    // Form state - if initialData exists (Edit mode), use it, otherwise keep empty
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        subject: '',
        qualification: '',
        experience: 0,
        salary: '',
        joiningDate: new Date().toISOString().split('T')[0],
        campus: ''
    });

    // When initialData changes (Edit button clicked), fill the form
    useEffect(() => {
        if (initialData) {
            const formattedData = {
                ...initialData,
                joiningDate: initialData.joiningDate ? initialData.joiningDate.split('T')[0] : '',
                // Don't include password in edit mode
                password: '',
                campus: initialData.campus?._id || initialData.campus || ''
            };
            setFormData(formattedData);
        } else {
            // Reset form for add mode
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                subject: '',
                qualification: '',
                experience: 0,
                salary: '',
                joiningDate: new Date().toISOString().split('T')[0],
                campus: selectedCampus?._id || ''
            });
        }
    }, [initialData, isOpen, selectedCampus]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCampusChange = (val) => {
        setFormData({ ...formData, campus: val });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {initialData ? 'Edit Teacher' : 'Add New Teacher'}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData ? 'Update the teacher details below.' : 'Fill in the details to add a new teacher to the system.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section 1: Account Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">Account Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    name="name" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="teacher@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <PasswordField
                                label={`Password ${!initialData ? '*' : ''}`}
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!initialData}
                                placeholder={initialData ? "Leave blank to keep current" : "Min 8 chars"}
                            />
                        </div>

                        {/* Section 2: Professional Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">Professional Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel" 
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="subject"
                                        name="subject" 
                                        placeholder="e.g. Mathematics"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="qualification">Qualification <span className="text-destructive">*</span></Label>
                                <Input
                                    id="qualification"
                                    name="qualification" 
                                    placeholder="e.g. M.Sc, B.Ed"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="campus">Assigned Campus <span className="text-destructive">*</span></Label>
                                <Select 
                                    value={formData.campus} 
                                    onValueChange={handleCampusChange}
                                    disabled={!isMainAdmin}
                                >
                                    <SelectTrigger className={!isMainAdmin ? "bg-muted cursor-not-allowed" : ""}>
                                        <SelectValue placeholder="Select Campus" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campuses.map(c => (
                                            <SelectItem key={c._id} value={c._id}>{c.campusName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Employment Details */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Employment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience (Years)</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    min="0" 
                                    placeholder="0"
                                    value={formData.experience}
                                    onChange={handleChange} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary">Monthly Salary <span className="text-destructive">*</span></Label>
                                <Input
                                    id="salary"
                                    name="salary"
                                    type="number"
                                    min="0" 
                                    placeholder="Monthly Amount"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="joiningDate">Joining Date</Label>
                                <DatePicker
                                    id="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={(val) => setFormData(prev => ({ ...prev, joiningDate: val }))}
                                    placeholder="Select joining date"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? 'Update Teacher' : 'Save Teacher'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TeacherModal;
