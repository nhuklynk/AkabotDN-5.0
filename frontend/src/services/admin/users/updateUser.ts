import apiClient from "@/services/apiClient";
import type { UserListItem } from "./getAllUser";

export type UpdateUserPayload = Partial<{
  full_name: string;
  avatar: string;
  phone: string;
  status: string;
  role_ids: string[];
}>;

export async function updateUser(
  userId: string | number,
  payload: UpdateUserPayload
): Promise<UserListItem> {
  return apiClient.patch(`/users/${userId}`, payload);
}

export default updateUser;
