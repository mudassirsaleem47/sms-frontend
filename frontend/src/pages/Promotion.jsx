import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ArrowRight, Users, Loader2, Check, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import API_URL_CENTRAL from '@/config/api';
const API_BASE = API_URL_CENTRAL;

const Promotion = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleNameClick = (e, studentId) => {
        e.stopPropagation();
        const basePath = location.pathname.startsWith('/teacher') ? '/teacher' : '/admin';
        navigate(`${basePath}/students/${studentId}`);
    };
    
    // --- State ---
    const [classes, setClasses] = useState([]);
    const [sourceClass, setSourceClass] = useState("");
    const [targetClass, setTargetClass] = useState("");
    
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [promoting, setPromoting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Fetch Classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (currentUser?._id) {
                    const result = await axios.get(`${API_BASE}/Sclasses/${currentUser._id}`);
                    setClasses(result.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load classes");
            }
        };
        fetchClasses();
    }, [currentUser]);

    // Fetch Students when Source Class changes
    useEffect(() => {
        const fetchStudents = async () => {
            if (!sourceClass) {
                setStudents([]);
                return;
            }
            setLoading(true);
            try {
                // Fetch all and filter client-side as per pattern
                const res = await axios.get(`${API_BASE}/Students/${currentUser._id}`);
                const allStudents = Array.isArray(res.data) ? res.data : [];
                const classStudents = allStudents.filter(s => s.sclassName?._id === sourceClass);
                setStudents(classStudents);
                setSelectedStudents([]); // Reset selection
            } catch (err) {
                console.error(err);
                toast.error("Failed to load students");
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [sourceClass, currentUser]);

    // Toggle Select All
    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedStudents(students.map(s => s._id));
        } else {
            setSelectedStudents([]);
        }
    };

    // Toggle Individual Student
    const toggleStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(prev => prev.filter(sid => sid !== id));
        } else {
            setSelectedStudents(prev => [...prev, id]);
        }
    };

    const handlePromoteClick = () => {
        if (!sourceClass || !targetClass) {
            toast.error("Please select both source and target classes");
            return;
        }
        if (sourceClass === targetClass) {
            toast.error("Source and Target classes cannot be the same");
            return;
        }
        if (selectedStudents.length === 0) {
            toast.error("Please select students to promote");
            return;
        }
        setShowConfirm(true);
    };

    const confirmPromote = async () => {
        setPromoting(true);
        try {
            await axios.put(`${API_BASE}/Students/Promote`, {
                studentIds: selectedStudents,
                nextClassId: targetClass
            });
            toast.success(`${selectedStudents.length} students promoted successfully!`);
            
            // Refresh list
            const remaining = students.filter(s => !selectedStudents.includes(s._id));
            setStudents(remaining);
            setSelectedStudents([]);
            setShowConfirm(false);
        } catch (err) {
            console.error(err);
            toast.error("Error promoting students");
        } finally {
            setPromoting(false);
        }
    };

    const sourceClassName = classes.find(c => c._id === sourceClass)?.sclassName || "Source Class";
    const targetClassName = classes.find(c => c._id === targetClass)?.sclassName || "Target Class";

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    Student Promotion
                </h1>
                <p className="text-muted-foreground mt-1">
                    Promote students from one academic session/class to the next.
                </p>
            </div>

            <Separator />

            {/* Selection Panel */}
            <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Promotion Settings</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">

                    <div className="md:col-span-3 space-y-2">
                        <Label>Current Class (From)</Label>
                        <Select value={sourceClass} onValueChange={setSourceClass}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c._id} value={c._id}>{c.sclassName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center md:col-span-1 text-muted-foreground pt-6">
                        <div className="p-2 rounded-full bg-background border shadow-xs">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <div className="md:col-span-3 space-y-2">
                        <Label>Promote To (Target)</Label>
                        <Select value={targetClass} onValueChange={setTargetClass} disabled={!sourceClass}>
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Target Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c._id} value={c._id} disabled={c._id === sourceClass}>
                                        {c.sclassName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </CardContent>
            </Card>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {sourceClass && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Student List */}
                        <Card className="lg:col-span-2 h-[600px] flex flex-col">
                            <CardHeader className="pb-3 border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Students in {sourceClassName}</CardTitle>
                                        <CardDescription>Select students to promote</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="px-3 py-1">
                                        Total: {students.length}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <div className="p-4 border-b bg-muted/40 flex items-center space-x-2">
                                <Checkbox
                                    id="select-all"
                                    checked={students.length > 0 && selectedStudents.length === students.length}
                                    onCheckedChange={toggleSelectAll}
                                    disabled={students.length === 0}
                                />
                                <Label htmlFor="select-all" className="font-medium cursor-pointer">
                                    Select All Students
                                </Label>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-4 space-y-2">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center h-40 space-y-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <p className="text-sm text-muted-foreground">Loading students...</p>
                                        </div>
                                    ) : students.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                                <p className="text-muted-foreground">No students found in this class.</p>
                                            </div>
                                        ) : (
                                            students.map((student) => (
                                                <div
                                                    key={student._id} 
                                                className={`
                                                    flex items-center space-x-4 p-3 rounded-lg border transition-colors cursor-pointer
                                                    ${selectedStudents.includes(student._id) ? 'bg-primary/5 border-primary/30' : 'bg-card hover:bg-muted/50'}
                                                `}
                                                onClick={() => toggleStudent(student._id)}
                                            >
                                                <Checkbox
                                                    checked={selectedStudents.includes(student._id)}
                                                    onCheckedChange={() => toggleStudent(student._id)}
                                                />
                                                <div className="flex-1">
                                                        <p className="font-medium leading-none hover:underline hover:text-primary transition-colors" onClick={(e) => handleNameClick(e, student._id)}>{student.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Roll No: {student.rollNum}</p>
                                                </div>
                                                {selectedStudents.includes(student._id) && (
                                                    <Check className="w-4 h-4 text-primary animate-in zoom-in" />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>

                        {/* Summary & Action */}
                        <div className="space-y-6">
                            <Card className="h-fit">
                                <CardHeader>
                                    <CardTitle>Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Source Class</span>
                                        <span className="font-semibold">{sourceClassName}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Target Class</span>
                                        <span className="font-semibold text-primary">{targetClassName || "Not selected"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Selected Students</span>
                                        <span className="font-bold text-lg">{selectedStudents.length}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handlePromoteClick}
                                        disabled={!sourceClass || !targetClass || selectedStudents.length === 0}
                                    >
                                        Promote Students
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card className="bg-yellow-50/50 border-yellow-200 shadow-none">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-yellow-800">
                                        <AlertCircle className="h-5 w-5" />
                                        <CardTitle className="text-sm">Important Note</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-xs text-yellow-700/80 leading-relaxed">
                                    Promoting students will update their current class to the target class. This action helps in moving students to the next academic session. Ensure you have selected the correct target class.
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Promotion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to promote <span className="font-bold text-foreground">{selectedStudents.length}</span> students
                            from <span className="font-medium text-foreground">{sourceClassName}</span> to <span className="font-medium text-foreground">{targetClassName}</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPromote}>
                            {promoting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Promoting...
                                </>
                            ) : (
                                "Yes, Promote Students"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Promotion;

