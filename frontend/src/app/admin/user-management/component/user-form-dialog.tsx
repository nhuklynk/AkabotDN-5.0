"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/useLocale"

type UserFormData = {
  full_name: string
  email: string
  phone?: string
  avatar?: string
  status: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: UserFormData
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>
  onSubmit: () => void
  mode: "create" | "edit"
}

export default function UserFormDialog({ open, onOpenChange, formData, setFormData, onSubmit, mode }: Props) {
  const isCreate = mode === "create"
  const { t } = useLocale()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreate ? t("user.dialog.createTitle") : t("user.dialog.editTitle")}</DialogTitle>
          <DialogDescription>
            {isCreate ? t("user.dialog.createDesc") : t("user.dialog.editDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">{t("user.form.name")}</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData((d) => ({ ...d, full_name: e.target.value }))}
              placeholder={t("user.form.namePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="email">{t("user.form.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
              placeholder={t("user.form.emailPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <Label htmlFor="avatar">Ảnh đại diện (URL)</Label>
            <Input
              id="avatar"
              value={formData.avatar || ""}
              onChange={(e) => setFormData((d) => ({ ...d, avatar: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="status">{t("user.form.status")}</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData((d) => ({ ...d, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t("user.form.statusPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("user.status.active")}</SelectItem>
                <SelectItem value="inactive">{t("user.status.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSubmit}>{isCreate ? t("user.dialog.createCta") : t("user.dialog.updateCta")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
