"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateCategory from "@/services/admin/categories/updateCategory";
import type { CreateCategoryPayload } from "@/services/admin/categories/createCategory";
import type { CategoryDetail } from "@/services/admin/categories/getCategoryById";

export function useUpdateCategory() {
  const qc = useQueryClient();
  const mutation = useMutation<CategoryDetail, Error, { id: string | number; payload: Partial<CreateCategoryPayload> }>({
    mutationFn: async ({ id, payload }) => {
      await updateCategory(id, payload);
      return {} as CategoryDetail; // Return placeholder since we just need to trigger cache invalidation
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const mutate = useCallback((id: string | number, payload: Partial<CreateCategoryPayload>) => mutation.mutateAsync({ id, payload }), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useUpdateCategory;
