import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Loader2, Search, BookOpen, Check } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import API_URL_CENTRAL from '@/config/api';
const API_BASE = API_URL_CENTRAL;

const AssignClassModal = ({ isOpen, onClose, teacher, onAssignSuccess }) => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClasses, setSelectedClasses] = useState([]);

    // Fetch Classes
    useEffect(() => {
        const fetchClasses = async () => {
            if (!isOpen || !currentUser?._id) return;
            
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/Sclasses/${currentUser._id}`);
                setClasses(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching classes:", err);
                showToast("Failed to load classes", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [isOpen, currentUser]);

    // Initialize selected classes when teacher changes
    useEffect(() => {
        if (teacher && teacher.assignedClasses) {
            setSelectedClasses(teacher.assignedClasses.map(c => c._id || c));
        } else {
            setSelectedClasses([]);
        }
    }, [teacher]);

    const handleToggleClass = (classId) => {
        setSelectedClasses(prev => 
            prev.includes(classId) 
                ? prev.filter(id => id !== classId) 
                : [...prev, classId]
        );
    };

    const handleSave = async () => {
        if (!teacher?._id) return;
        
        setSaving(true);
        try {
            const response = await axios.put(`${API_BASE}/Teacher/${teacher._id}`, {
                assignedClasses: selectedClasses
            });
            
            if (response.data) {
                showToast("Classes assigned successfully!", "success");
                onAssignSuccess(response.data.teacher || response.data);
                onClose();
            }
        } catch (err) {
            console.error("Error assigning classes:", err);
            showToast("Failed to assign classes", "error");
        } finally {
            setSaving(false);
        }
    };

    const filteredClasses = classes.filter(c => 
        c.sclassName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        Assign Classes
                    </DialogTitle>
                    <DialogDescription>
                        Select classes to assign to <span className="font-semibold text-foreground">{teacher?.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search classes..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 px-6 py-2">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredClasses.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            {searchQuery ? "No classes match your search." : "No classes found to assign."}
                        </div>
                    ) : (
                        <div className="space-y-1 py-2">
                            {filteredClasses.map((item) => (
                                <label
                                    key={item._id}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:bg-muted/50 ${
                                        selectedClasses.includes(item._id) 
                                            ? "border-primary bg-primary/5 shadow-sm" 
                                            : "border-transparent"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={selectedClasses.includes(item._id)}
                                            onCheckedChange={() => handleToggleClass(item._id)}
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{item.sclassName}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {item.sections?.map((s, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-[10px] h-4 px-1">
                                                        {s.sectionName}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedClasses.includes(item._id) && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </label>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="p-6 pt-2 border-t bg-muted/5">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-muted-foreground">
                            {selectedClasses.length} classes selected
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose} disabled={saving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving || loading}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : "Save Assignments"}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AssignClassModal;

