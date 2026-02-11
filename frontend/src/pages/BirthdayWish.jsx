import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
    Cake, Gift, Calendar, PartyPopper, Star, Search, MessageCircle, Send
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const API_BASE = import.meta.env.VITE_API_URL;

const BirthdayWish = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    
    // State Management
    const [students, setStudents] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Filter State
    const [dateFilter, setDateFilter] = useState('today'); // 'today', 'week', 'month'
    const [searchQuery, setSearchQuery] = useState('');
    
    // Message State
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    });

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const schoolId = currentUser._id;
            
            // Fetch students
            const studentsRes = await axios.get(`${API_BASE}/students/${schoolId}`);
            const allStudents = Array.isArray(studentsRes.data) ? studentsRes.data : [];
            
            // Filter students with birthdays
            const today = new Date();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
            
            const birthdayStudents = allStudents.filter(student => {
                if (!student.dateOfBirth) return false;
                const dob = new Date(student.dateOfBirth);
                return dob.getMonth() === todayMonth && dob.getDate() === todayDate;
            });
            
            // Week birthdays
            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);
            
            const weekBirthdays = allStudents.filter(student => {
                if (!student.dateOfBirth) return false;
                const dob = new Date(student.dateOfBirth);
                const thisYearBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                return thisYearBday >= today && thisYearBday <= weekEnd;
            });
            
            // Month birthdays
            const monthBirthdays = allStudents.filter(student => {
                if (!student.dateOfBirth) return false;
                const dob = new Date(student.dateOfBirth);
                return dob.getMonth() === todayMonth;
            });
            
            setStudents(allStudents);
            setStats({
                today: birthdayStudents.length,
                thisWeek: weekBirthdays.length,
                thisMonth: monthBirthdays.length
            });
            
            // Fetch templates
            const templatesRes = await axios.get(`${API_BASE}/MessageTemplates/${schoolId}`);
            setTemplates(Array.isArray(templatesRes.data) ? templatesRes.data : []);
            
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchData();
    }, [currentUser]);

    // Get filtered birthday students
    const getFilteredStudents = () => {
        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        
        return students.filter(student => {
            if (!student.dateOfBirth) return false;
            const dob = new Date(student.dateOfBirth);
            
            // Date filter
            let matchesDate = false;
            if (dateFilter === 'today') {
                matchesDate = dob.getMonth() === todayMonth && dob.getDate() === todayDate;
            } else if (dateFilter === 'week') {
                const weekEnd = new Date(today);
                weekEnd.setDate(weekEnd.getDate() + 7);
                const thisYearBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                matchesDate = thisYearBday >= today && thisYearBday <= weekEnd;
            } else if (dateFilter === 'month') {
                matchesDate = dob.getMonth() === todayMonth;
            }
            
            // Search filter
            const matchesSearch = !searchQuery || 
                student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.fatherName?.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesDate && matchesSearch;
        });
    };

    const filteredStudents = getFilteredStudents();

    // Reset selection when filter changes
    useEffect(() => {
        setSelectedStudents([]);
        setSelectAll(false);
    }, [dateFilter]);

    // Handle Select All
    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedStudents(filteredStudents.map(s => s._id));
        } else {
            setSelectedStudents([]);
        }
    };

    // Check if all are selected
    useEffect(() => {
        if (filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedStudents, filteredStudents]);

    // Handle Individual Selection
    const handleStudentSelect = (studentId, checked) => {
        if (checked) {
            setSelectedStudents(prev => [...prev, studentId]);
        } else {
            setSelectedStudents(prev => prev.filter(id => id !== studentId));
        }
    };

    // Calculate age
    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const dob = new Date(dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age + 1; // Next birthday age
    };

    // Send Birthday Wishes
    const handleSendWishes = async () => {
        if (selectedStudents.length === 0) {
            showToast('Please select at least one student!', 'error');
            return;
        }
        
        const message = selectedTemplate 
            ? templates.find(t => t._id === selectedTemplate)?.content 
            : customMessage;
            
        if (!message || message.trim() === '') {
            showToast('Message is required!', 'error');
            return;
        }

        try {
            setSending(true);
            
            await axios.post(`${API_BASE}/SendBirthdayWishes`, {
                school: currentUser._id,
                studentIds: selectedStudents,
                message: message,
                templateId: selectedTemplate || null
            });
            
            showToast(`Birthday wishes sent to ${selectedStudents.length} students!`, 'success');
            setSelectedStudents([]);
            setSelectAll(false);
            setCustomMessage('');
            setSelectedTemplate('');
            
        } catch (err) {
            showToast('Error sending birthday wishes!', 'error');
        } finally {
            setSending(false);
        }
    };

    // Handle Template Selection
    const handleTemplateSelect = (templateId) => {
        setSelectedTemplate(templateId);
        const template = templates.find(t => t._id === templateId);
        if (template) {
            setCustomMessage(template.content);
        }
    };

    // Format date for display
    const formatBirthday = (dateOfBirth) => {
        const dob = new Date(dateOfBirth);
        return dob.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        Birthday Wishes
                    </h1>
                    <p className="text-muted-foreground mt-1">Send birthday greetings to your students</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${dateFilter === 'today' ? 'border-primary ring-1 ring-primary' : ''}`}
                    onClick={() => setDateFilter('today')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Birthdays</CardTitle>
                        <Cake className="h-4 w-4 text-pink-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.today}</div>
                    </CardContent>
                </Card>
                
                <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${dateFilter === 'week' ? 'border-primary ring-1 ring-primary' : ''}`}
                    onClick={() => setDateFilter('week')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisWeek}</div>
                    </CardContent>
                </Card>
                
                <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${dateFilter === 'month' ? 'border-primary ring-1 ring-primary' : ''}`}
                    onClick={() => setDateFilter('month')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Star className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisMonth}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side - Birthday Students */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by student name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    <Card className="flex flex-col h-[600px]">
                        <CardHeader className="bg-muted/30 py-3 border-b">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="select-all"
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                />
                                <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                    Select All ({filteredStudents.length} birthdays)
                                </Label>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 flex-1">
                            <ScrollArea className="h-full">
                                {loading ? (
                                    <div className="flex items-center justify-center h-48">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : filteredStudents.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                            <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                                <PartyPopper className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold">No birthdays found</h3>
                                            <p className="text-muted-foreground text-sm mt-1">
                                                {dateFilter === 'today' && 'No students have birthday today'}
                                                {dateFilter === 'week' && 'No birthdays this week'}
                                                {dateFilter === 'month' && 'No birthdays this month'}
                                            </p>
                                        </div>
                                    ) : (
                                            <div className="divide-y">
                                                {filteredStudents.map(student => (
                                                    <div
                                                        key={student._id}
                                                className={`flex items-center px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${selectedStudents.includes(student._id) ? 'bg-primary/5' : ''
                                                    }`}
                                                onClick={() => handleStudentSelect(student._id, !selectedStudents.includes(student._id))}
                                            >
                                                <Checkbox
                                                    id={`student-${student._id}`}
                                                    checked={selectedStudents.includes(student._id)}
                                                    onCheckedChange={(checked) => handleStudentSelect(student._id, checked)}
                                                    className="mr-4"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Label
                                                            htmlFor={`student-${student._id}`}
                                                            className="font-medium cursor-pointer"
                                                        >
                                                            {student.name}
                                                        </Label>
                                                        {new Date(student.dateOfBirth).getMonth() === new Date().getMonth() &&
                                                            new Date(student.dateOfBirth).getDate() === new Date().getDate() && (
                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                                                Today! 🎂
                                                                </Badge>
                                                            )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {student.class?.sclassName || student.class?.className || 'N/A'} | Father: {student.fatherName}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-primary">
                                                        {formatBirthday(student.dateOfBirth)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Turning {calculateAge(student.dateOfBirth)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side - Message Composition */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-primary" />
                                Compose Message
                            </CardTitle>
                            <CardDescription>Send customized wishes</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Template (Optional)</Label>
                                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="-- Custom Message --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="custom">-- Custom Message --</SelectItem>
                                        {templates.filter(t => t.category === 'other' || t.category === 'general').map(template => (
                                            <SelectItem key={template._id} value={template._id}>
                                                {template.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Message Content</Label>
                                <Textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Write your birthday message here..."
                                    className="min-h-[150px] font-normal"
                                />
                                <div className="text-xs text-muted-foreground text-right">
                                    {customMessage.length} characters
                                </div>
                            </div>

                            <div className="p-3 bg-muted/40 rounded-lg space-y-2">
                                <Label className="text-xs uppercase text-muted-foreground">Available Tags</Label>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="font-mono text-xs">{'{{name}}'}</Badge>
                                    <Badge variant="outline" className="font-mono text-xs">{'{{age}}'}</Badge>
                                    <Badge variant="outline" className="font-mono text-xs">{'{{class}}'}</Badge>
                                </div>
                            </div>

                            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Recipients:</span>
                                    <span className="font-medium">{selectedStudents.length}</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                onClick={handleSendWishes} 
                                className="w-full"
                                disabled={sending || selectedStudents.length === 0 || !customMessage}
                            >
                                {sending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Gift className="w-4 h-4 mr-2" />
                                        Send Wishes
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BirthdayWish;
