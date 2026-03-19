import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AlertCircle, CheckCircle2, MailCheck, RefreshCcw } from "lucide-react";

import API_URL from "@/config/api.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthLayout } from "@/components/auth/AuthLayout";

const VERIFY_URL = `${API_URL}/Auth/VerifyEmail`;
const RESEND_URL = `${API_URL}/Auth/ResendVerification`;

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const emailFromLink = useMemo(() => params.get("email") || "", [params]);

  const [email, setEmail] = useState(emailFromLink);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const autoVerify = async () => {
      if (!token || !emailFromLink) return;

      setVerifying(true);
      setMessage("");

      try {
        const res = await axios.post(VERIFY_URL, {
          token,
          email: emailFromLink,
        });

        setVerified(true);
        setMessageType("success");
        setMessage(res.data?.message || "Email verified successfully. You can now login.");
      } catch (error) {
        setVerified(false);
        setMessageType("error");
        setMessage(error.response?.data?.message || "Verification failed. Please request a new verification email.");
      } finally {
        setVerifying(false);
      }
    };

    autoVerify();
  }, [token, emailFromLink]);

  const handleResend = async (e) => {
    e.preventDefault();
    setResending(true);
    setMessage("");

    try {
      const res = await axios.post(RESEND_URL, { email });
      setMessageType("success");
      setMessage(res.data?.message || "Verification email sent. Please check your inbox.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Unable to send verification email right now.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify email"
      subtitle="Activate your account by confirming your email address."
      icon={MailCheck}
      badgeText="Verification"
      footer={<Link to="/login" className="font-semibold text-slate-900 hover:underline">Back to login</Link>}
    >
      {(verifying || message) && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border p-3 text-sm",
            messageType === "success" && "border-green-200 bg-green-50 text-green-700",
            messageType === "error" && "border-red-200 bg-red-50 text-red-700",
            messageType === "info" && "border-slate-200 bg-slate-50 text-slate-700"
          )}
        >
          {messageType === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{verifying ? "Verifying your email..." : message}</span>
        </div>
      )}

      {!verified && (
        <form onSubmit={handleResend} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@school.com"
            />
          </div>

          <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={resending || !email}>
            {resending ? (
              "Sending..."
            ) : (
              <span className="inline-flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Resend verification email
              </span>
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default VerifyEmailPage;
