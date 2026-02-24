import React, { useState, useEffect, useCallback } from 'react';
import { formatDateTime } from '../utils/formatDateTime';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  DollarSign, 
  User, 
  CheckCircle,
  Receipt,
  X,
  CreditCard,
  Banknote,
  Building
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

import API_URL_CENTRAL from '@/config/api';
const API_BASE = API_URL_CENTRAL;

const FeeCollection = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNameClick = (e, studentId) => {
    e.stopPropagation();
    const basePath = location.pathname.startsWith('/teacher') ? '/teacher' : '/admin';
    navigate(`${basePath}/students/${studentId}`);
  };
  
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentFees, setStudentFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'Cash',
    chequeNumber: '',
    bankName: '',
    transactionReference: '',
    remarks: ''
  });

  const paymentMethods = ['Cash', 'Online', 'Cheque', 'Card', 'Bank Transfer'];

  const fetchStudents = useCallback(async () => {
    try {
      const schoolId = currentUser.school?._id || currentUser.school || currentUser._id;
      const response = await axios.get(`${API_BASE}/Students/${schoolId}`);
      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error fetching students', 'error');
    }
  }, [currentUser, showToast]);

  useEffect(() => {
    if (currentUser) {
      fetchStudents();
    }
  }, [currentUser, fetchStudents]);

  const fetchStudentFees = async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE}/StudentFees/${studentId}`);
      setStudentFees(Array.isArray(response.data) ? response.data : []);
    } catch {
      showToast('Error fetching student fees', 'error');
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    fetchStudentFees(student._id);
    setSelectedFee(null);
    resetPaymentForm();
  };

  const handleFeeSelect = (fee) => {
    setSelectedFee(fee);
    setPaymentForm(prev => ({
      ...prev,
      amount: fee.pendingAmount.toString()
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFee) {
      showToast('Please select a fee to pay', 'error');
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    if (amount <= 0 || amount > selectedFee.pendingAmount) {
      showToast(`Invalid amount. Pending: Rs.${selectedFee.pendingAmount}`, 'error');
      return;
    }

    try {
      const payload = {
        feeId: selectedFee._id,
        amount,
        paymentMethod: paymentForm.paymentMethod,
        collectedBy: currentUser._id,
        chequeNumber: paymentForm.chequeNumber,
        bankName: paymentForm.bankName,
        transactionReference: paymentForm.transactionReference,
        remarks: paymentForm.remarks
      };

      const response = await axios.post(`${API_BASE}/CollectFee`, payload);
      
      showToast('Payment collected successfully!', 'success');
      
      // Fetch receipt details
      const receiptResponse = await axios.get(
        `${API_BASE}/FeeReceipt/${response.data.transaction._id}`
      );
      setReceiptData(receiptResponse.data);
      setShowReceipt(true);
      
      // Refresh student fees
      fetchStudentFees(selectedStudent._id);
      resetPaymentForm();
      setSelectedFee(null);
      
    } catch (error) {
      showToast(error.response?.data?.message || 'Error processing payment', 'error');
    }
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      amount: '',
      paymentMethod: 'Cash',
      chequeNumber: '',
      bankName: '',
      transactionReference: '',
      remarks: ''
    });
  };

  const printReceipt = () => {
    window.print();
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNum?.toString().includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
      case 'Partial': return 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200';
      case 'Overdue': return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fee Collection</h2>
          <p className="text-muted-foreground mt-2">Process student fee payments and generate receipts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Search & List */}
        <div className="lg:col-span-1 h-full">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Select Student</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or roll..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full px-4 pb-4">
                {filteredStudents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <User className="h-12 w-12 mb-3 opacity-20" />
                    <p>No students found</p>
                  </div>
                ) : (
                    <div className="space-y-2">
                      {filteredStudents.map((student) => (
                        <div
                          key={student._id}
                          onClick={() => handleStudentSelect(student)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${selectedStudent?._id === student._id
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-transparent'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedStudent?._id === student._id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <User className="h-5 w-5" />
                              </div>
                            <div>
                              <div className="font-semibold text-sm hover:underline hover:text-primary transition-colors" onClick={(e) => handleNameClick(e, student._id)}>{student.name}</div>
                              <div className="text-xs text-muted-foreground">
                                  Roll: {student.rollNum} • Class: {student.sclassName?.sclassName} {student.section}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Fee Details & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedStudent ? (
            <Card className="h-[calc(100vh-200px)] flex flex-col items-center justify-center border-dashed">
              <div className="text-center p-8">
                <div className="bg-muted/30 p-4 rounded-full inline-flex mb-4">
                  <User className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold">No Student Selected</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">Select a student from the list to view their fee details and collect payments.</p>
              </div>
            </Card>
          ) : (
              <>
              {/* Student Info Card */}
                <Card className="bg-primary text-primary-foreground border-none shadow-md overflow-hidden relative">
                  {/* Decorative background circle */}
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

                  <CardContent className="p-6 flex items-start justify-between relative z-10">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 hover:underline cursor-pointer" onClick={(e) => handleNameClick(e, selectedStudent._id)}>{selectedStudent.name}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-primary-foreground/80 text-sm">
                        <span>Roll Number: <span className="font-medium text-white">{selectedStudent.rollNum}</span></span>
                        <span className="hidden sm:inline">•</span>
                        <span>Class: <span className="font-medium text-white">{selectedStudent.sclassName?.sclassName} - {selectedStudent.section}</span></span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedStudent(null)}
                      className="text-primary-foreground hover:bg-white/20 -mr-2 -mt-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>

              {/* Pending Fees */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Fees</CardTitle>
                    <CardDescription>Select a fee record to process payment</CardDescription>
                  </CardHeader>
                  <CardContent>
                {studentFees.filter(f => f.status !== 'Paid').length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                        <p className="text-lg font-medium">All fees are cleared!</p>
                  </div>
                ) : (
                        <div className="grid gap-3">
                    {studentFees.filter(f => f.status !== 'Paid').map((fee) => (
                      <div
                        key={fee._id}
                        onClick={() => handleFeeSelect(fee)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                          selectedFee?._id === fee._id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'bg-card hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{fee.feeStructure?.feeName}</h4>
                              <Badge variant="outline" className={getStatusColor(fee.status)}>
                                {fee.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>Due: {formatDateTime(fee.dueDate, { dateOnly: true })}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Pending Amount</div>
                            <div className="text-lg font-bold text-destructive">Rs.{fee.pendingAmount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total: Rs.{fee.totalAmount.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                  </CardContent>
                </Card>

              {/* Payment Form */}
              {selectedFee && (
                  <Card className="border-t-4 border-t-primary shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <CardTitle>Collect Payment</CardTitle>
                      </div>
                      <CardDescription>
                        Receiving payment for <span className="font-medium text-foreground">{selectedFee.feeStructure?.feeName}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Amount (Rs.) <span className="text-destructive">*</span></Label>
                            <Input
                              type="number"
                              name="amount"
                              value={paymentForm.amount}
                              onChange={handleInputChange}
                              required
                              min="0.01"
                              max={selectedFee.pendingAmount}
                              step="0.01"
                            />
                            <p className="text-xs text-muted-foreground">Max payable: Rs.{selectedFee.pendingAmount.toLocaleString()}</p>
                          </div>

                          <div className="space-y-2">
                            <Label>Payment Method <span className="text-destructive">*</span></Label>
                            <Select
                              value={paymentForm.paymentMethod} 
                              onValueChange={(val) => setPaymentForm(prev => ({ ...prev, paymentMethod: val }))}
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

                          {paymentForm.paymentMethod === 'Cheque' && (
                            <>
                              <div className="space-y-2">
                                <Label>Cheque Number</Label>
                                <Input
                                  type="text"
                                  name="chequeNumber"
                                  value={paymentForm.chequeNumber}
                                  onChange={handleInputChange}
                                  placeholder="xxxxxx"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Bank Name</Label>
                                <Input
                                  type="text"
                                  name="bankName"
                                  value={paymentForm.bankName}
                                  onChange={handleInputChange}
                                  placeholder="Bank Name"
                                />
                              </div>
                            </>
                          )}

                          {(paymentForm.paymentMethod === 'Online' || paymentForm.paymentMethod === 'Bank Transfer') && (
                            <div className="space-y-2 md:col-span-2">
                              <Label>Transaction Reference / ID</Label>
                              <Input
                                type="text"
                                name="transactionReference"
                                value={paymentForm.transactionReference}
                                onChange={handleInputChange}
                                placeholder="Enter Transaction ID"
                              />
                            </div>
                          )}

                          <div className="md:col-span-2 space-y-2">
                            <Label>Remarks (Optional)</Label>
                            <Textarea
                              name="remarks"
                              value={paymentForm.remarks}
                              onChange={handleInputChange}
                              rows={2}
                              placeholder="Any additional notes..."
                            />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="bg-muted/20 border-t p-4 flex justify-end">
                      <Button onClick={handlePaymentSubmit} size="lg" className="w-full md:w-auto gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Confirm Payment
                      </Button>
                    </CardFooter>
                  </Card>
              )}
              </>
          )}
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-2xl">
          {receiptData && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 text-primary mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <DialogTitle>Payment Receipt</DialogTitle>
                    <p className="text-sm text-muted-foreground">Transaction Successful</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-2" id="receipt-content">
                {/* School Info */}
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold">{receiptData.school?.schoolName}</h2>
                  <p className="text-sm text-gray-500">{receiptData.school?.address}</p>
                  <p className="text-sm text-gray-500">{receiptData.school?.email} | {receiptData.school?.phone}</p>
                </div>

                <Separator />

                {/* Receipt Meta */}
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Receipt No</span>
                    <span className="font-mono font-medium">{receiptData.receiptNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Date & Time</span>
                    <span className="font-medium">
                      {formatDateTime(receiptData.paymentDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Trans. ID</span>
                    <span className="font-mono">{receiptData.transactionId}</span>
                  </div>
                </div>

                {/* Student Info Box */}
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Student Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{receiptData.student?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Roll No:</span>
                      <span className="ml-2 font-medium">{receiptData.student?.rollNum}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Class:</span>
                      <span className="ml-2 font-medium">
                        {receiptData.student?.sclassName?.sclassName} - {receiptData.student?.section}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground">Fee Description</span>
                    <span className="font-medium">{receiptData.fee?.feeStructure?.feeName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{receiptData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-2">
                    <span>Total Amount Paid</span>
                    <span className="text-primary">Rs.{receiptData.amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Remarks Footer */}
                {receiptData.remarks && (
                  <div className="text-sm bg-yellow-50 p-3 rounded text-yellow-800 border border-yellow-100">
                    <strong>Note:</strong> {receiptData.remarks}
                  </div>
                )}

                <div className="text-center text-xs text-muted-foreground pt-4">
                  <p>Collected by: {receiptData.collectedBy?.schoolName || 'Admin'}</p>
                  <p>This is a computer-generated receipt.</p>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setShowReceipt(false)}>Close</Button>
                <Button onClick={printReceipt} className="gap-2">
                  <Receipt className="w-4 h-4" /> Print Receipt
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeeCollection;

