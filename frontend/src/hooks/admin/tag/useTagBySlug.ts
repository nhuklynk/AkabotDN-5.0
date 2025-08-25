"use client";

import { useQuery } from "@tanstack/react-query";
import getTagBySlug from "@/services/admin/tags/getTagBySlug";
import type { TagDetail } from "@/services/admin/tags/getTagById";

export function useTagBySlug(slug?: string, enabled = true) {
  const { data, isLoading, error, refetch } = useQuery<TagDetail, Error>({
    queryKey: ["admin-tag-slug", slug],
    queryFn: () => getTagBySlug(slug as string),
    enabled: !!slug && enabled,
  });

  return { data: data ?? null, loading: isLoading, error: error?.message ?? null, refetch };
}

export default useTagBySlug;


