import apiClient from "@/services/apiClient";
import type { UserListItem } from "./getAllUser";

export type CreateUserPayload = {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  status?: string; // active/inactive
  role_id: string;
};

export async function createUser(payload: CreateUserPayload): Promise<UserListItem> {
  return apiClient.post("/users", payload);
}

export default createUser;
