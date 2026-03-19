import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Placeholder flow until OTP backend endpoint is connected.
    setTimeout(() => {
      if (otp.trim().length >= 4) {
        setMessageType("success");
        setMessage("OTP verified successfully.");
      } else {
        setMessageType("error");
        setMessage("Invalid OTP. Please enter the correct code.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the one-time passcode sent to your email or phone."
      icon={ShieldCheck}
      badgeText="Two-Factor"
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
          <Label htmlFor="otp">One-Time Passcode</Label>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit code"
            required
          />
        </div>

        <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default OtpVerificationPage;
