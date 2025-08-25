import apiClient from "@/services/apiClient";

// Matches posts entity: id, status, created_by, created_at, modified_by, modified_at,
// title, slug, content, post_status, summary, published_at, post_type, media_id, user_id
export type CreatePostPayload = {
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  post_status?: string; // draft | review | published | rejected | archived | scheduled
  post_type?: string; // article | news | event | guide ...
  published_at?: string | null; // ISO date
  media_id?: number | string | null;
  user_id?: number | string; // author/user id
  status?: string; // active/inactive
};

export async function createPost(payload: CreatePostPayload) {
  return apiClient.post("/posts", payload);
}

export default createPost;


