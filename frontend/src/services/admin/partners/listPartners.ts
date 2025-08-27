import apiClient from "@/services/apiClient";

export type PartnerQuery = {
  page?: number;
  limit?: number;
  search?: string;
  partner_type?: 'strategic' | 'gold' | 'silver' | 'bronze' | 'associate';
};

export type PartnerListItem = {
  id: number | string;
  name: string;
  description?: string;
  logo?: string;
  logo_url?: string | null;
  website?: string;
  partner_type: 'strategic' | 'gold' | 'silver' | 'bronze' | 'associate';
  sort_order: number;
  status: string;
  created_at?: string;
  modified_at?: string;
  created_by?: string;
  modified_by?: string;
};

export type ListPartnersResponse = {
  items: PartnerListItem[];
  total: number;
  page: number;
  limit: number;
};

export async function listPartners(
  query: PartnerQuery = {}
): Promise<ListPartnersResponse> {
  const params = { ...query } as Record<string, any>;
  const res: any = await apiClient.get("/partners", { params });
  const payload = res?.data ?? res;
  const itemsRaw: any[] = Array.isArray(payload)
    ? payload
    : payload?.items ?? [];

  const items: PartnerListItem[] = itemsRaw.map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    logo: p.logo,
    logo_url: p.logo_url,
    website: p.website,
    partner_type: p.partner_type,
    sort_order: p.sort_order ?? 0,
    status: p.status ?? "active",
    created_at: p.created_at,
    modified_at: p.modified_at,
    created_by: p.created_by,
    modified_by: p.modified_by,
  }));

  return {
    items,
    total: (payload?.total ?? items.length) as number,
    page: (payload?.page ?? query.page ?? 1) as number,
    limit: (payload?.limit ?? query.limit ?? 10) as number,
  };
}

export default listPartners;
