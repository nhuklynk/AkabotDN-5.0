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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Tạo danh mục mới" : "Chỉnh sửa danh mục"}</DialogTitle>
          <DialogDescription>
            {isCreate ? "Thêm danh mục mới để tổ chức nội dung." : "Cập nhật thông tin và cài đặt danh mục."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nhập tên danh mục"
            />
          </div>
          <div>
            <Label htmlFor="slug">Đường dẫn (slug)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((d) => ({ ...d, slug: e.target.value }))}
              placeholder="category-slug"
            />
          </div>
          <div>
            <Label htmlFor="parent">Danh mục cha</Label>
            <Select
              value={formData.parentId?.toString() || "none"}
              onValueChange={(value) =>
                setFormData((d) => ({ ...d, parentId: value === "none" ? null : Number.parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục cha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có (Cấp gốc)</SelectItem>
                {parentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="color">Màu sắc</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData((d) => ({ ...d, color: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn màu" />
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
            <Label htmlFor="status">Trạng thái</Label>
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
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) => setFormData((d) => ({ ...d, description: html }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>{isCreate ? "Tạo danh mục" : "Cập nhật danh mục"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


