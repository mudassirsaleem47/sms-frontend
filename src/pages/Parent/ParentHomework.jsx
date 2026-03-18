import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BookOpen, Calendar, Loader2 } from 'lucide-react';
import API_URL from '@/config/api';

const API_BASE = API_URL;

const ParentHomework = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const [homework, setHomework] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHomework = async () => {
        if (!currentUser?._id) {
            setHomework([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/Homework/Student/${currentUser._id}`);
            setHomework(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            setHomework([]);
            showToast('Failed to load homework', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomework();
    }, [currentUser?._id]);

    const summary = useMemo(() => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const total = homework.length;
        const pending = homework.filter(item => {
            const due = new Date(item.dueDate);
            return item.status === 'Assigned' && format(due, 'yyyy-MM-dd') >= today;
        }).length;
        const overdue = homework.filter(item => {
            const due = new Date(item.dueDate);
            return item.status === 'Assigned' && format(due, 'yyyy-MM-dd') < today;
        }).length;
        return { total, pending, overdue };
    }, [homework]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
            case 'Overdue': return 'bg-red-100 text-red-700 hover:bg-red-200';
            case 'Archived': return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getDisplayStatus = (item) => {
        if (item.status === 'Archived') return 'Archived';
        const isOverdue = new Date(item.dueDate) < new Date();
        return isOverdue ? 'Overdue' : 'Pending';
    };

    return (
        <div className="flex-1 p-8 pt-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Homework & Assignments</h2>
                    <p className="text-muted-foreground mt-1">Daily tasks and project deadlines synced from school dashboard</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{summary.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-amber-600">{summary.pending}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-rose-600">{summary.overdue}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {loading ? (
                    <div className="flex items-center justify-center rounded-xl border border-border/70 py-16 text-muted-foreground">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading homework...
                    </div>
                ) : homework.length === 0 ? (
                    <div className="rounded-xl border border-border/70 py-16 text-center text-muted-foreground">
                        No homework assigned yet.
                    </div>
                ) : (
                    homework.map((item) => {
                        const displayStatus = getDisplayStatus(item);
                        return (
                            <Card key={item._id} className="shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                            {item.subject}: {item.title}
                                        </CardTitle>
                                        <CardDescription className="flex flex-wrap items-center gap-4 text-sm mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" /> Due: {format(new Date(item.dueDate), 'PPP')}
                                            </span>
                                            {item.classId?.sclassName && (
                                                <span>Class: {item.classId.sclassName}{item.section ? ` - ${item.section}` : ''}</span>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <Badge className={`${getStatusColor(displayStatus)} border-none`}>
                                        {displayStatus}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 bg-muted/50 p-3 rounded-md">
                                        {item.description || 'No extra instructions provided.'}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ParentHomework;
