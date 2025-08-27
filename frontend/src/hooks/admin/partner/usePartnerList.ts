"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import listPartners, { ListPartnersResponse, PartnerListItem, PartnerQuery } from "@/services/admin/partners/listPartners";

export type UsePartnerListOptions = {
  initialQuery?: PartnerQuery;
  autoFetch?: boolean;
};

export function usePartnerList(options: UsePartnerListOptions = {}) {
  const { initialQuery = {}, autoFetch = true } = options;
  const [query, setQuery] = useState<PartnerQuery>(initialQuery);

  const { data, isLoading, error, refetch } = useQuery<ListPartnersResponse, Error>({
    queryKey: ["admin-partners", query],
    queryFn: () => listPartners(query),
    enabled: autoFetch,
    refetchOnWindowFocus: false,
  });

  const items: PartnerListItem[] = useMemo(() => data?.items ?? [], [data]);

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

export default usePartnerList;
