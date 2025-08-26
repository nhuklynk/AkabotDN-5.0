"use client"

import * as React from "react"
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
} from "@/components/ui/alert-dialog"
import { useLocale } from "@/hooks/useLocale"

type Props = {
  title?: string
  description?: string
  confirmLabel?: string
  onConfirm: () => void | Promise<any>
  children: React.ReactNode
}

export default function DeleteConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  children,
}: Props) {
  const { t } = useLocale()
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || t("common.areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{description || t("common.deleteWarning")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={async () => { try { await onConfirm(); } catch (e) { console.error(e); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {confirmLabel || t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


