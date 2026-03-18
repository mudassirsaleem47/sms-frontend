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
  Baby,
  ShieldCheck,
  Sparkles,
  Building2
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            Smart School Suite
          </div>

          <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
            School Management System
          </h1>
          <p className="mt-3 text-sm text-slate-200/90 sm:text-base">
            One secure portal for administration, academics, finance, and parent communication.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
              <ShieldCheck className="h-5 w-5 text-cyan-200" />
              <span className="text-sm text-slate-100">Role-based access and protected login flows</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
              <Building2 className="h-5 w-5 text-cyan-200" />
              <span className="text-sm text-slate-100">Centralized controls for school operations</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-2xl sm:p-6">
          <div className="mb-5 text-center sm:mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Portal Login</h2>
            <p className="mt-1 text-sm text-slate-500">Select your role to continue</p>
          </div>

          <div className="mx-auto w-full max-w-2xl">
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 sm:grid-cols-5">
                <TabsTrigger value="admin" className="flex h-auto flex-col gap-1 rounded-xl py-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300">
                  <UserCog className="h-4 w-4" />
                  <span className="font-medium">Admin</span>
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex h-auto flex-col gap-1 rounded-xl py-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300">
                  <GraduationCap className="h-4 w-4" />
                  <span className="font-medium">Teacher</span>
                </TabsTrigger>
                <TabsTrigger value="accountant" className="flex h-auto flex-col gap-1 rounded-xl py-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium">Accountant</span>
                </TabsTrigger>
                <TabsTrigger value="receptionist" className="flex h-auto flex-col gap-1 rounded-xl py-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Receptionist</span>
                </TabsTrigger>
                <TabsTrigger value="parent" className="flex h-auto flex-col gap-1 rounded-xl py-2 text-[11px] sm:text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300">
                  <Baby className="h-4 w-4" />
                  <span className="font-medium">Parent</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 min-h-[560px] animate-in slide-in-from-bottom-4 duration-500 fade-in zoom-in-95 sm:min-h-[620px]">
                <TabsContent value="admin">
                  <Card className="min-h-[520px] border-slate-200/80 shadow-lg shadow-slate-200/60">
                    <CardHeader className="text-center pb-2 pt-6">
                      <CardTitle className="text-2xl text-slate-900">Admin Login</CardTitle>
                      <CardDescription>
                        Enter your credentials to access the administration panel
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                          {localError && (
                            <div className="rounded-md bg-destructive/15 p-3 text-center text-sm font-medium text-destructive">
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
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <a href="#" className="text-xs font-medium text-primary hover:underline">
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
                              className="h-11"
                            />
                          </div>
                          <Button type="submit" className="mt-2 h-11 w-full" disabled={loading}>
                            {loading ? "Authenticating..." : "Login to Admin Portal"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                    <div className="rounded-b-lg border-t bg-slate-50/90 p-4 text-center text-xs text-slate-500">
                      Don&apos;t have an account?{" "}
                      <Link to="/register" className="font-medium text-primary hover:underline">
                        Register School
                      </Link>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="teacher">
                  <Card className="min-h-[520px] border-slate-200/80 shadow-lg shadow-slate-200/60">
                    <CardHeader className="text-center pb-2 pt-6">
                      <CardTitle className="text-2xl text-slate-900">Teacher Login</CardTitle>
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
        </section>
      </div>

      <div className="relative mx-auto mt-8 w-full max-w-6xl text-center text-xs text-slate-400">
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
