"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLocale } from "@/hooks/useLocale";

export type DeleteConfirmDialogProps = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<unknown>;
  /**
   * Phải là 1 phần tử duy nhất vì AlertDialogTrigger dùng `asChild`.
   * Ví dụ: <Button>Delete</Button>
   */
  children: React.ReactElement;
  /** Cho phép điều khiển từ bên ngoài (tùy chọn) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function DeleteConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  children,
  open: openProp,
  onOpenChange,
}: DeleteConfirmDialogProps) {
  const { t } = useLocale();

  // Hỗ trợ controlled + uncontrolled
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof openProp === "boolean";
  const open = isControlled ? (openProp as boolean) : internalOpen;
  const setOpen = isControlled && onOpenChange ? onOpenChange : setInternalOpen;

  const [submitting, setSubmitting] = React.useState(false);

  // Cleanup effect to ensure dialog state is properly reset
  React.useEffect(() => {
    if (!open) {
      // Reset submitting state when dialog closes
      setSubmitting(false);
    }
  }, [open]);

  // Force cleanup on unmount
  React.useEffect(() => {
    return () => {
      setSubmitting(false);
    };
  }, []);

  const handleConfirm = React.useCallback(async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm();
      console.log("DeleteConfirmDialog: Delete successful, closing dialog");
      setOpen(false);
      setTimeout(() => {
        setSubmitting(false);
      }, 100);
    } catch (error) {
      console.error("DeleteConfirmDialog: Delete failed:", error);
      setSubmitting(false);
    }
  }, [onConfirm, setOpen, submitting]);

  console.log(
    "DeleteConfirmDialog: Rendering with open=",
    open,
    "submitting=",
    submitting
  );

  const handleOpenChange = (newOpen: boolean) => {
    console.log("DeleteConfirmDialog: onOpenChange called with", newOpen);
    if (!newOpen && submitting) {
      return;
    }
    setOpen(newOpen);
    if (!newOpen) {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog
      key={`dialog-${open}-${submitting}`}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent
        className="max-w-md"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            {title || t("common.areYouSure")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description || t("common.deleteWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel disabled={submitting} className="flex-1">
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {submitting
              ? t("common.deleting") || "Deleting..."
              : confirmLabel || t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
