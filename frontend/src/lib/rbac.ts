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

// ---------- Role helpers (CSR-friendly) ----------

export function normalizeRole(input?: string | null): RoleKey {
  const v = (input || "").toString().toLowerCase();
  const allowed: RoleKey[] = ["admin", "moderator", "member", "expert", "guest"];
  return (allowed.includes(v as RoleKey) ? (v as RoleKey) : "guest");
}

export function roleFromProfile(profile?: { roles?: { name?: string }[] } | null): RoleKey {
  const name = profile?.roles?.[0]?.name;
  return normalizeRole(name);
}

export function pickEffectiveRole(profileRole?: RoleKey, reduxRole?: RoleKey): RoleKey {
  return (profileRole && profileRole !== "guest") ? profileRole : (reduxRole || "guest");
}

// Optional: fallback from localStorage token (if app stores one)
type JwtPayload = { role?: string } & Record<string, unknown>;

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

export function decodeJwt(token: string): JwtPayload | null {
  if (!token || token.split(".").length < 2) return null;
  const payloadPart = token.split(".")[1];
  const json = base64UrlDecode(payloadPart);
  try {
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function roleFromToken(token?: string | null): RoleKey {
  const payload = token ? decodeJwt(token) : null;
  return normalizeRole(payload?.role as string | undefined);
}

export function getCurrentRoleFromClientStorage(): RoleKey {
  if (typeof window === "undefined") return "guest";
  try {
    const token = localStorage.getItem("token");
    return roleFromToken(token);
  } catch {
    return "guest";
  }
}
