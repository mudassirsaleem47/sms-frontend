import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Phone,
    PhoneIncoming,
    PhoneOutgoing,
    Calendar,
    Clock,
    FileText,
    AlertCircle,
    User,
    Check
} from 'lucide-react';

const PhoneCallModal = ({ isOpen, onClose, onSubmit, initialData = null, viewMode = false }) => {

    // Form state
    const [formData, setFormData] = useState({
        callerName: '',
        phone: '',
        callType: 'Incoming',
        callDate: '',
        callTime: '',
        purpose: '',
        callDuration: '',
        followUpRequired: false,
        followUpDate: '',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                callerName: initialData.callerName || '',
                phone: initialData.phone || '',
                callType: initialData.callType || 'Incoming',
                callDate: initialData.callDate ? new Date(initialData.callDate).toISOString().split('T')[0] : '',
                callTime: initialData.callTime || '',
                purpose: initialData.purpose || '',
                callDuration: initialData.callDuration || '',
                followUpRequired: initialData.followUpRequired || false,
                followUpDate: initialData.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : '',
                notes: initialData.notes || ''
            });
        } else {
            // Reset form for new entry
            setFormData({
                callerName: '',
                phone: '',
                callType: 'Incoming',
                callDate: new Date().toISOString().split('T')[0],
                callTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                purpose: '',
                callDuration: '',
                followUpRequired: false,
                followUpDate: '',
                notes: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Specific handler for Checkbox component
    const handleCheckboxChange = (checked) => {
        setFormData(prev => ({ ...prev, followUpRequired: checked }));
    };

    // Specific handler for RadioGroup
    const handleRadioChange = (value) => {
        setFormData(prev => ({ ...prev, callType: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>
                        {viewMode ? 'View Phone Call Details' : (initialData ? 'Edit Phone Call' : 'Add Phone Call')}
                    </DialogTitle>
                    <DialogDescription>
                        {viewMode
                            ? 'Details of the selected phone call record.'
                            : 'Enter the details of the phone call below.'}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    {viewMode ? (
                        /* VIEW MODE */
                        <div className="grid gap-6">

                            {/* Call Information */}
                            <div className="space-y-4 rounded-lg border p-4 bg-muted/40">
                                <h4 className="flex items-center gap-2 font-semibold text-primary">
                                    <Phone size={18} /> Call Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-muted-foreground">Caller Name:</span> <span className="font-medium ml-1">{formData.callerName}</span></div>
                                    <div><span className="text-muted-foreground">Phone Number:</span> <span className="font-medium ml-1">{formData.phone}</span></div>
                                    <div>
                                        <span className="text-muted-foreground">Call Type:</span>
                                        <Badge variant={formData.callType === 'Incoming' ? "success" : "default"} className="ml-2 gap-1">
                                            {formData.callType === 'Incoming' ? <PhoneIncoming size={12} /> : <PhoneOutgoing size={12} />}
                                            {formData.callType}
                                        </Badge>
                                    </div>
                                    <div><span className="text-muted-foreground">Duration:</span> <span className="font-medium ml-1">{formData.callDuration || '-'}</span></div>
                                </div>
                            </div>

                            {/* Schedule & Purpose */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 rounded-lg border p-4 bg-muted/40">
                                    <h4 className="flex items-center gap-2 font-semibold text-primary">
                                        <Clock size={18} /> Time & Date
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="text-muted-foreground">Date:</span> <span className="font-medium ml-1">{new Date(formData.callDate).toLocaleDateString()}</span></div>
                                        <div><span className="text-muted-foreground">Time:</span> <span className="font-medium ml-1">{formData.callTime}</span></div>
                                    </div>
                                </div>
                                <div className="space-y-4 rounded-lg border p-4 bg-muted/40">
                                    <h4 className="flex items-center gap-2 font-semibold text-primary">
                                        <FileText size={18} /> Purpose
                                    </h4>
                                    <p className="text-sm">{formData.purpose || 'No purpose recorded.'}</p>
                                </div>
                            </div>

                            {/* Follow-up & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formData.followUpRequired && (
                                    <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                        <h4 className="flex items-center gap-2 font-semibold text-amber-800">
                                            <AlertCircle size={18} /> Follow-up Required
                                        </h4>
                                        <div className="text-sm text-amber-900">
                                            <span className="font-medium">Date:</span> {new Date(formData.followUpDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                                {formData.notes && (
                                    <div className={`space-y-4 rounded-lg border p-4 bg-muted/40 ${!formData.followUpRequired ? 'col-span-2' : ''}`}>
                                        <h4 className="flex items-center gap-2 font-semibold text-primary">
                                            <FileText size={18} /> Additional Notes
                                        </h4>
                                        <p className="text-sm">{formData.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                            /* EDIT/ADD FORM */
                            <form id="phonecall-form" onSubmit={handleSubmit} className="grid gap-5 py-4">
                            
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="callerName">Caller Name *</Label>
                                        <Input
                                            id="callerName"
                                            name="callerName"
                                            value={formData.callerName}
                                            onChange={handleChange} 
                                            placeholder="Enter caller name" 
                                            required 
                                    />
                                </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            name="phone" 
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange} 
                                            placeholder="Enter phone number" 
                                            required 
                                    />
                                </div>
                            </div>

                                {/* Row 2: Call Type */}
                                <div className="space-y-3">
                                    <Label>Call Type *</Label>
                                    <RadioGroup
                                        value={formData.callType}
                                        onValueChange={handleRadioChange}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Incoming" id="incoming" />
                                            <Label htmlFor="incoming" className="cursor-pointer flex items-center gap-1.5 font-normal">
                                                <PhoneIncoming size={16} className="text-green-600" /> Incoming
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Outgoing" id="outgoing" />
                                            <Label htmlFor="outgoing" className="cursor-pointer flex items-center gap-1.5 font-normal">
                                                <PhoneOutgoing size={16} className="text-blue-600" /> Outgoing
                                            </Label>
                                        </div>
                                    </RadioGroup>
                            </div>

                                {/* Row 3: Date, Time, Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="callDate">Call Date *</Label>
                                        <Input
                                            id="callDate"
                                            name="callDate" 
                                            type="date" 
                                            value={formData.callDate}
                                            onChange={handleChange}
                                            required 
                                    />
                                </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="callTime">Call Time *</Label>
                                        <Input
                                            id="callTime"
                                            name="callTime" 
                                            type="time" 
                                            value={formData.callTime}
                                            onChange={handleChange}
                                            required 
                                    />
                                </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="callDuration">Duration</Label>
                                        <Input
                                            id="callDuration"
                                            name="callDuration"
                                            value={formData.callDuration}
                                            onChange={handleChange} 
                                            placeholder="e.g. 5 mins" 
                                    />
                                </div>
                            </div>

                            {/* Row 4: Purpose */}
                                <div className="space-y-2">
                                    <Label htmlFor="purpose">Purpose</Label>
                                    <Textarea
                                        id="purpose"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange} 
                                    placeholder="Enter purpose of call"
                                        className="resize-none"
                                        rows={2}
                                />
                            </div>

                                {/* Row 5: Follow-up */}
                                <div className="flex flex-col space-y-4 rounded-lg border p-4 bg-muted/20">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="followUpRequired"
                                            checked={formData.followUpRequired}
                                            onCheckedChange={handleCheckboxChange}
                                        />
                                        <Label htmlFor="followUpRequired" className="font-medium cursor-pointer">
                                            Follow-up Required
                                        </Label>
                                    </div>

                                    {formData.followUpRequired && (
                                        <div className="pl-6 animate-fade-in-down">
                                            <Label htmlFor="followUpDate" className="mb-1.5 block">Follow-up Date</Label>
                                            <Input
                                                id="followUpDate"
                                                name="followUpDate" 
                                                type="date" 
                                                value={formData.followUpDate}
                                                onChange={handleChange}
                                                className="w-full md:w-1/2"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Row 6: Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Additional Notes</Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange} 
                                    placeholder="Any additional notes..."
                                        className="resize-none"
                                        rows={3}
                                />
                                </div>

                        </form>
                    )}
                </ScrollArea>

                <DialogFooter className="p-6 border-t bg-gray-50/50">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {!viewMode && (
                        <Button type="submit" form="phonecall-form">
                            {initialData ? 'Update Call' : 'Save Call'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PhoneCallModal;
