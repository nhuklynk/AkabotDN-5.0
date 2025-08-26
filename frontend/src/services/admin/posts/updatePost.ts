import apiClient from "@/services/apiClient";

export interface UpdatePostPayload {
  title?: string;
  summary?: string;
  content?: string;
  post_status?: string;
  user_id: string;
  category_ids?: string;
  tag_ids?: string;
  published_at?: string;
  featured_image?: any;
}

export const updatePost = async (
  id: string | number,
  payload: UpdatePostPayload
) => {
  const response = await apiClient.patch(`/posts/${id}`, payload);
  return response?.data ?? response;
};
