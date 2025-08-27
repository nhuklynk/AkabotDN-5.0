import apiClient from "@/services/apiClient";

export type PartnerDetail = {
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

export async function getPartnerById(id: string | number): Promise<PartnerDetail> {
  const response = (await apiClient.get(`/partners/${id}`)) as any;
  const data = response?.data ?? response;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    logo: data.logo,
    logo_url: data.logo_url,
    website: data.website,
    partner_type: data.partner_type,
    sort_order: data.sort_order ?? 0,
    status: data.status || "active",
    created_at: data.created_at,
    modified_at: data.modified_at,
    created_by: data.created_by,
    modified_by: data.modified_by,
  };
}

export default getPartnerById;
