import apiClient from "@/services/apiClient";

export type CategoryQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; // forward to BE; BE supports multiple statuses but FE filters subset
  name?: string;
  slug?: string;
  parentId?: string | null;
};

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null; // prefer camelCase from API
  parent_id?: string | null; // support legacy
  status: string;
  createdAt?: string;
  created_at?: string; // support legacy
};

export type ListCategoriesResponse = {
  items: CategoryListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

export async function listCategories(query: CategoryQuery = {}): Promise<ListCategoriesResponse> {
  const params = { ...query } as Record<string, any>;
  // apiClient returns response.data from Axios. Backend response shape:
  // { success, statusCode, message, data: { items, total, page, limit, totalPages }, ... }
  const res: any = await apiClient.get("/categories", { params });
  const payload = res?.data ?? res; // support both wrapped and direct
  const itemsRaw = payload?.items ?? [];
  const normalizedItems: CategoryListItem[] = itemsRaw.map((it: any) => ({
    id: String(it.id),
    name: it.name,
    slug: it.slug,
    description: it.description,
    parentId: it.parent?.id ?? it.parentId ?? it.parent_id ?? null,
    parent_id: it.parent_id, // keep legacy if present
    status: it.status ?? "active",
    createdAt: it.createdAt ?? it.created_at,
    created_at: it.created_at,
  }));

  return {
    items: normalizedItems,
    total: payload?.total ?? 0,
    page: payload?.page ?? 1,
    limit: payload?.limit ?? query.limit ?? 10,
    totalPages: payload?.totalPages,
  };
}

export default listCategories;


