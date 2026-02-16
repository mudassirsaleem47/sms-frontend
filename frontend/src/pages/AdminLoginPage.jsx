import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  Building2,
  GraduationCap,
  Users,
  UserCircle,
  Briefcase,
  UserCog,
  Baby,
  School
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 gap-8">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <School className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">School Management System</h1>
          <p className="text-muted-foreground">Select your role to login to the portal</p>
        </div>

        {/* Login Area */}
        <div className="flex justify-center">
          <Tabs defaultValue="admin" className="w-full max-w-lg flex flex-col items-center">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-full border">
              <TabsTrigger value="admin" className="gap-2 py-2.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="teacher" className="gap-2 py-2.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Teacher</span>
              </TabsTrigger>
              <TabsTrigger value="accountant" className="gap-2 py-2.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Finance</span>
              </TabsTrigger>
              <TabsTrigger value="receptionist" className="gap-2 py-2.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Front Desk</span>
              </TabsTrigger>
              <TabsTrigger value="parent" className="gap-2 py-2.5 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300">
                <Baby className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Parent</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-8 w-full animate-in slide-in-from-bottom-4 duration-500 fade-in zoom-in-95">
              <TabsContent value="admin">
                <Card className="border shadow-lg">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">Admin Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access the administration panel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <Button type="submit" className="w-full h-10 mt-2" disabled={loading}>
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
                <Card className="border shadow-lg">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">Teacher Login</CardTitle>
                    <CardDescription>Access class schedules and student records</CardDescription>
                  </CardHeader>
                  <CardContent>
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
