"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/useLocale"

type ResourceFormData = {
  name: string
  filename: string
  type: string
  category: string
  description: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: ResourceFormData
  setFormData: React.Dispatch<React.SetStateAction<ResourceFormData>>
  onSubmit: () => void
  mode: "create" | "edit"
}

export default function ResourceFormDialog({ open, onOpenChange, formData, setFormData, onSubmit, mode }: Props) {
  const isCreate = mode === "create"
  const { t } = useLocale()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? t("resource.dialog.createTitle") : t("resource.dialog.editTitle")}</DialogTitle>
          <DialogDescription>
            {isCreate ? t("resource.dialog.createDesc") : t("resource.dialog.editDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("resource.form.name")}</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))} placeholder={t("resource.form.namePlaceholder")} />
          </div>
          <div>
            <Label htmlFor="filename">{t("resource.form.filename")}</Label>
            <Input id="filename" value={formData.filename} onChange={(e) => setFormData((d) => ({ ...d, filename: e.target.value }))} placeholder={t("resource.form.filenamePlaceholder")} />
          </div>
          <div>
            <Label htmlFor="type">{t("resource.form.type")}</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((d) => ({ ...d, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t("resource.form.typePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">{t("resource.types.document")}</SelectItem>
                <SelectItem value="image">{t("resource.types.image")}</SelectItem>
                <SelectItem value="video">{t("resource.types.video")}</SelectItem>
                <SelectItem value="audio">{t("resource.types.audio")}</SelectItem>
                <SelectItem value="archive">{t("resource.types.archive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">{t("resource.form.category")}</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData((d) => ({ ...d, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t("resource.form.categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t("resource.categories.general")}</SelectItem>
                <SelectItem value="branding">{t("resource.categories.branding")}</SelectItem>
                <SelectItem value="marketing">{t("resource.categories.marketing")}</SelectItem>
                <SelectItem value="documentation">{t("resource.categories.documentation")}</SelectItem>
                <SelectItem value="media">{t("resource.categories.media")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">{t("resource.form.description")}</Label>
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
          <Button onClick={onSubmit}>{isCreate ? t("resource.dialog.createCta") : t("resource.dialog.updateCta")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


