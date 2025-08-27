"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, MoreHorizontal, Trash2, ExternalLink } from "lucide-react"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"
import { useLocale } from "@/hooks/useLocale"

type Partner = {
  id: number | string
  name: string
  description?: string
  logo?: string
  logo_url?: string | null
  website?: string
  partner_type: 'strategic' | 'gold' | 'silver' | 'bronze' | 'associate'
  sort_order: number
  status: string
  created_at?: string
  modified_at?: string
  created_by?: string
  modified_by?: string
}

export default function PartnerTable({
  items,
  getPartnerTypeColor,
  getPartnerTypeIcon,
  onEdit,
  onDelete,
}: {
  items: Partner[]
  getPartnerTypeColor: (t: string) => string
  getPartnerTypeIcon: (t: string) => React.ReactNode
  onEdit: (p: Partner) => void
  onDelete: (id: number | string) => void
}) {
  const { t } = useLocale()
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("partner.table.logo")}</TableHead>
            <TableHead>{t("partner.table.name")}</TableHead>
            <TableHead>{t("partner.table.description")}</TableHead>
            <TableHead>{t("partner.table.website")}</TableHead>
            <TableHead>{t("partner.table.partnerType")}</TableHead>
            <TableHead>{t("partner.table.sortOrder")}</TableHead>
            <TableHead>{t("partner.table.createdAt")}</TableHead>
            <TableHead className="w-[90px]">{t("partner.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>
                {partner.logo_url ? (
                  <>
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="h-8 w-8 object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="h-8 w-8 bg-muted rounded flex items-center justify-center"
                      style={{ display: 'none' }}
                    >
                      <span className="text-xs text-muted-foreground">No Logo</span>
                    </div>
                  </>
                ) : (
                  <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No Logo</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{partner.name}</TableCell>
              <TableCell className="max-w-xs truncate" title={partner.description}>
                {partner.description || "N/A"}
              </TableCell>
              <TableCell>
                {partner.website ? (
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Website
                  </a>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <Badge className={`${getPartnerTypeColor(partner.partner_type)} capitalize`}>
                  <div className="flex items-center gap-1">
                    {getPartnerTypeIcon(partner.partner_type)}
                    {partner.partner_type}
                  </div>
                </Badge>
              </TableCell>
              <TableCell>{partner.sort_order}</TableCell>
              <TableCell>{formatDate(partner.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" /> {t("common.view")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(partner)}>
                      <Edit className="h-4 w-4 mr-2" /> {t("common.edit")}
                    </DropdownMenuItem>
                    <DeleteConfirmDialog onConfirm={() => onDelete(partner.id)}>
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
