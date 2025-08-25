import apiClient from "../apiClient";

export enum Status {
  ACTIVE = "active", //for delete
  INACTIVE = "inactive", //for delete
  DRAFT = "draft", //for update/create
  PUBLISHED = "published", //for update/create
  ARCHIVED = "archived", //for update/create
  PENDING = "pending", //for update/create
}

// Types based on the backend API
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  summary?: string; // Added for API compatibility
  post_status?: Status;
  status?: Status; // Added for API compatibility
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  user?: {
    // Added for API compatibility
    id: string;
    email: string;
  };
  categories?: Array<{ id: string; name: string; slug: string }>;
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at?: string;
  }>;
  created_at: string;
  updated_at?: string;
  published_at?: string;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  status?: Status;
  category?: string;
  tag?: string;
  search?: string;
  author_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors: null;
  timestamp: string;
  path: string;
}

export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status?: Status;
  author_id: string;
  categories?: string[];
  tags?: string[];
  featured_image?: File;
}

export interface UpdatePostData {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: Status;
  author_id?: string;
  categories?: string[];
  tags?: string[];
  featured_image?: File;
}

class PostService {
  private readonly baseUrl = "/posts";

  /**
   * Search and filter posts with pagination
   */
  async searchAndFilter(
    params: PostQueryParams = {}
  ): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.category) queryParams.append("category", params.category);
    if (params.tag) queryParams.append("tag", params.tag);
    if (params.search) queryParams.append("search", params.search);
    if (params.author_id) queryParams.append("author_id", params.author_id);
    if (params.date_from) queryParams.append("date_from", params.date_from);
    if (params.date_to) queryParams.append("date_to", params.date_to);

    const url = `${this.baseUrl}?${queryParams.toString()}`;

    // apiClient interceptor returns response.data directly
    const response = await apiClient.get(url);

    // response is already the data structure we need
    return response as unknown as PaginatedResponse<Post>;
  }

  /**
   * Get all published posts with pagination
   */
  async getPublishedPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> {
    return this.searchAndFilter({
      page,
      limit,
      status: Status.PUBLISHED,
    });
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(
    categorySlug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> {
    return this.searchAndFilter({
      page,
      limit,
      status: Status.PUBLISHED,
      category: categorySlug,
    });
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(
    tagSlug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> {
    return this.searchAndFilter({
      page,
      limit,
      status: Status.PUBLISHED,
      tag: tagSlug,
    });
  }

  /**
   * Search posts by text
   */
  async searchPosts(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> {
    return this.searchAndFilter({
      page,
      limit,
      status: Status.PUBLISHED,
      search: searchTerm,
    });
  }

  /**
   * Get post by slug
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const response = await apiClient.get(`${this.baseUrl}/slug/${slug}`);
    // Extract post data from the API response structure
    return response.data;
  }

  /**
   * Get post by ID
   */
  async getPostById(id: string): Promise<Post> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    // Extract post data from the API response structure
    return response.data;
  }

  /**
   * Create a new post
   */
  async createPost(postData: CreatePostData): Promise<Post> {
    const formData = new FormData();

    // Add text fields
    formData.append("title", postData.title);
    formData.append("slug", postData.slug);
    formData.append("content", postData.content);
    if (postData.excerpt) formData.append("excerpt", postData.excerpt);
    if (postData.status) formData.append("status", postData.status);
    formData.append("author_id", postData.author_id);

    // Add arrays
    if (postData.categories && postData.categories.length > 0) {
      postData.categories.forEach((categoryId) => {
        formData.append("categories", categoryId);
      });
    }

    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach((tagId) => {
        formData.append("tags", tagId);
      });
    }

    // Add featured image if provided
    if (postData.featured_image) {
      formData.append("featured_image", postData.featured_image);
    }

    return apiClient.post(this.baseUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, postData: UpdatePostData): Promise<Post> {
    return apiClient.patch(`${this.baseUrl}/${id}`, postData);
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get recent posts (last 5 published posts)
   */
  async getRecentPosts(limit: number = 6): Promise<Post[]> {
    const response = await this.searchAndFilter({
      page: 1,
      limit,
      status: Status.PUBLISHED,
    });
    return response.data.items;
  }

  /**
   * Get featured posts (you can implement custom logic here)
   */
  async getFeaturedPosts(limit: number = 3): Promise<Post[]> {
    // This could be implemented based on your business logic
    // For now, returning recent posts
    return this.getRecentPosts(limit);
  }
}

// Export a singleton instance
export const postService = new PostService();
export default postService;
