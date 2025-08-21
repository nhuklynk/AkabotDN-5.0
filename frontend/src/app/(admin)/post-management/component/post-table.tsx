"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Edit, Eye, ExternalLink, MoreHorizontal, Trash2, User } from "lucide-react"
import Image from "next/image"
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog"

type Post = {
  id: number
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
  onDelete: (id: number) => void
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bài viết</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Xuất bản</TableHead>
            <TableHead>Lượt xem</TableHead>
            <TableHead className="w-[70px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="flex items-start gap-3">
                  <Image src={post.featuredImage || "/placeholder.svg"} alt={post.title} width={64} height={48} className="w-16 h-12 object-cover rounded border" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-card-foreground truncate">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {post.tags.length > 3 && <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {post.author}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-full px-3">{post.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(post.status)} uppercase tracking-wide px-3`}>{post.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(post.publishedAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  {post.views.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" /> Xem trước
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" /> Xem trực tiếp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(post)}>
                      <Edit className="h-4 w-4 mr-2" /> Sửa
                    </DropdownMenuItem>
                    <DeleteConfirmDialog onConfirm={() => onDelete(post.id)}>
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


