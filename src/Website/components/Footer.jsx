import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

function Footer() {
  return (
      <footer className="border-t border-slate-200 bg-white py-10">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-4">
              <div className="md:col-span-2">
                  <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-xl bg-slate-900 p-2 text-white">
                          <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                          <p className="text-sm font-semibold leading-tight text-slate-900">School Management</p>
                          <p className="text-xs leading-tight text-slate-500">Simple Premium Suite</p>
                      </div>
                  </div>
                  <p className="max-w-lg text-sm leading-relaxed text-slate-600">
                      A focused school platform for admissions, academics, attendance, fees, and communication.
                  </p>
              </div>

              <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">Quick Links</h3>
                  <div className="space-y-2 text-sm">
                      <a href="#features" className="block text-slate-600 transition hover:text-slate-900">Features</a>
                      <a href="#stats" className="block text-slate-600 transition hover:text-slate-900">Stats</a>
                      <a href="#pricing" className="block text-slate-600 transition hover:text-slate-900">Pricing</a>
                      <a href="#contact" className="block text-slate-600 transition hover:text-slate-900">Contact</a>
                  </div>
              </div>

              <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">Access</h3>
                  <div className="space-y-2 text-sm">
                      <Link to="/AdminLogin" className="block text-slate-600 transition hover:text-slate-900">Login</Link>
                      <Link to="/AdminRegister" className="block text-slate-600 transition hover:text-slate-900">Register</Link>
          </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>support@schoolms.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>+92 300 1234567</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Pakistan</span>
                      </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                      {[Twitter, Linkedin, Github].map((Icon, idx) => (
                          <a
                              key={idx}
                              href="#"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                          >
                              <Icon className="h-4 w-4" />
                          </a>
            ))}
          </div>
        </div>
          </div>

          <div className="mx-auto mt-8 w-full max-w-6xl border-t border-slate-200 px-4 pt-4 text-xs text-slate-500 sm:px-6">
              © {new Date().getFullYear()} School Management System. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
