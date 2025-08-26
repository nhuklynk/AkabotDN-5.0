import apiClient from "@/services/apiClient";
import type { PostListItem } from "./listPosts";

export type CreatePostPayload = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status?: string;
  author_id: string;
  categories?: string[];
  tags?: string[];
  featured_image?: File;
};

export async function createPost(payload: CreatePostPayload): Promise<PostListItem> {
  const formData = new FormData();

  // Add text fields
  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("content", payload.content);
  if (payload.excerpt) formData.append("excerpt", payload.excerpt);
  if (payload.status) formData.append("status", payload.status);
  formData.append("author_id", payload.author_id);

  // Add arrays
  if (payload.categories && payload.categories.length > 0) {
    payload.categories.forEach((categoryId) => {
      formData.append("categories", categoryId);
    });
  }

  if (payload.tags && payload.tags.length > 0) {
    payload.tags.forEach((tagId) => {
      formData.append("tags", tagId);
    });
  }

  // Add featured image if provided
  if (payload.featured_image) {
    formData.append("featured_image", payload.featured_image);
  }

  const response = await apiClient.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data as PostListItem;
}

export default createPost;


