import { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

import API_URL from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { cn } from "@/lib/utils";

const API_BASE = API_URL;

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = query.get("token") || "";
  const role = query.get("role") || "auto";
  const emailFromUrl = query.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showError = (text) => {
    setMessageType("error");
    setMessage(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      showError("Invalid reset link.");
      return;
    }

    if (newPassword.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/Auth/ResetPassword`, {
        email,
        token,
        role,
        newPassword,
      });

      setMessageType("success");
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      showError(err.response?.data?.message || "Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Create a new secure password for your account."
      icon={KeyRound}
      badgeText="Security"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
