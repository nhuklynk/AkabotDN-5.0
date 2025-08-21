"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CategoryFormDialog from "./component/category-form-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import CategoryTable from "./component/category-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, MoreHorizontal, ChevronRight, Folder, FolderOpen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DeleteConfirmDialog from "./component/delete-confirm-dialog"

// Mock data for categories
const initialCategories = [
  {
    id: 1,
    name: "Technology",
    slug: "technology",
    description: "All technology-related content",
    color: "#6366f1",
    status: "active",
    parentId: null,
    postCount: 45,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Web Development",
    slug: "web-development",
    description: "Frontend and backend web development topics",
    color: "#10b981",
    status: "active",
    parentId: 1,
    postCount: 23,
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    name: "Mobile Development",
    slug: "mobile-development",
    description: "iOS and Android app development",
    color: "#f59e0b",
    status: "active",
    parentId: 1,
    postCount: 12,
    createdAt: "2024-01-17",
  },
  {
    id: 4,
    name: "Design",
    slug: "design",
    description: "UI/UX design and visual content",
    color: "#ec4899",
    status: "active",
    parentId: null,
    postCount: 28,
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    name: "UI Design",
    slug: "ui-design",
    description: "User interface design principles and practices",
    color: "#8b5cf6",
    status: "active",
    parentId: 4,
    postCount: 15,
    createdAt: "2024-01-19",
  },
  {
    id: 6,
    name: "Marketing",
    slug: "marketing",
    description: "Digital marketing and promotion strategies",
    color: "#ef4444",
    status: "inactive",
    parentId: null,
    postCount: 8,
    createdAt: "2024-01-20",
  },
]

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

const colorOptions = [
  { value: "#6366f1", label: "Blue" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ec4899", label: "Pink" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ef4444", label: "Red" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#84cc16", label: "Lime" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#6366f1",
    status: "active",
    parentId: null as number | null,
  })

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || category.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Get parent categories for dropdown
  const parentCategories = categories.filter((cat) => cat.parentId === null)

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: Math.max(...categories.map((c) => c.id)) + 1,
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
      postCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCategories([...categories, newCategory])
    setFormData({ name: "", slug: "", description: "", color: "#6366f1", status: "active", parentId: null })
    setIsCreateDialogOpen(false)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      status: category.status,
      parentId: category.parentId,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, ...formData, slug: formData.slug || generateSlug(formData.name) }
            : category,
        ),
      )
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      setFormData({ name: "", slug: "", description: "", color: "#6366f1", status: "active", parentId: null })
    }
  }

  const handleDeleteCategory = (categoryId: number) => {
    const hasChildren = categories.some((cat) => cat.parentId === categoryId)
    if (hasChildren) {
      alert("Cannot delete category with subcategories. Please delete or move subcategories first.")
      return
    }
    setCategories(categories.filter((category) => category.id !== categoryId))
  }

  const getParentName = (parentId: number | null) => {
    if (!parentId) return null
    const parent = categories.find((cat) => cat.id === parentId)
    return parent?.name || null
  }

  const getStatusColor = (_status: string) => "bg-secondary text-secondary-foreground"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý danh mục</h1>
          <p className="text-muted-foreground">Tổ chức nội dung theo cấu trúc danh mục và thẻ.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </Button>
        <CategoryFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          parentCategories={parentCategories}
          colorOptions={colorOptions}
          onSubmit={handleCreateCategory}
          onNameChange={(name) => setFormData({ ...formData, name, slug: generateSlug(name) })}
          mode="create"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh mục</CardTitle>
          <CardDescription>Quản lý danh mục và cấu trúc phân cấp.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredCategories.length} / {categories.length} danh mục
            </div>
          </div>

          <CategoryTable
            items={filteredCategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            getParentName={getParentName}
            getStatusColor={getStatusColor}
          />
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        parentCategories={parentCategories.filter((cat) => cat.id !== editingCategory?.id)}
        colorOptions={colorOptions}
        onSubmit={handleUpdateCategory}
        onNameChange={(name) => setFormData({ ...formData, name, slug: generateSlug(name) })}
        mode="edit"
      />
    </div>
  )
}
