import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCampus } from '../context/CampusContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import {
  Users,
  School,
  BookOpen,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  Calendar,
  Bell,
  BarChart3,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { selectedCampus, campuses } = useCampus();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    revenue: 0,
    capacity: 0
  });
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser, selectedCampus, campuses]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Stats (Students, Teachers, Classes)
      let studentCount = 0;
      let teacherCount = 0;
      let classCount = 0;

      if (selectedCampus) {
        const res = await axios.get(`${API_URL}/CampusStats/${selectedCampus._id}`);
        if (res.data.success) {
          const s = res.data.stats;
          studentCount = s.totalStudents;
          teacherCount = s.totalTeachers;
          classCount = s.totalClasses;
        }
      } else if (campuses.length > 0) {
        const promises = campuses.map(campus =>
          axios.get(`${API_URL}/CampusStats/${campus._id}`)
        );
        const results = await Promise.all(promises);
        results.forEach(res => {
          if (res.data.success) {
            studentCount += res.data.stats.totalStudents;
            teacherCount += res.data.stats.totalTeachers;
            classCount += res.data.stats.totalClasses;
          }
        });
      }

      // 2. Fetch Revenue
      let revenue = 0;
      try {
        const incomeRes = await axios.get(`${API_URL}/IncomeStatistics/${currentUser._id}`);
        revenue = incomeRes.data.totalIncome?.amount || 0;
      } catch (err) {
        console.error("Error fetching revenue:", err);
      }

      setStats({
        students: studentCount,
        teachers: teacherCount,
        classes: classCount,
        revenue: revenue
      });

      // 3. Fetch Data
      const [notifRes, eventRes] = await Promise.all([
        axios.get(`${API_URL}/Notifications/${currentUser._id}`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/Events/${currentUser._id}`).catch(() => ({ data: [] }))
      ]);

      setActivities(notifRes.data.notifications?.slice(0, 5) || []);
      setNotifications(notifRes.data.notifications?.filter(n => !n.read).slice(0, 5) || []);

      const upcoming = (Array.isArray(eventRes.data) ? eventRes.data : [])
        .filter(e => new Date(e.eventFrom) >= new Date())
        .sort((a, b) => new Date(a.eventFrom) - new Date(b.eventFrom))
        .slice(0, 3);
      setEvents(upcoming);

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: 'Total Students',
      count: stats.students,
      change: '+12%',
      trend: 'up',
      color: 'text-blue-600',
      bg: 'bg-blue-100/50'
    },
    {
      icon: School,
      label: 'Total Teachers',
      count: stats.teachers,
      change: '+4%',
      trend: 'up',
      color: 'text-purple-600',
      bg: 'bg-purple-100/50'
    },
    {
      icon: BookOpen,
      label: 'Total Classes',
      count: stats.classes,
      change: '0%',
      trend: 'neutral',
      color: 'text-orange-600',
      bg: 'bg-orange-100/50'
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      count: `PKR ${stats.revenue.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100/50'
    },
  ];

  const quickActions = [
    { label: 'Add Student', icon: Users, route: '/admin/admission', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Manage Classes', icon: BookOpen, route: '/admin/classes', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Class Schedule', icon: Calendar, route: '/admin/class-schedule', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Subjects', icon: BookOpen, route: '/admin/subjects', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'All Students', icon: School, route: '/admin/students', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Timetable', icon: Clock, route: '/admin/teacher-schedule', color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your institute's performance.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden sm:flex" onClick={fetchDashboardData}>
            <Activity className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button onClick={() => navigate('/admin/admission')}>
            <Users className="mr-2 h-4 w-4" />
            New Admission
          </Button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div variants={itemVariants} key={idx}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-20" /> : stat.count}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-muted-foreground" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-emerald-500 font-medium' : ''}>
                      {stat.change}
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Activity / Notifications */}
        <Card className="col-span-4 lg:col-span-4 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system updates and notifications</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-6">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-3 w-[200px]" />
                      </div>
                    </div>
                  ))
                ) : activities.length > 0 ? (
                  activities.map((activity, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="relative mt-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background group-hover:bg-muted transition-colors">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.message}</p>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {activity.timestamp ? format(new Date(activity.timestamp), 'MMM dd, yyyy • h:mm a') : 'Just now'}
                        </div>
                      </div>
                    </div>
                  ))
                  ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="p-3 bg-muted rounded-full mb-3">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions & Events */}
        <div className="col-span-3 space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className="h-auto flex-col items-center justify-center py-4 space-y-2 hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(action.route)}
                  >
                    <div className={`p-2 rounded-full ${action.bg}`}>
                      <Icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : events.length > 0 ? (
                  events.map((event, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col items-center justify-center h-10 w-10 rounded-md bg-primary/10 text-primary shrink-0">
                        <span className="text-[10px] font-bold uppercase leading-none">
                          {event.eventFrom ? format(new Date(event.eventFrom), 'MMM') : 'EVT'}
                        </span>
                        <span className="text-sm font-bold leading-none mt-0.5">
                          {event.eventFrom ? format(new Date(event.eventFrom), 'dd') : '00'}
                        </span>
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium leading-none line-clamp-1">{event.eventName}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{event.description || "No details provided"}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                  ) : (
                  <p className="text-sm text-center text-muted-foreground py-4">No upcoming events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;