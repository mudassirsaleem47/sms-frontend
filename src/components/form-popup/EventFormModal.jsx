import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import API_URL from '../../config/api';

const EventFormModal = ({ isOpen, onClose, selectedDate, event }) => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        eventTitle: '',
        eventDescription: '',
        eventFrom: '',
        eventTo: '',
        eventColor: '#3b82f6',
        eventType: 'Other',
        visibility: 'Public'
    });

    const eventColors = [
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Green', value: '#10b981' },
        { name: 'Purple', value: '#8b5cf6' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Indigo', value: '#6366f1' }
    ];

    useEffect(() => {
        if (event) {
            setFormData({
                eventTitle: event.eventTitle || '',
                eventDescription: event.eventDescription || '',
                // Ensure date format is compatible with datetime-local input (YYYY-MM-DDTHH:mm)
                eventFrom: event.eventFrom ? new Date(event.eventFrom).toISOString().slice(0, 16) : '',
                eventTo: event.eventTo ? new Date(event.eventTo).toISOString().slice(0, 16) : '',
                eventColor: event.eventColor || '#3b82f6',
                eventType: event.eventType || 'Other',
                visibility: event.visibility || 'Public'
            });
        } else if (selectedDate) {
            // Adjust for local timezone offset manually to prevent UTC date shift
            const localDate = new Date(selectedDate);
            localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
            const dateStr = localDate.toISOString().slice(0, 10);

            setFormData({
                eventTitle: '',
                eventDescription: '',
                eventFrom: `${dateStr}T09:00`,
                eventTo: `${dateStr}T17:00`,
                eventColor: '#3b82f6',
                eventType: 'Other',
                visibility: 'Public'
            });
        } else {
            // Default fallbacks if no date provided
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            const dateStr = now.toISOString().slice(0, 10);
            setFormData({
                eventTitle: '',
                eventDescription: '',
                eventFrom: `${dateStr}T09:00`,
                eventTo: `${dateStr}T17:00`,
                eventColor: '#3b82f6',
                eventType: 'Other',
                visibility: 'Public'
            });
        }
    }, [event, selectedDate, isOpen]); // Added isOpen to reset when opening

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                schoolId: currentUser.school?._id || currentUser.school || currentUser._id,
                createdBy: currentUser._id,
                createdByModel: 'admin' // Adjust based on user role if needed
            };

            if (event) {
                await axios.put(`${API_URL}/Event/${event._id}`, payload);
                showToast('Event updated successfully!', 'success');
            } else {
                await axios.post(`${API_URL}/Event`, payload);
                showToast('Event created successfully!', 'success');
            }
            onClose();
        } catch (error) {
            console.error('Error saving event:', error);
            showToast(error.response?.data?.message || 'Failed to save event', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true);
            // Auto reset confirm after 3s
            setTimeout(() => setShowDeleteConfirm(false), 3000);
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`${API_URL}/Event/${event._id}`);
            showToast('Event deleted successfully!', 'success');
            setShowDeleteConfirm(false);
            onClose();
        } catch (error) {
            console.error('Error deleting event:', error);
            showToast('Failed to delete event', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                    <DialogDescription>
                        {event ? 'Make changes to the event details below.' : 'Fill in the details to create a new calendar event.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Event Title */}
                    <div className="space-y-2">
                        <Label htmlFor="eventTitle">Event Title <span className="text-destructive">*</span></Label>
                        <Input
                            id="eventTitle"
                            name="eventTitle"
                            value={formData.eventTitle}
                            onChange={handleChange}
                            required
                            placeholder="Enter event title"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="eventDescription">Description</Label>
                        <Textarea
                            id="eventDescription"
                            name="eventDescription"
                            value={formData.eventDescription}
                            onChange={handleChange}
                            placeholder="Enter event description"
                            rows={3}
                        />
                    </div>

                    {/* Date/Time Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="eventFrom">From <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Input
                                    type="datetime-local"
                                    id="eventFrom"
                                    name="eventFrom"
                                    value={formData.eventFrom}
                                    onChange={handleChange}
                                    required
                                    className="block"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="eventTo">To <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <Input
                                    type="datetime-local"
                                    id="eventTo"
                                    name="eventTo"
                                    value={formData.eventTo}
                                    onChange={handleChange}
                                    required
                                    className="block"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Color & Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>Event Color</Label>
                            <div className="flex flex-wrap gap-2">
                                {eventColors.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => handleSelectChange('eventColor', color.value)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${formData.eventColor === color.value
                                                ? 'border-foreground scale-110 shadow-sm'
                                                : 'border-transparent hover:scale-110'
                                        }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {formData.eventColor === color.value && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="eventType">Event Type</Label>
                            <Select
                                value={formData.eventType} 
                                onValueChange={(val) => handleSelectChange('eventType', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Academic">Academic</SelectItem>
                                    <SelectItem value="Holiday">Holiday</SelectItem>
                                    <SelectItem value="Meeting">Meeting</SelectItem>
                                    <SelectItem value="Exam">Exam</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-3">
                        <Label>Visibility</Label>
                        <RadioGroup
                            value={formData.visibility}
                            onValueChange={(val) => handleSelectChange('visibility', val)}
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Public" id="r1" />
                                <Label htmlFor="r1" className="cursor-pointer font-normal">Public</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Private" id="r2" />
                                <Label htmlFor="r2" className="cursor-pointer font-normal">Private</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Super Admin" id="r3" />
                                <Label htmlFor="r3" className="cursor-pointer font-normal">Super Admin</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-between">
                        <div>
                            {event && (
                                <Button
                                    type="button"
                                    variant={showDeleteConfirm ? "destructive" : "outline"}
                                    onClick={handleDelete}
                                    className={showDeleteConfirm ? "animate-pulse" : "text-destructive hover:bg-destructive/10 border-destructive/20"}
                                >
                                    {showDeleteConfirm ? "Click again to confirm" : (
                                        <>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Event
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : event ? "Update Changes" : "Create Event"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EventFormModal;
