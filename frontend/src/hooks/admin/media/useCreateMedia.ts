"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createMedia, { CreateMediaPayload } from "@/services/admin/medias/createMedia";
import type { MediaDetail } from "@/services/admin/medias/getMediaById";

export function useCreateMedia() {
  const qc = useQueryClient();
  const mutation = useMutation<MediaDetail, Error, CreateMediaPayload>({
    mutationFn: (payload) => createMedia(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

  const mutate = useCallback((payload: CreateMediaPayload) => mutation.mutateAsync(payload), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useCreateMedia;


