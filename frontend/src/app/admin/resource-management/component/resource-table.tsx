"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"

type Resource = {
  id: number
  name: string
  filename: string
  type: string
  size: string
  category: string
  description: string
  uploadedBy: string
  createdAt: string
  url: string
}

export default function ResourceTable({
  items,
  getTypeColor,
  getTypeIcon,
  getCategoryColor,
  onEdit,
  onDelete,
}: {
  items: Resource[]
  getTypeColor: (t: string) => string
  getTypeIcon: (t: string) => React.ReactNode
  getCategoryColor: (c: string) => string
  onEdit: (r: Resource) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Tên tệp</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Kích thước</TableHead>
            <TableHead>Tải lên bởi</TableHead>
            <TableHead>Tạo lúc</TableHead>
            <TableHead className="w-[90px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="font-medium">{resource.name}</TableCell>
              <TableCell className="font-mono text-sm">{resource.filename}</TableCell>
              <TableCell>
                <Badge className={`${getTypeColor(resource.type)} capitalize`}>
                  <div className="flex items-center gap-1">{getTypeIcon(resource.type)}{resource.type}</div>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getCategoryColor(resource.category)} capitalize`}>{resource.category}</Badge>
              </TableCell>
              <TableCell>{resource.size}</TableCell>
              <TableCell>{resource.uploadedBy}</TableCell>
              <TableCell>{resource.createdAt}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" /> Xem
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" /> Tải xuống
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(resource)}>
                      <Edit className="h-4 w-4 mr-2" /> Sửa
                    </DropdownMenuItem>
                    <DeleteConfirmDialog onConfirm={() => onDelete(resource.id)}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" /> Xóa
                      </DropdownMenuItem>
                    </DeleteConfirmDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


