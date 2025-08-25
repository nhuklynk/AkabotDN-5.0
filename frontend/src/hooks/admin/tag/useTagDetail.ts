"use client";

import { useQuery } from "@tanstack/react-query";
import getTagById, { TagDetail } from "@/services/admin/tags/getTagById";

export function useTagDetail(id?: string | number, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<TagDetail, Error>({
    queryKey: ["admin-tag", id],
    queryFn: () => getTagById(id as string | number),
    enabled: !!id && enabled,
  });

  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch };
}

export default useTagDetail;


