"use client";

import { useQuery } from "@tanstack/react-query";
import getMediaById, { MediaDetail } from "@/services/admin/medias/getMediaById";

export function useMediaDetail(id?: string | number, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<MediaDetail, Error>({
    queryKey: ["admin-media-detail", id],
    queryFn: () => getMediaById(id as string | number),
    enabled: !!id && enabled,
  });

  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch };
}

export default useMediaDetail;


