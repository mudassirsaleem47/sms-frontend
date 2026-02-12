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
  IconUsers,
  IconSchool,
  IconBook,
  IconChartBar,
} from "@tabler/icons-react";
import SearchBar from './SearchBar';



const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [extraBreadcrumb, setExtraBreadcrumb] = useState(null);

  // Reset extra breadcrumb on route change
  useEffect(() => {
    setExtraBreadcrumb(null);
  }, [location.pathname]);

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
      const title = toTitle(path);

      // Skip "Dashboard" from dynamic crumbs to avoid redundancy with the static root crumb
      if (title === "Dashboard") return null;

      return {
        title: title,
        href: href,
        isLast: isLast
      };
    }).filter(Boolean); // Filter out nulls
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
        <header className="flex h-16 shrink-0 sticky top-0 z-50 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {/* Dashboard Link - Always visible as root */}
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
                        {crumb.isLast && !extraBreadcrumb ? (
                          <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.href}>{crumb.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {(!crumb.isLast || extraBreadcrumb) && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                  {extraBreadcrumb && (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{extraBreadcrumb}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto w-full max-w-sm">
            <SearchBar />
          </div>
        </header>


        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 p-4">
          <Outlet context={{ setExtraBreadcrumb }} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;