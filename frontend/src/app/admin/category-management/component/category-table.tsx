"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Trash2 } from "lucide-react"
import DeleteConfirmDialog from "./delete-confirm-dialog"

type Category = {
  id: number
  name: string
  slug: string
  description: string
  color: string
  status: string
  parentId: number | null
  postCount: number
  createdAt: string
}

export default function CategoryTable({
  items,
  onEdit,
  onDelete,
  getParentName,
  getStatusColor,
}: {
  items: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
  getParentName: (parentId: number | null) => string | null
  getStatusColor: (status: string) => string
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Danh mục</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Cấp</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Bài viết</TableHead>
            <TableHead>Tạo lúc</TableHead>
            <TableHead className="w-[90px] whitespace-nowrap">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: category.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      {category.parentId && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{category.slug}</TableCell>
              <TableCell>
                {getParentName(category.parentId) ? (
                  <Badge variant="outline">{getParentName(category.parentId)}</Badge>
                ) : (
                  <span className="text-muted-foreground">Cấp gốc</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(category.status)} capitalize`}>{category.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{category.postCount}</Badge>
              </TableCell>
              <TableCell>{category.createdAt}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Sửa
                    </DropdownMenuItem>
                    <DeleteConfirmDialog
                      description="Thao tác này không thể hoàn tác. Danh mục sẽ bị xóa vĩnh viễn và có thể ảnh hưởng đến nội dung liên quan."
                      onConfirm={() => onDelete(category.id)}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
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


