export type RoleKey =
  | "admin"
  | "moderator"
  | "member"
  | "expert"
  | "guest";

// Define which admin routes each role can see/access
export const roleToAllowedRoutes: Record<RoleKey, string[]> = {
  admin: [
    "/admin",
    "/admin/user-management",
    "/admin/resource-management",
    "/admin/category-management",
    "/admin/post-management",
    "/admin/event-management",
    "/admin/faq-management",
    "/admin/permission-management",
  ],
  moderator: [
    "/admin",
    "/admin/post-management",
    "/admin/category-management",
    "/admin/resource-management",
    "/admin/event-management",
    "/admin/faq-management",
  ],
  member: ["/admin", "/admin/faq-management"],
  expert: ["/admin", "/admin/post-management"],
  guest: [
    "/admin",
    "/admin/user-management",
    "/admin/resource-management",
    "/admin/category-management",
    "/admin/post-management",
    "/admin/event-management",
    "/admin/faq-management",
    "/admin/permission-management",
  ],
};

export function isRouteAllowed(role: RoleKey, path: string): boolean {
  const rules = roleToAllowedRoutes[role] || roleToAllowedRoutes.guest;
  return rules.some((r) => path === r || path.startsWith(r + "/"));
}

export function filterNavigation<T extends { href: string }>(
  items: T[],
  role: RoleKey
): T[] {
  const rules = roleToAllowedRoutes[role] || roleToAllowedRoutes.guest;
  return items.filter((i) => rules.some((r) => i.href === r));
}
