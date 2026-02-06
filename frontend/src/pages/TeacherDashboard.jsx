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
  GraduationCap
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

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
        avgAttendance: 0,
        avgPerformance: 0 
      });

      setLoading(false);
    } catch (error) {
      toast.error('Error fetching dashboard data');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Teacher'}. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border text-sm font-medium">
          <Clock className="w-4 h-4 text-primary" />
          <span>{format(currentTime, 'EEEE, MMM do, h:mm a')}</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            </div>
        </div>
      ) : (
        <>
          {/* Hero / Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-emerald-50">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-emerald-100/70 mt-1">Under your supervision</p>
              </CardContent>
            </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Classes</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClasses}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active classes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Class Size</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalClasses > 0 ? Math.round(stats.totalStudents / stats.totalClasses) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Students per class</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Subject</CardTitle>
                  <GraduationCap className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold truncate text-base pt-1" title={currentUser?.subject}>
                    {currentUser?.subject || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Primary subject</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Assigned Classes List */}
              <Card className="col-span-2 md:col-span-2">
                <CardHeader>
                  <CardTitle>My Classes</CardTitle>
                  <CardDescription>Overview of classes you are teaching.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {currentUser?.assignedClasses && currentUser.assignedClasses.length > 0 ? (
                      currentUser.assignedClasses.map((cls, index) => {
                        const classStudents = students.filter(s => s.sclassName?._id === cls._id);
                        return (
                                      <div key={index} className="flex flex-col p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                                            <BookOpen className="w-4 h-4" />
                                          </div>
                                          <span className="font-semibold text-lg">{cls.sclassName}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-auto pt-2 border-t flex justify-between">
                                          <span>Students</span>
                                          <Badge variant="secondary">{classStudents.length}</Badge>
                                        </div>
                                      </div>
                                  )
                                })
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <BookOpen className="h-10 w-10 mb-2 opacity-20" />
                        <p>No classes assigned yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule / Exams */}
              <Card className="col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Today's Exams</CardTitle>
                  <CardDescription>Scheduled assessments for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {examSchedules.length > 0 ? (
                      examSchedules.map((schedule, index) => (
                                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg border bg-muted/20">
                                    <div className="flex flex-col items-center justify-center bg-background border rounded-md h-12 w-12 shrink-0">
                                      <span className="text-xs font-bold text-muted-foreground uppercase">
                                        {format(new Date(schedule.examDate), 'MMM')}
                                      </span>
                                      <span className="text-lg font-bold">
                                        {format(new Date(schedule.examDate), 'dd')}
                                      </span>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                      <p className="text-sm font-medium leading-none">{schedule.subject}</p>
                                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                                        <Badge variant="outline" className="text-[10px] h-4 px-1">{schedule.class?.sclassName}</Badge>
                                        <span className="flex items-center">
                                          <Clock className="mr-1 h-3 w-3" />
                                          {format(new Date(schedule.examDate), 'h:mm a')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                        <Calendar className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">No exams scheduled for today</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
