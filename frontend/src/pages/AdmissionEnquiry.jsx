import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import EnquiryModal from '../components/form-popup/EnquiryModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Copy,
    Star,
    Phone,
    Calendar,
    Users,
    UserPlus,
    School,
    GraduationCap,
    CheckCircle2,
    Clock,
    User,
    Mail,
    MapPin
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL;

const AdmissionEnquiry = () => {
    const { currentUser } = useAuth();
    
    // --- State Management ---
    const [enquiries, setEnquiries] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEnquiry, setCurrentEnquiry] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    
    // Delete Confirmation State
    const [deleteItem, setDeleteItem] = useState(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // --- 1. Data Fetching ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const schoolId = currentUser._id;

            const [enqRes, classRes, teachRes] = await Promise.all([
                axios.get(`${API_BASE}/EnquiryList/${schoolId}`),
                axios.get(`${API_BASE}/Sclasses/${schoolId}`),
                axios.get(`${API_BASE}/Teachers/${schoolId}`).catch(() => ({ data: [] }))
            ]);

            setEnquiries(Array.isArray(enqRes.data) ? enqRes.data : []);
            setClassesList(classRes.data);
            setTeachersList(teachRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchData();
    }, [currentUser]);

    // --- 2. Action Handlers ---

    // Add/Edit Submit Logic
    const handleFormSubmit = async (formData) => {
        try {
            const dataToSend = { ...formData, school: currentUser._id };
            
            // Check if it's an update (has _id) or a new creation (no _id or it's a copy)
            // Note: Copies have undefined _id, so they fall into the 'else' block
            if (currentEnquiry && currentEnquiry._id) {
                await axios.put(`${API_BASE}/EnquiryUpdate/${currentEnquiry._id}`, dataToSend);
                toast.success("Enquiry updated successfully!");
            } else {
                await axios.post(`${API_BASE}/EnquiryCreate`, dataToSend);
                toast.success("Enquiry created successfully!");
            }

            setIsModalOpen(false);
            setCurrentEnquiry(null);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save enquiry.");
        }
    };

    // Delete Logic
    const confirmDelete = async () => {
        if (!deleteItem) return;
        try {
            await axios.delete(`${API_BASE}/EnquiryDelete/${deleteItem._id}`);
            fetchData();
            toast.success("Enquiry deleted successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Error deleting enquiry");
        }
        setDeleteItem(null);
    };

    // View/Edit/Add/Copy Actions
    const handleView = (enquiry) => {
        setCurrentEnquiry(enquiry);
        setViewMode(true);
        setIsModalOpen(true);
    };

    const handleEdit = (enquiry) => {
        setCurrentEnquiry(enquiry);
        setViewMode(false);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentEnquiry(null);
        setViewMode(false);
        setIsModalOpen(true);
    };

    const handleCopy = (enquiry) => {
        // Create a copy object.
        // Important: _id must be removed/undefined so the form treats it as new.
        const copiedData = {
            ...enquiry,
            _id: undefined, 
            name: `${enquiry.name} (Copy)`
        };
        setCurrentEnquiry(copiedData);
        setViewMode(false);
        setIsModalOpen(true);
        toast.info("Creating copy of enquiry");
    };

    const handleFavorite = (enquiry) => {
        toast.success(`${enquiry.name} marked as favorite!`);
        // Placeholder for favorite logic
    };

    // Filter enquiries
    const filteredEnquiries = enquiries.filter((enquiry) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            enquiry.name?.toLowerCase().includes(query) ||
            enquiry.phone?.toLowerCase().includes(query) ||
            enquiry.class?.sclassName?.toLowerCase().includes(query) ||
            enquiry.assigned?.name?.toLowerCase().includes(query)
        );
    });

    // Counts for cards
    const totalEnquiries = enquiries.length;
    const assignedEnquiries = enquiries.filter(e => e.assigned).length;
    const pendingEnquiries = enquiries.filter(e => !e.assigned).length;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary/90">Admission Enquiries</h2>
                    <p className="text-muted-foreground">
                        Manage and track incoming admission requests and student follow-ups.
                    </p>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4" /> Add Enquiry
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600">Total Enquiries</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-800">{totalEnquiries}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total registered enquiries
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-600">Assigned</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-800">{assignedEnquiries}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Handled by teachers/staff
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-600">Pending</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-800">{pendingEnquiries}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting assignment
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="border shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                        <div>
                            <CardTitle>Enquiries List</CardTitle>
                            <CardDescription>
                                A list of all admission enquiries including their details and status.
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search enquiries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                <span>Loading data...</span>
                            </div>
                        </div>
                    ) : filteredEnquiries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/10 rounded-lg border border-dashed">
                                <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                                    <Users className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium">No results found</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                    No enquiries match your search criteria. Try adjusting filters or add a new enquiry.
                                </p>
                            </div>
                    ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow>
                                                <TableHead>Applicant Name</TableHead>
                                                <TableHead>Contact Info</TableHead>
                                                <TableHead>Class Interest</TableHead>
                                                <TableHead>Status / Assigned</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                    {filteredEnquiries.map((item) => (
                                        <TableRow key={item._id} className="hover:bg-muted/5 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{item.name}</span>
                                                    {item.noOfChild > 1 && (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Users className="h-3 w-3" /> {item.noOfChild} Children
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                                                        {item.phone}
                                                    </div>
                                                    {item.email && (
                                                        <div className="flex items-center text-xs text-muted-foreground">
                                                            <Mail className="mr-2 h-3 w-3" />
                                                            {item.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                                                    <GraduationCap className="mr-1 h-3 w-3" />
                                                    {item.class?.sclassName || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {item.assigned?.name ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Assigned
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">to {item.assigned.name}</span>
                                                    </div>
                                                ) : (
                                                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                                            <Clock className="mr-1 h-3 w-3" />
                                                            Pending
                                                        </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Calendar className="mr-2 h-3 w-3" />
                                                    {new Date(item.date).toLocaleDateString()}
                                                </div>
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
                                                        <DropdownMenuItem onClick={() => handleView(item)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            View / Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleCopy(item)}>
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleFavorite(item)}>
                                                            <Star className="mr-2 h-4 w-4" />
                                                            Mark Favorite
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDeleteItem(item)} className="text-destructive focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the enquiry for
                            <span className="font-medium text-foreground"> {deleteItem?.name} </span>
                            and remove it from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Form Modal */}
            <EnquiryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={currentEnquiry}
                classesList={classesList}
                teachersList={teachersList}
                viewMode={viewMode}
            />
        </div>
    );
};

export default AdmissionEnquiry;