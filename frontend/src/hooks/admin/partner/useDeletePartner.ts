"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deletePartner from "@/services/admin/partners/deletePartner";

export function useDeletePartner() {
  const qc = useQueryClient();
  const mutation = useMutation<boolean, Error, string | number>({
    mutationFn: async (id) => {
      await deletePartner(id);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-partners"] }),
    onError: (error) => {
      console.error('Error deleting partner:', error);
    },
  });

  const mutate = useCallback((id: string | number) => mutation.mutateAsync(id), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useDeletePartner;
