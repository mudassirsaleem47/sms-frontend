import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">School MS</span>
                <p className="text-xs text-gray-400 -mt-1">Management System</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modern school management solution built for efficiency and ease of use.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <a href="#demo" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group">
                <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                Demo
              </a>
              <a href="#features" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group">
                <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                Features
              </a>
              <a href="#changelog" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group">
                <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                Changelog
              </a>
              <a href="#support" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group">
                <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                Support
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <div className="flex flex-col gap-3">
              <Link to="/AdminLogin" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group">
                <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                Login
              </Link>
              <Link to="/AdminRegister" className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group">
                <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 transition-all"></span>
                Register
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm group hover:text-white transition">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>support@schoolms.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm group hover:text-white transition">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm group hover:text-white transition">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2025 School Management System. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition group">
              <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition group">
              <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition group">
              <Github className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
