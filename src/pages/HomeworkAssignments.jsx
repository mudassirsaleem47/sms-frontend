import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '@/config/api';
import { BookOpenCheck, CalendarDays, Plus, Pencil, Trash2, Loader2, ClipboardList } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_BASE = API_URL;

const initialForm = {
  title: '',
  subject: '',
  classId: '',
  section: '',
  dueDate: '',
  description: '',
  status: 'Assigned'
};

const HomeworkAssignments = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const schoolId = currentUser?.school?._id || currentUser?.school || currentUser?._id;
  const campusId = currentUser?.campus?._id || currentUser?.campus || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homework, setHomework] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedClass, setSelectedClass] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchClasses = async () => {
    if (!schoolId) return;
    try {
      const res = await axios.get(`${API_BASE}/Sclasses/${schoolId}`);
      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      showToast('Failed to load classes', 'error');
    }
  };

  const fetchHomework = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const query = selectedClass !== 'all' ? `?classId=${selectedClass}` : '';
      const res = await axios.get(`${API_BASE}/Homework/${schoolId}${query}`);
      setHomework(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      showToast('Failed to load homework', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [schoolId]);

  useEffect(() => {
    fetchHomework();
  }, [schoolId, selectedClass]);

  const summary = useMemo(() => {
    const now = new Date();
    const total = homework.length;
    const dueToday = homework.filter(item => format(new Date(item.dueDate), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')).length;
    const overdue = homework.filter(item => new Date(item.dueDate) < now && item.status === 'Assigned').length;
    return { total, dueToday, overdue };
  }, [homework]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingItem(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      subject: item.subject || '',
      classId: item.classId?._id || item.classId || '',
      section: item.section || '',
      dueDate: item.dueDate ? format(new Date(item.dueDate), 'yyyy-MM-dd') : '',
      description: item.description || '',
      status: item.status || 'Assigned'
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.subject || !form.classId || !form.dueDate) {
      showToast('Title, subject, class and due date are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        schoolId,
        campus: campusId || undefined,
        createdBy: currentUser?._id,
        createdByModel: currentUser?.userType === 'teacher' ? 'teacher' : (currentUser?.userType === 'admin' ? 'admin' : 'staff')
      };

      if (editingItem?._id) {
        await axios.put(`${API_BASE}/Homework/${editingItem._id}`, payload);
        showToast('Homework updated successfully', 'success');
      } else {
        await axios.post(`${API_BASE}/Homework`, payload);
        showToast('Homework created successfully', 'success');
      }

      setDialogOpen(false);
      resetForm();
      fetchHomework();
    } catch (error) {
      showToast('Failed to save homework', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const ok = window.confirm('Delete this homework assignment?');
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE}/Homework/${item._id}`);
      showToast('Homework deleted', 'success');
      fetchHomework();
    } catch (error) {
      showToast('Failed to delete homework', 'error');
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-2 md:p-6 md:pt-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Homework & Assignments</h2>
          <p className="text-sm text-muted-foreground">Create and manage class-wise daily assignments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c._id} value={c._id}>{c.sclassName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{summary.dueToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{summary.overdue}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4 text-primary" />
            Assignment List
          </CardTitle>
          <CardDescription>Newest and urgent work appears first.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading assignments...
            </div>
          ) : homework.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
              <BookOpenCheck className="h-8 w-8" />
              <p className="font-medium">No assignments found</p>
              <p className="text-sm">Create your first homework assignment to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {homework.map((item) => {
                const due = new Date(item.dueDate);
                const isOverdue = due < new Date() && item.status === 'Assigned';
                return (
                  <div key={item._id} className="rounded-xl border border-border/70 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold leading-none">{item.title}</h3>
                          <Badge variant={isOverdue ? 'destructive' : 'secondary'}>
                            {isOverdue ? 'Overdue' : item.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{item.subject}</span>
                          <span className="mx-2">•</span>
                          <span>{item.classId?.sclassName || 'Class not found'}</span>
                          {item.section ? <span className="mx-2">• Section {item.section}</span> : null}
                        </div>
                        {item.description ? (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        ) : null}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Due {format(due, 'PPP')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-start">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(item)} className="gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item)} className="gap-1.5">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Homework' : 'Create Homework'}</DialogTitle>
            <DialogDescription>
              Set assignment details and due date for the selected class.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Worksheet 4 - Fractions" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))} placeholder="Mathematics" />
              </div>
              <div className="grid gap-2">
                <Label>Class</Label>
                <Select value={form.classId} onValueChange={(value) => setForm(prev => ({ ...prev, classId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.sclassName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="section">Section (Optional)</Label>
                <Input id="section" value={form.section} onChange={(e) => setForm(prev => ({ ...prev, section: e.target.value }))} placeholder="A" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Add instructions for students" />
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeworkAssignments;