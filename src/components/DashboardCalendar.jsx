import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EventFormModal from './form-popup/EventFormModal';
import API_URL from '../config/api';

const DashboardCalendar = () => {
    const { currentUser } = useAuth();
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchEvents();
        }
    }, [currentUser]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const schoolId = currentUser.school?._id || currentUser.school || currentUser._id;
            // Handle different user types API endpoints if needed, but assuming /Events/:id works
            const response = await axios.get(`${API_URL}/Events/${currentUser._id}`);
            setEvents(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedDateEvents = events.filter(event => {
        if (!event.eventFrom || !date) return false;
        const eventDate = new Date(event.eventFrom);
        return isSameDay(eventDate, date);
    });

    // Create a generic modifier for days with events
    const eventDays = events.map(event => new Date(event.eventFrom));

    return (
        <>
            <Card className="h-full flex flex-col shadow-sm">
                <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        School Calendar
                    </CardTitle>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setShowEventForm(true)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0 grid md:grid-cols-2 divide-x divide-border/50">
                    <div className="p-3 flex justify-center items-start">
                         <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => d && setDate(d)}
                            className="rounded-md border-0 w-full"
                            modifiers={{ hasEvent: eventDays }}
                            modifiersClassNames={{
                                hasEvent: "font-bold text-primary underline decoration-primary/50 decoration-2 underline-offset-4"
                            }}
                        />
                    </div>
                    
                    <div className="flex flex-col h-full min-h-[300px] md:min-h-[auto]">
                        <div className="p-3 border-b bg-muted/20">
                            <h4 className="font-medium text-sm">
                                {format(date, 'EEEE, MMMM do, yyyy')}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {selectedDateEvents.length} events scheduled
                            </p>
                        </div>
                        
                        <ScrollArea className="flex-1 p-3 h-[300px]">
                            {loading ? (
                                <div className="space-y-3">
                                    {[1,2,3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />)}
                                </div>
                            ) : selectedDateEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedDateEvents.map((event, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-3 rounded-lg border bg-card hover:shadow-sm transition-all border-l-4"
                                            style={{ borderLeftColor: event.eventColor || '#3b82f6' }}
                                        >
                                            <h5 className="font-semibold text-sm line-clamp-1">{event.eventTitle || event.eventName}</h5>
                                            {event.description && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
                                                    <Clock className="h-3 w-3" />
                                                    {event.eventFrom ? format(new Date(event.eventFrom), 'h:mm a') : 'All Day'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground/50">
                                    <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                                        <CalendarIcon className="h-5 w-5 opacity-50" />
                                    </div>
                                    <p className="text-sm">No events for this day</p>
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="h-auto p-0 mt-2 text-primary"
                                        onClick={() => setShowEventForm(true)}
                                    >
                                        Add Event
                                    </Button>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>

            {showEventForm && (
                <EventFormModal
                    isOpen={showEventForm}
                    onClose={() => {
                        setShowEventForm(false);
                        fetchEvents(); // Refresh after add
                    }}
                    selectedDate={date}
                />
            )}
        </>
    );
};

export default DashboardCalendar;
