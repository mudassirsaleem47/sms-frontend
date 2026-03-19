import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AlertCircle, CheckCircle2, Building2 } from "lucide-react";

import API_URL from "@/config/api.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/ui/email-pass";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { cn } from "@/lib/utils";

const REGISTER_URL = `${API_URL}/AdminReg`;

const AdminRegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        schoolName: "",
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

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
          setMessage(res.data?.message || "Registration successful. Please verify your email before login.");
          setRegisteredEmail(formData.email);
          setFormData({ name: "", email: "", password: "", schoolName: "" });
      } catch (error) {
          setMessageType("error");
          setMessage(error.response?.data?.message || "Registration failed. Please try again.");
          setRegisteredEmail("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle="Set up your school workspace in seconds."
            icon={Building2}
            badgeText="School Setup"
            maxWidthClass="max-w-xl"
            footer={
                <>
                    Already have an account? <Link to="/login" className="font-semibold text-slate-900 hover:underline">Sign in</Link>
                </>
            }
        >
            {message ? (
                <div
                    className={cn(
                        "flex items-start gap-3 rounded-xl border p-3 text-sm",
                        messageType === "success"
                            ? "border-green-200 bg-green-50 text-green-700"
                          : "border-red-200 bg-red-50 text-red-700"
                  )}
                >
                    {messageType === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <span>{message}</span>
                </div>
            ) : null}

            {messageType === "success" && registeredEmail ? (
                <p className="text-center text-xs text-slate-600">
                    Did not get email?{" "}
                    <Link
                        to={`/verify-email?email=${encodeURIComponent(registeredEmail)}`}
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Resend verification
                    </Link>
                </p>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Mudassir Saleem"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@school.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="schoolName">School Name</Label>
                        <Input
                            id="schoolName"
                            name="schoolName"
                            placeholder="Central High School"
                            value={formData.schoolName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <PasswordField
                        label="Password"
                        id="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="md:col-span-2"
                    />
                </div>

                <Button type="submit" className="w-full bg-[#2a2a2a] hover:bg-[#303030] border border-[#3a3a3a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.4)] transition-all duration-150 text-white" disabled={loading}>
                    {loading ? "Creating..." : "Create account"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default AdminRegisterPage;
