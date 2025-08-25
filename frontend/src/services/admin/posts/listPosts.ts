import apiClient from "@/services/apiClient";

export type AdminPostQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; // active/inactive
  post_status?: string; // draft/review/published/...
  post_type?: string;
  user_id?: number | string;
};

export type AdminPostListItem = {
  id: number | string;
  title: string;
  slug: string;
  summary?: string;
  post_status?: string;
  post_type?: string;
  published_at?: string | null;
  media_id?: number | string | null;
  user_id?: number | string;
  created_at?: string;
  status?: string;
};

export type AdminListPostsResponse = {
  items: AdminPostListItem[];
  total: number;
  page: number;
  limit: number;
};

export async function listPosts(query: AdminPostQuery = {}): Promise<AdminListPostsResponse> {
  const params = { ...query } as Record<string, any>;
  return apiClient.get("/posts", { params });
}

export default listPosts;


