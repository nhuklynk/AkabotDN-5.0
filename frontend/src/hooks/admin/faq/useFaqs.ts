import { useState, useCallback, useMemo, useEffect } from "react";
import listFaqs, { FaqQuery, FaqListItem, ListFaqsResponse } from "@/services/admin/faqs/listFaqs";
import createFaq, { CreateFaqPayload } from "@/services/admin/faqs/createFaq";
import updateFaq, { UpdateFaqPayload } from "@/services/admin/faqs/updateFaq";
import deleteFaq from "@/services/admin/faqs/deleteFaq";
import getFaqById from "@/services/admin/faqs/getFaqById";

export type UseFaqsOptions = {
  initialQuery?: FaqQuery;
  autoFetch?: boolean;
};

export function useFaqs(options: UseFaqsOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<FaqQuery>(initialQuery);
  const [data, setData] = useState<ListFaqsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = useCallback(async (override?: FaqQuery) => {
    setLoading(true);
    setError(null);
    try {
      const effectiveQuery = { ...query, ...override };
      const res = await listFaqs(effectiveQuery);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, [query]);

  // CRUD operations
  const create = useCallback(async (payload: CreateFaqPayload) => {
    const res = await createFaq(payload);
    await fetchFaqs();
    return res;
  }, [fetchFaqs]);

  const update = useCallback(async (id: string | number, payload: UpdateFaqPayload) => {
    const res = await updateFaq(id, payload);
    await fetchFaqs();
    return res;
  }, [fetchFaqs]);

  const remove = useCallback(async (id: string | number) => {
    const res = await deleteFaq(id);
    await fetchFaqs();
    return res;
  }, [fetchFaqs]);

  const getById = useCallback(async (id: string | number) => getFaqById(id), []);

  const items: FaqListItem[] = useMemo(() => data?.items ?? [], [data]);

  // Auto fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchFaqs();
    }
  }, []); // Empty dependency array to run only once on mount

  return {
    query,
    setQuery,
    data,
    items,
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? query.limit ?? 10,
    loading,
    error,
    fetchFaqs,
    create,
    update,
    remove,
    getById,
  };
}

export default useFaqs;
