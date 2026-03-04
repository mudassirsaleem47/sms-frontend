import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../utils/formatDateTime';
import { CheckSquare, Plus, Check, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import TaskFormModal from './form-popup/TaskFormModal';

import API_URL from '@/config/api';
const API_BASE = API_URL;

const TaskModal = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    // Modal State
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchTasks = async () => {
        if (!currentUser?._id) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/Tasks/${currentUser._id}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchTasks();
        }
    }, [open]);

    const handleAddTask = () => {
        setSelectedTask(null);
        setShowTaskForm(true);
        setOpen(false); // Close popover when opening modal
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowTaskForm(true);
        setOpen(false);
    };

    const handleTaskSaved = () => {
        fetchTasks();
    // Optionally reopen popover or just stay closed
    };

    const handleStatusToggle = async (e, task) => {
        e.stopPropagation();
        
        const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
        
        // Optimistic update
        setTasks(prev => prev.map(t => 
            t._id === task._id ? { ...t, status: newStatus } : t
        ));

        try {
            await axios.put(`${API_BASE}/Task/${task._id}`, {
                ...task,
                status: newStatus,
                schoolId: currentUser._id
            });
        } catch (error) {
            console.error('Error updating status:', error);
            // Revert
            setTasks(prev => prev.map(t => 
                t._id === task._id ? { ...t, status: task.status } : t
            ));
            showToast('Failed to update status', 'error');
        }
    };

    const activeTasksCount = tasks.filter(t => t.status !== 'Completed').length;

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9" title="Tasks">
                        <CheckSquare className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
                        {activeTasksCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
                        <h4 className="font-semibold text-sm">My Tasks</h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={handleAddTask}
                        >
                            <Plus className="mr-1 h-3 w-3" />
                            Add New
                        </Button>
                    </div>
                    <ScrollArea className="h-72">
                        {loading ? (
                            <div className="flex justify-center items-center h-full p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                                <CheckSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                <span className="text-sm text-muted-foreground">No tasks yet</span>
                                <span className="text-xs text-muted-foreground/70 mt-1">Add a task to get started</span>
                            </div>
                        ) : (
                                    <div className="flex flex-col">
                                        {tasks.map((task) => (
                                            <div
                                                key={task._id}
                                        className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer group border-b last:border-0"
                                        onClick={() => handleEditTask(task)}
                                    >
                                        <button
                                            onClick={(e) => handleStatusToggle(e, task)}
                                            className={`shrink-0 mt-0.5 h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${task.status === 'Completed'
                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                    : 'border-muted-foreground/40 hover:border-primary'
                                                }`}
                                        >
                                            {task.status === 'Completed' && <Check className="h-3 w-3" />}
                                        </button>

                                        <div className="flex-1 space-y-1 min-w-0">
                                            <p className={`text-sm font-medium leading-none truncate ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                                                {task.taskTitle}
                                            </p>
                                            {task.taskDescription && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {task.taskDescription}
                                                </p>
                                            )}
                                            {task.dueDate && (
                                                <div className="flex items-center text-[10px] text-muted-foreground mt-1">
                                                    <CalendarIcon className="mr-1 h-3 w-3" />
                                                    {formatDateTime(task.dueDate, { dateOnly: true })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </PopoverContent>
            </Popover>

            <TaskFormModal
                isOpen={showTaskForm}
                onClose={() => setShowTaskForm(false)}
                task={selectedTask}
                onTaskSaved={handleTaskSaved}
            />
        </>
    );
};

export default TaskModal;

