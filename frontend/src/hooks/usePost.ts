import { useState, useEffect, useCallback, useRef } from "react";
import { postService, Post } from "@/services/postService";

interface UsePostOptions {
  autoFetch?: boolean;
}

interface UsePostReturn {
  post: Post | null;
  loading: boolean;
  error: string | null;
  fetchPost: (identifier: string, isSlug?: boolean) => Promise<void>;
  refreshPost: () => Promise<void>;
  clearError: () => void;
}

export function usePost(options: UsePostOptions = {}): UsePostReturn {
  const { autoFetch = false } = options;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIdentifier, setCurrentIdentifier] = useState<string>("");
  const [isCurrentSlug, setIsCurrentSlug] = useState(false);

  // Use refs to track initialization
  const hasInitialized = useRef(false);

  const fetchPost = useCallback(
    async (identifier: string, isSlug: boolean = false) => {
      try {
        setLoading(true);
        setError(null);
        setCurrentIdentifier(identifier);
        setIsCurrentSlug(isSlug);

        let fetchedPost: Post;

        if (isSlug) {
          fetchedPost = await postService.getPostBySlug(identifier);
        } else {
          fetchedPost = await postService.getPostById(identifier);
        }

        setPost(fetchedPost);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Không thể tải bài đăng. Vui lòng thử lại sau.");
        setPost(null);
      } finally {
        setLoading(false);
      }
    },
    [] // Empty dependency array - function never changes
  );

  const refreshPost = useCallback(async () => {
    if (currentIdentifier) {
      await fetchPost(currentIdentifier, isCurrentSlug);
    }
  }, [currentIdentifier, isCurrentSlug, fetchPost]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch && currentIdentifier && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchPost(currentIdentifier, isCurrentSlug);
    }
  }, [currentIdentifier, isCurrentSlug, autoFetch, fetchPost]);

  return {
    post,
    loading,
    error,
    fetchPost,
    refreshPost,
    clearError,
  };
}

// Specialized hooks for common use cases
export function usePostBySlug(slug: string, autoFetch: boolean = true) {
  const hook = usePost({ autoFetch: false });

  useEffect(() => {
    if (slug && !hook.loading && !hook.post) {
      hook.fetchPost(slug, true);
    }
  }, [slug]); // Only depend on slug

  return hook;
}

export function usePostById(id: string, autoFetch: boolean = true) {
  const hook = usePost({ autoFetch: false });

  useEffect(() => {
    if (id && !hook.loading && !hook.post) {
      hook.fetchPost(id, false);
    }
  }, [id]); // Only depend on id

  return hook;
}
