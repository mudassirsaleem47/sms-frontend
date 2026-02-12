import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  GraduationCap, Users, BookOpen, Calendar, DollarSign, BarChart3,
  Shield, ArrowRight, CheckCircle2, Menu, X, Sparkles,
  Mail, Phone, MapPin, Github, Linkedin, Twitter, Star, Zap, Globe, Lock
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Marquee = ({ children, reverse = false }) => (
  <div className="flex overflow-hidden group">
    <div className={`flex gap-8 animate-marquee ${reverse ? 'flex-row-reverse' : ''} group-hover:paused`}>
      {children}
      {children}
    </div>
  </div>
);

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pricingPeriod, setPricingPeriod] = useState('monthly');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'Benefits', id: 'benefits' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'FAQ', id: 'faq' },
  ];

  const features = [
    { icon: Users, title: 'Student Management', color: "text-blue-500", bg: "bg-blue-500/10", desc: 'Securely manage student records, admissions, attendance, and performance tracking all in one place.' },
    { icon: DollarSign, title: 'Financial Intelligence', color: "text-green-500", bg: "bg-green-500/10", desc: 'Automated fee structures, instant receipts, and defaulter tracking with comprehensive financial reports.' },
    { icon: Calendar, title: 'Smart Scheduling', color: "text-purple-500", bg: "bg-purple-500/10", desc: 'Effortlessly create conflict-free timetables, exam schedules, and academic calendars.' },
    { icon: BookOpen, title: 'Academic Excellence', color: "text-orange-500", bg: "bg-orange-500/10", desc: 'Streamline assignments, syllabus tracking, and grading with our intuitive academic tools.' },
    { icon: BarChart3, title: 'Advanced Analytics', color: "text-pink-500", bg: "bg-pink-500/10", desc: 'Make data-driven decisions with real-time dashboards and detailed performance insights.' },
    { icon: Shield, title: 'Enterprise Security', color: "text-red-500", bg: "bg-red-500/10", desc: 'Bank-grade encryption and role-based access control to keep your institutional data safe.' },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: pricingPeriod === 'monthly' ? "$49" : "$490",
      period: pricingPeriod === 'monthly' ? "/mo" : "/yr",
      desc: "Perfect for small schools getting started.",
      features: ["Up to 200 Students", "Basic Reporting", "Attendance Tracking", "Email Support"],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: pricingPeriod === 'monthly' ? "$99" : "$990",
      period: pricingPeriod === 'monthly' ? "/mo" : "/yr",
      desc: "Comprehensive solution for growing institutions.",
      features: ["Up to 1000 Students", "Advanced Analytics", "Fee Management", "Priority Support", "Exam Management"],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Tailored for large universities & districts.",
      features: ["Unlimited Students", "Custom Integrations", "Dedicated Account Manager", "SLA Support", "Multi-Campus"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption protocols (SSL/TLS) and secure cloud storage to ensure your institution's data is protected at all times." },
    { q: "Can I manage multiple campuses?", a: "Yes! Our Enterprise plan supports multi-campus management from a single unified dashboard." },
    { q: "Do you offer training?", a: "We provide comprehensive video tutorials, documentation, and live onboarding sessions for your staff." },
    { q: "Is there a mobile app?", a: "Our platform is fully responsive and works seamlessly on all devices, including tablets and smartphones." },
  ];

  const trustedLogos = [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
    <div key={i} className="flex items-center gap-2 text-muted-foreground/50 font-bold text-xl mx-8 grayscale opacity-50 hover:opacity-100 transition-opacity cursor-default">
      <div className="h-8 w-8 rounded bg-current"></div>
      SCHOOL {i}
    </div>
  ));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">School MS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group py-1"
                >
                  {link.name}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pl-6 border-l">
              <ModeToggle />
              <Link to="/AdminLogin">
                <Button variant="ghost" size="sm" className="font-medium">Log in</Button>
              </Link>
              <Link to="/AdminRegister">
                <Button size="sm" className="shadow-md font-medium px-5">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav Content */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b bg-background overflow-hidden absolute top-16 left-0 right-0 shadow-xl"
            >
              <div className="container mx-auto px-6 py-4 space-y-4 bg-background">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="block w-full text-left text-sm font-medium py-2 hover:text-primary transition-colors border-b border-border/50 last:border-0"
                  >
                    {link.name}
                  </button>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <Link to="/AdminLogin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">Log in</Button>
                  </Link>
                  <Link to="/AdminRegister" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full justify-start">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero Section ── */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-dot-pattern">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute top-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px] animate-pulse-slow delay-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-8 hover:bg-primary/10 transition-colors cursor-pointer">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping block absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              New Feature: AI-Powered Analytics is now live!
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 pb-2 leading-[1.1]">
              Manage Your School <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Like a Pro</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light text-balance">
              The all-in-one platform that streamlines operations, boosts productivity, and brings your entire institution onto a single, powerful dashboard.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/AdminRegister">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/AdminLogin">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-muted-foreground/20 hover:bg-muted/50 hover:border-foreground/20 transition-all">
                View Live Demo
              </Button>
            </Link>
          </FadeIn>

          {/* Dashboard Mockup with Tilt Effect */}
          <motion.div
            style={{ scale: heroScale, rotateX: 5 }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
            className="group relative mx-auto max-w-6xl rounded-2xl border bg-background/50 shadow-2xl backdrop-blur-sm p-2 md:p-3"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="rounded-xl border bg-card/90 shadow-inner overflow-hidden relative aspect-[16/9] md:aspect-[21/10]">
              {/* Mock UI Content - Replaced with more detail */}
              <div className="absolute inset-0 flex flex-col">
                {/* Mock Window Bar */}
                <div className="h-8 border-b bg-muted/30 flex items-center px-4 gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 h-4 w-64 bg-muted/50 rounded-full text-[10px] flex items-center px-2 text-muted-foreground">school-ms.com/dashboard/admin</div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-16 md:w-64 border-r bg-muted/10 p-4 hidden md:flex flex-col gap-4">
                    <div className="h-8 w-32 bg-primary/20 rounded mb-4"></div>
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-8 w-full bg-muted/30 rounded flex items-center px-2 gap-2"><div className="h-4 w-4 rounded bg-muted/50"></div><div className="h-3 w-20 bg-muted/40 rounded"></div></div>)}
                  </div>
                  <div className="flex-1 p-6 bg-background/40 overflow-hidden">
                    <div className="flex justify-between mb-8 items-center">
                      <div>
                        <div className="h-8 w-48 bg-muted/50 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-muted/30 rounded"></div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-10 w-32 rounded bg-primary/10"></div>
                        <div className="h-10 w-10 rounded-full bg-muted/30 border"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-xl bg-card border shadow-sm p-4 flex flex-col justify-between">
                        <div className="h-8 w-8 rounded bg-primary/10 mb-2"></div>
                        <div><div className="h-6 w-16 bg-muted/40 rounded mb-1"></div><div className="h-3 w-24 bg-muted/20 rounded"></div></div>
                      </div>)}
                    </div>
                    <div className="grid grid-cols-3 gap-6 h-full">
                      <div className="col-span-2 rounded-xl border bg-card shadow-sm p-4">
                        <div className="h-6 w-32 bg-muted/30 rounded mb-4"></div>
                        <div className="flex items-end gap-2 h-40">
                          {[40, 70, 45, 90, 60, 80, 50, 95, 65, 85].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/20 rounded-t hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }}></div>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-1 rounded-xl border bg-card shadow-sm p-4">
                        <div className="h-6 w-32 bg-muted/30 rounded mb-4"></div>
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-12 w-full bg-muted/10 rounded mb-2 flex items-center px-2 gap-2"><div className="h-8 w-8 rounded-full bg-muted/20"></div><div className="flex-1"><div className="h-3 w-full bg-muted/30 rounded mb-1"></div><div className="h-2 w-1/2 bg-muted/20 rounded"></div></div></div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest animate-pulse">Live Dashboard Preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Social Proof (Marquee) ── */}
      <section className="py-10 border-y bg-muted/20 overflow-hidden">
        <div className="flex animate-marquee-container gap-12">
          <Marquee>{trustedLogos}</Marquee>
          <Marquee reverse>{trustedLogos}</Marquee>
        </div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section id="features" className="py-24 md:py-32 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a complete suite of tools to manage every aspect of your educational institution with ease and precision.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="h-full border-muted/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden bg-card/50 backdrop-blur-sm">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${f.bg} to-transparent rounded-bl-full opacity-50 transition-opacity group-hover:opacity-100`}></div>
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className={`h-6 w-6 ${f.color}`} />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {f.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary/10">
            {[
              { label: 'Students Managed', value: '10k+' },
              { label: 'Schools Trust Us', value: '500+' },
              { label: 'Uptime Guarantee', value: '99.9%' },
              { label: 'Expert Support', value: '24/7' }
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1} className="p-4">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2 tabular-nums tracking-tight">{s.value}</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Section ── */}
      <section id="benefits" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Designed for the Future of Education</h2>
              <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
                Built with direct input from educators and administrators, School MS focuses on what truly matters: <span className="text-foreground font-semibold">simplicity, reliability, and powerful insights</span>.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Cloud-Based Architecture", desc: "Access your data securely from anywhere, anytime." },
                  { title: "Real-time Notifications", desc: "Keep parents and students updated instantly." },
                  { title: "Automated Reporting", desc: "Generate complex reports with a single click." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                          <div>
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
              </div>

            </FadeIn>
            <FadeIn delay={0.2} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-50"></div>
              <Card className="relative border bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
                <CardHeader>
                  <CardTitle>Why Administrators Love Us</CardTitle>
                  <CardDescription>Real feedback from our partners</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-5 rounded-xl bg-muted/30 border border-muted/50">
                    <div className="flex gap-1 mb-3 text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="italic text-muted-foreground mb-4 leading-relaxed">"The reporting tools have completely transformed how we handle our finances. What used to take days now takes minutes. It's simply revolutionized our workflow."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                      <div>
                        <p className="text-sm font-bold">Sarah Jenkins</p>
                        <p className="text-xs text-muted-foreground">Principal, Westview Academy</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-muted/30 border border-muted/50">
                    <div className="flex gap-1 mb-3 text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="italic text-muted-foreground mb-4 leading-relaxed">"Finally, a system that teachers actually enjoy using. The attendance and grading modules are intuitive, fast, and require zero training."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                      <div>
                        <p className="text-sm font-bold">Michael Ross</p>
                        <p className="text-xs text-muted-foreground">Admin, Tech High</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the plan that fits your institution's needs. No hidden fees.
            </p>

            <div className="inline-flex items-center p-1 bg-muted rounded-full border mb-8">
              <button
                onClick={() => setPricingPeriod('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${pricingPeriod === 'monthly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingPeriod('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${pricingPeriod === 'yearly' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Yearly <span className="ml-1 text-[10px] text-green-600 font-bold bg-green-100 px-1.5 py-0.5 rounded-full uppercase">Save 20%</span>
              </button>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-2xl scale-105 relative z-10' : 'border-muted/60 hover:border-muted-foreground/30'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3 mt-4">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={plan.popular ? "default" : "outline"} className="w-full h-11" asChild>
                      <Link to="/AdminRegister">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-24 px-6 md:px-0">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about School MS.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-6 relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-600"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">Ready to Transform Your School?</h2>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-light">
              Join hundreds of forward-thinking institutions streamlining their operations today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/AdminRegister">
                <Button size="lg" variant="secondary" className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-black/20 hover:scale-105 transition-transform text-primary font-bold">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-full border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm">
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-sm text-primary-foreground/60">No credit card required · 14-day free trial · Cancel anytime</p>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="border-t bg-card pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-1.5 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold tracking-tight">School MS</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                Empowering education through technology. The most comprehensive platform for modern institutional management.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-foreground">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-foreground">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-foreground">Contact Us</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover:text-foreground transition-colors">support@schoolms.com</span>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover:text-foreground transition-colors">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 group cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover:text-foreground transition-colors">123 Education St, NY</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 School Management System. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
