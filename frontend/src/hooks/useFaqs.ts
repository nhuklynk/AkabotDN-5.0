import { useState, useEffect, useCallback, useRef } from "react";
import { faqService, Faq, PaginatedResponse } from "@/services/faqService";

interface PaginationState {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UseFaqsOptions {
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useFaqs(options: UseFaqsOptions = {}) {
  const { initialLimit = 20, autoFetch = true } = options;

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: initialLimit,
  });

  const hasInitialized = useRef(false);

  const fetchFaqs = useCallback(
    async (page = 1, limit = initialLimit, search?: string) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching FAQs with:", { page, limit, search });

        const response = await faqService.searchAndFilter({
          page,
          limit,
          search,
        });

        if (response.success && response.data) {
          if (Array.isArray(response.data.items)) {
            // Paginated response
            setFaqs(response.data.items);
            const paginationData = {
              total: response.data.total || 0,
              totalPages: response.data.totalPages || 0,
              currentPage: response.data.page || page,
              limit: response.data.limit || limit,
            };
            setPagination(paginationData);
          } else if (Array.isArray(response.data)) {
            // Direct array of FAQs
            setFaqs(response.data);
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
            // Single FAQ object
            const faqData = response.data as any;
            if (faqData.id && faqData.content) {
              setFaqs([faqData as Faq]);
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
        console.error("Error fetching FAQs:", err);
        setError("Không thể tải danh sách câu hỏi");
      } finally {
        setLoading(false);
      }
    },
    [] // Empty dependency array to prevent re-creation
  );

  const refreshFaqs = useCallback(() => {
    fetchFaqs(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage, pagination.limit]); // Remove fetchFaqs dependency

  const setCurrentPage = useCallback(
    (page: number) => {
      fetchFaqs(page, pagination.limit);
    },
    [pagination.limit]
  ); // Remove fetchFaqs dependency

  const searchFaqs = useCallback(
    (searchTerm: string) => {
      fetchFaqs(1, pagination.limit, searchTerm);
    },
    [pagination.limit]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchFaqs(1, initialLimit);
    }
  }, [autoFetch]); // Remove fetchFaqs dependency, use initialLimit directly

  return {
    faqs,
    loading,
    error,
    pagination,
    fetchFaqs,
    refreshFaqs,
    setCurrentPage,
    searchFaqs,
    clearError,
  };
}

// Specialized hooks
export function useAllFaqs(limit = 20) {
  return useFaqs({ initialLimit: limit });
}

export function useFaqCategories() {
  const [categories, setCategories] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await faqService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching FAQ categories:", err);
        setError("Không thể tải danh mục câu hỏi");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// This hook is no longer needed since there's no parent-child relationship
// Keeping it for backward compatibility but it will return empty array
export function useFaqsByParent(parentId: string | null, limit = 20) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Return empty since there's no parent structure anymore
  useEffect(() => {
    setFaqs([]);
    setLoading(false);
    setError(null);
  }, [parentId, limit]);

  return { faqs, loading, error };
}

export function usePopularFaqs(limit = 5) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularFaqs = async () => {
      try {
        setLoading(true);
        const popularFaqs = await faqService.getPopularFaqs(limit);
        setFaqs(popularFaqs);
      } catch (err) {
        console.error("Error fetching popular FAQs:", err);
        setError("Không thể tải câu hỏi phổ biến");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularFaqs();
  }, [limit]);

  return { faqs, loading, error };
}
