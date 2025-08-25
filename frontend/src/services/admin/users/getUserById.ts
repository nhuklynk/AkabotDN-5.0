import apiClient from "@/services/apiClient";
import type { UserListItem } from "./getAllUser";

export async function getUserById(userId: string | number): Promise<UserListItem> {
  return apiClient.get(`/users/${userId}`);
}

export default getUserById;
