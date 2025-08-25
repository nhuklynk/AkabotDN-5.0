import { useState, useEffect, useCallback, useRef } from "react";
import {
  postService,
  Post,
  PaginatedResponse,
  Status,
} from "@/services/end-user/postService";

interface PaginationState {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UsePostsOptions {
  initialLimit?: number;
  autoFetch?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { initialLimit = 10, autoFetch = true } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: initialLimit,
  });

  const hasInitialized = useRef(false);

  const fetchPosts = useCallback(
    async (page = 1, limit = initialLimit) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching posts with:", { page, limit });

        const response = await postService.searchAndFilter({
          page,
          limit,
          status: Status.PUBLISHED,
        });

        if (response.success && response.data) {
          if (Array.isArray(response.data.items)) {
            // Paginated response
            setPosts(response.data.items);
            const paginationData = {
              total: response.data.total || 0,
              totalPages: response.data.totalPages || 0,
              currentPage: response.data.page || page,
              limit: response.data.limit || limit,
            };
            setPagination(paginationData);
          } else if (Array.isArray(response.data)) {
            // Direct array of posts
            setPosts(response.data);
            setPagination({
              total: response.data.length,
              totalPages: 1,
              currentPage: 1,
              limit: response.data.length,
            });
          } else if (
            typeof response.data === "object" &&
            response.data !== null
          ) {
            // Single post object
            const postData = response.data as any;
            if (postData.id && postData.title) {
              setPosts([postData as Post]);
              setPagination({
                total: 1,
                totalPages: 1,
                currentPage: 1,
                limit: 1,
              });
            }
          }
        } else {
          console.error("Invalid response structure:", response);
          setError("Dữ liệu không hợp lệ từ server");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Không thể tải danh sách bài viết");
      } finally {
        setLoading(false);
      }
    },
    [] // Remove initialLimit dependency to prevent re-creation
  );

  const refreshPosts = useCallback(() => {
    fetchPosts(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage, pagination.limit]); // Remove fetchPosts dependency

  const setCurrentPage = useCallback(
    (page: number) => {
      fetchPosts(page, pagination.limit);
    },
    [pagination.limit]
  ); // Remove fetchPosts dependency

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchPosts(1, initialLimit);
    }
  }, [autoFetch]); // Remove fetchPosts dependency, use initialLimit directly

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    refreshPosts,
    setCurrentPage,
    clearError,
  };
}

// Specialized hooks
export function usePublishedPosts(limit = 10) {
  return usePosts({ initialLimit: limit });
}

export function useRecentPosts(limit = 5) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const recentPosts = await postService.getRecentPosts(limit);
        setPosts(recentPosts);
      } catch (err) {
        console.error("Error fetching recent posts:", err);
        setError("Không thể tải bài viết gần đây");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [limit]);

  return { posts, loading, error };
}

export function useFeaturedPosts(limit = 3) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const featuredPosts = await postService.getFeaturedPosts(limit);
        setPosts(featuredPosts);
      } catch (err) {
        console.error("Error fetching featured posts:", err);
        setError("Không thể tải bài viết nổi bật");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, [limit]);

  return { posts, loading, error };
}
