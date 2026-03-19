import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  Briefcase,
  UserCog,
  Baby,
    ArrowRightToLine,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AuthLayout } from "@/components/auth/AuthLayout";

const AdminLoginPanel = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    const { showToast } = useToast();
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
    try {
      await login({ email, password });
      navigate("/admin/dashboard");
    } catch (err) {
        const apiError = err.response?.data;
        const message = apiError?.message || error || "Invalid credentials";
        showToast(message, "error");
        if (apiError?.code === "EMAIL_NOT_VERIFIED") {
            navigate(`/verify-email?email=${encodeURIComponent(apiError?.email || email)}`);
        }
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4 ">
          <div className="space-y-2 transition-all">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@school.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
          </div>

          <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <Label htmlFor="admin-password">Password</Label>
                  <Link to="/forgot-password?role=admin" className="text-xs font-medium text-slate-700 hover:underline">
                      Forgot password?
                  </Link>
              </div>
              <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
          </div>

            <button type="submit" className="w-full bg-[#2a2a2a] hover:bg-[#303030] border border-[#3a3a3a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.4)] transition-all duration-150 text-white" disabled={loading}>
                {loading ? "Authenticating..." : "Get Started"}
            </button>
        </form>
    );
};

const TeacherLoginPanel = () => {
    const navigate = useNavigate();
    const { teacherLogin, loading, error } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teacherLogin({ email, password });
            navigate("/teacher/dashboard");
        } catch (err) {
            showToast(err.response?.data?.message || error || "Invalid credentials", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="teacher-email">Email</Label>
                <Input
                    id="teacher-email"
                    type="email"
                    placeholder="teacher@school.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Link to="/forgot-password?role=teacher" className="text-xs font-medium text-slate-700 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Input
                    id="teacher-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full bg-[#2a2a2a] hover:bg-[#303030] border border-[#3a3a3a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.4)] transition-all duration-150 text-white" disabled={loading}>
                {loading ? "Authenticating..." : "Get Started"}
            </Button>
        </form>
    );
};

const StaffRolePanel = ({ role, dashboardPath, placeholder }) => {
    const navigate = useNavigate();
    const { staffLogin, loading, error } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await staffLogin({ email, password });
            const normalizedRole = String(user.role || user.designation || "").toLowerCase();
            if (normalizedRole === role) {
                navigate(dashboardPath);
            } else {
                showToast(`Access denied: this account is not a ${role}.`, "error");
            }
        } catch (err) {
            showToast(err.response?.data?.message || error || "Invalid credentials", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`${role}-email`}>Email</Label>
                <Input
                    id={`${role}-email`}
                    type="email"
                    placeholder={placeholder}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
      </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`${role}-password`}>Password</Label>
                    <Link to={`/forgot-password?role=${role}`} className="text-xs font-medium text-slate-700 hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <Input
                    id={`${role}-password`}
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full bg-[#2a2a2a] hover:bg-[#303030] border border-[#3a3a3a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.4)] transition-all duration-150 text-white" disabled={loading}>
                {loading ? "Authenticating..." : "Get Started"}
            </Button>
        </form>
  );
};

const ParentLoginPanel = () => {
  const navigate = useNavigate();
    const { parentLogin, loading, error } = useAuth();
    const { showToast } = useToast();
    const [studentName, setStudentName] = useState("");
    const [rollNum, setRollNum] = useState("");
    const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
    try {
        await parentLogin({ studentName, rollNum, password });
        navigate("/parent/dashboard");
    } catch (err) {
        showToast(err.response?.data?.message || error || "Invalid credentials", "error");
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="parent-student-name">Student Name</Label>
              <Input
                  id="parent-student-name"
                  placeholder="Ali Khan"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
              />
          </div>

          <div className="space-y-2">
              <Label htmlFor="parent-roll-number">Roll Number</Label>
              <Input
                  id="parent-roll-number"
                  type="number"
                  placeholder="101"
                  required
                  value={rollNum}
                  onChange={(e) => setRollNum(e.target.value)}
              />
          </div>

          <div className="space-y-2">
              <Label htmlFor="parent-password">Password</Label>
              <Input
                  id="parent-password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
      </div>

          <Button type="submit" className="w-full bg-[#2a2a2a] hover:bg-[#303030] border border-[#3a3a3a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.4)] transition-all duration-150 text-white" disabled={loading}>
              {loading ? "Authenticating..." : "Get Started"}
          </Button>
    </form>
    );
};

const AdminLoginPage = () => {
    return (
        <AuthLayout 
            title="Sign in"
            subtitle="Select your role and continue with secure access to your dashboard."
            icon={ArrowRightToLine}
            badgeText="School Access"
            footer={
                <>
                    Don&apos;t have an account? <Link to="/register" className="font-semibold text-slate-900 hover:underline">Create school</Link>
                </>
            }
        >
            <Tabs defaultValue="admin" className="w-full">
                <TabsList className="grid h-auto w-full grid-cols-5 rounded-xl border border-slate-200 bg-slate-100 p-1">
                    <TabsTrigger value="admin" className="px-1.5 py-2 text-[11px] sm:text-xs"><UserCog className="mx-auto h-3.5 w-3.5" /><span>Admin</span></TabsTrigger>
                    <TabsTrigger value="teacher" className="px-1.5 py-2 text-[11px] sm:text-xs"><GraduationCap className="mx-auto h-3.5 w-3.5" /><span>Teacher</span></TabsTrigger>
                    <TabsTrigger value="accountant" className="px-1.5 py-2 text-[11px] sm:text-xs"><Briefcase className="mx-auto h-3.5 w-3.5" /><span>Accountant</span></TabsTrigger>
                    <TabsTrigger value="receptionist" className="px-1.5 py-2 text-[11px] sm:text-xs"><Users className="mx-auto h-3.5 w-3.5" /><span>Reception</span></TabsTrigger>
                    <TabsTrigger value="parent" className="px-1.5 py-2 text-[11px] sm:text-xs"><Baby className="mx-auto h-3.5 w-3.5" /><span>Parent</span></TabsTrigger>
                </TabsList>

                <TabsContent value="admin" className="mt-4"><AdminLoginPanel /></TabsContent>
                <TabsContent value="teacher" className="mt-4"><TeacherLoginPanel /></TabsContent>
                <TabsContent value="accountant" className="mt-4">
                    <StaffRolePanel role="accountant" dashboardPath="/accountant/dashboard" placeholder="accountant@school.com" />
                </TabsContent>
                <TabsContent value="receptionist" className="mt-4">
                    <StaffRolePanel role="receptionist" dashboardPath="/receptionist/dashboard" placeholder="receptionist@school.com" />
                </TabsContent>
                <TabsContent value="parent" className="mt-4"><ParentLoginPanel /></TabsContent>
            </Tabs>
        </AuthLayout>
    );
};

export default AdminLoginPage;
