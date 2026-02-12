import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Info, AlertTriangle, CheckCircle, Clock, Trash2, Check, MoreVertical, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { toast } from "sonner";

const NotificationsPage = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (currentUser) {
            fetchNotifications();
        }
    }, [currentUser]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/Notifications/${currentUser._id}`);
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Error", {
                description: "Failed to fetch notifications",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/Notifications/read-all/${currentUser._id}`);
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast.success("Success", { description: "All notifications marked as read" });
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast.error("Error", { description: "Failed to mark all as read" });
        }
    };

    const handleClearAll = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/Notifications/clear-all/${currentUser._id}`);
            setNotifications([]);
            toast.success("Success", { description: "All notifications cleared" });
        } catch (error) {
            console.error("Error clearing notifications:", error);
            toast.error("Error", { description: "Failed to clear notifications" });
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/Notification/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/Notification/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success("Deleted", { description: "Notification removed" });
        } catch (error) {
            console.error("Error deleting notification:", error);
            toast.error("Error", { description: "Failed to delete notification" });
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="h-4 w-4 text-green-600" /></div>;
            case 'warning': return <div className="bg-amber-100 p-2 rounded-full"><AlertTriangle className="h-4 w-4 text-amber-600" /></div>;
            case 'info': return <div className="bg-blue-100 p-2 rounded-full"><Info className="h-4 w-4 text-blue-600" /></div>;
            case 'error': return <div className="bg-red-100 p-2 rounded-full"><AlertTriangle className="h-4 w-4 text-red-600" /></div>;
            default: return <div className="bg-gray-100 p-2 rounded-full"><Bell className="h-4 w-4 text-gray-600" /></div>;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread' && n.read) return false;
        if (searchQuery && !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const getDateLabel = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) return "Today";
        if (isYesterday(date)) return "Yesterday";
        return "Earlier";
    };

    const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
        const dateLabel = getDateLabel(notification.timestamp);
        if (!acc[dateLabel]) {
            acc[dateLabel] = [];
        }
        acc[dateLabel].push(notification);
        return acc;
    }, {});

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl space-y-6 p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
                     <p className="text-muted-foreground mt-1">Manage and view your system alerts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={notifications.length === 0} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear all
                    </Button>
                </div>
            </div>

            <Card className="border-border">
                <CardHeader className="pb-3">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setFilter}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="unread" className="relative">
                                    Unread
                                    {unreadCount > 0 && (
                                        <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search notifications..."
                                className="pl-9 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                   </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        {filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                                <div className="bg-muted/30 p-4 rounded-full mb-4">
                                    <Bell className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-lg font-medium">No notifications</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications at the moment."}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {Object.entries(groupedNotifications).map(([date, items]) => (
                                    <div key={date}>
                                        <div className="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10">
                                            {date}
                                        </div>
                                        <div className="divide-y divide-border/50">
                                            {items.map((notification) => (
                                                <div 
                                                    key={notification._id} 
                                                    className={`group flex items-start gap-4 p-4 hover:bg-muted/40 transition-all duration-200 ${!notification.read ? 'bg-primary/5' : ''}`}
                                                >
                                                    <div className="mt-1 shrink-0">
                                                        {getIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <p className={`text-sm font-medium leading-none ${!notification.read ? 'text-foreground font-semibold' : 'text-foreground/80'}`}>
                                                                    {notification.message}
                                                                </p>
                                                                {!notification.read && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                                )}
                                                            </div>
                                                            <span className="flex items-center text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                        {/* Optional: Add related entity info if needed */}
                                                        {notification.relatedEntity?.entityType && (
                                                            <p className="text-xs text-muted-foreground capitalize">
                                                                Related to: {notification.relatedEntity.entityType}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {!notification.read && (
                                                                    <DropdownMenuItem onClick={() => handleMarkAsRead(notification._id)}>
                                                                        <Check className="mr-2 h-4 w-4" /> Mark as read
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem onClick={() => handleDelete(notification._id)} className="text-destructive focus:text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationsPage;
