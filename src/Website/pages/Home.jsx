import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import {
    ArrowRight,
    Users,
    Wallet,
    CalendarDays,
    ShieldCheck,
    BarChart3,
    BellRing,
    CheckCircle2,
} from 'lucide-react';

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
  return (
      <div className="school-body-font min-h-screen bg-slate-50 text-slate-900">
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          </div>

          <Header />

          <main>
              <section id="hero" className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-6">
                  <img
                      src="/upen-element.webp"
                      alt="Decorative element"
                      className="hero-spark pointer-events-none absolute right-[22%] top-8 hidden h-20 w-20 opacity-90 md:block"
                  />
                  <img
                      src="/text-layer.webp"
                      alt="Decorative element"
                      className="hero-spark pointer-events-none absolute left-[28%] top-[14%] hidden h-10 w-10 opacity-80 md:block"
                  />

                  <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.35fr_1fr]">
                      <div className="order-2 lg:order-1">
                          <img
                              src="/Hero-section-image-1.webp"
                              alt="Student"
                              className="hero-float-left mx-auto w-full max-w-[300px] object-contain drop-shadow-2xl"
                          />
                      </div>

                      <div className="order-1 text-center lg:order-2">
                          <p className="mx-auto mb-4 inline-flex items-center rounded-full border border-[#153170]/20 bg-[#153170]/5 px-3 py-1 text-xs font-semibold text-[#153170]">
                              Welcome to our learning community
                          </p>

                          <h1 className="school-display-font text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                              <span className="school-gradient-blue block">Exploring The</span>
                              <span className="mt-1 block text-slate-900">School Of</span>
                              <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent to-yellow-500 mt-1 block">Ilm-o-Hikmat</span>
                          </h1>

                          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-slate-600 sm:text-lg">
                              We are dedicated to nurturing the leaders of tomorrow. With a strong emphasis on academic excellence, moral values, and holistic development.
                          </p>

                          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                              <Link to="/AdminRegister">
                                  <Button className="h-11 px-6 bg-[#153170] text-white hover:bg-[#102858]">
                                      Apply for Admission
                                      <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                              </Link>
                              <Link to="/AdminLogin">
                                  <Button variant="outline" className="h-11 border-[#153170]/30 px-6 text-[#153170] hover:bg-[#153170]/5">
                                      About Us
                                  </Button>
                              </Link>
                          </div>
                      </div>

                      <div className="order-3">
                          <img
                              src="/Hero-section-image-2.webp"
                              alt="Student"
                              className="hero-float-right mx-auto w-full max-w-[300px] object-contain drop-shadow-2xl"
                          />
                      </div>
                  </div>
              </section>

              <section id="features" className="border-b border-slate-200 bg-gradient-to-br from-slate-50/50 to-white py-16 md:py-20">
                  <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 md:gap-12 md:grid-cols-2 md:px-6">
                      <div>
                          <p className="school-nav-font mb-3 text-sm font-bold uppercase tracking-widest text-amber-500">Key Features</p>
                          <h2 className="school-display-font mb-6 text-4xl font-extrabold text-slate-900">
                              <span className="">ILM-O-HIKMAT</span>
                          </h2>
                          <p className="mb-6 text-base font-semibold leading-relaxed text-slate-700">
                              At ILM-O-HIKMAT, we offer a balanced education that focuses on both academics and personal growth.
                          </p>

                          <ul className="space-y-3 text-sm font-medium text-slate-600">
                              <li className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#153170] text-white text-xs font-bold">✓</span>
                                  <span>Hands-on activities to build creativity and critical thinking.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#153170] text-white text-xs font-bold">✓</span>
                                  <span>A structured curriculum for measurable progress.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#153170] text-white text-xs font-bold">✓</span>
                                  <span>Combining quality education with spiritual development.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#153170] text-white text-xs font-bold">✓</span>
                                  <span>Fun programs to enhance leadership and teamwork.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#153170] text-white text-xs font-bold">✓</span>
                                  <span>Assessments focused on understanding, not memorization.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#153170] text-white text-xs font-bold">✓</span>
                                  <span>Modern tech tools for interactive learning.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#153170] text-white text-xs font-bold">✓</span>
                                  <span>Platforms to showcase talent and creativity.</span>
                              </li>
                          </ul>

                          <p className="mt-8 text-sm font-semibold text-[#153170]">
                              Join us to inspire young minds and shape a brighter future!
                          </p>
                      </div>

                      <div className="grid auto-rows-max grid-cols-2 gap-6 sm:gap-8">
                          {[
                              { label: 'Activity & Skillbase\nlearning', color: 'from-amber-400 to-orange-500', icon: '🎯' },
                              { label: 'SLO Base Study', color: 'from-rose-400 to-rose-500', icon: '📊' },
                              { label: 'Hifz-Ul-Quran +\nNazra', color: 'from-blue-400 to-blue-500', icon: '📖' },
                              { label: 'Co-curricular\nactivities', color: 'from-indigo-600 to-slate-900', icon: '⚽' },
                              { label: 'Concept Base\nPaper System', color: 'from-emerald-400 to-green-500', icon: '✏️' },
                              { label: 'Educational\nexhibition', color: 'from-slate-500 to-slate-600', icon: '🎨' },
                              { label: 'E-Lab System', color: 'from-slate-600 to-slate-700', icon: '💻' },
                          ].map((feature, idx) => (
                              <div key={idx} className="flex flex-col items-center justify-center gap-3 text-center">
                                  <div className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${feature.color} text-4xl shadow-lg transition hover:scale-110 hover:shadow-xl`}>
                                      {feature.icon}
                                  </div>
                                  <p className="school-nav-font text-sm font-semibold leading-snug text-slate-700 whitespace-pre-line">
                                      {feature.label}
                                  </p>
                              </div>
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
