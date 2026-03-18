import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  Briefcase,
  UserCog,
  Baby
} from "lucide-react";
import { ParentLoginForm } from "@/components/parent-login-form";
import { AccountantLoginForm } from "@/components/accountant-login-form";
import { ReceptionistLoginForm } from "@/components/receptionist-login-form";

const AdminLoginPage = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login({ email, password });
      navigate("/admin/dashboard");
    } catch (err) {
      setLocalError(error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">School Management System</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Select your role to login to the portal</p>
        </div>

        {/* Login Area */}
        <div className="mx-auto w-full max-w-2xl">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl border bg-muted/40 p-1.5 sm:grid-cols-5">
              <TabsTrigger value="admin" className="flex h-auto flex-col gap-1 py-2 text-[11px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <UserCog className="h-4 w-4" />
                <span className="font-medium">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex h-auto flex-col gap-1 py-2 text-[11px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">Teacher</span>
              </TabsTrigger>
              <TabsTrigger value="accountant" className="flex h-auto flex-col gap-1 py-2 text-[11px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">Accountant</span>
              </TabsTrigger>
              <TabsTrigger value="receptionist" className="flex h-auto flex-col gap-1 py-2 text-[11px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <Users className="h-4 w-4" />
                <span className="font-medium">Receptionist</span>
              </TabsTrigger>
              <TabsTrigger value="parent" className="flex h-auto flex-col gap-1 py-2 text-[11px] sm:text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <Baby className="h-4 w-4" />
                <span className="font-medium">Parent</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 min-h-[560px] animate-in slide-in-from-bottom-4 duration-500 fade-in zoom-in-95 sm:min-h-[620px]">
              <TabsContent value="admin">
                <Card className="border shadow-xl/10 min-h-[520px] flex flex-col">
                  <CardHeader className="text-center pb-2 pt-6">
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access the administration panel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4">
                        {localError && (
                          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium text-center">
                            {localError}
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="admin@school.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <a href="#" className="text-xs text-primary hover:underline">
                              Forgot password?
                            </a>
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                          {loading ? "Authenticating..." : "Login to Admin Portal"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                  <div className="p-4 text-center text-xs text-muted-foreground border-t bg-muted/30 rounded-b-lg">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      Register School
                    </Link>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="teacher">
                <Card className="border shadow-xl/10 min-h-[520px] flex flex-col">
                  <CardHeader className="text-center pb-2 pt-6">
                    <CardTitle className="text-2xl">Teacher Login</CardTitle>
                    <CardDescription>Access class schedules and student records</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <LoginForm role="Teacher" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accountant">
                <AccountantLoginForm />
              </TabsContent>

              <TabsContent value="receptionist">
                <ReceptionistLoginForm />
              </TabsContent>

              <TabsContent value="parent">
                <ParentLoginForm />
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </div >

      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
      </div>
    </div>
  );
};

// Helper for Teacher login form (Refined)
const LoginForm = ({ role }) => {
  const { teacherLogin, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      if (role === 'Teacher') {
        await teacherLogin({ email, password });
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      setLocalError(error || "Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        {localError && <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium text-center">{localError}</div>}
        <div className="space-y-2">
          <Label htmlFor={`${role}-email`}>Email Address</Label>
          <Input id={`${role}-email`} type="email" placeholder="teacher@school.com" required value={email} onChange={e => setEmail(e.target.value)} className="h-10" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${role}-password`}>Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
          </div>
          <Input id={`${role}-password`} type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} className="h-10" />
        </div>
        <Button type="submit" className="w-full h-10 mt-2" disabled={loading}>Login as {role}</Button>
      </div>
    </form>
  )
}

export default AdminLoginPage;
