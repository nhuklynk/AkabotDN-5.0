"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateTag from "@/services/admin/tags/updateTag";
import type { CreateTagPayload } from "@/services/admin/tags/createTag";
import type { TagDetail } from "@/services/admin/tags/getTagById";

export function useUpdateTag() {
  const qc = useQueryClient();
  const mutation = useMutation<TagDetail, Error, { id: string | number; payload: Partial<CreateTagPayload> }>({
    mutationFn: async ({ id, payload }) => await updateTag(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tags"] }),
  });

  const mutate = useCallback((id: string | number, payload: Partial<CreateTagPayload>) => mutation.mutateAsync({ id, payload }), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useUpdateTag;


