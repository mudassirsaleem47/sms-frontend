import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { useToast } from '../context/ToastContext';
import {
    Search,
    LayoutGrid,
    List as ListIcon,
    Mail,
    Phone,
    GraduationCap,
    Users,
    BookOpen,
    Calculator,
    PhoneCall,
    Filter,
    Download,
    CheckCheck,
    XCircle,
    UserCheck,
    Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const API_BASE = API_URL;

const ROLE_CONFIG = {
    teacher: {
        label: 'Teacher',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        icon: BookOpen,
        avatarBg: 'bg-blue-500/10 text-blue-600',
    },
    accountant: {
        label: 'Accountant',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: Calculator,
        avatarBg: 'bg-green-500/10 text-green-600',
    },
    receptionist: {
        label: 'Receptionist',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: PhoneCall,
        avatarBg: 'bg-purple-500/10 text-purple-600',
    },
    principal: {
        label: 'Principal',
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        icon: UserCheck,
        avatarBg: 'bg-amber-500/10 text-amber-600',
    },
};

const StaffDirectory = () => {
    const { currentUser } = useAuth();
    const { selectedCampus, isMainAdmin } = useCampus();
    const { showToast } = useToast();

    const [allStaff, setAllStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const fetchAllStaff = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const schoolId = currentUser._id;
            const campusQuery = selectedCampus ? `?campus=${selectedCampus._id}` : '';

            // Fetch teachers and all other staff in parallel
            const [teachersRes, staffRes] = await Promise.allSettled([
                axios.get(`${API_BASE}/Teachers/${schoolId}${campusQuery}`),
                axios.get(`${API_BASE}/Staff/${schoolId}${campusQuery}`),
            ]);

            const teachers = (teachersRes.status === 'fulfilled' ? (Array.isArray(teachersRes.value.data) ? teachersRes.value.data : []) : [])
                .map(t => ({ ...t, role: 'teacher' }));
            
            // Other staff includes all non-teacher roles like Accountants and Receptionists
            const otherStaffRaw = (staffRes.status === 'fulfilled' ? (staffRes.value.data?.staff || []) : []);
            
            // Normalize role/designation if needed
            const otherStaff = otherStaffRaw.map(s => ({ 
                ...s, 
                role: (s.role || s.designation || 'staff').toLowerCase() 
            }));

            setAllStaff([...teachers, ...otherStaff]);
        } catch (err) {
            console.error("Error loading staff data:", err);
            showToast('Error loading staff data', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentUser, selectedCampus, showToast]);

    const handleApprove = async (staffId) => {
        try {
            const response = await axios.put(`${API_BASE}/Staff/${staffId}`, { status: 'active' });
            if (response.data.success) {
                showToast('Staff member approved successfully', 'success');
                fetchAllStaff(); // Refresh list
            }
        } catch (err) {
            showToast('Failed to approve staff', 'error');
        }
    };

    useEffect(() => {
        fetchAllStaff();
    }, [fetchAllStaff]);

    const filteredStaff = allStaff.filter((member) => {
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        if (!searchQuery) return matchesRole;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            member.name?.toLowerCase().includes(q) ||
            member.email?.toLowerCase().includes(q) ||
            member.phone?.toLowerCase().includes(q) ||
            member.subject?.toLowerCase().includes(q) ||
            member.qualification?.toLowerCase().includes(q);
        return matchesRole && matchesSearch;
    });

    const stats = {
        total: allStaff.length,
        teachers: allStaff.filter(s => s.role === 'teacher').length,
        accountants: allStaff.filter(s => s.role === 'accountant').length,
        receptionists: allStaff.filter(s => s.role === 'receptionist').length,
        pending: allStaff.filter(s => s.status === 'pending').length,
    };

    const getInitials = (name) => name?.substring(0, 2).toUpperCase() || '??';

    const RoleBadge = ({ role }) => {
        const config = ROLE_CONFIG[role];
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100'}`}>
                {config?.label || role}
            </span>
        );
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Staff Directory</h2>
                    <p className="text-muted-foreground">Complete list of all school staff members</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total}</p>
                            <p className="text-xs text-muted-foreground">Total Staff</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.teachers}</p>
                            <p className="text-xs text-muted-foreground">Teachers</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-green-500/10 p-2 rounded-lg">
                            <Calculator className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.accountants}</p>
                            <p className="text-xs text-muted-foreground">Accountants</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-purple-500/10 p-2 rounded-lg">
                            <PhoneCall className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.receptionists}</p>
                            <p className="text-xs text-muted-foreground">Receptionists</p>
                        </div>
                    </CardContent>
                </Card>

                {isMainAdmin && (
                    <Card className="border-l-4 border-l-amber-500 bg-amber-50/10">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="bg-amber-500/10 p-2 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-xs text-muted-foreground">Pending Approvals</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex flex-1 flex-col sm:flex-row gap-3 max-w-xl w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, subject..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-44">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="teacher">Teachers</SelectItem>
                            <SelectItem value="accountant">Accountants</SelectItem>
                            <SelectItem value="receptionist">Receptionists</SelectItem>
                        </SelectContent>
                    </Select>
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

            {/* Content Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="all">All Staff</TabsTrigger>
                        {isMainAdmin && stats.pending > 0 && (
                            <TabsTrigger value="pending" className="relative">
                                Login Requests
                                <Badge className="ml-2 bg-amber-500 px-1.5 py-0 min-w-[1.2rem] h-5 justify-center">
                                    {stats.pending}
                                </Badge>
                            </TabsTrigger>
                        )}
                    </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                    {viewType === 'list' ? (
                        <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 font-medium">
                                        <TableHead className="pl-4">Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Campus</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="text-right pr-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStaff.filter(s => s.status !== 'pending' || !isMainAdmin).map((member) => {
                                        const config = ROLE_CONFIG[member.role];
                                        return (
                                            <TableRow key={member._id + member.role} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="pl-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border shadow-sm">
                                                            <AvatarFallback className={config?.avatarBg || 'bg-primary/10 text-primary'}>
                                                                {getInitials(member.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-sm">{member.name}</span>
                                                            <span className="text-[10px] text-muted-foreground uppercase">{member.school?.schoolName}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <RoleBadge role={member.role} />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs text-muted-foreground gap-1">
                                                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {member.email}</span>
                                                        <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {member.phone || '—'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <LayoutGrid className="h-3 w-3 text-muted-foreground" />
                                                        {member.campus?.campusName || 'Main'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant={member.status === 'active' ? 'success' : 'secondary'} className="capitalize text-[10px] px-1.5 py-0 h-5">
                                                        {member.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-4">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs">View</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredStaff.filter(s => s.status !== 'pending' || !isMainAdmin).map((member) => {
                                const config = ROLE_CONFIG[member.role];
                                return (
                                    <Card key={member._id + member.role} className="group overflow-hidden hover:shadow-lg transition-all border-none ring-1 ring-border shadow-sm">
                                        <div className={`h-1.5 ${config?.avatarBg.replace('text-', 'bg-').split(' ')[0] || 'bg-primary/20'}`} />
                                        <CardHeader className="pb-3 px-5">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-11 w-11 border-2 ring-2 ring-background">
                                                    <AvatarFallback className={`text-sm font-bold ${config?.avatarBg || 'bg-primary/10 text-primary'}`}>
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">{member.name}</CardTitle>
                                                    <CardDescription className="text-[10px] uppercase tracking-wider font-medium">{member.campus?.campusName || 'Main Branch'}</CardDescription>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center">
                                                <RoleBadge role={member.role} />
                                                <Badge variant={member.status === 'active' ? 'success' : 'outline'} className="text-[9px] h-4">
                                                    {member.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-5 px-5 text-xs grid gap-2.5 pt-1">
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Mail className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Phone className="h-3 w-3 shrink-0" />
                                                <span>{member.phone || 'No phone'}</span>
                                            </div>
                                            <div className="pt-3 flex gap-2">
                                                <Button size="sm" variant="outline" className="flex-1 text-[10px] h-7">Details</Button>
                                                <Button size="sm" variant="secondary" className="px-2 h-7"><Phone className="h-3 w-3" /></Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                {isMainAdmin && (
                    <TabsContent value="pending" className="mt-0">
                        <div className="rounded-xl border bg-card shadow-sm overflow-hidden border-amber-200 dark:border-amber-900/30">
                            <div className="bg-amber-500/5 px-6 py-4 border-b border-amber-200 dark:border-amber-900/30 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                    <Clock className="h-5 w-5" />
                                    <h3 className="font-semibold">Pending Activation Requests</h3>
                                </div>
                                <p className="text-xs text-amber-600 dark:text-amber-500/80 font-medium">
                                    These accounts cannot login until you approve them.
                                </p>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="pl-6">Principal Name</TableHead>
                                        <TableHead>Campus/Branch</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Request Date</TableHead>
                                        <TableHead className="text-right pr-6">Approval Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allStaff.filter(s => s.status === 'pending').map((member) => (
                                        <TableRow key={member._id} className="hover:bg-amber-500/[0.02] border-amber-100 dark:border-amber-950/30">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-amber-200 shadow-sm ring-2 ring-amber-500/10">
                                                        <AvatarFallback className="bg-amber-500/10 text-amber-600 font-bold">
                                                            {getInitials(member.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-sm text-foreground">{member.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-medium">
                                                    <Building2 className="h-4 w-4 text-primary" />
                                                    {member.campus?.campusName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm font-medium">{member.email}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {new Date(member.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="text-destructive hover:bg-destructive/10 h-8"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" /> Reject
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        className="bg-green-600 hover:bg-green-700 h-8 font-semibold shadow-sm"
                                                        onClick={() => handleApprove(member._id)}
                                                    >
                                                        <UserCheck className="h-4 w-4 mr-2" /> Approve Login
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {stats.pending === 0 && (
                                <div className="p-12 text-center text-muted-foreground italic bg-muted/5">
                                    No pending login requests at the moment.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
};

export default StaffDirectory;
