"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"
import { useLocale } from "@/hooks/useLocale"
import type { UserListItem } from "@/services/admin/users/getAllUser"

type User = UserListItem

export default function UserTable({
  items,
  getRoleColor,
  getStatusColor,
  onEdit,
  onDelete,
}: {
  items: User[]
  getRoleColor: (role: string) => string
  getStatusColor: (status: string) => string
  onEdit: (u: User) => void
  onDelete: (id: number | string) => void
}) {
  const { t } = useLocale()
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("user.table.name")}</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>{t("user.table.status")}</TableHead>
            <TableHead>{t("user.table.createdAt")}</TableHead>
            <TableHead className="w-[90px] whitespace-nowrap">{t("user.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || ""}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(user.status)} capitalize`}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.created_at}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="h-4 w-4 mr-2" /> {t("common.edit")}
                    </DropdownMenuItem>
                    <DeleteConfirmDialog onConfirm={() => onDelete(user.id)}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" /> {t("common.delete")}
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


