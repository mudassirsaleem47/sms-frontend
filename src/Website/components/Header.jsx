import { Link } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'Stats', id: 'stats' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Contact', id: 'contact' },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
              <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2">
                  <div className="rounded-xl bg-slate-900 p-2 text-white">
                      <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                      <p className="text-sm font-semibold leading-tight text-slate-900">School Management</p>
                      <p className="text-xs leading-tight text-slate-500">Simple Premium Suite</p>
                  </div>
              </button>

              <nav className="hidden items-center gap-7 md:flex">
                  {navLinks.map((link) => (
                      <button
                          key={link.id}
                          onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                  {link.name}
              </button>
          ))}
              </nav>

              <div className="hidden items-center gap-2 md:flex">
                  <Link to="/AdminLogin">
                      <Button variant="ghost" className="font-medium">Login</Button>
                  </Link>
                  <Link to="/AdminRegister">
                      <Button className="bg-slate-900 text-white hover:bg-slate-800">Get Started</Button>
                  </Link>
              </div>

              <button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
          </div>

          {mobileMenuOpen && (
              <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
                  <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
                      {navLinks.map((link) => (
                          <button
                              key={link.id}
                              onClick={() => scrollToSection(link.id)}
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    {link.name}
                </button>
            ))}

                      <div className="mt-2 grid grid-cols-2 gap-2">
                          <Link to="/AdminLogin" onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="outline" className="w-full">Login</Button>
                          </Link>
                          <Link to="/AdminRegister" onClick={() => setMobileMenuOpen(false)}>
                              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">Start</Button>
                          </Link>
                      </div>
                  </div>
              </div>
          )}
    </header>
  );
}

export default Header;
