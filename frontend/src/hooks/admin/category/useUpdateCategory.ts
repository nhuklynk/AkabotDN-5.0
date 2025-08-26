"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateCategory from "@/services/admin/categories/updateCategory";
import type { CreateCategoryPayload } from "@/services/admin/categories/createCategory";
import type { CategoryListItem } from "@/services/admin/categories/listCategories";

export function useUpdateCategory() {
  const qc = useQueryClient();
  const mutation = useMutation<
    CategoryListItem,
    Error,
    { id: string | number; payload: Partial<CreateCategoryPayload> }
  >({
    mutationFn: async ({ id, payload }) => {
      return await updateCategory(id, payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const mutate = useCallback(
    (id: string | number, payload: Partial<CreateCategoryPayload>) =>
      mutation.mutateAsync({ id, payload }),
    [mutation]
  );

  return {
    mutate,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}

export default useUpdateCategory;
