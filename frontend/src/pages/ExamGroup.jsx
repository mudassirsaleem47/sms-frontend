import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { BookOpen, Plus, Edit, Trash2, Calendar, FileText, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const API_BASE = import.meta.env.VITE_API_URL;

const ExamGroup = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    groupName: '',
    academicYear: new Date().getFullYear().toString(),
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    if (currentUser) {
      fetchGroups();
    }
  }, [currentUser]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/ExamGroups/${currentUser._id}`);
      setGroups(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam groups:", error);
      showToast(error.response?.data?.message || 'Error fetching exam groups', 'error');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!formData.groupName || !formData.academicYear || !formData.status) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      const payload = { ...formData, school: currentUser._id };

      if (editingGroup) {
        await axios.put(`${API_BASE}/ExamGroup/${editingGroup._id}`, payload);
        showToast('Exam group updated successfully!', 'success');
      } else {
        await axios.post(`${API_BASE}/ExamGroupCreate`, payload);
        showToast('Exam group created successfully!', 'success');
      }
      
      resetForm();
      fetchGroups();
    } catch (error) {
      console.error("Error saving exam group:", error);
      showToast(error.response?.data?.message || 'Error saving exam group', 'error');
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      academicYear: group.academicYear,
      description: group.description || '',
      status: group.status
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`${API_BASE}/ExamGroup/${itemToDelete}`);
      showToast('Exam group deleted successfully!', 'success');
      fetchGroups();
    } catch (error) {
      console.error("Error deleting exam group:", error);
      showToast(error.response?.data?.message || 'Error deleting exam group', 'error');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      groupName: '',
      academicYear: new Date().getFullYear().toString(),
      description: '',
      status: 'Active'
    });
    setEditingGroup(null);
    setIsDialogOpen(false);
  };

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'Active': return 'default'; // varies by theme, often dark
      case 'Inactive': return 'secondary';
      case 'Completed': return 'outline';
      default: return 'secondary';
    }
  };
  
  // Custom styled badges for specific statuses if needed
  const StatusBadge = ({ status }) => {
    let classes = "";
    switch(status) {
        case 'Active': classes = "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"; break;
        case 'Inactive': classes = "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200"; break;
        case 'Completed': classes = "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"; break;
        default: classes = "bg-gray-100 text-gray-800";
    }
    
    return (
        <Badge variant="outline" className={`px-3 py-1 rounded-full ${classes}`}>
            {status}
        </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Exam Groups</h1>
          <p className="text-muted-foreground mt-1">Organize exams by term, semester, or academic year</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            setIsDialogOpen(open);
        }}>
            <DialogTrigger asChild>
                <Button className="shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="mr-2 h-4 w-4" /> Create Exam Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{editingGroup ? 'Edit Exam Group' : 'Create Exam Group'}</DialogTitle>
                    <DialogDescription>
                        {editingGroup ? 'Update the details for this exam group.' : 'Add a new exam group to your academic calendar.'}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="groupName">Group Name *</Label>
                        <Input
                            id="groupName"
                            name="groupName"
                            value={formData.groupName}
                            onChange={handleInputChange}
                            placeholder="e.g., Mid Term 2024, Final Exam"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="academicYear">Academic Year *</Label>
                            <Input
                                id="academicYear"
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleInputChange}
                                placeholder="e.g., 2024"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(value) => handleSelectChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Optional description..."
                            className="resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                     <Button variant="outline" onClick={resetForm} type="button">Cancel</Button>
                     <Button onClick={handleSubmit} type="submit">{editingGroup ? 'Update Group' : 'Create Group'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No exam groups yet</h3>
                <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                    Create your first exam group to start scheduling exams and managing results.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Create First Group
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group._id} className="group hover:shadow-md transition-all duration-200 border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <StatusBadge status={group.status} />
                </div>
                <CardTitle className="mt-4 text-xl">{group.groupName}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{group.academicYear}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 line-clamp-2 min-h-[2.5rem]">
                    {group.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="pt-2 flex gap-2 border-t bg-slate-50/50 px-6 py-4 rounded-b-xl">
                <Button 
                    variant="outline" 
                    className="flex-1 bg-white hover:bg-slate-50 border-slate-200"
                    onClick={() => handleEdit(group)}
                >
                    <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                </Button>
                <Button 
                    variant="ghost" 
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(group._id)}
                >
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the exam group and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamGroup;
