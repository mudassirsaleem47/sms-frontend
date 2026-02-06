import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import VisitorModal from "../components/form-popup/VisitorModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Search,
    Plus,
    Eye,
    Edit,
    Pencil,
    Copy,
    Star,
    Trash2,
    Loader2,
    MoreHorizontal,
    Calendar,
    Phone,
    CreditCard,
    User
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_BASE = import.meta.env.VITE_API_URL;

const VisitorBook = () => {
    const { currentUser } = useAuth();

    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view'
    const [selectedVisitor, setSelectedVisitor] = useState(null);

    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const schoolId = currentUser._id;
            const response = await axios.get(`${API_BASE}/Visitors/${schoolId}`);
            setVisitors(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error(err);
            toast.error("Error loading visitors");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedVisitor(null);
        setModalMode("add");
        setIsModalOpen(true);
    };

    const handleView = (visitor) => {
        setSelectedVisitor(visitor);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (visitor) => {
        setSelectedVisitor(visitor);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleCopy = (visitor) => {
        const copiedData = { ...visitor, _id: undefined, visitorName: `${visitor.visitorName} (Copy)` };
        setSelectedVisitor(copiedData);
        setModalMode("add");
        setIsModalOpen(true);
        toast.info("Creating copy of visitor record");
    };

    const handleFavorite = (visitor) => {
        toast.success(`${visitor.visitorName} marked as favorite`);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const oldVisitors = [...visitors];
            setVisitors((prev) => prev.filter((v) => v._id !== deleteId));
            setIsDeleteOpen(false);

            await axios.delete(`${API_BASE}/Visitor/${deleteId}`);
            toast.success("Visitor record deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete record");
            fetchData(); 
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            const payload = { ...formData, adminID: currentUser._id, school: currentUser._id };

            if (modalMode === "add") {
                const res = await axios.post(`${API_BASE}/VisitorCreate`, payload);
                setVisitors((prev) => [res.data, ...prev]);
                toast.success("Visitor added successfully");
            } else if (modalMode === "edit" && selectedVisitor) {
                await axios.put(`${API_BASE}/Visitor/${selectedVisitor._id}`, payload);

                setVisitors((prev) =>
                    prev.map((v) =>
                        v._id === selectedVisitor._id ? { ...v, ...formData } : v
                    )
                );
                toast.success("Visitor updated successfully");
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const filteredVisitors = visitors.filter((visitor) => {
        const query = searchQuery.toLowerCase();
        const staffName = visitor.staff?.name?.toLowerCase() || "";
        const studentName = visitor.student?.name?.toLowerCase() || "";

        return (
            (visitor.visitorName?.toLowerCase() || "").includes(query) ||
            (visitor.purpose?.toLowerCase() || "").includes(query) ||
            (visitor.phone?.toLowerCase() || "").includes(query) ||
            staffName.includes(query) ||
            studentName.includes(query)
        );
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary/90">Visitor Book</h2>
                    <p className="text-muted-foreground">
                        Manage visitor records and history.
                    </p>
                </div>
                <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Visitor
                </Button>
            </div>

            {/* Main Content */}
            <Card className="border shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                        <div>
                            <CardTitle>Visitors List</CardTitle>
                            <CardDescription>
                                A list of all visitors including their details and status.
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-[300px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, purpose..."
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
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading visitors...</span>
                            </div>
                        </div>
                    ) : filteredVisitors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/10 rounded-lg border border-dashed">
                            <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                                <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">No results found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                No visitors match your search criteria. Try adjusting filters or add a new visitor.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow>
                                                <TableHead>Visitor Name</TableHead>
                                                <TableHead>Contact Info</TableHead>
                                                <TableHead>Meeting With</TableHead>
                                                <TableHead>Status / Time</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredVisitors.map((visitor) => (
                                                <TableRow key={visitor._id} className="hover:bg-muted/5 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9 border">
                                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                                    {visitor.visitorName?.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-foreground">{visitor.visitorName}</span>
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    {visitor.numberOfPerson > 1 ? (
                                                                        <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                                                            {visitor.numberOfPerson} People
                                                                        </Badge>
                                                                    ) : (
                                                                        <span className="flex items-center gap-1">
                                                                            <CreditCard className="h-3 w-3" /> {visitor.idCard || 'No ID'}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            {visitor.phone && (
                                                                <div className="flex items-center text-sm">
                                                                    <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                                    {visitor.phone}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-muted-foreground truncate max-w-[150px] italic" title={visitor.purpose}>
                                                                "{visitor.purpose}"
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-medium">
                                                                {visitor.meetingWith === 'Staff'
                                                                    ? visitor.staff?.name
                                                                    : visitor.student?.name}
                                                            </span>
                                                            <Badge variant="outline" className="w-fit text-[10px] h-4 px-1 text-muted-foreground">
                                                                {visitor.meetingWith}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 font-medium">IN</Badge>
                                                                <span className="text-xs font-medium text-foreground">{visitor.inTime}</span>
                                                            </div>
                                                            {visitor.outTime ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px] px-1.5 font-medium">OUT</Badge>
                                                                    <span className="text-xs font-medium text-muted-foreground">{visitor.outTime}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 opacity-50">
                                                                    <Badge variant="outline" className="text-[10px] px-1.5">OUT</Badge>
                                                                    <span className="text-xs text-muted-foreground">--:--</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <Calendar className="mr-2 h-3.5 w-3.5" />
                                                            {visitor.date ? new Date(visitor.date).toLocaleDateString() : '-'}
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
                                                                <DropdownMenuItem onClick={() => handleEdit(visitor)}>
                                                                    <Pencil className="mr-2 h-4 w-4" /> View / Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleCopy(visitor)}>
                                                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleFavorite(visitor)}>
                                                                    <Star className="mr-2 h-4 w-4" /> Mark Favorite
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => confirmDelete(visitor._id)} className="text-destructive focus:text-destructive">
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

            {/* Visitor Modal */}
            <VisitorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedVisitor}
                viewMode={modalMode === "view"}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Visitor Record?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the visitor record for
                            <span className="font-semibold text-foreground"> {visitors.find(v => v._id === deleteId)?.visitorName}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VisitorBook;
