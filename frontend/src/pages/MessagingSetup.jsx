import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
    Settings, MessageSquare, Mail, Smartphone, QrCode, 
    CheckCircle2, XCircle, RefreshCw, Send, Eye, EyeOff,
    Wifi, WifiOff, AlertCircle, Loader2
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const API_BASE = import.meta.env.VITE_API_URL;

const MessagingSetup = () => {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    
    // Tab State
    const [activeTab, setActiveTab] = useState('whatsapp');
    
    // WhatsApp State
    const [whatsappStatus, setWhatsappStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'qr'
    const [qrCode, setQrCode] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);
    
    // Email State
    const [emailConfig, setEmailConfig] = useState({
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        senderName: '',
        senderEmail: ''
    });
    const [emailStatus, setEmailStatus] = useState('disconnected'); // 'disconnected', 'connected', 'testing'
    const [showPassword, setShowPassword] = useState(false);
    const [savingEmail, setSavingEmail] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);

    // Fetch current settings
    const fetchSettings = useCallback(async () => {
        try {
            const schoolId = currentUser._id;
            const response = await axios.get(`${API_BASE}/MessagingSettings/${schoolId}`);
            
            if (response.data) {
                // WhatsApp settings
                if (response.data.whatsapp) {
                    setWhatsappStatus(response.data.whatsapp.connected ? 'connected' : 'disconnected');
                    setWhatsappNumber(response.data.whatsapp.phoneNumber || '');
                }
                
                // Email settings
                if (response.data.email) {
                    setEmailConfig({
                        smtpHost: response.data.email.smtpHost || '',
                        smtpPort: response.data.email.smtpPort || '587',
                        smtpUser: response.data.email.smtpUser || '',
                        smtpPassword: '', // Never return password from backend
                        senderName: response.data.email.senderName || '',
                        senderEmail: response.data.email.senderEmail || ''
                    });
                    setEmailStatus(response.data.email.verified ? 'connected' : 'disconnected');
                }
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) fetchSettings();
    }, [currentUser, fetchSettings]);

    // WhatsApp Functions
    const connectWhatsapp = async () => {
        try {
            setLoadingWhatsapp(true);
            setWhatsappStatus('connecting');
            
            const response = await axios.post(`${API_BASE}/WhatsApp/Connect`, {
                school: currentUser._id
            });
            
            if (response.data.qrCode) {
                setQrCode(response.data.qrCode);
                setWhatsappStatus('qr');
                
                // Poll for connection status
                pollWhatsappStatus();
            }
        } catch (err) {
            showToast('Error connecting to WhatsApp!', 'error');
            setWhatsappStatus('disconnected');
        } finally {
            setLoadingWhatsapp(false);
        }
    };

    const pollWhatsappStatus = async () => {
        const checkStatus = async () => {
            try {
                const response = await axios.get(`${API_BASE}/WhatsApp/Status/${currentUser._id}`);
                
                if (response.data.connected) {
                    setWhatsappStatus('connected');
                    setWhatsappNumber(response.data.phoneNumber || '');
                    setQrCode('');
                    showToast('WhatsApp connected successfully!', 'success');
                    return true;
                } else if (response.data.qrCode && response.data.qrCode !== qrCode) {
                    setQrCode(response.data.qrCode);
                }
                return false;
            } catch (err) {
                return false;
            }
        };
        
        // Poll every 3 seconds for 2 minutes
        let attempts = 0;
        const maxAttempts = 40;
        
        const poll = setInterval(async () => {
            const connected = await checkStatus();
            attempts++;
            
            if (connected || attempts >= maxAttempts) {
                clearInterval(poll);
                if (!connected && attempts >= maxAttempts) {
                    showToast('QR code expired. Please try again.', 'error');
                    setWhatsappStatus('disconnected');
                    setQrCode('');
                }
            }
        }, 3000);
    };

    const disconnectWhatsapp = async () => {
        try {
            setLoadingWhatsapp(true);
            await axios.post(`${API_BASE}/WhatsApp/Disconnect`, {
                school: currentUser._id
            });
            
            setWhatsappStatus('disconnected');
            setWhatsappNumber('');
            setQrCode('');
            showToast('WhatsApp disconnected!', 'success');
        } catch (err) {
            showToast('Error disconnecting WhatsApp!', 'error');
        } finally {
            setLoadingWhatsapp(false);
        }
    };

    // Email Functions
    const saveEmailConfig = async () => {
        if (!emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.senderEmail) {
            showToast('Please fill in all required fields!', 'error');
            return;
        }

        try {
            setSavingEmail(true);
            
            await axios.post(`${API_BASE}/EmailSettings`, {
                school: currentUser._id,
                ...emailConfig
            });
            
            showToast('Email settings saved successfully!', 'success');
        } catch (err) {
            showToast('Error saving email settings!', 'error');
        } finally {
            setSavingEmail(false);
        }
    };

    const testEmailConnection = async () => {
        if (!emailConfig.smtpHost || !emailConfig.smtpUser) {
            showToast('Please save settings first!', 'error');
            return;
        }

        try {
            setTestingEmail(true);
            setEmailStatus('testing');
            
            const response = await axios.post(`${API_BASE}/EmailSettings/Test`, {
                school: currentUser._id,
                testEmail: emailConfig.senderEmail
            });
            
            if (response.data.success) {
                setEmailStatus('connected');
                showToast('Email configuration verified!', 'success');
            } else {
                setEmailStatus('disconnected');
                showToast(response.data.error || 'Email test failed!', 'error');
            }
        } catch (err) {
            setEmailStatus('disconnected');
            showToast('Error testing email connection!', 'error');
        } finally {
            setTestingEmail(false);
        }
    };

    // Badge Component
    const StatusBadge = ({ status }) => {
        let variant = "outline";
        let icon = null;
        let label = status;
        let className = "";

        switch (status) {
            case 'connected':
                variant = "default"; // or success if available, else standard primary
                className = "bg-green-600 hover:bg-green-700";
                icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
                label = "Connected";
                break;
            case 'disconnected':
                variant = "destructive";
                icon = <XCircle className="w-3 h-3 mr-1" />;
                label = "Disconnected";
                break;
            case 'connecting':
            case 'testing':
                variant = "secondary";
                icon = <Loader2 className="w-3 h-3 mr-1 animate-spin" />;
                label = status === 'connecting' ? "Connecting..." : "Testing...";
                break;
            case 'qr':
                variant = "secondary";
                className = "bg-blue-100 text-blue-800 hover:bg-blue-200";
                icon = <QrCode className="w-3 h-3 mr-1" />;
                label = "Scan QR Code";
                break;
            default:
                break;
        }

        return (
            <Badge variant={variant} className={className}>
                {icon} {label}
            </Badge>
        );
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messaging Setup</h1>
                    <p className="text-muted-foreground mt-1">Configure WhatsApp and Email channels for communication</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" /> WhatsApp
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email (SMTP)
                    </TabsTrigger>
                </TabsList>

                {/* WhatsApp Tab */}
                <TabsContent value="whatsapp" className="space-y-4">
                    <Card>
                        <CardHeader className="bg-muted/10">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <CardTitle>WhatsApp Connection</CardTitle>
                                    <CardDescription>Connect using Baileys integration for stable messaging.</CardDescription>
                                </div>
                                <StatusBadge status={whatsappStatus} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {whatsappStatus === 'connected' ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">WhatsApp Connected!</h3>
                                        <p className="text-muted-foreground">Your instance is ready to send messages.</p>
                                        {whatsappNumber && (
                                            <p className="font-medium text-primary">Connected: {whatsappNumber}</p>
                                        )}
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={disconnectWhatsapp}
                                        disabled={loadingWhatsapp}
                                        className="mt-4"
                                    >
                                        {loadingWhatsapp ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <WifiOff className="w-4 h-4 mr-2" />}
                                        Disconnect
                                    </Button>
                                </div>
                            ) : whatsappStatus === 'qr' ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold">Scan QR Code</h3>
                                            <p className="text-muted-foreground max-w-sm mx-auto">
                                                Open WhatsApp on your phone go to <strong>Settings {'>'} Linked Devices {'>'} Link a Device</strong>
                                            </p>
                                        </div>

                                        <div className="p-4 bg-white rounded-xl shadow-sm border border-border">
                                            {qrCode ? (
                                                <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64 object-contain" />
                                            ) : (
                                                <div className="w-64 h-64 flex items-center justify-center">
                                                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                                                </div>
                                            )}
                                        </div>

                                        <Alert variant="warning" className="max-w-md bg-yellow-50 text-yellow-800 border-yellow-200">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Action Required</AlertTitle>
                                            <AlertDescription>
                                                Scan the code quickly. The code refreshes automatically every few seconds.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                                <QrCode className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-2 max-w-lg">
                                                <h3 className="text-xl font-semibold">WhatsApp Not Connected</h3>
                                                <p className="text-muted-foreground">
                                                    Connect your WhatsApp account to enable messaging features for students and parents directly from the system.
                                                </p>
                                            </div>

                                            <Button
                                                size="lg"
                                                onClick={connectWhatsapp}
                                                disabled={loadingWhatsapp}
                                                className="gap-2"
                                            >
                                                {loadingWhatsapp ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wifi className="w-5 h-5" />}
                                                Connect Receiver
                                            </Button>

                                    <div className="text-left bg-muted/30 p-4 rounded-lg text-sm space-y-2 max-w-md w-full">
                                        <p className="font-semibold">Quick Guide:</p>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                            <li>Click "Connect Receiver" button above.</li>
                                            <li>Wait for the QR code to appear.</li>
                                            <li>Scan code with your phone's WhatsApp app.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Tab */}
                <TabsContent value="email" className="space-y-4">
                    <Card>
                        <CardHeader className="bg-muted/10">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <CardTitle>Email Configuration</CardTitle>
                                    <CardDescription>Setup SMTP details to enable email notifications using Nodemailer.</CardDescription>
                                </div>
                                <StatusBadge status={emailStatus} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-host">SMTP Host *</Label>
                                    <Input
                                        id="smtp-host"
                                        placeholder="smtp.gmail.com"
                                        value={emailConfig.smtpHost}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">SMTP Port</Label>
                                    <Select
                                        value={emailConfig.smtpPort} 
                                        onValueChange={(val) => setEmailConfig({ ...emailConfig, smtpPort: val })}
                                    >
                                        <SelectTrigger id="smtp-port">
                                            <SelectValue placeholder="Select port" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="587">587 (TLS)</SelectItem>
                                            <SelectItem value="465">465 (SSL)</SelectItem>
                                            <SelectItem value="25">25 (No Encryption)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="smtp-user">SMTP Username *</Label>
                                    <Input
                                        id="smtp-user"
                                        type="email"
                                        placeholder="your-email@gmail.com"
                                        value={emailConfig.smtpUser}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="smtp-pass">SMTP Password / App Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="smtp-pass"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••••••••••"
                                            value={emailConfig.smtpPassword}
                                            onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                                            className="pr-10"
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex="-1"
                                            type="button"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sender-name">Sender Name</Label>
                                    <Input
                                        id="sender-name"
                                        placeholder="Your School Name"
                                        value={emailConfig.senderName}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sender-email">Sender Email *</Label>
                                    <Input
                                        id="sender-email"
                                        type="email"
                                        placeholder="noreply@yourschool.com"
                                        value={emailConfig.senderEmail}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Alert className="mt-6 bg-blue-50 text-blue-800 border-blue-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>For Gmail Users</AlertTitle>
                                <AlertDescription>
                                    You must use an <strong>App Password</strong> instead of your regular Gmail password.
                                    Go to Google Account → Security → 2-Step Verification → App passwords to create one.
                                </AlertDescription>
                            </Alert>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Button
                                    className="flex-1"
                                    onClick={saveEmailConfig}
                                    disabled={savingEmail}
                                >
                                    {savingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                    Save Configuration
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={testEmailConnection}
                                    disabled={testingEmail || !emailConfig.smtpHost}
                                >
                                    {testingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    Test Connection
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MessagingSetup;
