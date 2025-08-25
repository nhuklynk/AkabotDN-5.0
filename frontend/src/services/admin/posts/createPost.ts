import apiClient from "@/services/apiClient";

export type CreatePostPayload = {
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  post_status?: string; 
  post_type?: string; 
  published_at?: string | null;
  media_id?: number | string | null;
  user_id?: number | string;
  status?: string;
};

export async function createPost(payload: CreatePostPayload) {
  return apiClient.post("/posts", payload);
}

export default createPost;


