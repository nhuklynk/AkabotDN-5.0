"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import listTags, { TagListItem, TagQuery, ListTagsResponse } from "@/services/admin/tags/listTags";

export type UseTagsListOptions = {
  initialQuery?: TagQuery;
  autoFetch?: boolean;
};

export function useTagsList(options: UseTagsListOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<TagQuery>(initialQuery);

  const { data, isLoading, error, refetch } = useQuery<ListTagsResponse, Error>({
    queryKey: ["admin-tags", query],
    queryFn: () => listTags(query),
    enabled: autoFetch,
    refetchOnWindowFocus: false,
  });

  const items: TagListItem[] = useMemo(() => data?.items ?? [], [data]);

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

export default useTagsList;

