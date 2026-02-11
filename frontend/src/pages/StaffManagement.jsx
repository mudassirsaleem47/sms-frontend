import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api.js';
import { Users, Plus, Edit, Trash2, UserCheck, UserX, Building2, Briefcase, Phone, MoreHorizontal } from 'lucide-react';
import StaffModal from '../components/form-popup/StaffModal';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const StaffManagement = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [staff, setStaff] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    // Delete state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch staff and designations
    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchStaff();
            fetchDesignations();
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

    const fetchDesignations = async () => {
        try {
            const response = await axios.get(`${API_URL}/Designations/${currentUser._id}`);
            if (response.data.success) {
                setDesignations(response.data.designations.filter(d => d.isActive === 'active'));
            }
        } catch (error) {
            console.error('Error fetching designations:', error);
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

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            const response = await axios.delete(`${API_URL}/Staff/${itemToDelete}`);
            if (response.data.success) {
                showToast('Staff member deleted successfully', 'success');
                fetchStaff();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete staff member';
            showToast(errorMsg, 'error');
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleModalClose = (refresh = false) => {
        setShowModal(false);
        setSelectedStaff(null);
        if (refresh) {
            fetchStaff();
        }
    };

    // Calculate stats
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.status === 'active').length;
    const inactiveStaff = staff.filter(s => s.status === 'inactive').length;

    // Filter staff based on active tab
    const filteredStaff = activeTab === 'all'
        ? staff
        : staff.filter(s => s.designation?._id === activeTab);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your staff members and designations</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/admin/designations')}>
                        <Briefcase className="mr-2 h-4 w-4" /> Add Designation
                    </Button>
                    <Button onClick={handleAddStaff}>
                        <Plus className="mr-2 h-4 w-4" /> Add Staff
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStaff}</div>
                        <p className="text-xs text-muted-foreground">Registered staff members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                        <UserCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeStaff}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Staff</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveStaff}</div>
                        <p className="text-xs text-muted-foreground">Currently inactive</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="flex flex-col space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-muted/20 p-1">
                        <div className="flex w-max space-x-2">
                            <TabsList className="bg-transparent h-auto p-0 justify-start">
                                <TabsTrigger
                                    value="all"
                                    className="px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                >
                                    All Staff ({totalStaff})
                                </TabsTrigger>
                                {designations.map(designation => {
                                    const count = staff.filter(s => s.designation?._id === designation._id).length;
                                    return (
                                        <TabsTrigger
                                            key={designation._id} 
                                            value={designation._id}
                                            className="px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                        >
                                            {designation.name} ({count})
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </Tabs>

                <Card>
                    <CardContent className="p-0">
                        {filteredStaff.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No staff members found</h3>
                                <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                                    {activeTab === 'all'
                                        ? 'Get started by adding your first staff member.'
                                        : 'No staff members found for this designation.'}
                                </p>
                                {activeTab === 'all' && (
                                    <Button onClick={handleAddStaff}>
                                        <Plus className="mr-2 h-4 w-4" /> Add Staff
                                    </Button>
                                )}
                            </div>
                        ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Staff Member</TableHead>
                                            <TableHead>Designation</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Campus</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStaff.map((staffMember) => (
                                        <TableRow key={staffMember._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                            {staffMember.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{staffMember.name}</span>
                                                        <span className="text-xs text-muted-foreground">{staffMember.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {staffMember.designation ? (
                                                    <Badge variant="outline" className="font-medium">
                                                        <Briefcase className="mr-1 w-3 h-3" />
                                                        {staffMember.designation.name}
                                                    </Badge>
                                                ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {staffMember.phone ? (
                                                        <div className="text-xs flex items-center gap-1 text-muted-foreground">
                                                            <Phone className="w-3 h-3" />
                                                            {staffMember.phone}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {staffMember.campus ? (
                                                    <div className="flex items-center gap-1 text-sm text-foreground">
                                                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {staffMember.campus.campusName}
                                                    </div>
                                                ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={staffMember.status === 'active' ? 'default' : 'secondary'}
                                                    className={staffMember.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800'
                                                        : ''}
                                                >
                                                    {staffMember.status === 'active' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditStaff(staffMember)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                handleDeleteClick(staffMember._id);
                                                            }}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Staff
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Staff Modal */}
            {showModal && (
                <StaffModal
                    staff={selectedStaff}
                    onClose={handleModalClose}
                />
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the staff member
                            <span className="font-semibold text-foreground"> {staff.find(s => s._id === itemToDelete)?.name}</span> and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setDeleteDialogOpen(false);
                            setItemToDelete(null);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteConfirm()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default StaffManagement;