"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeleteDialog } from "@/hooks/useDeleteDialog"
import { useLocale } from "@/hooks/useLocale"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

type Faq = { id: string; question: string; answer: string; category: string; createdAt: string }

export default function FaqTable({ items, onEdit, onDelete }: { items: Faq[]; onEdit: (f: Faq) => void; onDelete: (id: string) => void }) {
  const { t } = useLocale()
  const { deleteDialogOpen, deleteItemId, openDeleteDialog, closeDeleteDialog } = useDeleteDialog();
  
  const handleDelete = async () => {
    if (deleteItemId) {
      await onDelete(deleteItemId as string);
      closeDeleteDialog();
    }
  };
  
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
                    <DropdownMenuItem onClick={() => openDeleteDialog(f.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> {t("common.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Delete Confirmation Dialog */}
      <div className="relative">
        <div
          className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-200 ${
            deleteDialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeDeleteDialog}
        />
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ${
            deleteDialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-background border rounded-lg p-6 m-4 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-2">{t("common.confirmDelete")}</h3>
            <p className="text-muted-foreground mb-4">{t("common.deleteWarning")}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteDialog}>
                {t("common.cancel")}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                {t("common.delete")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


