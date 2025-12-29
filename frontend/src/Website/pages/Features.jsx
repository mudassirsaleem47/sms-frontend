import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, DollarSign, Calendar, BookOpen, BarChart3, Shield, FileText, UserCheck, Bell, Settings } from 'lucide-react';

function Features() {
  const featureCategories = [
    {
      category: "Student Management",
      icon: <Users className="w-8 h-8" />,
      features: [
        "Student admission and enrollment",
        "Student profiles with photos",
        "Attendance tracking",
        "Parent and guardian information",
        "Student promotion and transfer"
      ]
    },
    {
      category: "Fee Management",
      icon: <DollarSign className="w-8 h-8" />,
      features: [
        "Fee structure creation",
        "Online fee collection",
        "Payment receipts generation",
        "Fee defaulter reports",
        "Multiple payment methods"
      ]
    },
    {
      category: "Exam Management",
      icon: <Calendar className="w-8 h-8" />,
      features: [
        "Exam schedule creation",
        "Grade management",
        "Result card generation",
        "Mark sheets printing",
        "Performance analytics"
      ]
    },
    {
      category: "Class Management",
      icon: <BookOpen className="w-8 h-8" />,
      features: [
        "Class and section creation",
        "Subject assignment",
        "Teacher allocation",
        "Timetable management",
        "Classroom resources"
      ]
    },
    {
      category: "Reports & Analytics",
      icon: <BarChart3 className="w-8 h-8" />,
      features: [
        "Student performance reports",
        "Financial reports",
        "Attendance reports",
        "Custom report builder",
        "Data export options"
      ]
    },
    {
      category: "Security & Access",
      icon: <Shield className="w-8 h-8" />,
      features: [
        "Role-based access control",
        "Data encryption",
        "Secure authentication",
        "Activity logs",
        "Backup and recovery"
      ]
    }
  ];

  const additionalFeatures = [
    { icon: <FileText className="w-6 h-6" />, title: "Document Management", desc: "Store and manage all school documents" },
    { icon: <UserCheck className="w-6 h-6" />, title: "Staff Management", desc: "Complete employee records and payroll" },
    { icon: <Bell className="w-6 h-6" />, title: "Notifications", desc: "SMS and email notifications" },
    { icon: <Settings className="w-6 h-6" />, title: "Customizable", desc: "Adapt the system to your needs" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to manage your school efficiently
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {featureCategories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                </div>
                <ul className="space-y-3">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            And Much More...
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Features;
