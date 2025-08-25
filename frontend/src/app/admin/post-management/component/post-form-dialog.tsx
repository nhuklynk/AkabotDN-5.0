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
import { Textarea } from "@/components/ui/textarea"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocale } from "@/hooks/useLocale"

// Align to posts entity
// id, status, created_by, created_at, modified_by, modified_at,
// title, slug, content, post_status, summary, published_at, post_type, media_id, user_id

type PostFormData = {
  title: string
  slug: string
  summary: string
  content: string
  status: string
  user_id: number
  media_id: number | "" // optional select/text
  post_status: string
  published_at: string
  post_type: string
}

type Option = { id: number; name: string }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: PostFormData
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>
  authors: Option[]
  categories: Option[]
  onSubmit: () => void
  onTitleChange: (title: string) => void
  mode: "create" | "edit"
  statusHistory?: { status: string; at: string; by?: string; note?: string }[]
}

export default function PostFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  authors,
  categories,
  onSubmit,
  onTitleChange,
  mode,
  statusHistory,
}: Props) {
  const isCreate = mode === "create"
  const { t } = useLocale()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreate ? t("post.dialog.createTitle") : t("post.dialog.editTitle")}</DialogTitle>
          <DialogDescription>{isCreate ? t("post.dialog.createDesc") : t("post.dialog.editDesc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Nhập tiêu đề"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((d) => ({ ...d, slug: e.target.value }))}
                placeholder="post-slug"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="summary">Tóm tắt</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData((d) => ({ ...d, summary: e.target.value }))}
              placeholder="Nhập tóm tắt"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="content">Nội dung</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(html) => setFormData((d) => ({ ...d, content: html }))}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user_id">Tác giả</Label>
              <Select
                value={formData.user_id.toString()}
                onValueChange={(value) => setFormData((d) => ({ ...d, user_id: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tác giả" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="media_id">Media ID</Label>
              <Input
                id="media_id"
                value={formData.media_id === "" ? "" : String(formData.media_id)}
                onChange={(e) => setFormData((d) => ({ ...d, media_id: e.target.value ? Number.parseInt(e.target.value) : "" }))}
                placeholder="Nhập media_id (tuỳ chọn)"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="post_status">Trạng thái bài viết</Label>
              <Select value={formData.post_status} onValueChange={(value) => setFormData((d) => ({ ...d, post_status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="review">Duyệt</SelectItem>
                  <SelectItem value="published">Xuất bản</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                  <SelectItem value="archived">Lưu trữ</SelectItem>
                  <SelectItem value="scheduled">Lên lịch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="published_at">Ngày xuất bản</Label>
              <Input
                id="published_at"
                type="date"
                value={formData.published_at}
                onChange={(e) => setFormData((d) => ({ ...d, published_at: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="post_type">Loại bài viết</Label>
              <Select value={formData.post_type} onValueChange={(value) => setFormData((d) => ({ ...d, post_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Bài viết</SelectItem>
                  <SelectItem value="news">Tin tức</SelectItem>
                  <SelectItem value="event">Sự kiện</SelectItem>
                  <SelectItem value="guide">Hướng dẫn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Trạng thái bản ghi</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData((d) => ({ ...d, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isCreate && statusHistory && statusHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Lịch sử trạng thái</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {statusHistory.map((h, idx) => (
                  <li key={idx}>
                    <span className="font-medium text-foreground">{h.status}</span> · {new Date(h.at).toLocaleString()} {h.by ? `· ${h.by}` : ""}
                    {h.note ? ` · ${h.note}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSubmit}>{isCreate ? t("post.dialog.createCta") : t("post.dialog.updateCta")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


