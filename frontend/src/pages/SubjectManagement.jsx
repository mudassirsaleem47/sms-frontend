import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Trash2, Plus, BookOpen, Clock, Hash, Search, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

const API_BASE = import.meta.env.VITE_API_URL;

const SubjectManagement = () => {
    const { currentUser } = useAuth();
    
    // State
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClassId, setSelectedClassId] = useState("all");
    
    // Add Subject Form State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subName: "",
        subCode: "",
        sessions: "",
        sclass: ""
    });

    // Fetch Classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (currentUser?._id) {
                    const result = await axios.get(`${API_BASE}/Sclasses/${currentUser._id}`);
                    setClasses(result.data);
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
            }
        };
        fetchClasses();
    }, [currentUser]);

    // Fetch Subjects
    const fetchSubjects = async () => {
        if (!currentUser?._id) return;
        setLoading(true);
        try {
            let url = `${API_BASE}/AllSubjects/${currentUser._id}`;
            if (selectedClassId !== "all") {
                url = `${API_BASE}/ClassSubjects/${selectedClassId}`;
            }
            const result = await axios.get(url);
            if (Array.isArray(result.data)) {
                setSubjects(result.data);
            } else {
                setSubjects([]);
            }
        } catch (err) {
            console.error("Error fetching subjects:", err);
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [currentUser, selectedClassId]);

    // Handle Add Subject
    const handleAddSubject = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Backend expects subjects array
            const payload = {
                subjects: [{
                    subName: formData.subName,
                    subCode: formData.subCode,
                    sessions: formData.sessions
                }],
                sclass: formData.sclass,
                adminID: currentUser._id
            };

            await axios.post(`${API_BASE}/SubjectCreate`, payload);
            toast.success("Subject added successfully!");
            setFormData({ subName: "", subCode: "", sessions: "", sclass: "" });
            setShowAddModal(false);
            fetchSubjects();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding subject");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        // Simple window confirm for now, can upgrade to AlertDialog later if consistently needed
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                await axios.delete(`${API_BASE}/Subject/${id}`);
                toast.success("Subject deleted successfully");
                fetchSubjects();
            } catch (err) {
                toast.error("Error deleting subject");
            }
        }
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Subject Management</h2>
                    <p className="text-muted-foreground mt-1">Manage subjects and curriculum</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} size="lg">
                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                </Button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 max-w-sm">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger className="w-[180px] bg-background">
                        <SelectValue placeholder="Filter by Class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map(cls => (
                            <SelectItem key={cls._id} value={cls._id}>{cls.sclassName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
                    ))}
                </div>
            ) : subjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-muted/20 border-dashed text-center">
                        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium">No Subjects Found</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                            {selectedClassId !== "all" ? "This class has no subjects assigned yet." : "Start by adding subjects to your classes."}
                        </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subjects.map((sub) => (
                        <Card key={sub._id} className="group hover:shadow-md transition-all duration-200 overflow-hidden border-t-4 border-t-indigo-500">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                                        {sub.sclass?.sclassName || "No Class"}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(sub._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg font-bold">{sub.subName}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pb-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Hash className="w-4 h-4 mr-2" />
                                    <span>Code: <span className="font-mono text-foreground font-medium">{sub.subCode}</span></span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Sessions: {sub.sessions}/week</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Subject Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                        <DialogDescription>
                            Add a new subject to a specific class.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddSubject} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subName">Subject Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="subName"
                                placeholder="e.g. Mathematics"
                                value={formData.subName}
                                onChange={(e) => setFormData({ ...formData, subName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="subCode">Subject Code <span className="text-destructive">*</span></Label>
                                <Input
                                    id="subCode"
                                    placeholder="e.g. MATH101"
                                    value={formData.subCode}
                                    onChange={(e) => setFormData({ ...formData, subCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sessions">Sessions/Week <span className="text-destructive">*</span></Label>
                                <Input
                                    id="sessions"
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={formData.sessions}
                                    onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="class">Select Class <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.sclass} 
                                onValueChange={(val) => setFormData({ ...formData, sclass: val })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(cls => (
                                        <SelectItem key={cls._id} value={cls._id}>{cls.sclassName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Subject"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SubjectManagement;
