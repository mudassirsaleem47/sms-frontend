import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
    MessageCircle, Send, CheckCircle2, XCircle, Clock, 
    Search, Eye, Calendar, Filter
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const API_BASE = import.meta.env.VITE_API_URL;

const MessageReport = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    
    // State Management
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // 'today', 'week', 'month', 'all'
    
    // Stats
    const [stats, setStats] = useState({
        total: 0,
        sent: 0,
        delivered: 0,
        failed: 0
    });

    // Detail Modal
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Fetch Messages
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const schoolId = currentUser._id;
            const response = await axios.get(`${API_BASE}/MessageReports/${schoolId}`);
            const data = Array.isArray(response.data) ? response.data : [];
            setMessages(data);
            
            // Calculate stats
            setStats({
                total: data.length,
                sent: data.filter(m => m.status === 'sent').length,
                delivered: data.filter(m => m.status === 'delivered').length,
                failed: data.filter(m => m.status === 'failed').length
            });
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchMessages();
    }, [currentUser]);

    // Filter Messages
    const filteredMessages = messages.filter(message => {
        // Search Filter
        const matchesSearch = !searchQuery || 
            message.recipient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.recipient?.phone?.includes(searchQuery) ||
            message.content?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Status Filter
        const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
        
        // Date Filter
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const messageDate = new Date(message.createdAt);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (dateFilter === 'today') {
                matchesDate = messageDate >= today;
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                matchesDate = messageDate >= weekAgo;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                matchesDate = messageDate >= monthAgo;
            }
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    // Status Badge Helper
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'sent': return 'default'; // blue-ish usually
            case 'delivered': return 'success'; // needs custom class if not defining success variant, stick to default or outline with color
            case 'failed': return 'destructive';
            case 'pending': return 'secondary';
            default: return 'outline';
        }
    };

    // Custom Badge Component calls for colors
    const StatusBadge = ({ status }) => {
        let classes = "";
        let icon = null;
        let label = status;

        switch (status) {
            case 'sent':
                classes = "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
                icon = <Send className="w-3 h-3 mr-1" />;
                label = "Sent";
                break;
            case 'delivered':
                classes = "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
                icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
                label = "Delivered";
                break;
            case 'failed':
                classes = "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
                icon = <XCircle className="w-3 h-3 mr-1" />;
                label = "Failed";
                break;
            default: // pending
                classes = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200";
                icon = <Clock className="w-3 h-3 mr-1" />;
                label = "Pending";
                break;
        }

        return (
            <Badge variant="outline" className={`${classes} font-medium`}>
                {icon} {label}
            </Badge>
        );
    };

    // View Message Detail
    const viewDetails = (message) => {
        setSelectedMessage(message);
        setIsDetailOpen(true);
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Message Reports</h1>
                    <p className="text-muted-foreground mt-1">View delivery reports and status of sent messages</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Lifetime volume</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent</CardTitle>
                        <Send className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.sent}</div>
                        <p className="text-xs text-muted-foreground">Successfully sent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.delivered}</div>
                        <p className="text-xs text-muted-foreground">Confirmed delivery</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.failed}</div>
                        <p className="text-xs text-muted-foreground">Delivery failed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search recipient, phone or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Messages Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recipient</TableHead>
                                <TableHead className="w-[40%]">Message</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredMessages.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No messages found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                        filteredMessages.map((message) => (
                                            <TableRow key={message._id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{message.recipient?.name || 'Unknown'}</span>
                                                        <span className="text-xs text-muted-foreground">{message.recipient?.phone || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-muted-foreground truncate max-w-[300px]" title={message.content}>
                                                {message.content}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={message.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => viewDetails(message)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Message Details</DialogTitle>
                        <DialogDescription>
                            Full details of the selected message log.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMessage && (
                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-md border">
                                <span className="text-sm font-medium">Status</span>
                                <StatusBadge status={selectedMessage.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Recipient</span>
                                    <p className="font-medium">{selectedMessage.recipient?.name || 'Unknown'}</p>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.recipient?.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Sent At</span>
                                    <p className="text-sm">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <span className="text-xs text-muted-foreground uppercase font-semibold">Message Content</span>
                                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                                    {selectedMessage.content}
                                </div>
                            </div>

                            {(selectedMessage.error || selectedMessage.status === 'failed') && (
                                <div className="space-y-1">
                                    <span className="text-xs text-red-500 uppercase font-semibold">Error Details</span>
                                    <div className="bg-red-50 border border-red-100 p-3 rounded-md text-sm text-red-600">
                                        {selectedMessage.error || 'Unknown error occurred during delivery.'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setIsDetailOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MessageReport;
