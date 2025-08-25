"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import listMedia, { ListMediaResponse, MediaListItem, MediaQuery } from "@/services/admin/medias/listMedia";

export type UseMediaListOptions = {
  initialQuery?: MediaQuery;
  autoFetch?: boolean;
};

export function useMediaList(options: UseMediaListOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<MediaQuery>(initialQuery);

  const { data, isLoading, error, refetch } = useQuery<ListMediaResponse, Error>({
    queryKey: ["admin-media", query],
    queryFn: () => listMedia(query),
    enabled: autoFetch,
    refetchOnWindowFocus: false,
  });

  const items: MediaListItem[] = useMemo(() => data?.items ?? [], [data]);

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

export default useMediaList;

