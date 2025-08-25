"use client";

import { useQuery } from "@tanstack/react-query";
import getMediaByType from "@/services/admin/medias/getMediaByType";
import type { MediaListItem } from "@/services/admin/medias/listMedia";

export function useMediaByType(type?: string, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<MediaListItem[], Error>({
    queryKey: ["admin-media-type", type],
    queryFn: () => getMediaByType(type as string),
    enabled: !!type && enabled,
    refetchOnWindowFocus: false,
  });

  return { items: data ?? [], loading: isLoading, error: error?.message ?? null, refetch };
}

export default useMediaByType;


