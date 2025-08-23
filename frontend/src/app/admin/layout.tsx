"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  FolderOpen,
  Tag,
  FileText,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

const navigation = [
  {
    name: "Bảng điều khiển",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Quản lý người dùng",
    href: "/admin/user-management",
    icon: Users,
  },
  {
    name: "Quản lý tài nguyên",
    href: "/admin/resource-management",
    icon: FolderOpen,
  },
  {
    name: "Quản lý danh mục",
    href: "/admin/category-management",
    icon: Tag,
  },
  {
    name: "Quản lý bài viết",
    href: "/admin/post-management",
    icon: FileText,
  },
  {
    name: "Quản lý FAQ",
    href: "/admin/faq-management",
    icon: HelpCircle,
  },
  {
    name: "Phân quyền",
    href: "/admin/permission-management",
    icon: ShieldCheck,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Prefetch admin routes to speed up navigation
  useEffect(() => {
    navigation.forEach((n) => {
      if (typeof n.href === "string") router.prefetch(n.href);
    });
  }, [router]);

  const nameMap = useMemo(() => {
    const map = new Map<string, string>();
    navigation.forEach((n) => map.set(n.href, n.name));
    return map;
  }, []);

  const toTitle = (slug: string) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((_, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = nameMap.get(href) || toTitle(segments[idx]);
    return { href, label };
  });
  const currentTitle =
    breadcrumbItems[breadcrumbItems.length - 1]?.label || "Bảng điều khiển";

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          "lg:w-64",
          sidebarCollapsed && "lg:w-16",
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <h1
              className={cn(
                "text-xl font-bold text-sidebar-foreground transition-opacity duration-300",
                sidebarCollapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
              )}
            >
              Bảng quản trị
            </h1>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg py-2 text-sm font-medium transition-colors relative group",
                    sidebarCollapsed
                      ? "lg:justify-center lg:px-2"
                      : "gap-3 px-3",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="lg:block">{item.name}</span>
                  )}

                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-6 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block border border-border">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            <div className="flex flex-col">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, idx) => {
                    const isLast = idx === breadcrumbItems.length - 1;
                    return (
                      <React.Fragment key={item.href}>
                        {idx > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={item.href}>{item.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="flex items-center gap-4" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Suspense
            fallback={
              <div className="fixed inset-0 flex items-center justify-center">
                <Spinner size={36} className="text-foreground" />
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
