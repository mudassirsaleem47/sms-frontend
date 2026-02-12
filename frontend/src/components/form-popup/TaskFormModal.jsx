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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_URL;

const TaskFormModal = ({ isOpen, onClose, task, onTaskSaved }) => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        taskTitle: '',
        taskDescription: '',
        status: 'Todo',
        priority: 'Medium',
        dueDate: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                taskTitle: task.taskTitle || '',
                taskDescription: task.taskDescription || '',
                status: task.status || 'Todo',
                priority: task.priority || 'Medium',
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined
            });
        } else {
            setFormData({
                taskTitle: '',
                taskDescription: '',
                status: 'Todo',
                priority: 'Medium',
                dueDate: undefined
            });
        }
    }, [task, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateSelect = (date) => {
        setFormData(prev => ({ ...prev, dueDate: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                schoolId: currentUser._id,
                createdBy: currentUser._id,
                createdByModel: 'admin'
            };

            if (task) {
                await axios.put(`${API_BASE}/Task/${task._id}`, payload);
                showToast('Task updated successfully!', 'success');
            } else {
                await axios.post(`${API_BASE}/Task`, payload);
                showToast('Task created successfully!', 'success');
            }
            if (onTaskSaved) onTaskSaved();
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
            showToast(error.response?.data?.message || 'Failed to save task', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true);
            setTimeout(() => setShowDeleteConfirm(false), 3000);
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`${API_BASE}/Task/${task._id}`);
            showToast('Task deleted successfully!', 'success');
            setShowDeleteConfirm(false);
            if (onTaskSaved) onTaskSaved();
            onClose();
        } catch (error) {
            console.error('Error deleting task:', error);
            showToast('Failed to delete task', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                    <DialogDescription>
                        {task ? 'Update task details below.' : 'Create a new task to track your work.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="taskTitle">Task Title <span className="text-destructive">*</span></Label>
                        <Input
                            id="taskTitle"
                            name="taskTitle"
                            value={formData.taskTitle}
                            onChange={handleChange}
                            required
                            placeholder="What needs to be done?"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="taskDescription">Description</Label>
                        <Textarea
                            id="taskDescription"
                            name="taskDescription"
                            value={formData.taskDescription}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => handleSelectChange('status', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todo">To Do</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(val) => handleSelectChange('priority', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !formData.dueDate && "text-muted-foreground"
                                    )}
                                >
                                    {formData.dueDate ? (
                                        format(formData.dueDate, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.dueDate}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-between">
                        <div>
                            {task && (
                                <Button
                                    type="button"
                                    variant={showDeleteConfirm ? "destructive" : "outline"}
                                    onClick={handleDelete}
                                    className={showDeleteConfirm ? "animate-pulse" : "text-destructive hover:bg-destructive/10 border-destructive/20"}
                                >
                                    {showDeleteConfirm ? "Click again to confirm" : (
                                        <>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Task"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskFormModal;
