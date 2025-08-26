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

interface UseActivitiesOptions {
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useActivities(options: UseActivitiesOptions = {}) {
  const { initialLimit = 10, autoFetch = true } = options;

  const [activities, setActivities] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: initialLimit,
  });

  const hasInitialized = useRef(false);

  const fetchActivities = useCallback(
    async (page = 1, limit = initialLimit) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching activities with:", { page, limit });

        const response = await postService.getAssociationActivities(
          page,
          limit
        );

        if (response.success && response.data) {
          if (Array.isArray(response.data.items)) {
            // Paginated response
            setActivities(response.data.items);
            const paginationData = {
              total: response.data.total || 0,
              totalPages: response.data.totalPages || 0,
              currentPage: response.data.page || page,
              limit: response.data.limit || limit,
            };
            setPagination(paginationData);
          } else if (Array.isArray(response.data)) {
            // Direct array of posts
            setActivities(response.data);
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
              setActivities([postData as Post]);
              setPagination({
                total: 1,
                totalPages: 1,
                currentPage: 1,
                limit: 1,
              });
            } else {
              setActivities([]);
              setPagination({
                total: 0,
                totalPages: 0,
                currentPage: 1,
                limit: initialLimit,
              });
            }
          } else {
            setActivities([]);
            setPagination({
              total: 0,
              totalPages: 0,
              currentPage: 1,
              limit: initialLimit,
            });
          }
        } else {
          console.warn("Activities fetch failed:", response.message);
          setError(response.message || "Failed to fetch activities");
          setActivities([]);
          setPagination({
            total: 0,
            totalPages: 0,
            currentPage: 1,
            limit: initialLimit,
          });
        }
      } catch (err) {
        console.error("Activities fetch error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setActivities([]);
        setPagination({
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: initialLimit,
        });
      } finally {
        setLoading(false);
      }
    },
    [initialLimit]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      fetchActivities(page, pagination.limit);
    },
    [fetchActivities, pagination.limit]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchActivities();
    }
  }, [autoFetch, fetchActivities]);

  return {
    activities,
    loading,
    error,
    pagination,
    fetchActivities,
    setCurrentPage,
    refetch: fetchActivities,
  };
}
