"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Library,
    Calendar,
    Settings,
    CreditCard,
    Bus,
    FileText,
    MessageSquare,
    UserPlus,
    School,
    Phone,
    Briefcase,
    Plus,
    Search
} from "lucide-react"

import API_URL from '@/config/api';

export default function SearchBar() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [dbResults, setDbResults] = React.useState({ students: [], teachers: [] })
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Debounced Search
    React.useEffect(() => {
        if (!query || query.length < 2 || !currentUser) {
            setDbResults({ students: [], teachers: [] })
            return
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                // Parallel fetching for students and teachers
                // Note: Assuming search endpoints exist or fetching all and filtering. 
                // For better performance, backend SHOULD have a search endpoint.
                // Using existing list endpoints and filtering client side for now as fallback if specific search API doesn't exist

                // Fetch Students (Optimize: ideally a search endpoint)
                const studentsRes = await axios.get(`${API_URL}/Students/${currentUser._id}`);
                const teachersRes = await axios.get(`${API_URL}/Teachers/${currentUser._id}`);

                const filteredStudents = studentsRes.data.filter(s =>
                    s.name.toLowerCase().includes(query.toLowerCase()) ||
                    s.rollNum?.toString().includes(query)
                ).slice(0, 5); // Limit to 5

                const filteredTeachers = teachersRes.data.filter(t =>
                    t.name.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5); // Limit to 5

                setDbResults({
                    students: filteredStudents,
                    teachers: filteredTeachers
                });

            } catch (error) {
                console.error("Search failed:", error);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn)
    }, [query, currentUser])

    const runCommand = React.useCallback((command) => {
        setOpen(false)
        if (typeof command === 'object' && command.url) {
            navigate(command.url, { state: command.state });
        } else {
            navigate(command)
        }
    }, [navigate])

    const navigateToDetail = (type, id) => {
        setOpen(false);
        if (type === 'student') {
            // Navigate to student detail or list filtered by student. 
            // Currently navigating to list, ideal would be /admin/students/:id
            navigate('/admin/students', { state: { searchTarget: id } });
        } else if (type === 'teacher') {
            navigate('/admin/teachers', { state: { searchTarget: id } });
        }
    }

    const pages = [
        {
            group: "Quick Actions",
            items: [
                { title: "Add Student", url: "/admin/admission", icon: UserPlus },
                { title: "Student Admission", url: "/admin/admission", icon: UserPlus },
                { title: "Add Teacher", url: "/admin/teachers", icon: UserPlus, state: { openAddModal: true } },
                { title: "Add Class", url: "/admin/classes", icon: Plus, state: { openAddModal: true } },
                { title: "Add Subject", url: "/admin/subjects", icon: BookOpen, state: { openAddModal: true } },
            ]
        },
        {
            group: "Main",
            items: [
                { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
                { title: "Settings", url: "/admin/settings", icon: Settings },
            ]
        },
        {
            group: "People",
            items: [
                { title: "Students", url: "/admin/students", icon: Users },
                { title: "Teachers", url: "/admin/teachers", icon: GraduationCap },
                { title: "Staff", url: "/admin/staff", icon: Briefcase },
                { title: "Admission Enquiry", url: "/admin/enquiry", icon: Users },
                { title: "Student Admission", url: "/admin/admission", icon: UserPlus },
            ]
        },
        // ... (Other static groups can be kept or shortened for brevity in this replace)
        {
            group: "Academics",
            items: [
                { title: "Classes", url: "/admin/classes", icon: School },
                { title: "Subjects", url: "/admin/subjects", icon: BookOpen },
                { title: "Class Schedule", url: "/admin/class-schedule", icon: Calendar },
                { title: "Lesson Plan", url: "/admin/lesson-plan/manage", icon: Library },
                { title: "Exam Groups", url: "/admin/exam-groups", icon: FileText },
            ]
        },
        {
            group: "Finance",
            items: [
                { title: "Fee Collection", url: "/admin/fee-collection", icon: CreditCard },
                { title: "Fee Management", url: "/admin/fee-management", icon: CreditCard },
                { title: "Income", url: "/admin/income", icon: CreditCard },
                { title: "Expenses", url: "/admin/expense", icon: CreditCard },
            ]
        },
        {
            group: "Transport",
            items: [
                { title: "Transport Routes", url: "/admin/transport/routes", icon: Bus },
                { title: "Vehicle Management", url: "/admin/transport/vehicles", icon: Bus },
            ]
        },
        {
            group: "Communication",
            items: [
                { title: "Send Messages", url: "/admin/send-messages", icon: MessageSquare },
                { title: "Phone Logs", url: "/admin/phone-calls", icon: Phone },
                { title: "Complaints", url: "/admin/complain", icon: MessageSquare },
            ]
        }
    ]

    return (
        <div className="flex flex-col gap-4">
            <Button onClick={() => setOpen(true)} variant="outline" className="w-full justify-between text-muted-foreground">
                <span>Type a command or search...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search pages, students, teachers..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>

                        {/* Database Results */}
                        {dbResults.students.length > 0 && (
                            <CommandGroup heading="Students">
                                {dbResults.students.map((student) => (
                                    <CommandItem
                                        key={student._id}
                                        value={student.name}
                                        onSelect={() => navigateToDetail('student', student._id)}
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>{student.name} (Roll: {student.rollNum})</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {dbResults.teachers.length > 0 && (
                            <CommandGroup heading="Teachers">
                                {dbResults.teachers.map((teacher) => (
                                    <CommandItem
                                        key={teacher._id}
                                        value={teacher.name}
                                        onSelect={() => navigateToDetail('teacher', teacher._id)}
                                    >
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        <span>{teacher.name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        <CommandSeparator />

                        {/* Static Pages Results (Filtered manually since shouldFilter=false) */}
                        {pages.map((group) => {
                            // Filter items based on query
                            const filteredItems = group.items.filter(item =>
                                item.title.toLowerCase().includes(query.toLowerCase())
                            );

                            if (filteredItems.length === 0) return null;

                            return (
                                <React.Fragment key={group.group}>
                                    <CommandGroup heading={group.group}>
                                        {filteredItems.map((item) => (
                                            <CommandItem
                                                key={item.title}
                                                value={item.title}
                                                onSelect={() => runCommand(item)}
                                            >
                                                <item.icon className="mr-2 h-4 w-4" />
                                                <span>{item.title}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    <CommandSeparator />
                                </React.Fragment>
                            );
                        })}
                    </CommandList>
                </Command>
            </CommandDialog>
        </div>
    )
}
