"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteMedia from "@/services/admin/medias/deleteMedia";

export function useDeleteMedia() {
  const qc = useQueryClient();
  const mutation = useMutation<boolean, Error, string | number>({
    mutationFn: async (id) => {
      await deleteMedia(id);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

  const mutate = useCallback((id: string | number) => mutation.mutateAsync(id), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useDeleteMedia;


