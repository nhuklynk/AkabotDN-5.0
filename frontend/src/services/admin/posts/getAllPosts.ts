import apiClient from "@/services/apiClient";

export interface Post {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  author: string;
  authorId: number;
  category: string;
  categoryId: number;
  featuredImage: string;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  views: number;
  likes: number;
  allowComments?: boolean;
  isFeatured?: boolean;
  requireLogin?: boolean;
  postType?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };
  statusHistory?: { status: string; at: string; by?: string; note?: string }[];
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  postType?: string;
  tag?: string;
}

export interface PaginatedPostsResponse {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAllPosts = async (
  params: PostQueryParams = {}
): Promise<PaginatedPostsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.status && params.status !== "all")
    searchParams.append("status", params.status);
  if (params.category && params.category !== "all")
    searchParams.append("category", params.category);
  if (params.postType && params.postType !== "all")
    searchParams.append("postType", params.postType);
  if (params.tag) searchParams.append("tag", params.tag);

  const response = await apiClient.get(`/posts?${searchParams.toString()}`);

  console.log("Raw API Response:", response);

  // The API response structure is: { success, statusCode, message, data: { items, total, page, limit, totalPages } }
  // But axios already unwraps the response, so we need to check the structure
  console.log("Response structure:", response);

  // If response.data exists and has a 'data' property, that's our actual data
  let data = response?.data?.data || response?.data;

  // Fallback: if we still don't have the right structure, try to find it
  if (!data || !data.items) {
    console.log("Trying to find data structure...");
    if (response?.data?.success && response?.data?.data) {
      data = response.data.data;
    }
  }

  const mappedItems: Post[] = (data.items || []).map((item: any) => {
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.summary || "",
      content: item.content,
      status: item.post_status || item.status,
      author: item.user?.full_name || "Unknown",
      authorId: item.user?.id || 0,
      category: item.categories?.[0]?.name || "Uncategorized",
      categoryId: item.categories?.[0]?.id || 0,
      featuredImage: item.media_id
        ? `/api/media/${item.media_id}`
        : "/placeholder.svg",
      tags: item.tags?.map((tag: any) => tag.name) || [],
      publishedAt: item.published_at,
      createdAt: item.created_at,
      views: 0, // API doesn't provide this yet
      likes: 0, // API doesn't provide this yet
      postType: "article", // Default value
    };
  });

  console.log("Mapped items:", mappedItems);

  return {
    items: mappedItems,
    total: data.total || 0,
    page: data.page || 1,
    limit: data.limit || 10,
    totalPages: data.totalPages || 1,
  };
};
