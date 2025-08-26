import apiClient from "@/services/apiClient";

export type TagQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; // active/inactive
};

export type TagListItem = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  created_at?: string;
};

export type ListTagsResponse = {
  items: TagListItem[];
  total: number;
  page: number;
  limit: number;
};

export async function listTags(query: TagQuery = {}): Promise<ListTagsResponse> {
  const params = { ...query, status: "active" } as Record<string, any>;
  return apiClient.get("/tags", { params });
}

export default listTags;


