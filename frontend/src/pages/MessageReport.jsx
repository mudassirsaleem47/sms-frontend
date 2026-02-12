import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MessageReport = () => {
    // Placeholder data
    const reports = [
        { id: 1, title: "Exam Schedule Released", recipient: "All Students", type: "SMS", status: "Sent", date: "2024-03-10" },
        { id: 2, title: "Holiday Announcement", recipient: "Staff", type: "Email", status: "Sent", date: "2024-03-08" },
        { id: 3, title: "Fee Reminder", recipient: "Class 10A", type: "SMS", status: "Failed", date: "2024-03-05" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Message Report</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Sent Messages Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">{report.title}</TableCell>
                                    <TableCell>{report.recipient}</TableCell>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={report.status === 'Sent' ? 'default' : 'destructive'}>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{report.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MessageReport;
