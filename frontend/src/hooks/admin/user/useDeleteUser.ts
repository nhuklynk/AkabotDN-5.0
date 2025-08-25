"use client";

import { useCallback } from "react";
import deleteUser from "@/services/admin/users/deleteUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteUser() {
  const qc = useQueryClient();
  const mutation = useMutation<boolean, Error, string | number>({
    mutationFn: async (id) => {
      await deleteUser(id);
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const mutate = useCallback((id: string | number) => mutation.mutateAsync(id), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useDeleteUser;

