import apiClient from "@/services/apiClient";

export type AdminPostDetail = {
  id: number | string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  post_status?: string;
  post_type?: string;
  published_at?: string | null;
  media_id?: number | string | null;
  user_id?: number | string;
  created_at?: string;
  status?: string;
};

export async function getPostById(id: number | string): Promise<AdminPostDetail> {
  return apiClient.get(`/posts/${id}`);
}

export default getPostById;


