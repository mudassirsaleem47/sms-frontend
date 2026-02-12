import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../utils/formatDateTime';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Users,
  Filter,
  CreditCard,
  School,
  CheckCircle2,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Calendar } from "@/components/ui/calendar";
import { MoreHorizontal, Printer, Copy, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_URL;

const FeeReports = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [pendingFees, setPendingFees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, transactions, defaulters
  
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)), // First day of month
    to: new Date() // Today
  });

  // Sheet State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Derived date filter for API (uses ISO string format YYYY-MM-DD)
  const apiDateFilter = React.useMemo(() => ({
    startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
    endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''
  }), [dateRange]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, apiDateFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, transactionsRes] = await Promise.all([
        axios.get(`${API_BASE}/PendingFees/${currentUser._id}`),
        axios.get(`${API_BASE}/FeeTransactions/${currentUser._id}`, {
          params: apiDateFilter
        })
      ]);
      
      setPendingFees(pendingRes.data);
      setTransactions(transactionsRes.data);
      setLoading(false);
    } catch (error) {
      showToast('Error fetching data', 'error');
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalPending = pendingFees.reduce((sum, fee) => sum + fee.pendingAmount, 0);
    const totalCollected = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    const defaultersCount = pendingFees.filter(fee => fee.status === 'Overdue').length;
    
    return { totalPending, totalCollected, defaultersCount };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Partial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const exportToCSV = (data, filename) => {
    // Simple CSV export implementation
    let csv = '';
    
    if (activeTab === 'pending') {
      csv = 'Student Name,Roll Number,Class,Fee Type,Total Amount,Paid Amount,Pending Amount,Due Date,Status\n';
      data.forEach(fee => {
        csv += `"${fee.student?.name}","${fee.student?.rollNum}","${fee.student?.sclassName?.sclassName} ${fee.student?.section}","${fee.feeStructure?.feeName}","${fee.totalAmount}","${fee.paidAmount}","${fee.pendingAmount}","${formatDateTime(fee.dueDate, { dateOnly: true })}","${fee.status}"\n`;
      });
    } else {
      csv = 'Date,Receipt Number,Student Name,Roll Number,Fee Type,Amount,Payment Method,Collected By\n';
      data.forEach(txn => {
        csv += `"${formatDateTime(txn.paymentDate)}","${txn.receiptNumber}","${txn.student?.name}","${txn.student?.rollNum}","${txn.fee?.feeStructure?.feeName || 'N/A'}","${txn.amount}","${txn.paymentMethod}","${txn.collectedBy?.schoolName || 'N/A'}"\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('Report exported successfully!', 'success');
  };

  const handleNameClick = (item) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Helper to determine if item is transaction or fee
  const isTransaction = (item) => item && item.paymentDate && item.receiptNumber;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Fee Reports</h1>
        <p className="text-muted-foreground">View and export fee collection reports</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Total Pending Fees</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Rs.{totals.totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{pendingFees.length} pending fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Collected</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Rs.{totals.totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{transactions.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">Fee Defaulters</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totals.defaultersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Overdue fees</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Fees</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === 'transactions' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
            
            <Button
              onClick={() => {
                if (activeTab === 'pending' || activeTab === 'defaulters') {
                  const data = activeTab === 'defaulters' 
                    ? pendingFees.filter(f => f.status === 'Overdue')
                    : pendingFees;
                  exportToCSV(data, activeTab);
                } else {
                  exportToCSV(transactions, 'transactions');
                }
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                          No pending fees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingFees.map((fee) => (
                        <TableRow key={fee._id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <span 
                              className="font-medium text-foreground hover:underline hover:text-primary transition-colors cursor-pointer"
                              onClick={() => handleNameClick(fee)}
                            >
                              {fee.student?.name}
                            </span>
                          </TableCell>
                          <TableCell>{fee.student?.rollNum}</TableCell>
                          <TableCell>{fee.student?.sclassName?.sclassName} {fee.student?.section}</TableCell>
                          <TableCell>{fee.feeStructure?.feeName}</TableCell>
                          <TableCell>Rs.{fee.totalAmount?.toLocaleString()}</TableCell>
                          <TableCell>Rs.{fee.paidAmount?.toLocaleString()}</TableCell>
                          <TableCell className="text-destructive font-medium">Rs.{fee.pendingAmount?.toLocaleString()}</TableCell>
                          <TableCell>{formatDateTime(fee.dueDate, { dateOnly: true })}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "font-normal",
                              fee.status === 'Paid' && "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
                              fee.status === 'Pending' && "border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
                              fee.status === 'Overdue' && "border-red-500 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
                              fee.status === 'Partial' && "border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
                            )}>
                              {fee.status}
                            </Badge>
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
                                <DropdownMenuItem onClick={() => {
                                  navigator.clipboard.writeText(fee._id);
                                  showToast('Fee ID copied', 'success');
                                }}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleNameClick(fee)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          No transactions found for selected period
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((txn) => (
                        <TableRow key={txn._id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>{formatDateTime(txn.paymentDate)}</TableCell>
                          <TableCell className="font-medium text-primary">{txn.receiptNumber}</TableCell>
                          <TableCell>
                            <span 
                              className="font-medium text-foreground hover:underline hover:text-primary transition-colors cursor-pointer"
                              onClick={() => handleNameClick(txn)}
                            >
                              {txn.student?.name}
                            </span>
                          </TableCell>
                          <TableCell>{txn.student?.rollNum}</TableCell>
                          <TableCell>{txn.fee?.feeStructure?.feeName || 'N/A'}</TableCell>
                          <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">Rs.{txn.amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{txn.paymentMethod}</Badge>
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
                                <DropdownMenuItem onClick={() => showToast('Printing receipt...', 'info')}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  navigator.clipboard.writeText(txn.receiptNumber);
                                  showToast('Receipt number copied', 'success');
                                }}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Receipt No
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleNameClick(txn)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defaulters" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Pending Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFees.filter(f => f.status === 'Overdue').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          No defaulters found
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingFees.filter(f => f.status === 'Overdue').map((fee) => {
                        const daysOverdue = Math.floor((new Date() - new Date(fee.dueDate)) / (1000 * 60 * 60 * 24));
                        return (
                          <TableRow key={fee._id} className="hover:bg-muted/50 transition-colors">
                            <TableCell>
                              <span 
                                className="font-medium text-foreground hover:underline hover:text-primary transition-colors cursor-pointer"
                                onClick={() => handleNameClick(fee)}
                              >
                                {fee.student?.name}
                              </span>
                            </TableCell>
                            <TableCell>{fee.student?.rollNum}</TableCell>
                            <TableCell>{fee.student?.sclassName?.sclassName} {fee.student?.section}</TableCell>
                            <TableCell>{fee.feeStructure?.feeName}</TableCell>
                            <TableCell className="text-destructive font-medium">Rs.{fee.pendingAmount?.toLocaleString()}</TableCell>
                            <TableCell>{formatDateTime(fee.dueDate, { dateOnly: true })}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{daysOverdue} days</Badge>
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
                                  <DropdownMenuItem onClick={() => handleNameClick(fee)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-full">
          <SheetHeader>
            <SheetTitle>
              {selectedItem && isTransaction(selectedItem) ? 'Transaction Details' : 'Fee Details'}
            </SheetTitle>
            <SheetDescription>
              Detailed information for {selectedItem?.student?.name}
            </SheetDescription>
          </SheetHeader>

          {selectedItem && (
            <div className="mt-6 space-y-6">
              {/* Student Info Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Student Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium text-gray-500">Name</div>
                    <div className="col-span-2 font-medium">{selectedItem.student?.name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium text-gray-500 flex items-center gap-2">
                       <School className="h-3.5 w-3.5" /> Class
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        {selectedItem.student?.sclassName?.sclassName} {selectedItem.student?.section}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium text-gray-500">Roll No</div>
                    <div className="col-span-2">{selectedItem.student?.rollNum}</div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-muted my-2" />

              {/* Conditional Content based on Type */}
              {isTransaction(selectedItem) ? (
                /* Transaction Specific Details */
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Transaction Info</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Receipt #</div>
                        <div className="col-span-2 font-medium text-primary">{selectedItem.receiptNumber}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Date</div>
                      <div className="col-span-2">{formatDateTime(selectedItem.paymentDate)}</div>
                    </div>
                     <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Amount</div>
                        <div className="col-span-2 font-bold text-emerald-600">Rs.{selectedItem.amount?.toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Method</div>
                        <div className="col-span-2">
                           <Badge variant="outline">{selectedItem.paymentMethod}</Badge>
                        </div>
                    </div>
                     <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Collected By</div>
                        <div className="col-span-2 text-muted-foreground text-xs italic">
                            {selectedItem.collectedBy?.schoolName || 'Admin'}
                        </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fee Specific Details */
                <div>
                   <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Fee Information</h3>
                   <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Fee Type</div>
                        <div className="col-span-2 font-medium">{selectedItem.feeStructure?.feeName}</div>
                     </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Status</div>
                        <div className="col-span-2">
                            <Badge variant="outline" className={cn(
                              "font-normal",
                              selectedItem.status === 'Paid' && "border-green-500 text-green-700 bg-green-50",
                              selectedItem.status === 'Pending' && "border-yellow-500 text-yellow-700 bg-yellow-50",
                              selectedItem.status === 'Overdue' && "border-red-500 text-red-700 bg-red-50",
                              selectedItem.status === 'Partial' && "border-orange-500 text-orange-700 bg-orange-50"
                            )}>
                              {selectedItem.status}
                            </Badge>
                        </div>
                     </div>
                     <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Total</div>
                        <div className="col-span-2">Rs.{selectedItem.totalAmount?.toLocaleString()}</div>
                     </div>
                     <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Paid</div>
                        <div className="col-span-2">Rs.{selectedItem.paidAmount?.toLocaleString()}</div>
                     </div>
                     <div className="grid grid-cols-3 gap-2 text-sm">
                         <div className="font-medium text-gray-500">Pending</div>
                        <div className="col-span-2 font-bold text-destructive">Rs.{selectedItem.pendingAmount?.toLocaleString()}</div>
                     </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-gray-500">Due Date</div>
                        <div className="col-span-2">{formatDateTime(selectedItem.dueDate, { dateOnly: true })}</div>
                     </div>
                   </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FeeReports;
