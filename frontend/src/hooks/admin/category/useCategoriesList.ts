"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import listCategories, { CategoryQuery, ListCategoriesResponse, CategoryListItem } from "@/services/admin/categories/listCategories";

export type UseCategoriesListOptions = {
  initialQuery?: CategoryQuery;
  autoFetch?: boolean;
};

export function useCategoriesList(options: UseCategoriesListOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<CategoryQuery>(initialQuery);

  const { data, isLoading, error, refetch } = useQuery<ListCategoriesResponse, Error>({
    queryKey: ["admin-categories", query],
    queryFn: () => listCategories(query),
    enabled: autoFetch,
    refetchOnWindowFocus: false,
  });

  const items: CategoryListItem[] = useMemo(() => data?.items ?? [], [data]);

  return {
    query,
    setQuery,
    data: data ?? null,
    items,
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? query.limit ?? 10,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

export default useCategoriesList;

