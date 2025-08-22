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

type UserFormData = {
  name: string
  email: string
  role: string
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreate ? "Tạo người dùng mới" : "Chỉnh sửa người dùng"}</DialogTitle>
          <DialogDescription>
            {isCreate ? "Thêm người dùng mới với thông tin cơ bản." : "Cập nhật thông tin và quyền hạn người dùng."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Họ tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
              placeholder="Nhập họ tên"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
              placeholder="Nhập địa chỉ email"
            />
          </div>
          <div>
            <Label htmlFor="role">Vai trò</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData((d) => ({ ...d, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="editor">Biên tập</SelectItem>
                <SelectItem value="admin">Quản trị</SelectItem>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>{isCreate ? "Tạo người dùng" : "Cập nhật"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
