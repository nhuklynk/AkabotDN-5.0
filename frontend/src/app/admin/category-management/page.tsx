"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryFormDialog from "./component/category-form-dialog";
import type { CategoryFormData } from "./component/category-form-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CategoryTable from "./component/category-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";
import { useCategoriesList } from "@/hooks/admin/category/useCategoriesList";
import { useCreateCategory } from "@/hooks/admin/category/useCreateCategory";
import { useDeleteCategory } from "@/hooks/admin/category/useDeleteCategory";
import { useUpdateCategory } from "@/hooks/admin/category/useUpdateCategory";

type Category = {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  color: string;
  status: string;
  parentId: number | string | null;
  postCount: number;
  createdAt: string;
};

type TableCategory = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  status: string;
  parentId: number | string | null;
  postCount: number;
  createdAt?: string;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] = useState<TableCategory | null>(
    null
  );
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    color: "#6366f1",
    status: "active",
    parentId: null as string | null,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { items, total, loading, setQuery, refetch } = useCategoriesList({
    initialQuery: { page: currentPage, limit: pageSize },
  });
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / pageSize)),
    [total]
  );
  const apiCategories: Category[] = useMemo(
    () =>
      items.map((it: any) => ({
        id: it.id,
        name: it.name,
        slug: it.slug,
        description: it.description ?? "",
        color: "var(--chart-1)",
        status: it.status,
        parentId: it.parentId ?? it.parent_id ?? null,
        postCount: 0,
        createdAt: it.createdAt ?? it.created_at ?? "",
      })),
    [items]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    setQuery({
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      status: filterStatus === "all" ? undefined : filterStatus,
    });
  }, [currentPage, pageSize, searchTerm, filterStatus, setQuery]);

  // Get parent categories for dropdown
  const parentCategories = apiCategories.filter((cat) => cat.parentId === null);
  const parentOptions = useMemo(
    () => parentCategories.map((c) => ({ id: c.id, name: c.name })),
    [parentCategories]
  );

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

  const { mutate: createCat } = useCreateCategory();
  const { mutate: updateCat } = useUpdateCategory();
  const { mutate: deleteCat } = useDeleteCategory();

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      await createCat({
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        parent_id: formData.parentId || undefined,
      });
      setDialogOpen(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        color: "#6366f1",
        status: "active",
        parentId: null,
      });
      refetch();
    } catch (error) {
      console.error("Failed to create category:", error);
      alert("Không thể tạo danh mục. Vui lòng thử lại.");
    }
  };

  const handleEditCategory = (category: TableCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      color: category.color,
      status: category.status,
      parentId: category.parentId !== null ? String(category.parentId) : null,
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    if (!formData.name.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      await updateCat(editingCategory.id, {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description,
        parent_id: formData.parentId,
      });
      setDialogOpen(false);
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        color: "#6366f1",
        status: "active",
        parentId: null,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Không thể cập nhật danh mục. Vui lòng thử lại.");
    }
  };

  const handleDeleteCategory = async (categoryId: number | string) => {
    await deleteCat(categoryId);
    refetch();
  };

  const getParentName = (parentId: number | string | null) => {
    if (!parentId) return null;
    const parent = apiCategories.find(
      (cat) => String(cat.id) === String(parentId)
    );
    return parent?.name || null;
  };

  const getStatusColor = (_status: string) =>
    "bg-secondary text-secondary-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">
            {t("category.title")}
          </h1>
          <p className="text-muted-foreground">{t("category.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setDialogMode("create");
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("category.add")}
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
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
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? t("category.dialog.createTitle") : t("category.dialog.editTitle")}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create" ? t("category.dialog.createDesc") : t("category.dialog.editDesc")}
              </DialogDescription>
            </DialogHeader>

            <CategoryFormDialog
              formData={formData}
              setFormData={setFormData}
              parentCategories={parentOptions.filter((cat) => String(cat.id) !== String(editingCategory?.id))}
              colorOptions={colorOptions}
              onNameChange={(name) => setFormData({ ...formData, name, slug: generateSlug(name) })}
              mode={dialogMode}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={dialogMode === "create" ? handleCreateCategory : handleUpdateCategory}>
                {dialogMode === "create" ? t("category.dialog.createCta") : t("category.dialog.updateCta")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <SelectItem value="inactive">
                  {t("category.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {t("category.countSummary", {
                filtered: items.length,
                total: total,
              })}
            </div>
          </div>

          <CategoryTable
            items={apiCategories}
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

      {/* Single dialog instance above handles both create and edit */}
    </div>
  );
}
