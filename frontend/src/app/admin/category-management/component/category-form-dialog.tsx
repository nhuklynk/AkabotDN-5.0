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
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/useLocale"

type CategoryFormData = {
  name: string
  slug: string
  description: string
  color: string
  status: string
  parentId: number | null
}

type ParentOption = { id: number; name: string }
type ColorOption = { value: string; label: string }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: CategoryFormData
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>
  parentCategories: ParentOption[]
  colorOptions: ColorOption[]
  onSubmit: () => void
  onNameChange: (name: string) => void
  mode: "create" | "edit"
}

export default function CategoryFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  parentCategories,
  colorOptions,
  onSubmit,
  onNameChange,
  mode,
}: Props) {
  const isCreate = mode === "create"
  const { t } = useLocale()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? t("category.dialog.createTitle") : t("category.dialog.editTitle")}</DialogTitle>
          <DialogDescription>
            {isCreate ? t("category.dialog.createDesc") : t("category.dialog.editDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("category.form.name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t("category.form.namePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="slug">{t("category.form.slug")}</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((d) => ({ ...d, slug: e.target.value }))}
              placeholder="category-slug"
            />
          </div>
          <div>
            <Label htmlFor="parent">{t("category.form.parent")}</Label>
            <Select
              value={formData.parentId?.toString() || "none"}
              onValueChange={(value) =>
                setFormData((d) => ({ ...d, parentId: value === "none" ? null : Number.parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("category.form.parentPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("category.table.root")}</SelectItem>
                {parentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="color">{t("category.form.color")}</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData((d) => ({ ...d, color: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t("category.form.colorPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color.value }} />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">{t("category.form.status")}</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData((d) => ({ ...d, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t("category.form.statusPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("category.active")}</SelectItem>
                <SelectItem value="inactive">{t("category.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">{t("category.form.description")}</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) => setFormData((d) => ({ ...d, description: html }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSubmit}>{isCreate ? t("category.dialog.createCta") : t("category.dialog.updateCta")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


