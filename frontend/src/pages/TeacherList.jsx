import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    Edit,
    Trash2,
    Plus,
    Check,
    BookOpen,
    Search,
    LayoutGrid,
    List as ListIcon,
    MoreHorizontal,
    Mail,
    Phone,
    GraduationCap,
    IndianRupee
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import TeacherModal from '../components/form-popup/TeacherModal';
import AssignClassModal from '../components/form-popup/AssignClassModal';

const API_BASE = API_URL;

const TeacherList = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();

    // --- State Management ---
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('list'); // 'list' | 'grid'
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);

    // Assignment Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [teacherToAssign, setTeacherToAssign] = useState(null);

    // Delete Confirmation State
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // --- 1. Data Fetching (Load on Page Start) ---
    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            const schoolId = currentUser._id;
            setTeachers([]);
            const response = await axios.get(`${API_BASE}/Teachers/${schoolId}`);
            setTeachers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(error);
            showToast("Error loading teachers", "error");
        } finally {
            setLoading(false);
        }
    }, [currentUser, showToast]);

    useEffect(() => {
        if (currentUser) fetchData();
    }, [currentUser, fetchData]);

    // --- 2. Action Handlers ---

    const handleFormSubmit = async (formData) => {
        try {
            const dataToSend = { ...formData, school: currentUser._id };
            
            if (currentTeacher) {
                if (!dataToSend.password) delete dataToSend.password;
                await axios.put(`${API_BASE}/Teacher/${currentTeacher._id}`, dataToSend);
            } else {
                await axios.post(`${API_BASE}/TeacherRegister`, dataToSend);
            }

            setIsModalOpen(false);
            setCurrentTeacher(null);
            fetchData();
            showToast("Teacher saved successfully!", "success");
        } catch (err) {
            showToast("Failed to save teacher.", "error");
        }
    };

    const handleDelete = (id) => {
        if (selectedDeleteId === id) {
            confirmDelete();
        } else {
            setSelectedDeleteId(id);
            setTimeout(() => setSelectedDeleteId(null), 3000);
        }
    };

    const confirmDelete = async () => {
        if (!selectedDeleteId) return;
        try {
            await axios.delete(`${API_BASE}/Teacher/${selectedDeleteId}`);
            fetchData();
            showToast("Teacher deleted successfully!", "success");
        } catch (err) {
            showToast("Error deleting teacher", "error");
        }
        setSelectedDeleteId(null);
    };

    const handleEdit = (teacher) => {
        setCurrentTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentTeacher(null);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (location.state?.openAddModal) {
            handleAdd();
            window.history.replaceState({}, document.title)
        }
        if (location.state?.searchTarget && teachers.length > 0) {
            const targetTeacher = teachers.find(t => t._id === location.state.searchTarget);
            if (targetTeacher) {
                setSearchQuery(targetTeacher.name);
                window.history.replaceState({}, document.title);
            }
        }
    }, [location, teachers]);

    const handleAssignClass = (teacher) => {
        setTeacherToAssign(teacher);
        setIsAssignModalOpen(true);
    };

    const handleAssignSuccess = (updatedTeacher) => {
        setTeachers(prev => prev.map(t => t._id === updatedTeacher._id ? updatedTeacher : t));
    };

    const filteredTeachers = teachers.filter((teacher) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            teacher.name?.toLowerCase().includes(query) ||
            teacher.email?.toLowerCase().includes(query) ||
            teacher.subject?.toLowerCase().includes(query) ||
            teacher.qualification?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Teacher Management</h2>
                    <p className="text-muted-foreground">Manage and track all teachers in your school</p>
                </div>
                <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Teacher
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-1 rounded-lg">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, subject..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center bg-muted/50 p-1 rounded-lg border ml-auto">
                    <Button
                        variant={viewType === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewType('list')}
                        className="h-8 w-8"
                        title="List View"
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewType === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewType('grid')}
                        className="h-8 w-8"
                        title="Grid View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))}
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-muted/10 border-dashed text-center">
                    <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <GraduationCap className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-medium">No Teachers Found</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        {searchQuery ? "No matches found for your search." : "Get started by adding teachers to your staff."}
                    </p>
                </div>
                ) : viewType === 'list' ? (
                    <div className="rounded-md border bg-card shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="pl-4">Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="hidden md:table-cell">Qualification</TableHead>
                                    <TableHead className="hidden lg:table-cell">Experience</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeachers.map((teacher) => (
                                    <TableRow key={teacher._id} className="group hover:bg-muted/30 transition-colors">
                                        <TableCell className="pl-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {teacher.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span>{teacher.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {teacher.email}</span>
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {teacher.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {teacher.subject}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{teacher.qualification}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{teacher.experience} Years</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleAssignClass(teacher)} title="Assign Class">
                                                    <BookOpen className="h-4 w-4 text-emerald-600" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(teacher)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(teacher._id)}>
                                                            {selectedDeleteId === teacher._id ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                            {selectedDeleteId === teacher._id ? "Confirm Delete" : "Delete"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredTeachers.map((teacher) => (
                                    <Card key={teacher._id} className="overflow-hidden hover:shadow-md transition-all">
                                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                            <Avatar className="h-12 w-12 border">
                                                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                                    {teacher.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <CardTitle className="text-base">{teacher.name}</CardTitle>
                                                <CardDescription className="text-xs">{teacher.email}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-2 text-sm grid gap-2">
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Subject</span>
                                                <span className="font-medium">{teacher.subject}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Phone</span>
                                                <span>{teacher.phone}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Qualification</span>
                                                <span>{teacher.qualification}</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-muted-foreground">Salary</span>
                                                <span className="font-semibold text-green-600 flex items-center">
                                                    Rs. {teacher.salary?.toLocaleString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-2 flex justify-between bg-muted/20">
                                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleAssignClass(teacher)}>
                                                <BookOpen className="mr-2 h-3 w-3" /> Assign Class
                                            </Button>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(teacher)}>
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(teacher._id)}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                </div>
            )}

            <TeacherModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={currentTeacher}
            />

            <AssignClassModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                teacher={teacherToAssign}
                onAssignSuccess={handleAssignSuccess}
            />
        </div>
    );
};

export default TeacherList;
