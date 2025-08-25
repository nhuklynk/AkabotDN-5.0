import apiClient from "@/services/apiClient";

export async function deleteUser(userId: string | number): Promise<{ success: boolean }> {
  return apiClient.delete(`/users/${userId}`);
}

export default deleteUser;

