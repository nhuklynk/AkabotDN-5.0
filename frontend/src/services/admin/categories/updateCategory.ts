import apiClient from "@/services/apiClient";
import { CreateCategoryPayload } from "./createCategory";
import type { CategoryListItem } from "./listCategories";

export async function updateCategory(
  id: number | string,
  payload: Partial<CreateCategoryPayload>
): Promise<CategoryListItem> {
  const response = (await apiClient.patch(`/categories/${id}`, payload)) as any;
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

export default updateCategory;
