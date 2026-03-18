import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    GraduationCap,
    Menu,
    X,
    ArrowRight,
    Users,
    Wallet,
    CalendarDays,
    ShieldCheck,
    BarChart3,
    BellRing,
    CheckCircle2,
} from 'lucide-react';

const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Stats', id: 'stats' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Contact', id: 'contact' },
];

const features = [
    {
        title: 'Student Lifecycle',
        description: 'Admissions, profiles, attendance, and progress in one structured flow.',
        icon: Users,
        tint: 'from-blue-50 to-cyan-50',
        iconBg: 'bg-blue-600',
    },
    {
        title: 'Finance Control',
        description: 'Track fees, generate receipts, and monitor dues with a clean ledger view.',
        icon: Wallet,
        tint: 'from-emerald-50 to-lime-50',
        iconBg: 'bg-emerald-600',
    },
    {
        title: 'Academic Planning',
        description: 'Class schedules, exam calendars, and subject mapping with less manual work.',
        icon: CalendarDays,
        tint: 'from-amber-50 to-orange-50',
        iconBg: 'bg-amber-600',
    },
    {
        title: 'Secure Access',
        description: 'Role-based authentication so admins, staff, and parents see only what they need.',
        icon: ShieldCheck,
        tint: 'from-violet-50 to-fuchsia-50',
        iconBg: 'bg-violet-600',
    },
    {
        title: 'Smart Reporting',
        description: 'Data-rich dashboards for attendance, finance, and academic insights.',
        icon: BarChart3,
        tint: 'from-rose-50 to-pink-50',
        iconBg: 'bg-rose-600',
    },
    {
        title: 'Instant Alerts',
        description: 'Notify parents and staff quickly with integrated message workflows.',
        icon: BellRing,
        tint: 'from-sky-50 to-indigo-50',
        iconBg: 'bg-sky-600',
    },
];

function Home() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

  return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          </div>

          <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
              <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
                  <button onClick={() => scrollTo('hero')} className="flex items-center gap-2">
                      <div className="rounded-xl bg-slate-900 p-2 text-white">
                          <GraduationCap className="h-5 w-5" />
            </div>
                      <div className="text-left">
                          <p className="text-sm font-semibold leading-tight">School Management</p>
                          <p className="text-xs text-slate-500 leading-tight">Simple Premium Suite</p>
                      </div>
                  </button>

                  <nav className="hidden items-center gap-7 md:flex">
                      {navItems.map((item) => (
                          <button
                              key={item.id}
                              onClick={() => scrollTo(item.id)}
                              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                              {item.label}
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
                      className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                      onClick={() => setMobileOpen((v) => !v)}
                  >
                      {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
        </div>

              {mobileOpen && (
                  <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
                      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
                          {navItems.map((item) => (
                              <button
                                  key={item.id}
                                  onClick={() => scrollTo(item.id)}
                                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                                  {item.label}
                  </button>
                          ))}
                          <div className="mt-2 grid grid-cols-2 gap-2">
                              <Link to="/AdminLogin" onClick={() => setMobileOpen(false)}>
                                  <Button variant="outline" className="w-full">Login</Button>
                              </Link>
                              <Link to="/AdminRegister" onClick={() => setMobileOpen(false)}>
                                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">Start</Button>
                              </Link>
                          </div>
                      </div>
                  </div>
              )}
          </header>

          <main>
              <section id="hero" className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center">
                  <div>
                      <p className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                          Built for schools that want clarity and speed
                      </p>
                      <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                          A Clean and Powerful
                          <span className="block bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700 bg-clip-text text-transparent">School Management Platform</span>
            </h1>
                      <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                          Manage admissions, attendance, fees, academics, and communication from one dashboard designed for daily school operations.
                      </p>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                          <Link to="/AdminRegister">
                              <Button className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800">
                                  Start Free Setup
                                  <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                          </Link>
                          <Link to="/AdminLogin">
                              <Button variant="outline" className="h-11 px-6 border-slate-300 text-slate-700">
                                  Login to Portal
                              </Button>
                          </Link>
                      </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-4 flex items-center justify-between">
                              <div>
                                  <p className="text-sm font-semibold text-slate-900">Admin Dashboard</p>
                                  <p className="text-xs text-slate-500">Live overview</p>
                              </div>
                              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">Online</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                              {[
                                  { label: 'Students', value: '2,450' },
                                  { label: 'Attendance', value: '94%' },
                                  { label: 'Collected Fees', value: '$42k' },
                                  { label: 'Pending Dues', value: '$6.2k' },
                              ].map((item) => (
                                  <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3">
                                      <p className="text-xs text-slate-500">{item.label}</p>
                                      <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                                  </div>
                              ))}
                          </div>

                          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                              <p className="mb-3 text-xs font-medium text-slate-500">Today Tasks</p>
                              <div className="space-y-2">
                                  {['Review fee defaulters', 'Approve 8 admissions', 'Publish exam timetable'].map((task) => (
                                      <div key={task} className="flex items-center gap-2 text-sm text-slate-700">
                                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                          {task}
                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              <section id="features" className="border-y border-slate-200 bg-white py-16">
                  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                      <div className="mb-10 text-center">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple features, serious control</h2>
                          <p className="mt-3 text-slate-600">Everything required to run day-to-day operations without complexity.</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {features.map((feature) => (
                              <article key={feature.title} className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${feature.tint} p-5 transition hover:-translate-y-0.5 hover:shadow-lg`}>
                                  <div className={`mb-4 inline-flex rounded-xl ${feature.iconBg} p-2 text-white shadow-md`}>
                                      <feature.icon className="h-5 w-5" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                              </article>
                          ))}
                      </div>
                  </div>
              </section>

              <section id="stats" className="bg-gradient-to-b from-slate-50 to-white py-16">
                  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          {[
                              { value: '500+', label: 'Schools', ring: 'border-blue-200 bg-blue-50/60' },
                              { value: '10k+', label: 'Students Managed', ring: 'border-emerald-200 bg-emerald-50/60' },
                              { value: '99.9%', label: 'Uptime', ring: 'border-violet-200 bg-violet-50/60' },
                              { value: '24/7', label: 'Support', ring: 'border-amber-200 bg-amber-50/60' },
                          ].map((s) => (
                              <div key={s.label} className={`rounded-2xl border p-5 text-center shadow-sm ${s.ring}`}>
                                  <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{s.value}</p>
                                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>

              <section id="pricing" className="border-y border-slate-200 bg-white py-16">
                  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                      <div className="mb-10 text-center">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Straightforward pricing</h2>
                          <p className="mt-3 text-slate-600">Choose what fits your school size and workflow.</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                          {[
                              { name: 'Starter', price: '$49/mo', points: ['Up to 200 students', 'Attendance + reports', 'Email support'], style: 'border-blue-200 bg-blue-50/50' },
                              { name: 'Pro', price: '$99/mo', points: ['Up to 1000 students', 'Fees + exams + analytics', 'Priority support'], featured: true, style: '' },
                              { name: 'Enterprise', price: 'Custom', points: ['Multi-campus setup', 'Custom integrations', 'Dedicated support'], style: 'border-emerald-200 bg-emerald-50/40' },
                          ].map((plan) => (
                              <div
                                  key={plan.name}
                                  className={`rounded-2xl border p-5 ${plan.featured ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : plan.style}`}
                              >
                                  <p className="text-sm font-medium">{plan.name}</p>
                                  <p className="mt-2 text-3xl font-bold">{plan.price}</p>
                                  <ul className="mt-5 space-y-2 text-sm">
                                      {plan.points.map((point) => (
                                          <li key={point} className="flex items-start gap-2">
                                              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? 'text-cyan-300' : 'text-emerald-600'}`} />
                                              {point}
                                          </li>
                                      ))}
                                  </ul>
                                  <Link to="/AdminRegister" className="mt-6 inline-block w-full">
                                      <Button className={`w-full ${plan.featured ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                          Get Started
                    </Button>
                                  </Link>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>

              <section id="contact" className="py-16">
                  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                      <div className="rounded-3xl bg-slate-900 px-6 py-12 text-center text-white sm:px-10">
                          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to modernize your school operations?</h2>
                          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
                              Start in minutes and move your complete workflow to one secure dashboard.
                          </p>
                          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                              <Link to="/AdminRegister">
                                  <Button className="h-11 bg-white text-slate-900 hover:bg-slate-100">Create School Account</Button>
                              </Link>
                              <Link to="/AdminLogin">
                                  <Button variant="outline" className="h-11 border-white/40 bg-transparent text-white hover:bg-white/10">Go to Login</Button>
                              </Link>
                          </div>
            </div>
          </div>
              </section>
          </main>

          <footer className="border-t border-slate-200 bg-white py-7">
              <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
                  <p>© {new Date().getFullYear()} School Management System. All rights reserved.</p>
                  <p>support@schoolms.com</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
