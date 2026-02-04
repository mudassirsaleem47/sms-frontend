import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  TrendingUp,
  Bell,
  Clock,
  Activity,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      icon: Users,
      label: 'Total Students',
      count: '1,234',
      change: '+12%',
      trend: 'up'
    },
    {
      icon: GraduationCap,
      label: 'Total Teachers',
      count: '89',
      change: '+3%',
      trend: 'up'
    },
    {
      icon: BookOpen,
      label: 'Total Classes',
      count: '24',
      change: '0%',
      trend: 'neutral'
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      count: 'PKR 2.5M',
      change: '+18%',
      trend: 'up'
    },
  ];

  const recentActivities = [
    { title: 'New student admission', time: '2 hours ago', type: 'info' },
    { title: 'Class 10th exam scheduled', time: '5 hours ago', type: 'warning' },
    { title: 'Teacher meeting completed', time: '1 day ago', type: 'success' },
    { title: 'Fee payment received', time: '2 days ago', type: 'success' },
  ];

  const quickActions = [
    { label: 'Student Admission', icon: Users, route: '/admin/admissions', color: 'text-blue-600' },
    { label: 'Manage Classes', icon: BookOpen, route: '/admin/classes', color: 'text-indigo-600' },
    { label: 'View Schedule', icon: Calendar, route: '/admin/class-schedule', color: 'text-purple-600' },
    { label: 'Manage Subjects', icon: BookOpen, route: '/admin/subjects', color: 'text-green-600' },
    { label: 'View Students', icon: GraduationCap, route: '/admin/students', color: 'text-orange-600' },
    { label: 'Teacher Schedule', icon: Clock, route: '/admin/teacher-schedule', color: 'text-pink-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {currentUser ? currentUser.name : 'Admin'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.trend === 'up' && (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : ''}>
                    {stat.change} from last month
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and events</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="mt-1">
                    <div className={`h-2 w-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="justify-start h-auto py-3"
                    onClick={() => navigate(action.route)}
                  >
                    <Icon className={`h-4 w-4 mr-3 ${action.color}`} />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-md p-2 min-w-[48px]">
                  <span className="text-xs font-medium">FEB</span>
                  <span className="text-lg font-bold">05</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Mid-term Exams</p>
                  <p className="text-xs text-muted-foreground">All classes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center justify-center bg-secondary text-secondary-foreground rounded-md p-2 min-w-[48px]">
                  <span className="text-xs font-medium">FEB</span>
                  <span className="text-lg font-bold">12</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Parent-Teacher Meeting</p>
                  <p className="text-xs text-muted-foreground">Grade 9-10</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="h-5 px-2">3</Badge>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">Fee payment pending</p>
                  <p className="text-xs text-muted-foreground">45 students</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">Teacher leave requests</p>
                  <p className="text-xs text-muted-foreground">3 pending approvals</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="text-sm font-medium">New enquiries</p>
                  <p className="text-xs text-muted-foreground">12 unread</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Performance</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className="text-sm font-bold">94%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Pass Rate</span>
                  <span className="text-sm font-bold">87%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '87%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Staff Satisfaction</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;