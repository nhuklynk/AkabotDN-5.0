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
  children: React.ReactElement
}

export default function DeleteConfirmDialog({
  title = "Bạn chắc chắn?",
  description = "Thao tác này không thể hoàn tác.",
  confirmLabel = "Xóa",
  onConfirm,
  children,
}: Props) {
  const { t } = useLocale()
  const [open, setOpen] = React.useState(false)
  
  const handleConfirm = async () => {
    try {
      await onConfirm()
      setOpen(false)
    } catch (e) {
      console.error(e)
      // Don't close dialog on error
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={() => setOpen(true)}>
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || t("common.areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{description || t("common.deleteWarning")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmLabel || t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


