"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, Edit, Folder, FolderOpen, MoreHorizontal, Trash2 } from "lucide-react"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"
import { useLocale } from "@/hooks/useLocale"

type Category = {
  id: number | string
  name: string
  slug: string
  description?: string
  color: string
  status: string
  parentId: number | string | null
  level: number
  postCount: number
  createdAt?: string
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
  onDelete: (id: number | string) => void
  getParentName: (parentId: number | string | null) => string | null
  getStatusColor: (status: string) => string
}) {
  const { t } = useLocale()
  const visibleItems = items.filter((c) => (c.status || "").toLowerCase() === "active")
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("category.table.category")}</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>{t("category.table.level")}</TableHead>
            <TableHead>{t("category.table.status")}</TableHead>
            <TableHead>{t("category.table.posts")}</TableHead>
            <TableHead>{t("category.table.createdAt")}</TableHead>
            <TableHead className="w-[90px] whitespace-nowrap">{t("category.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleItems.map((category) => (
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
                {category.level === 0 ? (
                  <span className="text-muted-foreground">{t("category.table.root")}</span>
                ) : (
                  <Badge variant="outline">Level {category.level}</Badge>
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
                      {t("common.edit")}
                    </DropdownMenuItem>
                    <DeleteConfirmDialog
                      description={t("common.deleteWarningLong")}
                      onConfirm={() => onDelete(category.id)}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("common.delete")}
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


