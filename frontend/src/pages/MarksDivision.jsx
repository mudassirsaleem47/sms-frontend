import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Award, Plus, Edit, Trash2, TrendingUp, MoreHorizontal } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import API_URL from '@/config/api';
const API_BASE = API_URL;

const MarksDivision = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    divisionName: '',
    percentageFrom: '',
    percentageTo: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchDivisions();
    }
  }, [currentUser]);

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/MarksDivisions/${currentUser._id}`);
      setDivisions(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error fetching divisions', 'error');
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
        school: currentUser._id
      };

      if (editingDivision) {
        await axios.put(`${API_BASE}/MarksDivision/${editingDivision._id}`, payload);
        showToast('Division updated successfully!', 'success');
      } else {
        await axios.post(`${API_BASE}/MarksDivisionCreate`, payload);
        showToast('Division created successfully!', 'success');
      }
      
      resetForm();
      fetchDivisions();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving division', 'error');
    }
  };

  const handleEdit = (division) => {
    setEditingDivision(division);
    setFormData({
      divisionName: division.divisionName,
      percentageFrom: division.percentageFrom.toString(),
      percentageTo: division.percentageTo.toString()
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
      await axios.delete(`${API_BASE}/MarksDivision/${itemToDelete}`);
      showToast('Division deleted successfully!', 'success');
      fetchDivisions();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting division', 'error');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      divisionName: '',
      percentageFrom: '',
      percentageTo: ''
    });
    setEditingDivision(null);
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Marks Division Configuration</h1>
        <p className="text-muted-foreground">Configure division system based on percentage</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Division System</CardTitle>
            <CardDescription>Set up division criteria to classify student performance.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
              if (!open) resetForm();
              setIsDialogOpen(open);
          }}>
              <DialogTrigger asChild>
                  <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Division
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                      <DialogTitle>{editingDivision ? 'Edit Division' : 'Add New Division'}</DialogTitle>
                      <DialogDescription>
                          {editingDivision ? 'Update details for this division.' : 'Define a new division range.'}
                      </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                          <Label htmlFor="divisionName">Division Name *</Label>
                          <Input
                              id="divisionName"
                              name="divisionName"
                              value={formData.divisionName}
                              onChange={handleInputChange}
                              placeholder="e.g., 1st, 2nd, 3rd"
                              required
                          />
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
                                  placeholder="e.g., 60"
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

                      <div className="rounded-md bg-blue-50 p-4 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>Example:</strong> 1st Division: 60% - 100%, 2nd Division: 45% - 59%, 3rd Division: 33% - 44%
                        </p>
                      </div>
                  </div>

                  <DialogFooter>
                       <Button variant="outline" onClick={resetForm} type="button">Cancel</Button>
                       <Button onClick={handleSubmit} type="submit">{editingDivision ? 'Update Division' : 'Add Division'}</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {divisions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
                <Award className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-lg font-medium">No divisions configured</p>
                <p className="text-sm">Set up division criteria to classify student performance.</p>
            </div>
          ) : (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Division Name</TableHead>
                            <TableHead>Percentage Range</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {divisions.map((division) => (
                            <TableRow key={division._id}>
                                <TableCell className="font-medium">
                                    {division.divisionName}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        <span>{division.percentageFrom}% - {division.percentageTo}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEdit(division)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(division._id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
              This action cannot be undone. This will permanently delete the division configuration.
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

export default MarksDivision;

