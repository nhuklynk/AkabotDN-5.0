"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createTag, { CreateTagPayload } from "@/services/admin/tags/createTag";
import type { TagDetail } from "@/services/admin/tags/getTagById";

export function useCreateTag() {
  const qc = useQueryClient();
  const mutation = useMutation<TagDetail, Error, CreateTagPayload>({
    mutationFn: (payload) => createTag(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tags"] }),
  });

  const mutate = useCallback((payload: CreateTagPayload) => mutation.mutateAsync(payload), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useCreateTag;


