import apiClient from "@/services/apiClient";

export type UserQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type UserListItem = {
  id: number | string;
  full_name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: string; // active/inactive
  created_at: string;
};

export type GetAllUserResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
};

export async function getAllUser(
  query: UserQuery = {}
): Promise<GetAllUserResponse> {
  const params = { ...query } as Record<string, any>;
  const res: any = await apiClient.get("/users", { params });
  const payload = res?.data ?? res;

  if (Array.isArray(payload)) {
    const items = payload as UserListItem[];
    return {
      items,
      total: typeof res?.total === "number" ? res.total : items.length,
      page: typeof res?.page === "number" ? res.page : params.page ?? 1,
      limit:
        typeof res?.limit === "number"
          ? res.limit
          : params.limit ?? items.length,
    };
  }

  if (payload && Array.isArray(payload.items)) {
    const items = payload.items as UserListItem[];
    return {
      items,
      total: typeof payload.total === "number" ? payload.total : items.length,
      page: typeof payload.page === "number" ? payload.page : params.page ?? 1,
      limit:
        typeof payload.limit === "number"
          ? payload.limit
          : params.limit ?? items.length,
    };
  }

  return {
    items: [],
    total: 0,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };
}

export default getAllUser;

// Fetch users by a single role id
export async function getUsersByRole(roleId: string, query: UserQuery = {}): Promise<GetAllUserResponse> {
  const params = { ...query } as Record<string, any>;
  const res: any = await apiClient.get(`/users/by-role/${roleId}`, { params });
  const payload = res?.data ?? res;

  if (Array.isArray(payload)) {
    const items = payload as UserListItem[];
    return {
      items,
      total: typeof res?.total === "number" ? res.total : items.length,
      page: typeof res?.page === "number" ? res.page : params.page ?? 1,
      limit:
        typeof res?.limit === "number"
          ? res.limit
          : params.limit ?? items.length,
    };
  }

  if (payload && Array.isArray(payload.items)) {
    const items = payload.items as UserListItem[];
    return {
      items,
      total: typeof payload.total === "number" ? payload.total : items.length,
      page: typeof payload.page === "number" ? payload.page : params.page ?? 1,
      limit:
        typeof payload.limit === "number"
          ? payload.limit
          : params.limit ?? items.length,
    };
  }

  return {
    items: [],
    total: 0,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };
}

// Fetch and merge users across multiple role ids, returning a paginated union
export async function getUsersByRolesUnion(roleIds: string[], query: UserQuery = {}): Promise<GetAllUserResponse> {
  const params = { ...query } as Record<string, any>;
  const [page, limit] = [Number(params.page ?? 1), Number(params.limit ?? 10)];

  const results = await Promise.all(
    roleIds.map((id) => getUsersByRole(id, { search: params.search, status: params.status }))
  );
  const merged = results.flatMap((r) => r.items);
  const status = params.status ?? undefined;
  const dedupMap = new Map<string | number, UserListItem>();
  merged.forEach((u) => {
    if (!status || u.status === status) dedupMap.set(u.id, u);
  });
  const allItems = Array.from(dedupMap.values());

  const total = allItems.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageItems = allItems.slice(start, end);

  return {
    items: pageItems,
    total,
    page,
    limit,
  };
}
