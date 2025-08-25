"use client";

import { useCallback } from "react";
import updateUser, { UpdateUserPayload } from "@/services/admin/users/updateUser";
import type { UserListItem } from "@/services/admin/users/getAllUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUser() {
  const qc = useQueryClient();
  const mutation = useMutation<UserListItem, Error, { id: string | number; payload: UpdateUserPayload }>({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const mutate = useCallback((id: string | number, payload: UpdateUserPayload) => mutation.mutateAsync({ id, payload }), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useUpdateUser;

