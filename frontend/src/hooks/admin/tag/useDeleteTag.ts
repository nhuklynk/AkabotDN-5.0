"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteTag from "@/services/admin/tags/deleteTag";

export function useDeleteTag() {
  const qc = useQueryClient();
  const mutation = useMutation<boolean, Error, string | number>({
    mutationFn: async (id) => {
      await deleteTag(id);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tags"] }),
    onError: (error) => {
      console.error('Error deleting tag:', error);
    },
  });

  const mutate = useCallback((id: string | number) => mutation.mutateAsync(id), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useDeleteTag;


