import { useState, useEffect, useCallback } from 'react';
import { getAllPosts, type Post, type PostQueryParams, type PaginatedPostsResponse } from '@/services/admin/posts/getAllPosts';

interface UsePostsOptions {
  initialQuery?: PostQueryParams;
}

export const usePosts = ({ initialQuery = {} }: UsePostsOptions = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<PostQueryParams>(initialQuery);

  const fetchPosts = useCallback(async (page?: number, limit?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...query,
        page: page || query.page || 1,
        limit: limit || query.limit || 10,
      };
      
      const response: PaginatedPostsResponse = await getAllPosts(params);
      
      console.log('API Response:', response);
      console.log('Posts items:', response.items);
      
      setPosts(response.items);
      setPagination({
        currentPage: response.page,
        totalPages: response.totalPages,
        total: response.total,
        limit: response.limit,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const setCurrentPage = useCallback((page: number) => {
    setQuery(prev => ({ ...prev, page }));
  }, []);

  const searchPosts = useCallback((searchTerm: string) => {
    setQuery(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Fetch posts when query changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    pagination,
    loading,
    error,
    query,
    setQuery,
    fetchPosts,
    setCurrentPage,
    searchPosts,
    refreshPosts,
  };
};
