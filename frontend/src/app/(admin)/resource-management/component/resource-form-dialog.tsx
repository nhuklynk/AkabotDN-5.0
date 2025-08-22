"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Thêm tài nguyên mới" : "Chỉnh sửa tài nguyên"}</DialogTitle>
          <DialogDescription>
            {isCreate ? "Tải lên tài nguyên hoặc tệp mới vào hệ thống." : "Cập nhật thông tin và metadata của tài nguyên."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tên tài nguyên</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))} placeholder="Nhập tên tài nguyên" />
          </div>
          <div>
            <Label htmlFor="filename">Tên tệp</Label>
            <Input id="filename" value={formData.filename} onChange={(e) => setFormData((d) => ({ ...d, filename: e.target.value }))} placeholder="Nhập tên tệp" />
          </div>
          <div>
            <Label htmlFor="type">Loại</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData((d) => ({ ...d, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Tài liệu</SelectItem>
                <SelectItem value="image">Hình ảnh</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Âm thanh</SelectItem>
                <SelectItem value="archive">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Danh mục</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData((d) => ({ ...d, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Chung</SelectItem>
                <SelectItem value="branding">Thương hiệu</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="documentation">Tài liệu</SelectItem>
                <SelectItem value="media">Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))} placeholder="Nhập mô tả tài nguyên" rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>{isCreate ? "Thêm tài nguyên" : "Cập nhật tài nguyên"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


