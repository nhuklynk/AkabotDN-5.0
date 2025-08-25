"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import getAllUser, { GetAllUserResponse, UserListItem, UserQuery } from "@/services/admin/users/getAllUser";
import getUserById from "@/services/admin/users/getUserById";
import createUser, { CreateUserPayload } from "@/services/admin/users/createUser";
import updateUser, { UpdateUserPayload } from "@/services/admin/users/updateUser";
import deleteUser from "@/services/admin/users/deleteUser";

export type UseUsersOptions = {
  initialQuery?: UserQuery;
  autoFetch?: boolean;
};

export function useUsers(options: UseUsersOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<UserQuery>(initialQuery);
  const [data, setData] = useState<GetAllUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (override?: UserQuery) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUser({ ...query, ...override });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (autoFetch) fetchUsers();
  }, [autoFetch, fetchUsers]);

  const create = useCallback(async (payload: CreateUserPayload) => {
    const res = await createUser(payload);
    await fetchUsers();
    return res;
  }, [fetchUsers]);

  const update = useCallback(async (id: string | number, payload: UpdateUserPayload) => {
    const res = await updateUser(id, payload);
    await fetchUsers();
    return res;
  }, [fetchUsers]);

  const remove = useCallback(async (id: string | number) => {
    const res = await deleteUser(id);
    await fetchUsers();
    return res;
  }, [fetchUsers]);

  const getById = useCallback(async (id: string | number) => getUserById(id), []);

  const items: UserListItem[] = useMemo(() => data?.items ?? [], [data]);

  return {
    query,
    setQuery,
    data,
    items,
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? query.limit ?? 10,
    loading,
    error,
    fetchUsers,
    create,
    update,
    remove,
    getById,
  };
}

export default useUsers;

