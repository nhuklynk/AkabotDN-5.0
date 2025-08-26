"use client";

import { useState } from "react";

export function useDeleteDialog() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | number | null>(null);

  const openDeleteDialog = (id: string | number) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  return {
    deleteDialogOpen,
    deleteItemId,
    openDeleteDialog,
    closeDeleteDialog,
    setDeleteDialogOpen,
  };
}
