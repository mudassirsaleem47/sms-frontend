import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Award, Plus, Edit, Trash2, TrendingUp, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const API_BASE = import.meta.env.VITE_API_URL;

const MarksGrade = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    gradeName: '',
    percentageFrom: '',
    percentageTo: '',
    gradePoint: '',
    remarks: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchGrades();
    }
  }, [currentUser]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/MarksGrades/${currentUser._id}`);
      setGrades(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error fetching grades', 'error');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        percentageFrom: parseFloat(formData.percentageFrom),
        percentageTo: parseFloat(formData.percentageTo),
        gradePoint: parseFloat(formData.gradePoint),
        school: currentUser._id
      };

      if (editingGrade) {
        await axios.put(`${API_BASE}/MarksGrade/${editingGrade._id}`, payload);
        showToast('Grade updated successfully!', 'success');
      } else {
        await axios.post(`${API_BASE}/MarksGradeCreate`, payload);
        showToast('Grade created successfully!', 'success');
      }
      
      resetForm();
      fetchGrades();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving grade', 'error');
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      gradeName: grade.gradeName,
      percentageFrom: grade.percentageFrom.toString(),
      percentageTo: grade.percentageTo.toString(),
      gradePoint: grade.gradePoint.toString(),
      remarks: grade.remarks || ''
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
          await axios.delete(`${API_BASE}/MarksGrade/${itemToDelete}`);
        showToast('Grade deleted successfully!', 'success');
        fetchGrades();
        } catch (error) {
        showToast(error.response?.data?.message || 'Error deleting grade', 'error');
        }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      gradeName: '',
      percentageFrom: '',
      percentageTo: '',
      gradePoint: '',
      remarks: ''
    });
    setEditingGrade(null);
    setIsDialogOpen(false);
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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Marks Grade Configuration</h1>
        <p className="text-muted-foreground">Configure grading system with percentage ranges</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Grade System</CardTitle>
            <CardDescription>Manage your grading scale and points.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
              if (!open) resetForm();
              setIsDialogOpen(open);
          }}>
              <DialogTrigger asChild>
                  <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Grade
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                      <DialogTitle>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
                      <DialogDescription>
                          {editingGrade ? 'Update the details for this grade level.' : 'Define a new grade level for student evaluation.'}
                      </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="gradeName">Grade Name *</Label>
                              <Input
                                  id="gradeName"
                                  name="gradeName"
                                  value={formData.gradeName}
                                  onChange={handleInputChange}
                                  placeholder="e.g., A+"
                                  required
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="gradePoint">Grade Point *</Label>
                              <Input
                                  id="gradePoint"
                                  name="gradePoint"
                                  type="number"
                                  value={formData.gradePoint}
                                  onChange={handleInputChange}
                                  step="0.01"
                                  placeholder="e.g., 4.0"
                                  required
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="percentageFrom">Percentage From *</Label>
                              <Input
                                  id="percentageFrom"
                                  name="percentageFrom"
                                  type="number"
                                  value={formData.percentageFrom}
                                  onChange={handleInputChange}
                                  min="0"
                                  max="100"
                                  placeholder="e.g., 90"
                                  required
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="percentageTo">Percentage To *</Label>
                              <Input
                                  id="percentageTo"
                                  name="percentageTo"
                                  type="number"
                                  value={formData.percentageTo}
                                  onChange={handleInputChange}
                                  min="0"
                                  max="100"
                                  placeholder="e.g., 100"
                                  required
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <Label htmlFor="remarks">Remarks</Label>
                          <Input
                              id="remarks"
                              name="remarks"
                              value={formData.remarks}
                              onChange={handleInputChange}
                              placeholder="e.g., Excellent, Good"
                          />
                      </div>
                  </div>

                  <DialogFooter>
                       <Button variant="outline" onClick={resetForm} type="button">Cancel</Button>
                       <Button onClick={handleSubmit} type="submit">{editingGrade ? 'Update Grade' : 'Add Grade'}</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
                <Award className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-lg font-medium">No grades configured</p>
                <p className="text-sm">Set up your grading system to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Grade</TableHead>
                            <TableHead>Percentage Range</TableHead>
                            <TableHead>Grade Point</TableHead>
                            <TableHead>Remarks</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grades.map((grade) => (
                            <TableRow key={grade._id}>
                                <TableCell>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-lg">
                                        {grade.gradeName}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        <span>{grade.percentageFrom}% - {grade.percentageTo}%</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="text-sm">
                                        {grade.gradePoint}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {grade.remarks || '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(grade)}>
                                            <Edit className="h-4 w-4 text-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(grade._id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the grade configuration.
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

export default MarksGrade;
