"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/useLocale"

export type CategoryFormData = {
  name: string
  slug: string
  description: string
  status: string
  parentId: string | null
}

export type ParentOption = { id: string | number; name: string }
type ColorOption = { value: string; label: string }

type Props = {
  formData: CategoryFormData
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>
  parentCategories: ParentOption[]
  onNameChange: (name: string) => void
  mode: "create" | "edit"
}

export default function CategoryFormDialog({
  formData,
  setFormData,
  parentCategories,
  onNameChange,
  mode,
}: Props) {
  const { t } = useLocale()

  return (
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
                setFormData((d) => ({ ...d, parentId: value === "none" ? null : value }))
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
            <textarea
              id="description"
              className="mt-2 w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
        </div>
  )
}


