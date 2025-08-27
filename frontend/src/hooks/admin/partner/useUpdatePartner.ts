"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updatePartner, { UpdatePartnerPayload } from "@/services/admin/partners/updatePartner";
import type { PartnerDetail } from "@/services/admin/partners/getPartnerById";

export function useUpdatePartner() {
  const qc = useQueryClient();
  const mutation = useMutation<PartnerDetail, Error, { id: string | number; payload: UpdatePartnerPayload }>({
    mutationFn: ({ id, payload }) => updatePartner(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-partners"] }),
  });

  const mutate = useCallback((id: string | number, payload: UpdatePartnerPayload) => mutation.mutateAsync({ id, payload }), [mutation]);

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useUpdatePartner;
