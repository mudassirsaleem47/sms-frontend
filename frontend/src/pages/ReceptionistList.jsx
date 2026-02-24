import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    Edit,
    Trash2,
    Plus,
    Check,
    Search,
    LayoutGrid,
    List as ListIcon,
    MoreHorizontal,
    Mail,
    Phone,
    Briefcase,
    Building2,
    UserCheck, 
    UserX
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
import StaffModal from '../components/form-popup/StaffModal';

import API_URL_CENTRAL from '@/config/api';
const API_BASE = API_URL_CENTRAL;

const ReceptionistList = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    // --- State Management ---
    const [receptionists, setReceptionists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('list'); // 'list' | 'grid'
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReceptionist, setCurrentReceptionist] = useState(null);

    // Delete Confirmation State
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    const fetchReceptionists = React.useCallback(async () => {
        if (!currentUser || !currentUser._id) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/Staff/${currentUser._id}`);
            if (response.data.success) {
                // Filter only receptionists
                const allStaff = response.data.staff || [];
                const filtered = allStaff.filter(s => s.designation === 'Receptionist');
                setReceptionists(filtered);
            }
        } catch (error) {
            console.error('Error fetching receptionists:', error);
            showToast('Failed to load receptionists', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentUser, showToast]);

    useEffect(() => {
        fetchReceptionists();
    }, [fetchReceptionists]);

    // --- Action Handlers ---

    // const handleFormSubmit = async () => {
    //     // StaffModal handles its own submission and calls onClose(true) on success
    //     setIsModalOpen(false);
    //     setCurrentReceptionist(null);
    //     fetchReceptionists();
    // };

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
            await axios.delete(`${API_BASE}/Staff/${selectedDeleteId}`);
            fetchReceptionists();
            showToast("Receptionist deleted successfully!", "success");
        } catch (error) {
            console.error(error);
            showToast("Error deleting receptionist", "error");
        }
        setSelectedDeleteId(null);
    };

    const handleEdit = (receptionist) => {
        setCurrentReceptionist(receptionist);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentReceptionist(null);
        setIsModalOpen(true);
    };

    const filteredReceptionists = receptionists.filter((rec) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            rec.name?.toLowerCase().includes(query) ||
            rec.email?.toLowerCase().includes(query) ||
            rec.phone?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Receptionist Management</h2>
                    <p className="text-muted-foreground">Manage and track all receptionists in your school</p>
                </div>
                <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Receptionist
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-1 rounded-lg">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email..."
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
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))}
                </div>
            ) : filteredReceptionists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-muted/10 border-dashed text-center">
                    <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-medium">No Receptionists Found</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        {searchQuery ? "No matches found for your search." : "Get started by adding receptionists to your staff."}
                    </p>
                </div>
                ) : viewType === 'list' ? (
                    <div className="rounded-md border bg-card shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="pl-4">Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Campus</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReceptionists.map((rec) => (
                                    <TableRow key={rec._id} className="group hover:bg-muted/30 transition-colors">
                                        <TableCell className="pl-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {rec.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span>{rec.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {rec.email}</span>
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {rec.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                {rec.campus?.campusName || '-'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={rec.status === 'active' ? 'default' : 'secondary'}
                                                className={rec.status === 'active' 
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 border-emerald-200' 
                                                    : ''}
                                            >
                                                {rec.status === 'active' ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(rec)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(rec._id)}>
                                                            {selectedDeleteId === rec._id ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                            {selectedDeleteId === rec._id ? "Confirm Delete" : "Delete"}
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
                                {filteredReceptionists.map((rec) => (
                                    <Card key={rec._id} className="overflow-hidden hover:shadow-md transition-all">
                                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                            <Avatar className="h-12 w-12 border">
                                                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                                    {rec.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <CardTitle className="text-base">{rec.name}</CardTitle>
                                                <CardDescription className="text-xs">{rec.email}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-2 text-sm grid gap-2">
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Phone</span>
                                                <span>{rec.phone}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Campus</span>
                                                <span>{rec.campus?.campusName || '-'}</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-muted-foreground">Salary</span>
                                                <span className="font-semibold text-green-600 flex items-center">
                                                    {rec.salary ? `Rs. ${rec.salary.toLocaleString()}` : '-'}
                                                </span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-2 flex justify-end bg-muted/20 gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(rec)}>
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(rec._id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                </div>
            )}

            {isModalOpen && (
                <StaffModal 
                    staff={currentReceptionist} 
                    onClose={(refresh) => {
                        setIsModalOpen(false);
                        if(refresh) fetchReceptionists();
                    }}
                />
            )}
        </div>
    );
};

export default ReceptionistList;

