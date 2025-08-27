"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  CalendarDays,
  ChevronDown,
  User,
  Settings,
  LogOut,
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
import LanguageSwitcher from "@/components/language-switcher";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { filterNavigation, RoleKey } from "@/lib/rbac";
import { useLocale } from "@/hooks/useLocale";
import { clearStuckOverlays } from "@/lib/dialog-utils";
import { useProfile } from "@/hooks/auth/useProfile";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import LogoutButton from "@/components/LogoutButton";
import { useLogout } from "@/hooks/auth/useLogout";

type NavItem = {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string }[];
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLocale();
  const dispatch = useDispatch();
  const userRole = (useSelector((s: RootState) => s.auth.user?.role) ||
    "guest") as RoleKey;
  const {
    data: profile,
    error: profileError,
    isLoading: profileLoading,
  } = useProfile();

  const logoutMutation = useLogout();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownOpen &&
        !(event.target as Element).closest(".profile-dropdown")
      ) {
        setProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileDropdownOpen]);

  // Get role from profile API - this is the source of truth
  const effectiveRole = React.useMemo(() => {
    if (profile?.roles && profile.roles.length > 0) {
      const roleName = profile.roles[0].name?.toLowerCase();
      const allowed: RoleKey[] = [
        "admin",
        "moderator",
        "member",
        "expert",
        "guest",
      ];
      if (allowed.includes(roleName as RoleKey)) {
        return roleName as RoleKey;
      }
    }
    // Fallback to Redux role if profile doesn't have roles
    return userRole;
  }, [profile, userRole]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (key: string) =>
    setOpenGroups((p) => ({ ...p, [key]: !p[key] }));
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const navigation: NavItem[] = useMemo(
    () => [
      {
        name: t("admin.nav.dashboard"),
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        name: t("admin.nav.userManagement"),
        href: "/admin/user-management",
        icon: Users,
        children: [
          { name: t("admin.nav.userAll"), href: "/admin/user-management" },
          {
            name: t("admin.nav.userMembersExperts"),
            href: "/admin/user-management?tab=members-experts",
          },
        ],
      },
      {
        name: t("admin.nav.resourceManagement"),
        href: "/admin/resource-management",
        icon: FolderOpen,
      },
      {
        name: t("admin.nav.categoryManagement"),
        href: "/admin/category-management",
        icon: Tag,
      },
      {
        name: t("admin.nav.postManagement"),
        href: "/admin/post-management",
        icon: FileText,
      },
      {
        name: t("admin.nav.eventManagement"),
        href: "/admin/event-management",
        icon: CalendarDays,
      },
      {
        name: t("admin.nav.faqManagement"),
        href: "/admin/faq-management",
        icon: HelpCircle,
      },
      {
        name: t("admin.nav.permissionManagement"),
        href: "/admin/permission-management",
        icon: ShieldCheck,
      },
    ],
    [t]
  );
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

  // Clear stuck overlays on route change
  useEffect(() => {
    clearStuckOverlays();
  }, [pathname]);

  const nameMap = useMemo(() => {
    const map = new Map<string, string>();
    navigation.forEach((n) => map.set(n.href, n.name));
    return map;
  }, [navigation]);

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
          <div
            className={cn(
              "flex h-16 items-center px-6 border-b border-sidebar-border",
              sidebarCollapsed ? "lg:justify-center" : "justify-between"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2",
                sidebarCollapsed && "lg:gap-0"
              )}
            >
              <div className="h-8 w-8 rounded  flex items-center justify-center overflow-hidden">
                <img
                  src="/icons/logo.png"
                  alt="Hiệp hội Dữ liệu Quốc gia Việt Nam"
                  width={32}
                  height={32}
                  className="object-contain h-8 w-8"
                />
              </div>
              <h1
                className={cn(
                  "text-xl font-bold text-sidebar-foreground transition-opacity duration-300",
                  sidebarCollapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                )}
              >
                {t("nav.admin")}
              </h1>
            </div>

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
            {filterNavigation(navigation, effectiveRole).map((item) => {
              const isActive = pathname === item.href;
              if (item.children && !sidebarCollapsed) {
                const open = openGroups[item.href] ?? true;
                const isChildActive = (childHref: string) => {
                  if (!mounted) return false;
                  const isMembersExperts =
                    childHref.includes("members-experts");
                  const tab = searchParams?.get("tab");
                  if (isMembersExperts)
                    return (
                      tab === "members-experts" &&
                      pathname === "/admin/user-management"
                    );
                  // default child (all users) active when not members-experts
                  return (
                    pathname === "/admin/user-management" &&
                    tab !== "members-experts"
                  );
                };
                const hasActiveChild = item.children.some((c) =>
                  isChildActive(c.href)
                );
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        hasActiveChild
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                      )}
                      onClick={() => toggleGroup(item.href)}
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span
                        className="flex-1 text-left"
                        suppressHydrationWarning
                      >
                        {item.name}
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          open && "rotate-90"
                        )}
                      />
                    </button>
                    {open && (
                      <div className="ml-9 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-primary/80 hover:text-sidebar-primary-foreground transition-colors",
                              isChildActive(child.href) &&
                                "bg-sidebar-accent text-sidebar-accent-foreground"
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span suppressHydrationWarning>{child.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              if (item.children && sidebarCollapsed) {
                const tab = mounted ? searchParams?.get("tab") : null;
                const hasActiveChild =
                  mounted &&
                  pathname === "/admin/user-management" &&
                  (tab === "members-experts" || tab === null);
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center rounded-lg py-2 lg:px-2 text-sm font-medium transition-colors",
                        isActive || hasActiveChild
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                      )}
                      onClick={() => setSidebarOpen(false)}
                      title={item.name}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                    </Link>
                    <div className="absolute left-full top-0 ml-3 hidden group-hover:block z-50">
                      <div className="min-w-[200px] rounded-md border border-border bg-popover p-2 shadow-lg">
                        <div
                          className="px-2 pb-2 text-xs font-medium text-muted-foreground"
                          suppressHydrationWarning
                        >
                          {item.name}
                        </div>
                        <div className="space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "block rounded-md px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-primary/80 hover:text-sidebar-primary-foreground",
                                mounted &&
                                  (child.href.includes("members-experts")
                                    ? tab === "members-experts"
                                    : tab !== "members-experts") &&
                                  pathname === "/admin/user-management" &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <span suppressHydrationWarning>{child.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
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
                  {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                  {!sidebarCollapsed && (
                    <span className="lg:block" suppressHydrationWarning>
                      {item.name}
                    </span>
                  )}

                  {sidebarCollapsed && (
                    <div
                      className="absolute left-full ml-6 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block border border-border"
                      suppressHydrationWarning
                    >
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
          <div className="flex items-center gap-4">
            {/* User Profile Info with Dropdown */}
            {profileLoading ? (
              <div className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="hidden md:block space-y-1">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ) : profile && profile.full_name ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => {
                    console.log("Profile button clicked!");
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  className="relative p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <img
                    src={profile.avatar || "/icons/avatar-default.svg"}
                    alt={profile.full_name || "User avatar"}
                    className="w-6 h-6 rounded-full object-cover border border-white shadow-sm hover:shadow-md transition-shadow"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0" fill="#6b7280"/>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        {profile.avatar ? (
                          <img
                            src={profile.avatar}
                            alt={profile.full_name}
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
                            <User className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900 truncate">
                            {profile.full_name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {profile.email}
                          </p>
                          {profile.roles && profile.roles.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="px-2 py-1 bg-blue-100 rounded-full">
                                <p className="text-xs text-blue-700 font-semibold capitalize">
                                  {profile.roles[0].name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-100 my-4"></div>
                      <button
                        onClick={() => {
                          logoutMutation.mutate();
                          setProfileDropdownOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                          {logoutMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4" />
                          )}
                        </div>
                        <span>
                          {logoutMutation.isPending
                            ? "Đang đăng xuất..."
                            : "Đăng xuất"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Debug Profile Info */}
            {(() => {
              console.log("🔍 Debug Profile:", {
                profile,
                profileLoading,
                profileError,
              });
              return null;
            })()}

            <LanguageSwitcher compact />
            {/* Hidden emergency button to clear stuck overlays */}
            <button
              onClick={clearStuckOverlays}
              className="hidden"
              id="emergency-clear-overlays"
              title="Emergency: Clear stuck overlays"
            >
              Clear Overlays
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Suspense
            fallback={
              <div className="fixed inset-0 z-[30] pointer-events-none flex items-center justify-center">
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
