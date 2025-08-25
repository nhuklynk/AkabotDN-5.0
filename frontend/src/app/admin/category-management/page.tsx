"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryFormDialog from "./component/category-form-dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CategoryTable from "./component/category-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
} from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";

// Mock data for categories
const initialCategories = [
  {
    id: 1,
    name: "Công nghệ",
    slug: "technology",
    description: "Tất cả nội dung liên quan đến công nghệ",
    color: "var(--chart-1)",
    status: "active",
    parentId: null,
    postCount: 45,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Phát triển web",
    slug: "web-development",
    description: "Các chủ đề phát triển web frontend và backend",
    color: "var(--chart-2)",
    status: "active",
    parentId: 1,
    postCount: 23,
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    name: "Phát triển di động",
    slug: "mobile-development",
    description: "Phát triển ứng dụng iOS và Android",
    color: "var(--chart-3)",
    status: "active",
    parentId: 1,
    postCount: 12,
    createdAt: "2024-01-17",
  },
  {
    id: 4,
    name: "Thiết kế",
    slug: "design",
    description: "Thiết kế UI/UX và nội dung trực quan",
    color: "var(--chart-4)",
    status: "active",
    parentId: null,
    postCount: 28,
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    name: "Thiết kế giao diện",
    slug: "ui-design",
    description: "Nguyên tắc và thực hành thiết kế giao diện",
    color: "var(--chart-5)",
    status: "active",
    parentId: 4,
    postCount: 15,
    createdAt: "2024-01-19",
  },
  {
    id: 6,
    name: "Tiếp thị",
    slug: "marketing",
    description: "Chiến lược tiếp thị số và quảng bá",
    color: "var(--chart-6)",
    status: "inactive",
    parentId: null,
    postCount: 8,
    createdAt: "2024-01-20",
  },
];

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  status: string;
  parentId: number | null;
  postCount: number;
  createdAt: string;
};

const colorOptions = [
  { value: "var(--chart-1)", label: "Xanh dương" },
  { value: "var(--chart-2)", label: "Xanh lá" },
  { value: "var(--chart-3)", label: "Hổ phách" },
  { value: "var(--chart-4)", label: "Hồng" },
  { value: "var(--chart-5)", label: "Tím" },
  { value: "var(--chart-6)", label: "Đỏ" },
  { value: "var(--chart-7)", label: "Xanh ngọc" },
  { value: "var(--chart-8)", label: "Xanh chanh" },
];

export default function CategoriesPage() {
  const { t } = useLocale();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#6366f1",
    status: "active",
    parentId: null as number | null,
  });

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || category.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Get parent categories for dropdown
  const parentCategories = categories.filter((cat) => cat.parentId === null);

  // Generate URL-safe slug from Vietnamese name (strip diacritics, convert đ, hyphenate)
  const generateSlug = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: Math.max(...categories.map((c) => c.id)) + 1,
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
      postCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCategories([...categories, newCategory]);
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#6366f1",
      status: "active",
      parentId: null,
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      status: category.status,
      parentId: category.parentId,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                ...formData,
                slug: formData.slug || generateSlug(formData.name),
              }
            : category
        )
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        color: "#6366f1",
        status: "active",
        parentId: null,
      });
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    const hasChildren = categories.some((cat) => cat.parentId === categoryId);
    if (hasChildren) {
      alert(
        "Không thể xóa danh mục có danh mục con. Vui lòng xóa hoặc di chuyển danh mục con trước."
      );
      return;
    }
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const getParentName = (parentId: number | null) => {
    if (!parentId) return null;
    const parent = categories.find((cat) => cat.id === parentId);
    return parent?.name || null;
  };

  const getStatusColor = (_status: string) =>
    "bg-secondary text-secondary-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">{t("category.title")}</h1>
          <p className="text-muted-foreground">{t("category.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          {t("category.add")}
        </Button>
        <CategoryFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          parentCategories={parentCategories}
          colorOptions={colorOptions}
          onSubmit={handleCreateCategory}
          onNameChange={(name) =>
            setFormData({ ...formData, name, slug: generateSlug(name) })
          }
          mode="create"
        />
      </div>

      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("category.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("category.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("category.all")}</SelectItem>
                <SelectItem value="active">{t("category.active")}</SelectItem>
                <SelectItem value="inactive">{t("category.inactive")}</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {t("category.countSummary", { filtered: filteredCategories.length, total: categories.length })}
            </div>
          </div>

          <CategoryTable
            items={paginatedCategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            getParentName={getParentName}
            getStatusColor={getStatusColor}
          />
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        parentCategories={parentCategories.filter(
          (cat) => cat.id !== editingCategory?.id
        )}
        colorOptions={colorOptions}
        onSubmit={handleUpdateCategory}
        onNameChange={(name) =>
          setFormData({ ...formData, name, slug: generateSlug(name) })
        }
        mode="edit"
      />
    </div>
  );
}
