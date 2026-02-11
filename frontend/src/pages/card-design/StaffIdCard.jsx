import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import {
    Printer, Loader2, Search, Briefcase,
    LayoutTemplate, UserCog, User, Check
} from 'lucide-react';
import API_URL from '../../config/api';
import CardRenderer from './CardRenderer';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";

const StaffIdCard = () => {
    const [loading, setLoading] = useState(false);
    const [staffType, setStaffType] = useState('all');
    const [staffList, setStaffList] = useState([]);
    const [schoolInfo, setSchoolInfo] = useState(null);
    
    // Template State
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const schoolId = user?.schoolName ? user._id : user?.school; 
    const componentRef = useRef();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await axios.get(`${API_URL}/CardTemplate/${schoolId}`);
            const staffTemplates = res.data.filter(t => t.cardType === 'staff');
            setTemplates(staffTemplates);
            if (staffTemplates.length > 0) {
                setSelectedTemplate(staffTemplates[0]);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    };

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/Card/Staff/${schoolId}/${staffType}`);
            setSchoolInfo(response.data.school);
            setStaffList(response.data.staffList);
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Staff_ID_Cards`,
    });

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff ID Cards</h1>
                        <p className="text-muted-foreground mt-1">Generate professional ID cards for your team</p>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <Card className="mb-8 border-border shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <UserCog className="w-5 h-5 text-primary" />
                        Card Configuration
                    </CardTitle>
                    <CardDescription>Select staff role and template to generate cards</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row items-end gap-6">

                        {/* Template Selector */}
                        <div className="w-full lg:w-1/3 space-y-2">
                            <Label htmlFor="template-select" className="text-xs font-semibold uppercase text-muted-foreground">Template</Label>
                            {templates.length > 0 ? (
                                <Select
                                    value={selectedTemplate?._id || ''}
                                    onValueChange={(val) => setSelectedTemplate(templates.find(t => t._id === val))}
                                >
                                    <SelectTrigger id="template-select" className="bg-background">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <LayoutTemplate className="w-4 h-4" />
                                            <SelectValue placeholder="Select Template">
                                                <span className="text-foreground">{selectedTemplate?.name || "Select Template"}</span>
                                            </SelectValue>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates.map(t => (
                                            <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                    <div className="h-10 flex items-center px-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                        No Templates Found
                                </div>
                            )}
                        </div>

                        {/* Staff Type Selector */}
                        <div className="w-full lg:w-1/3 space-y-2">
                            <Label htmlFor="staff-type" className="text-xs font-semibold uppercase text-muted-foreground">Staff Role</Label>
                            <Select
                                value={staffType} 
                                onValueChange={setStaffType}
                            >
                                <SelectTrigger id="staff-type" className="bg-background">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <UserCog className="w-4 h-4" />
                                        <SelectValue placeholder="All Staff">
                                            <span className="text-foreground">
                                                {staffType === 'all' ? 'All Staff' :
                                                    staffType === 'teacher' ? 'Teachers' : 'Non-Teaching Staff'}
                                            </span>
                                        </SelectValue>
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Staff</SelectItem>
                                    <SelectItem value="teacher">Teachers</SelectItem>
                                    <SelectItem value="staff">Non-Teaching Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 w-full lg:w-1/3">
                            <Button 
                                onClick={fetchStaff}
                                disabled={loading}
                                className="flex-1"
                                size="lg"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                                Generate Cards
                            </Button>

                            {staffList.length > 0 && (
                                <Button 
                                    onClick={handlePrint}
                                    variant="outline"
                                    size="lg"
                                    className="flex-1"
                                >
                                    <Printer className="w-4 h-4 mr-2" /> Print
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Area */}
            {staffList.length > 0 ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
                    <Card className="border-border shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">Generated Cards</CardTitle>
                                    <CardDescription>
                                        Found {staffList.length} staff members ready for printing
                                    </CardDescription>
                                </div>
                                {selectedTemplate && (
                                    <Badge variant="secondary" className="font-normal">
                                        Template: {selectedTemplate.name}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-muted/10 min-h-[500px]">
                            {/* Printable Area - Centered Preview */}
                            <div className="p-8 md:p-12 overflow-x-auto flex justify-center">
                                <div ref={componentRef} className="bg-white p-8 shadow-sm border border-border/50 min-w-[210mm] min-h-[297mm]">
                                    {selectedTemplate ? (
                                        <div className="flex flex-wrap gap-8 justify-center print:justify-start">
                                            <style>
                                                {`
                                                    @media print {
                                                        @page { margin: 10mm; size: auto; }
                                                        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                                                        .print-container { gap: 10px; }
                                                    }
                                                `}
                                            </style>
                                            {staffList.map((staff) => (
                                                <div key={staff._id} className="print:break-inside-avoid mb-4 transition-all hover:scale-[1.02] hover:shadow-xl duration-300 cursor-pointer">
                                                    <CardRenderer
                                                        template={selectedTemplate}
                                                        data={staff}
                                                        schoolData={schoolInfo}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
                                                <LayoutTemplate className="w-12 h-12 mb-4 opacity-20" />
                                                <p className="font-medium text-lg">Select a template to view cards</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                    <Card className="border-dashed shadow-none bg-muted/30">
                        <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                                <Briefcase className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Select a staff role from the configuration panel above to start generating ID cards.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default StaffIdCard;
