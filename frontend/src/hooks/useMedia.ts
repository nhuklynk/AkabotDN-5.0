import { useState, useEffect, useCallback, useRef } from "react";
import {
  mediaService,
  MediaItem,
  MediaType,
  PaginatedResponse,
} from "@/services/end-user/mediaService";

interface PaginationState {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UseMediaOptions {
  initialLimit?: number;
  autoFetch?: boolean;
  type?: MediaType;
}

export function useMedia(options: UseMediaOptions = {}) {
  const { initialLimit = 9, autoFetch = true, type } = options;

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: initialLimit,
  });

  const hasInitialized = useRef(false);

  const fetchMedia = useCallback(
    async (page = 1, limit = initialLimit, mediaType?: MediaType) => {
      try {
        setLoading(true);
        setError(null);

        let response: PaginatedResponse<MediaItem>;
        
        if (mediaType) {
          response = await mediaService.getMediaByType(mediaType, {
            page,
            limit,
          });
        } else {
          response = await mediaService.searchAndFilter({
            page,
            limit,
          });
        }

        if (response.success && response.data) {
          if (Array.isArray(response.data.items)) {
            // Paginated response
            setMedia(response.data.items);
            const paginationData = {
              total: response.data.total || 0,
              totalPages: response.data.totalPages || 0,
              currentPage: response.data.page || page,
              limit: response.data.limit || limit,
            };
            setPagination(paginationData);
          } else if (Array.isArray(response.data)) {
            // Direct array of media items
            setMedia(response.data);
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
            // Single media object
            const mediaData = response.data as any;
            if (mediaData.id && mediaData.title) {
              setMedia([mediaData as MediaItem]);
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
        console.error("Error fetching media:", err);
        setError("Không thể tải danh sách tư liệu");
      } finally {
        setLoading(false);
      }
    },
    [initialLimit]
  );

  const refreshMedia = useCallback(() => {
    fetchMedia(pagination.currentPage, pagination.limit, type);
  }, [fetchMedia, pagination.currentPage, pagination.limit, type]);

  const setCurrentPage = useCallback(
    (page: number) => {
      fetchMedia(page, pagination.limit, type);
    },
    [fetchMedia, pagination.limit, type]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchMedia(1, initialLimit, type);
    }
  }, [autoFetch, fetchMedia, initialLimit, type]);

  return {
    media,
    loading,
    error,
    pagination,
    fetchMedia,
    refreshMedia,
    setCurrentPage,
    clearError,
  };
}

// Specialized hooks
export function useImageMedia(limit = 9) {
  return useMedia({ initialLimit: limit, type: MediaType.DOCUMENT_IMAGE });
}

export function useVideoMedia(limit = 9) {
  return useMedia({ initialLimit: limit, type: MediaType.DOCUMENT_VIDEO });
}

export function useRecentMedia(limit = 6) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentMedia = async () => {
      try {
        setLoading(true);
        const recentMedia = await mediaService.getRecentMedia(limit);
        setMedia(recentMedia);
      } catch (err) {
        console.error("Error fetching recent media:", err);
        setError("Không thể tải tư liệu gần đây");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMedia();
  }, [limit]);

  return { media, loading, error };
}
