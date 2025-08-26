import apiClient from "@/services/apiClient";

export interface CreatePostPayload {
  title: string;
  slug: string; // Required by backend CreatePostFormdataDto
  summary?: string;
  content: string;
  post_status?: string; // enum: 'draft', 'published', 'archived', 'scheduled'
  user_id: string; // UUID string
  category_ids?: string; // comma-separated UUIDs
  tag_ids?: string; // comma-separated UUIDs
  published_at?: string; // ISO date string
  featured_image?: any;
}

export const createPost = async (payload: CreatePostPayload) => {
  const response = await apiClient.post('/posts', payload);
  return response?.data ?? response;
};


