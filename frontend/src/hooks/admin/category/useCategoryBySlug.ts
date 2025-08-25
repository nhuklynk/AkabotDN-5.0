"use client";

import { useQuery } from "@tanstack/react-query";
import getCategoryBySlug from "@/services/admin/categories/getCategoryBySlug";
import type { CategoryDetail } from "@/services/admin/categories/getCategoryById";

export function useCategoryBySlug(slug?: string, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<CategoryDetail, Error>({
    queryKey: ["admin-category-slug", slug],
    queryFn: () => getCategoryBySlug(slug as string),
    enabled: !!slug && enabled,
  });

  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch };
}

export default useCategoryBySlug;


