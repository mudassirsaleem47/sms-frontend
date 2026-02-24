
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '@/config/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Users,
    Phone,
    FileQuestion,
    AlertCircle,
    Calendar,
    ArrowRight
} from "lucide-react";
import { Link } from 'react-router-dom';

const API_BASE = API_URL;

const ReceptionistDashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        todayVisitors: 0,
        todayCalls: 0,
        pendingEnquiries: 0,
        recentComplaints: 0
    });
    const [recentActivites, setRecentActivites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (!currentUser) return;
                const schoolId = currentUser.school?._id || currentUser.school || currentUser._id;
                
                // Fetch stats (Mocking some endpoints if they don't exist efficiently for dashboard, 
                // but ideally we'd have a dashboard endpoint. For now, let's fetch lists and count clientside or minimal limit)
                
                // We will use existing endpoints and filter for "Today" where applicable
                const today = new Date().toISOString().split('T')[0];

                const [visitorsRes, callsRes, enquiriesRes, complainsRes] = await Promise.all([
                    axios.get(`${API_BASE}/Visitors/${schoolId}`),
                    axios.get(`${API_BASE}/PhoneCalls/${schoolId}`),
                    axios.get(`${API_BASE}/EnquiryList/${schoolId}`),
                    axios.get(`${API_BASE}/Complains/${schoolId}`)
                ]);

                const visitors = Array.isArray(visitorsRes.data) ? visitorsRes.data : [];
                const calls = Array.isArray(callsRes.data) ? callsRes.data : [];
                const enquiries = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : [];
                const complains = Array.isArray(complainsRes.data) ? complainsRes.data : [];

                // Calculate Stats
                const todayVisitorsCount = visitors.filter(v => v.date && v.date.startsWith(today)).length;
                const todayCallsCount = calls.filter(c => c.date && c.date.startsWith(today)).length; // Assuming date field exists/format
                const pendingEnquiriesCount = enquiries.filter(e => !e.assigned).length;
                const recentComplainCount = complains.length; // Just total for now

                setStats({
                    todayVisitors: todayVisitorsCount,
                    todayCalls: todayCallsCount,
                    pendingEnquiries: pendingEnquiriesCount,
                    recentComplaints: recentComplainCount
                });

                // Mock Recent Activity from combined lists
                const activity = [
                    ...visitors.slice(0, 3).map(v => ({ type: 'Visitor', msg: `${v.visitorName} visited`, time: v.date })),
                    ...calls.slice(0, 3).map(c => ({ type: 'Call', msg: `Call with ${c.callerName}`, time: c.date })),
                    ...enquiries.slice(0, 3).map(e => ({ type: 'Enquiry', msg: `Enquiry from ${e.name}`, time: e.date }))
                ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

                setRecentActivites(activity);

            } catch (error) {
                console.error("Dashboard data load failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary/90">Reception Status</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {currentUser?.name || 'Receptionist'}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
                        {new Date().toLocaleDateString()}
                    </Badge>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Visitors Today</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.todayVisitors}</div>
                        <p className="text-xs text-muted-foreground">Checked in today</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Calls Logged</CardTitle>
                        <Phone className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.todayCalls}</div>
                        <p className="text-xs text-muted-foreground">In/Out counts</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Enquiries</CardTitle>
                        <FileQuestion className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingEnquiries}</div>
                        <p className="text-xs text-muted-foreground">Requires follow-up</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Complaints</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.recentComplaints}</div>
                        <p className="text-xs text-muted-foreground">Total records</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Front Desk Activity</CardTitle>
                        <CardDescription>
                            Latest visitors, calls, and enquiries.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivites.length > 0 ? (
                                recentActivites.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${
                                                item.type === 'Visitor' ? 'bg-blue-100 text-blue-600' :
                                                item.type === 'Call' ? 'bg-green-100 text-green-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                                {item.type === 'Visitor' ? <Users size={16} /> :
                                                 item.type === 'Call' ? <Phone size={16} /> :
                                                 <FileQuestion size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{item.msg}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(item.time).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline">{item.type}</Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No recent activity.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Access</CardTitle>
                        <CardDescription>
                            Navigate to key management areas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Link to="/receptionist/visitor-book">
                            <Button variant="outline" className="w-full justify-between h-14 hover:border-primary/50 hover:bg-primary/5">
                                <span className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Visitor Book
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </Link>
                        <Link to="/receptionist/admission-enquiry">
                            <Button variant="outline" className="w-full justify-between h-14 hover:border-primary/50 hover:bg-primary/5">
                                <span className="flex items-center gap-2">
                                    <FileQuestion className="h-5 w-5 text-amber-500" />
                                    Admission Enquiries
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </Link>
                        <Link to="/receptionist/call-logs">
                            <Button variant="outline" className="w-full justify-between h-14 hover:border-primary/50 hover:bg-primary/5">
                                <span className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-green-500" />
                                    Call Logs
                                </span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
