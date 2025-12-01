import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, Building2, AlertCircle, CheckCircle, User } from 'lucide-react';

const API_URL = "http://localhost:5000/AdminReg";

const AdminRegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        schoolName: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const res = await axios.post(API_URL, formData);
            setMessageType('success');
            setMessage(`Admin registered successfully! School ID: ${res.data.schoolName}`);
            setFormData({ name: '', email: '', password: '', schoolName: '' });
            setTimeout(() => navigate('/admin'), 2000);
        } catch (error) {
            setMessageType('error');
            setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-gray-50 to-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
                
                {/* Left Side - Info */}
                <div className="hidden md:flex flex-col justify-center items-start text-white bg-linear-to-br from-indigo-600 to-indigo-700 p-12 rounded-2xl shadow-2xl">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4">
                            <UserPlus className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-4xl font-bold">Admin Setup</h1>
                        <p className="text-indigo-100 text-lg mt-2">Create Your School Account</p>
                    </div>
                    
                    <div className="space-y-6 mt-12">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                            <div>
                                <p className="font-600">One-Time Setup</p>
                                <p className="text-indigo-100 text-sm">Register your school's first admin account</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                            <div>
                                <p className="font-600">Complete Access</p>
                                <p className="text-indigo-100 text-sm">Full control over school management system</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                            <div>
                                <p className="font-600">Secure Setup</p>
                                <p className="text-indigo-100 text-sm">Your credentials are safely encrypted</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex flex-col justify-center">
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Registration</h2>
                            <p className="text-gray-600 mt-2">Set up your school management account</p>
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                                messageType === 'success' 
                                    ? 'bg-green-50 border-l-4 border-green-500' 
                                    : 'bg-red-50 border-l-4 border-red-500'
                            }`}>
                                {messageType === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                )}
                                <span className={messageType === 'success' ? 'text-green-700' : 'text-red-700'}>
                                    {message}
                                </span>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-600 text-gray-700 mb-2">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder="Enter your full name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-600 text-gray-700 mb-2">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="admin@school.com" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* School Name */}
                            <div>
                                <label className="block text-sm font-600 text-gray-700 mb-2">School Name (Unique ID) *</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        name="schoolName" 
                                        placeholder="e.g., Central High School" 
                                        value={formData.schoolName} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-600 text-gray-700 mb-2">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Create a strong password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Password should be at least 6 characters</p>
                            </div>

                            {/* Register Button */}
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className={`w-full py-3 px-4 rounded-lg font-600 text-white transition duration-200 flex items-center justify-center gap-2 shadow-lg ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                            >
                                <UserPlus className="w-5 h-5" />
                                {loading ? 'Registering...' : 'Register Admin'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-6 mb-6 flex items-center gap-3">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="text-gray-500 text-sm">Or</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-gray-600">Already registered? 
                                <Link to="/admin" className="ml-1 text-indigo-600 hover:text-indigo-700 font-600 underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegisterPage;