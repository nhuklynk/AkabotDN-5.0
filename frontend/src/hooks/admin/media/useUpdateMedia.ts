"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateMedia, { UpdateMediaPayload } from "@/services/admin/medias/updateMedia";
import type { MediaDetail } from "@/services/admin/medias/getMediaById";

export function useUpdateMedia() {
  const qc = useQueryClient();
  const mutation = useMutation<MediaDetail, Error, { id: string | number; payload: UpdateMediaPayload }>({
    mutationFn: ({ id, payload }) => updateMedia(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

  const mutate = useCallback((id: string | number, payload: UpdateMediaPayload) => mutation.mutateAsync({ id, payload }), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useUpdateMedia;


