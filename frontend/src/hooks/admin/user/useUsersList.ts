"use client";

import { useMemo, useState } from "react";
import getAllUser, { GetAllUserResponse, UserListItem, UserQuery } from "@/services/admin/users/getAllUser";
import { useQuery } from "@tanstack/react-query";

export type UseUsersListOptions = {
  initialQuery?: UserQuery;
  autoFetch?: boolean;
};

export function useUsersList(options: UseUsersListOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<UserQuery>(initialQuery);
  const { data, isLoading, error, refetch } = useQuery<GetAllUserResponse, Error>({
    queryKey: ["admin-users", query],
    queryFn: () => getAllUser(query),
    enabled: autoFetch,
    refetchOnWindowFocus: false,
  });

  const items: UserListItem[] = useMemo(() => data?.items ?? [], [data]);

  return {
    query,
    setQuery,
    data: data ?? null,
    items,
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? query.limit ?? 10,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

export default useUsersList;

