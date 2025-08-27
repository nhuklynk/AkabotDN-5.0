"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

export type ProfileResponse = {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
  phone?: string;
  status?: string;
  roles?: { id: string; name: string }[];
};

export function useProfile() {
  return useQuery<ProfileResponse, Error>({
    queryKey: ["auth-profile"],
    queryFn: () => apiClient.get("/users/profile/me", { withCredentials: true }),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export default useProfile;


