import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import PhoneCallModal from '../components/form-popup/PhoneCallModal';

// Icons
import {
    Edit,
    Trash2,
    Plus,
    Eye,
    PhoneIncoming,
    PhoneOutgoing,
    Search,
    Phone,
    Calendar,
    Filter,
    MoreHorizontal
} from 'lucide-react';

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = import.meta.env.VITE_API_URL;

const PhoneCallLog = () => {
    const { currentUser } = useAuth();
    
    // --- State Management ---
    const [phoneCalls, setPhoneCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCall, setCurrentCall] = useState(null);
    const [viewMode, setViewMode] = useState(false);

    // Delete State
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Filter/Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    // --- 1. Data Fetching ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const schoolId = currentUser._id;
            setPhoneCalls([]);
            
            const response = await axios.get(`${API_BASE}/PhoneCalls/${schoolId}`);
            setPhoneCalls(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error(err);
            toast.error("Error loading phone calls");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchData();
    }, [currentUser]);

    // --- 2. Action Handlers ---

    const handleFormSubmit = async (formData) => {
        try {
            const dataToSend = { ...formData, school: currentUser._id };
            
            if (currentCall) {
                // UPDATE
                await axios.put(`${API_BASE}/PhoneCall/${currentCall._id}`, dataToSend);
                toast.success("Phone call updated successfully");
            } else {
                // CREATE
                await axios.post(`${API_BASE}/PhoneCallCreate`, dataToSend);
                toast.success("Phone call recorded successfully");
            }

            setIsModalOpen(false);
            setCurrentCall(null);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save phone call");
        }
    };

    // Actual Delete Function
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await axios.delete(`${API_BASE}/PhoneCall/${itemToDelete}`);
            fetchData();
            toast.success("Phone call deleted");
        } catch (err) {
            console.error(err);
            toast.error("Error deleting phone call");
        }
        setItemToDelete(null);
        setIsDeleteOpen(false);
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setIsDeleteOpen(true);
    };

    // View Button Click Logic
    const handleView = (call) => {
        setCurrentCall(call);
        setViewMode(true);
        setIsModalOpen(true);
    };

    // Edit Button Click Logic
    const handleEdit = (call) => {
        setCurrentCall(call);
        setViewMode(false);
        setIsModalOpen(true);
    };

    // Add Button Click Logic
    const handleAdd = () => {
        setCurrentCall(null);
        setViewMode(false);
        setIsModalOpen(true);
    };

    // Filter phone calls based on search & filter
    const filteredCalls = phoneCalls.filter((call) => {
        const matchesSearch =
            !searchQuery ||
            call.callerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            call.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            call.purpose?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === 'all' || call.callType === typeFilter;

        return matchesSearch && matchesType;
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Phone Call Log</h2>
                    <p className="text-muted-foreground">
                        Track and manage incoming and outgoing phone calls.
                    </p>
                </div>
                <Button onClick={handleAdd} className="ml-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Call
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                        <CardTitle className="text-lg font-medium">Recorded Calls</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search calls..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-full sm:w-[250px]"
                                />
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Call Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Incoming">Incoming</SelectItem>
                                    <SelectItem value="Outgoing">Outgoing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : filteredCalls.length === 0 ? (
                            <div className="text-center py-10">
                                <Phone className="mx-auto h-12 w-12 text-muted-foreground/20" />
                                <h3 className="mt-4 text-lg font-semibold text-muted-foreground">No calls found</h3>
                                <p className="text-sm text-muted-foreground">
                                    {searchQuery ? "Try adjusting your search filters." : "Start by adding a new phone call."}
                                </p>
                        </div>
                    ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Caller Name</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead className="hidden md:table-cell">Purpose</TableHead>
                                                <TableHead className="hidden md:table-cell">Duration</TableHead>
                                                <TableHead>Follow-up</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                    {filteredCalls.map((call) => (
                                        <TableRow key={call._id}>
                                            <TableCell className="font-medium">{call.callerName}</TableCell>
                                            <TableCell>{call.phone}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={call.callType === 'Incoming' ? "success" : "secondary"}
                                                    className={`gap-1 ${call.callType === 'Incoming' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'}`}
                                                >
                                                    {call.callType === 'Incoming' ? <PhoneIncoming className="h-3 w-3" /> : <PhoneOutgoing className="h-3 w-3" />}
                                                    {call.callType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{new Date(call.callDate).toLocaleDateString()}</span>
                                                    <span className="text-xs text-muted-foreground">{call.callTime}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={call.purpose}>
                                                {call.purpose || '-'}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{call.callDuration || '-'}</TableCell>
                                            <TableCell>
                                                {call.followUpRequired ? (
                                                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
                                                        Required
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">-</span>
                                                )}
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
                                                        <DropdownMenuItem onClick={() => handleView(call)}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEdit(call)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Record
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(call._id)} className="text-red-600 focus:text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                        </TableBody>
                                    </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Popup Modal Component */}
            <PhoneCallModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={currentCall}
                viewMode={viewMode}
            />

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Call Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the call record for
                            <span className="font-semibold text-foreground"> {phoneCalls.find(c => c._id === itemToDelete)?.callerName}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setItemToDelete(null); setIsDeleteOpen(false); }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PhoneCallLog;
