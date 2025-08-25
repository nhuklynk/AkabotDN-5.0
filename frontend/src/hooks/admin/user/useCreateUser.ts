"use client";

import { useCallback } from "react";
import createUser, { CreateUserPayload } from "@/services/admin/users/createUser";
import type { UserListItem } from "@/services/admin/users/getAllUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUser() {
  const qc = useQueryClient();
  const mutation = useMutation<UserListItem, Error, CreateUserPayload>({
    mutationFn: (payload) => createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const mutate = useCallback((payload: CreateUserPayload) => mutation.mutateAsync(payload), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useCreateUser;

