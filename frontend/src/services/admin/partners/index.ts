export { default as listPartners } from "./listPartners";
export { default as getPartnerById } from "./getPartnerById";
export { default as createPartner } from "./createPartner";
export { default as updatePartner } from "./updatePartner";
export { default as deletePartner } from "./deletePartner";

export type { PartnerQuery, PartnerListItem, ListPartnersResponse } from "./listPartners";
export type { PartnerDetail } from "./getPartnerById";
export type { CreatePartnerPayload } from "./createPartner";
export type { UpdatePartnerPayload } from "./updatePartner";
