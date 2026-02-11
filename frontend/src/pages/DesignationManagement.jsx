import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config/api.js';
import { Briefcase, Plus, Edit, Trash2, CheckCircle, XCircle, GripVertical, Search, MoreHorizontal } from 'lucide-react';
import DesignationModal from '../components/form-popup/DesignationModal';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Card Component
const SortableCard = ({ designation, onEdit, onDeleteClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: designation._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative'
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`group hover:shadow-md transition-all duration-200 border-l-4 ${designation.isActive === 'active' ? 'border-l-emerald-500' : 'border-l-rose-500'
                }`}
        >
            <CardContent className="p-4 flex items-center gap-4">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded-md transition flex-shrink-0 text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                {/* Icon */}
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5" />
                </div>

                {/* Name and Status */}
                <div className="flex-shrink-0 min-w-[200px]">
                    <h3 className="font-semibold text-foreground text-base tracking-tight">{designation.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                        <Badge
                            variant={designation.isActive === 'active' ? 'default' : 'destructive'}
                            className={designation.isActive === 'active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-200'}
                        >
                            {designation.isActive === 'active' ? (
                                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
                            ) : (
                                <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Inactive</span>
                            )}
                        </Badge>
                    </div>
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0 hidden md:block">
                    {designation.description ? (
                        <p className="text-sm text-muted-foreground truncate">{designation.description}</p>
                    ) : (
                            <p className="text-sm text-muted-foreground/50 italic">No description provided</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 ml-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(designation)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDeleteClick(designation._id)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Designation
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
};

const DesignationManagement = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Delete state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Drag and Drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch designations
    useEffect(() => {
        if (currentUser && currentUser._id) {
            fetchDesignations();
        }
    }, [currentUser]);

    const fetchDesignations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/Designations/${currentUser._id}`);
            if (response.data.success) {
                setDesignations(response.data.designations);
            }
        } catch (error) {
            console.error('Error fetching designations:', error);
            showToast('Failed to load designations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDesignation = () => {
        setSelectedDesignation(null);
        setShowModal(true);
    };

    const handleEditDesignation = (designation) => {
        setSelectedDesignation(designation);
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            const response = await axios.delete(`${API_URL}/Designation/${itemToDelete}`);
            if (response.data.success) {
                showToast('Designation deleted successfully', 'success');
                fetchDesignations();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to delete designation';
            showToast(errorMsg, 'error');
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleModalClose = (refresh = false) => {
        setShowModal(false);
        setSelectedDesignation(null);
        if (refresh) {
            fetchDesignations();
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setDesignations((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Filter designations based on search query
    const filteredDesignations = designations.filter(designation => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            designation.name.toLowerCase().includes(query) ||
            (designation.description && designation.description.toLowerCase().includes(query))
        );
    });

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Designation Management</h1>
                    <p className="text-muted-foreground mt-1">Manage staff designations, roles, and hierarchy</p>
                </div>
                <Button onClick={handleAddDesignation} className="shadow-lg hover:shadow-xl transition-all">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Designation
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search designations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                />
            </div>

            {/* Designations List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredDesignations.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Briefcase className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">
                                {searchQuery ? 'No matching designations' : 'No designations found'}
                            </h3>
                            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                                {searchQuery
                                    ? `No designations match "${searchQuery}". Try a different search term.`
                                    : 'Start by adding your first designation to define staff roles.'}
                            </p>
                            {!searchQuery && (
                                <Button onClick={handleAddDesignation} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Designation
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={filteredDesignations.map(d => d._id)}
                            strategy={verticalListSortingStrategy}
                        >
                                <div className="flex flex-col gap-3">
                                    {filteredDesignations.map(designation => (
                                        <SortableCard
                                            key={designation._id}
                                            designation={designation}
                                            onEdit={handleEditDesignation}
                                    onDeleteClick={handleDeleteClick}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Modal */}
            {showModal && (
                <DesignationModal
                    designation={selectedDesignation}
                    onClose={handleModalClose}
                />
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the designation
                            <span className="font-semibold text-foreground"> {designations.find(d => d._id === itemToDelete)?.name}</span>.
                            Staff members assigned to this designation will need to be reassigned.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setDeleteDialogOpen(false);
                            setItemToDelete(null);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DesignationManagement;
