import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  FileText,
  Filter,
  X,
  CreditCard,
  Banknote,
  Wallet,
  Building2,
  Search,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
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
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_URL;

const IncomeManagement = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [statistics, setStatistics] = useState({
    totalIncome: { amount: 0, count: 0 },
    todayIncome: { amount: 0, count: 0 },
    monthlyIncome: { amount: 0, count: 0 },
    categoryBreakdown: []
  });
  
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  
  // Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  // Delete Alert State
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Fee Collection',
    description: '',
    date: new Date().toISOString(),
    paymentMethod: 'Cash',
    reference: ''
  });

  const incomeCategories = ['Fee Collection', 'Donations', 'Grants', 'Events', 'Other Income'];
  const paymentMethods = ['Cash', 'Bank Transfer', 'Cheque', 'Online', 'Other'];

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, entriesRes] = await Promise.all([
        axios.get(`${API_BASE}/IncomeStatistics/${currentUser._id}`),
        axios.get(`${API_BASE}/Income/${currentUser._id}`)
      ]);

      setStatistics(statsRes.data);
      setIncomeEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Income Management Error:', error);
      showToast(error.response?.data?.message || 'Error fetching data', 'error');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (!formData.amount || !formData.date || !formData.category) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        school: currentUser._id,
        createdBy: currentUser._id
      };

      if (editingIncome) {
        await axios.put(`${API_BASE}/Income/${editingIncome._id}`, payload);
        showToast('Income updated successfully!', 'success');
      } else {
        await axios.post(`${API_BASE}/IncomeCreate`, payload);
        showToast('Income added successfully!', 'success');
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving income', 'error');
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      amount: income.amount.toString(),
      category: income.category,
      description: income.description,
      date: income.date || new Date().toISOString(),
      paymentMethod: income.paymentMethod,
      reference: income.reference || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_BASE}/Income/${deleteId}`);
      showToast('Income deleted successfully!', 'success');
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting income', 'error');
    }
    setIsDeleteAlertOpen(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      category: 'Fee Collection',
      description: '',
      date: new Date().toISOString(),
      paymentMethod: 'Cash',
      reference: ''
    });
    setEditingIncome(null);
    setIsDialogOpen(false);
  };

  const handleViewDetails = (income) => {
    setSelectedIncome(income);
    setIsSheetOpen(true);
  };

  const filteredEntries = incomeEntries.filter(entry => {
    const matchesCategory = filterCategory === "all" || entry.category === filterCategory;
    const matchesSearch = 
        entry.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.amount.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const getPaymentIcon = (method) => {
    switch(method) {
        case 'Cash': return <Banknote className="h-4 w-4" />;
        case 'Online': return <CreditCard className="h-4 w-4" />;
        case 'Bank Transfer': return <Building2 className="h-4 w-4" />;
        case 'Cheque': return <FileText className="h-4 w-4" />;
        default: return <Wallet className="h-4 w-4" />;
    }
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
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Income Management</h1>
                <p className="text-muted-foreground">Track and manage all income sources for your school</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) resetForm();
                setIsDialogOpen(open);
            }}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Income
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingIncome ? 'Edit Income' : 'Add New Income'}</DialogTitle>
                        <DialogDescription>
                            {editingIncome ? 'Update the details of this income entry.' : 'Record a new income entry for your school.'}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">Rs.</span>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="pl-9"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select 
                                    value={formData.category} 
                                    onValueChange={(value) => handleSelectChange('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectGroup>
                                        <SelectLabel>Income Categories</SelectLabel>
                                        {incomeCategories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                       </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paymentMethod">Payment Method *</Label>
                                <Select 
                                    value={formData.paymentMethod} 
                                    onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentMethods.map(method => (
                                            <SelectItem key={method} value={method}>{method}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter details regarding this income..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reference">Reference ID (Optional)</Label>
                            <Input
                                id="reference"
                                name="reference"
                                value={formData.reference}
                                onChange={handleInputChange}
                                placeholder="Receipt No, Transaction ID, etc."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                         <Button variant="outline" onClick={resetForm} type="button">Cancel</Button>
                         <Button onClick={handleSubmit} type="submit">{editingIncome ? 'Save Changes' : 'Create Entry'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Total Income</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-200 dark:bg-emerald-900/40 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">Rs. {statistics.totalIncome.amount.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              {statistics.totalIncome.count} total transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400">Today's Income</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-900/40 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">Rs. {statistics.todayIncome.amount.toLocaleString()}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {statistics.todayIncome.count} transactions today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-400">Monthly Income</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-200 dark:bg-purple-900/40 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-700 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">Rs. {statistics.monthlyIncome.amount.toLocaleString()}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {statistics.monthlyIncome.count} transactions this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                <div>
                    <CardTitle>Income Entries</CardTitle>
                    <CardDescription>A detailed list of all income transactions.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {incomeCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-foreground">No income found</p>
                    <p className="text-sm max-w-sm mx-auto mt-1">
                        Try adjusting your filters or search query. Or create a new income entry.
                    </p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                      <TableHead>Date/Time</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="w-[300px]">Description</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEntries.map((income) => (
                                <TableRow key={income._id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        {format(new Date(income.date), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal capitalize">
                                            {income.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div 
                                            className="font-medium text-foreground hover:underline cursor-pointer truncate max-w-[280px]"
                                            onClick={() => handleViewDetails(income)}
                                        >
                                            {income.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-xs">
                                                {getPaymentIcon(income.paymentMethod)}
                                                {income.paymentMethod}
                                            </span>
                                            {income.reference && (
                                                <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                                                    Ref: {income.reference}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                                        Rs. {income.amount.toLocaleString()}
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
                                                <DropdownMenuItem onClick={() => handleViewDetails(income)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEdit(income)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(income._id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
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

      {/* View Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-full">
            <SheetHeader>
                <SheetTitle>Income Details</SheetTitle>
                <SheetDescription>
                    Complete information for this transaction.
                </SheetDescription>
            </SheetHeader>
            {selectedIncome && (
                <div className="mt-6 space-y-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Total Amount</div>
                        <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                            Rs. {selectedIncome.amount.toLocaleString()}
                        </div>
                        <Badge className="mt-3 bg-emerald-600 hover:bg-emerald-700">
                            INCOME
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium text-muted-foreground flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" /> Date
                            </div>
                            <div className="col-span-2 font-medium">
                                {format(new Date(selectedIncome.date), "MMMM dd, yyyy")}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium text-muted-foreground flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Category
                            </div>
                            <div className="col-span-2">
                                <Badge variant="outline" className="text-base font-normal">
                                    {selectedIncome.category}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium text-muted-foreground flex items-center gap-2">
                                <Wallet className="h-4 w-4" /> Method
                            </div>
                            <div className="col-span-2 font-medium">
                                {selectedIncome.paymentMethod}
                            </div>
                        </div>

                        {selectedIncome.reference && (
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="font-medium text-muted-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Reference
                                </div>
                                <div className="col-span-2 font-mono text-xs bg-muted p-1 rounded inline-block">
                                    {selectedIncome.reference}
                                </div>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <div className="font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Description
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md text-sm leading-relaxed">
                                {selectedIncome.description}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6">
                        <Button className="flex-1" variant="outline" onClick={() => {
                            setIsSheetOpen(false);
                            handleEdit(selectedIncome);
                        }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button className="flex-1" variant="destructive" onClick={() => {
                            setIsSheetOpen(false);
                            handleDelete(selectedIncome._id);
                        }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the income entry from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IncomeManagement;
