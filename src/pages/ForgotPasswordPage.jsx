import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

import API_URL from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { cn } from "@/lib/utils";

const API_BASE = API_URL;

const ForgotPasswordPage = () => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const roleFromQuery = query.get("role") || "auto";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roleFromQuery);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = { email };
      if (role !== "auto") payload.role = role;

      const res = await axios.post(`${API_BASE}/Auth/ForgotPassword`, payload);
      setMessageType("success");
      setMessage(res.data?.message || "If an account exists, a reset link has been sent.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Unable to process request right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we will send you a secure reset link."
      icon={Mail}
      badgeText="Recovery"
      footer={<Link to="/login" className="font-semibold text-slate-900 hover:underline">Back to login</Link>}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@school.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Account Type</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Auto detect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto Detect</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="receptionist">Receptionist</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit"className="w-full bg-[#2a2a2a] hover:bg-[#303030] border border-[#3a3a3a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.4)] transition-all duration-150 text-white" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
