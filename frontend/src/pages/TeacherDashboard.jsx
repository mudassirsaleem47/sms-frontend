import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  GraduationCap,
  LayoutDashboard,
  CheckCircle2,
  CalendarDays,
  MoreVertical,
  Plus
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
  Cell
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL;

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Real data states
  const [students, setStudents] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    avgAttendance: 0,
    avgPerformance: 0
  });

  // Mock chart data
  const attendanceData = [
    { day: "Mon", present: 45, absent: 5 },
    { day: "Tue", present: 48, absent: 2 },
    { day: "Wed", present: 42, absent: 8 },
    { day: "Thu", present: 47, absent: 3 },
    { day: "Fri", present: 44, absent: 6 },
  ];

  const performanceData = [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 72 },
    { month: "Mar", score: 68 },
    { month: "Apr", score: 85 },
    { month: "May", score: 78 },
  ];

  const chartConfig = {
    present: {
      label: "Present",
      color: "hsl(var(--primary))",
    },
    absent: {
      label: "Absent",
      color: "hsl(var(--destructive))",
    },
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))"
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const schoolId = currentUser.school?._id || currentUser.school;

      if (!schoolId) {
        toast.error('School information not found.');
        setLoading(false);
        return;
      }

      // Fetch students
      const studentsRes = await axios.get(`${API_BASE}/Students/${schoolId}`);
      const allStudents = studentsRes.data || [];

      // Filter students by teacher's assigned classes
      let teacherStudents = allStudents;
      if (currentUser.assignedClasses && currentUser.assignedClasses.length > 0) {
        const assignedClassIds = currentUser.assignedClasses.map(cls => cls._id);
        teacherStudents = allStudents.filter(student =>
          assignedClassIds.includes(student.sclassName?._id)
        );
      }

      setStudents(teacherStudents);

      // Fetch exam schedules for today
      if (currentUser.assignedClasses && currentUser.assignedClasses.length > 0) {
        const schedulesPromises = currentUser.assignedClasses.map(cls =>
          axios.get(`${API_BASE}/ExamSchedules/Class/${cls._id}`).catch(() => ({ data: [] }))
        );
        const schedulesResults = await Promise.all(schedulesPromises);
        const allSchedules = schedulesResults.flatMap(res => res.data || []);

        // Filter today's schedules
        const today = new Date().toISOString().split('T')[0];
        const todaySchedules = allSchedules.filter(schedule => {
          const scheduleDate = new Date(schedule.examDate).toISOString().split('T')[0];
          return scheduleDate === today;
        });

        setExamSchedules(todaySchedules.slice(0, 3)); // Show max 3
      }

      // Calculate stats
      setStats({
        totalStudents: teacherStudents.length,
        totalClasses: currentUser.assignedClasses?.length || 0,
        avgAttendance: 92, // Mocking stable attendance
        avgPerformance: 78 // Mocking performance
      });

      setLoading(false);
    } catch (error) {
      toast.error('Error fetching dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-4 w-[350px]" />
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="col-span-2 h-[400px] rounded-xl" />
          <Skeleton className="col-span-1 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-6 space-y-8 bg-background/50 animate-in fade-in duration-500">

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Teacher Dashboard</h2>
          </div>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            Welcome back, <span className="font-semibold text-foreground">{currentUser?.name || 'Teacher'}</span> 👋
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3 px-4 py-2 bg-card border rounded-2xl shadow-sm text-sm font-semibold">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span>{format(currentTime, 'EEEE, MMMM do')}</span>
            <Separator orientation="vertical" className="h-4 mx-1" />
            <Clock className="w-4 h-4 text-primary" />
            <span className="tabular-nums">{format(currentTime, 'h:mm:ss a')}</span>
          </div>
        </div>
      </div>

      {/* Stats Section with Hover Effects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group border-none shadow-md bg-gradient-to-br from-primary/95 to-primary text-primary-foreground">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
            <Users className="w-20 h-20" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalStudents}</div>
            <div className="flex items-center text-xs mt-2 text-primary-foreground/70">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>+3 from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Classes</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Sections: A, B, C</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Avg</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgAttendance}%</div>
            <div className="flex items-center text-xs mt-1 text-emerald-600 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>Above average</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-purple-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Primary Subject</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate max-w-full" title={currentUser?.subject}>
              {currentUser?.subject || 'All Subjects'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Specialization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Attendance Trends Chart */}
        <Card className="col-span-full lg:col-span-4 shadow-sm border-none bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Weekly overview of student presence.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">This Week</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="leading-none text-muted-foreground">
              Based on the last 5 school days.
            </div>
          </CardFooter>
        </Card>

        {/* Action Center / Quick Actions */}
        <Card className="col-span-full lg:col-span-3 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequent management tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 flex-1">
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-blue-50/50 hover:bg-blue-100/50 hover:border-blue-200 transition-all border-dashed" onClick={() => window.location.href = '/teacher/attendance'}>
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <span>Mark Attendance</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-purple-50/50 hover:bg-purple-100/50 hover:border-purple-200 transition-all border-dashed">
              <Plus className="w-6 h-6 text-purple-600" />
              <span>Lesson Plan</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-orange-50/50 hover:bg-orange-100/50 hover:border-orange-200 transition-all border-dashed" onClick={() => window.location.href = '/teacher/results'}>
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <span>Upload Marks</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-emerald-50/50 hover:bg-emerald-100/50 hover:border-emerald-200 transition-all border-dashed" onClick={() => window.location.href = '/teacher/students'}>
              <Users className="w-6 h-6 text-emerald-600" />
              <span>Student List</span>
            </Button>
          </CardContent>
          <CardFooter className="bg-muted/30 py-4 mt-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span>3 Attendance reports pending submission.</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Classes List */}
        <Card className="col-span-full lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle>My Active Classes</CardTitle>
              <CardDescription>Managing {currentUser?.assignedClasses?.length || 0} classes.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
                    {currentUser?.assignedClasses && currentUser.assignedClasses.length > 0 ? (
                currentUser.assignedClasses.map((cls, index) => {
                  const classStudents = students.filter(s => s.sclassName?._id === cls._id);
                  return (
                    <div key={index} className="group relative flex flex-col p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted/20 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary" className="font-semibold">{classStudents.length} Students</Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-xl block group-hover:text-primary transition-colors">{cls.sclassName}</span>
                        <p className="text-sm text-muted-foreground">Main Section</p>
                      </div>
                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Roll list ready</span>
                        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1" />
                      </div>
                    </div>
                  )
                })
                    ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl bg-muted/5">
                    <BookOpen className="h-12 w-12 mb-4 text-muted-foreground/30" />
                    <p className="font-semibold text-muted-foreground">No classes assigned yet.</p>
                    <Button variant="link" className="mt-2 text-primary">Request assignment</Button>
                  </div>
                    )}
            </div>
          </CardContent>
        </Card>

        {/* Exams Schedule / Notifications */}
        <Card className="col-span-full lg:col-span-1 shadow-sm overflow-hidden border-none bg-gradient-to-b from-card to-muted/30">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Exams
            </CardTitle>
            <CardDescription>Your assessment supervision duty.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
                    {examSchedules.length > 0 ? (
                examSchedules.map((schedule, index) => (
                  <div key={index} className="flex items-start gap-4 group cursor-default">
                    <div className="flex flex-col items-center justify-center bg-background border-2 border-primary/20 rounded-2xl h-14 w-14 shrink-0 group-hover:border-primary transition-colors shadow-sm">
                      <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                                        {format(new Date(schedule.examDate), 'MMM')}
                      </span>
                      <span className="text-xl font-black text-foreground -mt-1">
                                        {format(new Date(schedule.examDate), 'dd')}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1 py-1">
                      <p className="text-base font-bold leading-none group-hover:text-primary transition-colors">
                        {schedule.subject}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center px-2 py-0.5 bg-muted rounded-full">
                          {schedule.class?.sclassName}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-primary" />
                          {format(new Date(schedule.examDate), 'h:mm a')}
                                        </span>
                      </div>
                    </div>
                  </div>
                ))
                    ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">No duty scheduled today</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-xs">View full schedule</Button>
                  </div>
                    )}
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t mt-4">
            <Button className="w-full font-bold shadow-lg shadow-primary/20 group">
              View Exam Calendar
              <Plus className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
};

export default TeacherDashboard;
