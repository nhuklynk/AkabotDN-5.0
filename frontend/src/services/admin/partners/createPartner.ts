import apiClient from "@/services/apiClient";
import type { PartnerDetail } from "./getPartnerById";

export type CreatePartnerPayload = {
  name: string;
  description?: string;
  logo?: File | Blob;
  website?: string;
  partner_type?: 'strategic' | 'gold' | 'silver' | 'bronze' | 'associate';
  sort_order?: number;
};

export async function createPartner(
  payload: CreatePartnerPayload
): Promise<PartnerDetail> {
  const partnerForm = new FormData();
  partnerForm.append("name", payload.name);
  
  if (payload.description) {
    partnerForm.append("description", payload.description);
  }
  
  if (payload.logo) {
    partnerForm.append("logo", payload.logo);
  }
  
  if (payload.website) {
    partnerForm.append("website", payload.website);
  }
  
  if (payload.partner_type) {
    partnerForm.append("partner_type", payload.partner_type);
  }
  
  if (payload.sort_order !== undefined) {
    partnerForm.append("sort_order", payload.sort_order.toString());
  }

  const response = (await apiClient.post("/partners/form-data", partnerForm, {
    headers: { "Content-Type": "multipart/form-data" },
  })) as any;

  // Handle API response structure
  const data = response?.data ?? response;

  // Normalize response to PartnerDetail format
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
    created_by: data.created_by,
    created_at: data.created_at,
    modified_by: data.modified_by,
    modified_at: data.modified_at,
  };
}

export default createPartner;
