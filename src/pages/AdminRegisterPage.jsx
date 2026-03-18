import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "@/config/api.js";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, UserPlus, Sparkles, ShieldCheck, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PasswordField } from '@/components/ui/email-pass';

const REGISTER_URL = `${API_URL}/AdminReg`;

const AdminRegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        schoolName: ""
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(REGISTER_URL, formData);
            setMessageType("success");
            setMessage(`Admin registered successfully! School ID: ${res.data.schoolName}`);
            setFormData({ name: "", email: "", password: "", schoolName: "" });
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessageType("error");
            setMessage(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 sm:py-12">
            <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
                <section className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl sm:p-8 lg:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-100">
                        <Sparkles className="h-3.5 w-3.5" />
                        School Setup Wizard
                    </div>

                    <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
                        Create Your School Workspace
                    </h1>
                    <p className="mt-3 text-sm text-slate-200/90 sm:text-base">
                        Register your institute and start managing students, staff, classes, and finance from one panel.
                    </p>

                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                            <ShieldCheck className="h-5 w-5 text-cyan-200" />
                            <span className="text-sm text-slate-100">Secure account setup with role-based dashboard access</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                            <Building2 className="h-5 w-5 text-cyan-200" />
                            <span className="text-sm text-slate-100">Launch your school profile in just a few steps</span>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-2xl sm:p-6">
                    <Card className="border-slate-200/80 shadow-lg shadow-slate-200/60">
                        <CardHeader className="text-center pb-2 pt-6">
                            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                                <UserPlus className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl text-slate-900">Admin Registration</CardTitle>
                            <CardDescription>
                                Enter your details to register your school
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {message && (
                                <div className={cn(
                                    "mb-6 flex items-start gap-3 rounded-lg border p-4 text-sm",
                                    messageType === "success"
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : "border-destructive/20 bg-destructive/10 text-destructive"
                                )}>
                                    {messageType === "success" ? (
                                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                    ) : (
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                    )}
                                    <span>{message}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="admin@school.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolName">School Name</Label>
                                        <Input
                                            id="schoolName"
                                            name="schoolName"
                                            placeholder="e.g., Central High School"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                            required
                                            className="h-11"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            This will be your school identifier for setup and onboarding.
                                        </p>
                                    </div>
                                    <PasswordField
                                        label="Password"
                                        id="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className=""
                                    />
                                    <Button type="submit" className="mt-2 h-11 w-full" disabled={loading}>
                                        {loading ? "Creating Account..." : "Register School"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <div className="rounded-b-lg border-t bg-slate-50/90 p-4 text-center text-xs text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary hover:underline">
                                Log in
                            </Link>
                        </div>
                    </Card>
                </section>
            </div>

            <div className="relative mx-auto mt-8 w-full max-w-6xl text-center text-xs text-slate-400">
                <p>&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AdminRegisterPage;