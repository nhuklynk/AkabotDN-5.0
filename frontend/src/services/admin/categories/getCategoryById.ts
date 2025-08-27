import apiClient from "@/services/apiClient";

export type CategoryDetail = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | string | null;
  status: string;
  created_by?: number | string;
  created_at?: string;
  modified_by?: number | string;
  modified_at?: string;
};

export async function getCategoryById(id: number | string): Promise<CategoryDetail> {
  const response = await apiClient.get(`/categories/${id}`) as any;
  // Handle API response structure (response is already unwrapped by apiClient interceptor)
  const data = response?.data ?? response;
  
  // Normalize response to CategoryDetail format
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    parent_id: data.parent?.id ?? data.parent_id ?? null,
    status: data.status ?? "active",
    created_by: data.created_by,
    created_at: data.created_at,
    modified_by: data.modified_by,
    modified_at: data.modified_at,
  };
}

export default getCategoryById;


