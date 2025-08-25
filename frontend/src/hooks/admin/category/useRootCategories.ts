"use client";

import { useQuery } from "@tanstack/react-query";
import getRootCategories from "@/services/admin/categories/getRootCategories";
import type { CategoryListItem } from "@/services/admin/categories/listCategories";

export function useRootCategories(enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<CategoryListItem[], Error>({
    queryKey: ["admin-categories-roots"],
    queryFn: () => getRootCategories(),
    enabled,
    refetchOnWindowFocus: false,
  });

  return { items: data ?? [], loading: isLoading, error: error?.message ?? null, refetch };
}

export default useRootCategories;


