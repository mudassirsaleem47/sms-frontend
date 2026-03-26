import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, MapPin, Search } from 'lucide-react';

const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Programs', id: 'features' },
    { name: 'Blog', id: 'stats' },
    { name: 'Portfolio', id: 'pricing' },
    { name: 'About Us', id: 'contact' },
    { name: 'Contact Us', id: 'contact' },
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
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
            <div className="hidden border-b border-[#153170]/20 bg-[#153170] text-slate-100 md:block">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2 text-xs">
                    <div className="flex flex-wrap items-center gap-5">
                        <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            +92 300 8875374
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            ilmohikmatedu@gmail.com
                        </span>
                        
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-blue-100/90">
                        <MapPin className="h-3.5 w-3.5" />
                        Talwandi, Pakistan
                    </span>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6">
                <button onClick={() => scrollToSection('hero')} className="flex m-3 items-center gap-3">
                    <img
                        src="/soih-logo.png"
                        alt="School of Ilm-o-Hikmat Logo"
                        className="h-16"
                    />
                    <div className="text-left school-body-font">
                        <p className="school-display-font text-base font-extrabold leading-tight text-[#153170]">School of Ilm-o-Hikmat</p>
                        <p className="school-nav-font text-xs font-semibold uppercase tracking-wide text-slate-500">Inspiring Young Minds</p>
                    </div>
                </button>

                <nav className="school-nav-font hidden items-center gap-6 lg:flex">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className="text-sm font-semibold text-slate-600 transition hover:text-[#153170]"
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <button
                        aria-label="Search"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-[#153170]/40 hover:text-[#153170]"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                    <Link to="/login">
                        <Button className="bg-[#153170] text-white hover:bg-[#102858]">Staff Login</Button>
                    </Link>
                </div>

                <button
                    className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
                        <div className="mb-2 rounded-xl bg-slate-100 p-3 text-xs text-slate-700">
                            <p className="font-semibold text-slate-900">Admissions Helpline</p>
                            <p className="mt-1">+92 300 8875374</p>
                            <p>ilmohikmatedu@gmail.com</p>
                        </div>

                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-[#153170]/10 hover:text-[#153170]"
                            >
                                {link.name}
                            </button>
                        ))}

                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-[#153170] text-white hover:bg-[#102858]">Staff Login</Button>
                            </Link>
                            <button
                                aria-label="Search"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
