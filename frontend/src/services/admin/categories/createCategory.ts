import apiClient from "@/services/apiClient";
import type { CategoryListItem } from "./listCategories";

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
};

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<CategoryListItem> {
  const body: any = { ...payload };
  if (!body.parent_id) delete body.parent_id; // omit when null/undefined/empty

  const response = (await apiClient.post("/categories", body)) as any;
  // Handle API response structure (response is already unwrapped by apiClient interceptor)
  const data = response?.data ?? response;

  // Normalize response to CategoryListItem format
  return {
    id: String(data.id),
    name: data.name,
    slug: data.slug,
    description: data.description,
    parentId: data.parent?.id ?? data.parentId ?? data.parent_id ?? null,
    parent_id: data.parent_id,
    status: data.status ?? "active",
    createdAt: data.createdAt ?? data.created_at,
    created_at: data.created_at,
  };
}

export default createCategory;
