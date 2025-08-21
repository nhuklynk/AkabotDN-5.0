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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PostFormData = {
  title: string
  slug: string
  excerpt: string
  content: string
  status: string
  authorId: number
  categoryId: number
  featuredImage: string
  tags: string
  publishedAt: string
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
}: Props) {
  const isCreate = mode === "create"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}</DialogTitle>
          <DialogDescription>{isCreate ? "Viết bài blog hoặc bài viết mới." : "Cập nhật nội dung và cài đặt."}</DialogDescription>
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
              <Label htmlFor="slug">Đường dẫn (slug)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((d) => ({ ...d, slug: e.target.value }))}
                placeholder="post-slug"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="excerpt">Mô tả ngắn</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((d) => ({ ...d, excerpt: e.target.value }))}
              placeholder="Mô tả ngắn cho bài viết"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((d) => ({ ...d, content: e.target.value }))}
              placeholder="Viết nội dung bài viết..."
              rows={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Tác giả</Label>
              <Select
                value={formData.authorId.toString()}
                onValueChange={(value) => setFormData((d) => ({ ...d, authorId: Number.parseInt(value) }))}
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
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) => setFormData((d) => ({ ...d, categoryId: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData((d) => ({ ...d, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="publishedAt">Ngày xuất bản</Label>
              <Input
                id="publishedAt"
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData((d) => ({ ...d, publishedAt: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="featuredImage">Ảnh đại diện (URL)</Label>
            <Input
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => setFormData((d) => ({ ...d, featuredImage: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="tags">Thẻ</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData((d) => ({ ...d, tags: e.target.value }))}
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-muted-foreground mt-1">Ngăn cách thẻ bằng dấu phẩy</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>{isCreate ? "Tạo bài viết" : "Cập nhật bài viết"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


