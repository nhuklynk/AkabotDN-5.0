"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createCategory, { CreateCategoryPayload } from "@/services/admin/categories/createCategory";
import type { CategoryListItem } from "@/services/admin/categories/listCategories";

export function useCreateCategory() {
  const qc = useQueryClient();
  const mutation = useMutation<CategoryListItem, Error, CreateCategoryPayload>({
    mutationFn: (payload) => createCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const mutate = useCallback((payload: CreateCategoryPayload) => mutation.mutateAsync(payload), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useCreateCategory;


