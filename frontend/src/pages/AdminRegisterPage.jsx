import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/register-form';
import { Shield, GraduationCap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminRegisterPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
            {/* Navigation Tabs */}
            <div className="w-full max-w-md mb-6">
                <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login" asChild>
                            <Link to="/AdminLogin" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Login
                            </Link>
                        </TabsTrigger>
                        <TabsTrigger value="register" asChild>
                            <Link to="/AdminRegister" className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Register
                            </Link>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Register Form */}
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>

            {/* Support */}
            <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                    Need help?{' '}
                    <a href="#" className="text-primary hover:underline font-medium">
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AdminRegisterPage;