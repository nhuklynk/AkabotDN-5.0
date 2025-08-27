"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export type ProfileResponse = {
  id: string;
  email: string;
  full_name: string;
  avatar?: string;
  phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  roles?: { id: string; name: string }[];
};

export function useProfile() {
  return useQuery<ProfileResponse, Error>({
    queryKey: ["auth-profile"],
    queryFn: async () => {
      const response = await apiClient.get("/users/profile/me");

      return response.data;
    },
    enabled: true, // Always enabled since token is in cookie
    retry: 3, // Retry 3 times if failed
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnReconnect: true, // Refetch when reconnecting
  });
}

export default useProfile;


