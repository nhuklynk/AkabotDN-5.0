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
  const trigger = React.cloneElement(children, {
    onSelect: (e: any) => {
      if (e?.preventDefault) e.preventDefault()
      setOpen(true)
    },
    onClick: (e: any) => {
      // Fallback for non-Menu triggers
      if (children.props?.onClick) children.props.onClick(e)
      if (!e?.defaultPrevented) setOpen(true)
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || t("common.areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{description || t("common.deleteWarning")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setOpen(false)
              try { void onConfirm() } catch (e) { console.error(e) }
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmLabel || t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


