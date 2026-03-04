import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API_URL from '../../config/api.js';
import { Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const DesignationModal = ({ designation, onClose }) => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState(designation?.name || '');
    const [description, setDescription] = useState(designation?.description || '');
    const [isActive, setIsActive] = useState(designation?.isActive || 'active');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name) {
            showToast('Designation name is required', 'error');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name,
                description,
                isActive,
                school: currentUser._id
            };

            if (designation) {
                // Update
                const response = await axios.put(`${API_URL}/Designation/${designation._id}`, payload);
                if (response.data.success) {
                    showToast('Designation updated successfully', 'success');
                    onClose(true);
                }
            } else {
                // Create
                const response = await axios.post(`${API_URL}/Designation`, payload);
                if (response.data.success) {
                    showToast('Designation created successfully', 'success');
                    onClose(true);
                }
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to save designation';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose(false)}>
            <DialogContent className="sm:max-w-[500px] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>{designation ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
                    <DialogDescription>
                        {designation ? 'Update designation details below.' : 'Create a new designation for staff members.'}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    <form id="designation-form" onSubmit={handleSubmit} className="grid gap-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Designation Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Principal, Lab Assistant"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of this role..."
                                className="resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="isActive">Status</Label>
                            <Select value={isActive} onValueChange={setIsActive}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </ScrollArea>

                <DialogFooter className="px-6 py-4 border-t">
                    <Button variant="outline" type="button" onClick={() => onClose(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" form="designation-form" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {designation ? 'Update Designation' : 'Add Designation'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DesignationModal;
