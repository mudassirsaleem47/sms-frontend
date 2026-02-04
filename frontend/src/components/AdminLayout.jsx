import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  IconSearch,
  IconUsers,
  IconSchool,
  IconBook,
  IconCalendar,
  IconCurrencyDollar,
  IconFileText,
  IconSettings,
  IconChartBar,
  IconUserPlus,
  IconClipboardList
} from "@tabler/icons-react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Keyboard shortcut for Ctrl+K
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Navigation items for search
  const navigationItems = [
    {
      group: "Main",
      items: [
        { name: "Dashboard", icon: IconChartBar, path: "/admin/dashboard" },
        { name: "Students", icon: IconUsers, path: "/admin/students" },
        { name: "Teachers", icon: IconSchool, path: "/admin/teachers" },
        { name: "Classes", icon: IconBook, path: "/admin/classes" },
      ]
    },
    {
      group: "Academic",
      items: [
        { name: "Subjects", icon: IconBook, path: "/admin/subjects" },
        { name: "Class Schedule", icon: IconCalendar, path: "/admin/class-schedule" },
        { name: "Teacher Schedule", icon: IconCalendar, path: "/admin/teacher-schedule" },
        { name: "Attendance", icon: IconClipboardList, path: "/admin/attendance" },
      ]
    },
    {
      group: "Admissions",
      items: [
        { name: "Student Admission", icon: IconUserPlus, path: "/admin/admissions" },
        { name: "Enquiry", icon: IconFileText, path: "/admin/enquiry" },
        { name: "Promote Students", icon: IconUsers, path: "/admin/promote" },
      ]
    },
    {
      group: "Finance",
      items: [
        { name: "Fee Collection", icon: IconCurrencyDollar, path: "/admin/fees" },
        { name: "Expenses", icon: IconCurrencyDollar, path: "/admin/expenses" },
      ]
    },
    {
      group: "Settings",
      items: [
        { name: "School Settings", icon: IconSettings, path: "/admin/settings" },
      ]
    }
  ];

  // Generate breadcrumb dari current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);

    // Skip first 'admin' segment
    const pathsWithoutAdmin = paths.slice(1);

    // Convert path to readable title
    const toTitle = (str) => {
      return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return pathsWithoutAdmin.map((path, index) => {
      const href = `/admin/${pathsWithoutAdmin.slice(0, index + 1).join('/')}`;
      const isLast = index === pathsWithoutAdmin.length - 1;

      return {
        title: toTitle(path),
        href: href,
        isLast: isLast
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleSelect = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with Breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {/* Dashboard Link */}
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {/* Dynamic Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        {crumb.isLast ? (
                          <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.href}>{crumb.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!crumb.isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Search Bar Trigger */}
          <div className="ml-auto">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <IconSearch className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        </header>

        {/* Command Palette Dialog */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {navigationItems.map((section) => (
              <React.Fragment key={section.group}>
                <CommandGroup heading={section.group}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.path}
                        onSelect={() => handleSelect(item.path)}
                      >
                        <Icon className="mr-2 h-3.5 w-3.5" />
                        <span>{item.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))}
          </CommandList>
        </CommandDialog>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;