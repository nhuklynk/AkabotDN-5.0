import apiClient from "@/services/apiClient";

export type PostQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  tag?: string;
  author_id?: string;
};

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  summary?: string;
  post_status?: string;
  status?: string;
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
  categories?: Array<{ id: string; name: string; slug: string }>;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  created_at: string;
  updated_at?: string;
  published_at?: string;
};

export type ListPostsResponse = {
  items: PostListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

export async function listPosts(query: PostQuery = {}): Promise<ListPostsResponse> {
  const params = { ...query, status: "active" } as Record<string, any>;
  const res: any = await apiClient.get("/posts", { params });
  const payload = res?.data ?? res;
  const itemsRaw: any[] = Array.isArray(payload) ? payload : (payload?.items ?? []);

  const items: PostListItem[] = itemsRaw.map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    summary: post.summary,
    post_status: post.post_status,
    status: post.status ?? "active",
    featured_image: post.featured_image,
    author_id: post.author_id,
    author_name: post.author_name,
    user: post.user,
    categories: post.categories,
    tags: post.tags,
    created_at: post.created_at,
    updated_at: post.updated_at,
    published_at: post.published_at,
  }));

  return {
    items,
    total: (payload?.total ?? items.length) as number,
    page: (payload?.page ?? query.page ?? 1) as number,
    limit: (payload?.limit ?? query.limit ?? 10) as number,
    totalPages: payload?.totalPages,
  };
}

export default listPosts;


