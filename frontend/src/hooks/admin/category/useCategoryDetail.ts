"use client";

import { useQuery } from "@tanstack/react-query";
import getCategoryById, { CategoryDetail } from "@/services/admin/categories/getCategoryById";

export function useCategoryDetail(id?: string | number, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<CategoryDetail, Error>({
    queryKey: ["admin-category", id],
    queryFn: () => getCategoryById(id as string | number),
    enabled: !!id && enabled,
  });

  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch };
}

export default useCategoryDetail;


