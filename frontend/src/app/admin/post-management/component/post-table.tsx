"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, ExternalLink, MoreHorizontal, Trash2, Star } from "lucide-react"
import Image from "next/image"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"
import { useLocale } from "@/hooks/useLocale"

type Post = {
  id: string | number
  title: string
  excerpt: string
  author: string
  category: string
  status: string
  featuredImage: string
  tags: string[]
  publishedAt: string | null
  views: number
  // extra fields to align with page-level Post type
  slug: string
  content: string
  authorId: number
  categoryId: number
  createdAt: string
  likes: number
  // new
  isFeatured?: boolean
  postType?: string
}

export default function PostTable({
  items,
  getStatusColor,
  formatDate,
  onEdit,
  onDelete,
}: {
  items: Post[]
  getStatusColor: (status: string) => string
  formatDate: (d: string | null) => string
  onEdit: (p: Post) => void
  onDelete: (id: string | number) => void
}) {
  const { t } = useLocale()
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("post.table.post")}</TableHead>
            <TableHead>{t("post.table.author")}</TableHead>
            <TableHead>{t("post.table.category")}</TableHead>
            <TableHead>{t("post.table.status")}</TableHead>
            <TableHead>{t("post.table.published")}</TableHead>
            <TableHead>{t("post.table.views")}</TableHead>
            <TableHead className="w-[90px] whitespace-nowrap">{t("post.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex items-start gap-3">
                  <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} width={64} height={48} className="w-16 h-12 object-cover rounded border" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-card-foreground truncate flex items-center gap-1">
                      {post.title}
                      {post.isFeatured && <Star className="h-3.5 w-3.5 text-yellow-500" />}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {post.tags.length > 3 && <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>}
                      {post.postType && <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">{post.postType}</Badge>}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-full px-3">{post.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(post.status)} capitalize tracking-wide px-3`}>{post.status}</Badge>
              </TableCell>
              <TableCell>{formatDate(post.publishedAt)}</TableCell>
              <TableCell>{new Intl.NumberFormat("vi-VN").format(post.views)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      {t("common.preview")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" /> {t("common.viewLive")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(post)}>
                      <Edit className="h-4 w-4 mr-2" /> {t("common.edit")}
                    </DropdownMenuItem>
                    <DeleteConfirmDialog onConfirm={() => onDelete(post.id)}>
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


