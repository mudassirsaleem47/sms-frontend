import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Loader2, Clock, User } from 'lucide-react';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import API_URL_CENTRAL from '@/config/api';
const API_BASE = API_URL_CENTRAL;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TeacherSchedule = () => {
    const { currentUser } = useAuth();
    
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [schedule, setSchedule] = useState([]); // Array of days with periods
    const [loading, setLoading] = useState(false);

    // Fetch Teachers
    useEffect(() => {
        const fetchTeachers = async () => {
             if (currentUser?._id) {
                try {
                    const res = await axios.get(`${API_BASE}/Teachers/${currentUser._id}`);
                    setTeachers(Array.isArray(res.data) ? res.data : []);
                } catch(err) { console.error(err); }
             }
        };
        fetchTeachers();
    }, [currentUser]);

    // Fetch Schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedTeacher) return;
            
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/TeacherSchedule/${selectedTeacher}`);
                const rawSchedules = Array.isArray(res.data) ? res.data : [];
                
                // Process raw schedules into a weekly format for the teacher
                // rawSchedules contains multiple class schedules where this teacher appears
                const weeklySchedule = DAYS.map(day => ({ day, periods: [] }));

                rawSchedules.forEach(classSched => {
                    const className = classSched.sclass?.sclassName || "Unknown Class";
                    classSched.days.forEach(dayPlan => {
                        const dayIndex = weeklySchedule.findIndex(d => d.day === dayPlan.day);
                        if (dayIndex !== -1) {
                            dayPlan.periods.forEach(p => {
                                if (p.teacher === selectedTeacher) {
                                    weeklySchedule[dayIndex].periods.push({
                                        ...p,
                                        className,
                                        sectionId: classSched.section // Store section ID if we had name
                                    });
                                }
                            });
                        }
                    });
                });

                // Sort periods by time (simple string sort works for HH:MM usually)
                weeklySchedule.forEach(day => {
                   day.periods.sort((a, b) => a.startTime.localeCompare(b.startTime));
                });

                setSchedule(weeklySchedule);

            } catch (err) {
                console.error(err);
                setSchedule(DAYS.map(day => ({ day, periods: [] })));
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [selectedTeacher]);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Teacher Schedule</h2>
                    <p className="text-muted-foreground mt-2">View weekly timetable for teachers</p>
                </div>
            </div>

            {/* Selection Bar */}
            <Card>
                <CardContent className="p-6">
                    <div className="max-w-md space-y-2">
                        <Label>Select Teacher</Label>
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger>
                                <SelectValue placeholder="-- Select Teacher --" />
                            </SelectTrigger>
                            <SelectContent>
                                {teachers.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

             {/* Timetable Grid */}
             {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                 </div>
             ) : (!selectedTeacher) ? (
                    <div className="flex flex-col items-center justify-center py-20 border rounded-xl bg-muted/10 border-dashed text-center">
                        <User className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-medium">No Teacher Selected</h3>
                        <p className="text-muted-foreground mt-2">Please select a teacher to view their schedule.</p>
                 </div>
             ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                     {schedule.map((dayPlan, index) => (
                         <Card key={index} className="overflow-hidden">
                             <CardHeader className="bg-muted/30 pb-3 border-b">
                                 <CardTitle className="text-base font-semibold text-primary">{dayPlan.day}</CardTitle>
                             </CardHeader>
                             <CardContent className="p-4 min-h-[120px]">
                                 <div className="flex flex-wrap gap-3">
                                     {dayPlan.periods.length === 0 ? (
                                         <div className="flex flex-col items-center justify-center w-full py-6 text-muted-foreground border border-dashed rounded-lg bg-muted/5">
                                             <Clock className="w-8 h-8 opacity-20 mb-2" />
                                             <span className="text-sm">No classes scheduled</span>
                                         </div>
                                     ) : (
                                         dayPlan.periods.map((period, pIndex) => (
                                             <div key={pIndex} className="bg-card border rounded-lg p-3 w-56 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                                                 <Badge variant="secondary" className="mb-2 font-mono text-xs">
                                                     {period.startTime} - {period.endTime}
                                                 </Badge>
                                                 <div className="font-bold text-sm line-clamp-1 mb-1">{period.subject?.subName || "Subject"}</div>
                                                 <div className="text-xs text-muted-foreground">
                                                     Class: <span className="font-medium text-foreground">{period.className}</span>
                                                 </div>
                                             </div>
                                         ))
                                     )}
                                 </div>
                             </CardContent>
                         </Card>
                     ))}
                 </div>
             )}
         </div>
    );
};

export default TeacherSchedule;

