import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import DashboardCalendar from './DashboardCalendar';

const CalendarDialog = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>School Calendar</DialogTitle>
                </DialogHeader>
                <div className="p-4 h-[600px] bg-muted/20">
                    <DashboardCalendar />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CalendarDialog;
