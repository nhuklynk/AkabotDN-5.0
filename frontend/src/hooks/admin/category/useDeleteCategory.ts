"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteCategory from "@/services/admin/categories/deleteCategory";

export function useDeleteCategory() {
  const qc = useQueryClient();
  const mutation = useMutation<boolean, Error, string | number>({
    mutationFn: async (id) => {
      await deleteCategory(id);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const mutate = useCallback((id: string | number) => mutation.mutateAsync(id), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useDeleteCategory;


