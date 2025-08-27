"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createPartner, { CreatePartnerPayload } from "@/services/admin/partners/createPartner";
import type { PartnerDetail } from "@/services/admin/partners/getPartnerById";

export function useCreatePartner() {
  const qc = useQueryClient();
  const mutation = useMutation<PartnerDetail, Error, CreatePartnerPayload>({
    mutationFn: (payload) => createPartner(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-partners"] }),
  });

  const mutate = useCallback((payload: CreatePartnerPayload) => mutation.mutateAsync(payload), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useCreatePartner;
