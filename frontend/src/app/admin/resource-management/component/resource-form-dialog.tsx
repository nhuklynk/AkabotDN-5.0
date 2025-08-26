"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/useLocale"

type ResourceFormData = {
  file: File | null
  filename: string
  media_type: "post" | "event" | "member" | "other"
}

type Props = {
  formData: ResourceFormData
  setFormData: React.Dispatch<React.SetStateAction<ResourceFormData>>
  mode: "create" | "edit"
}

export default function ResourceFormDialog({ formData, setFormData, mode }: Props) {
  const { t } = useLocale()
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null
            setFormData((d) => ({ ...d, file: f, filename: f?.name || d.filename }))
          }}
        />
      </div>
      <div>
        <Label htmlFor="filename">{t("resource.form.filename")}</Label>
        <Input id="filename" value={formData.filename} onChange={(e) => setFormData((d) => ({ ...d, filename: e.target.value }))} placeholder={t("resource.form.filenamePlaceholder")} />
      </div>
      <div>
        <Label htmlFor="media_type">Media type</Label>
        <Select value={formData.media_type} onValueChange={(value) => setFormData((d) => ({ ...d, media_type: value as any }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="post">post</SelectItem>
            <SelectItem value="event">event</SelectItem>
            <SelectItem value="member">member</SelectItem>
            <SelectItem value="other">other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}


