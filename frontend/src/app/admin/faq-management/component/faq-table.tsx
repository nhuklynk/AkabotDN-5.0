"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"
import { useLocale } from "@/hooks/useLocale"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

type Faq = { id: number; question: string; answer: string; category: string; createdAt: string }

export default function FaqTable({ items, onEdit, onDelete }: { items: Faq[]; onEdit: (f: Faq) => void; onDelete: (id: number) => void }) {
  const { t } = useLocale()
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("faqManagement.table.question")}</TableHead>
            <TableHead>{t("faqManagement.table.category")}</TableHead>
            <TableHead>{t("faqManagement.table.createdAt")}</TableHead>
            <TableHead className="w-[90px]">{t("faqManagement.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.question}</TableCell>
              <TableCell>{f.category}</TableCell>
              <TableCell>{new Date(f.createdAt).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(f)}>
                      <Edit className="h-4 w-4 mr-2" /> {t("common.edit")}
                    </DropdownMenuItem>
                    <DeleteConfirmDialog onConfirm={() => onDelete(f.id)}>
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


