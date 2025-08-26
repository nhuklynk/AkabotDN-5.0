"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FaqTable from "./component/faq-table";
import FaqFormDialog from "./component/faq-form-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";
import { useFaqManagement } from "@/hooks/admin/faq/useFaqManagement";

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
};

export default function FaqManagementPage() {
  const { t } = useLocale();
  const {
    faqs,
    searchTerm,
    dialogOpen,
    dialogMode,
    formData,
    loading,
    error,
    setFormData,
    setSearchTerm,
    setDialogOpen,
    openCreate,
    openEdit,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSearch,
    closeDialog,
  } = useFaqManagement();

  const filtered = faqs.filter((f) =>
    [f.question, f.answer, f.category].some((t) =>
      t.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const currentPage = 1;
  const totalPages = 1;
  const paginatedFaqs = filtered;

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [searchTerm, handleSearch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">{t("faqManagement.title")}</h1>
          <p className="text-muted-foreground">{t("faqManagement.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" /> {t("faqManagement.add")}
        </Button>
      </div>

      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("faqManagement.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {t("faqManagement.countSummary", { filtered: filtered.length, total: faqs.length })}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            </div>
          ) : (
            <FaqTable
              items={paginatedFaqs}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={() => {}}
          />
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <div className="relative">
        <div
          className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-200 ${
            dialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeDialog}
        />
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ${
            dialogOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-background border rounded-lg p-6 m-4 max-w-md w-full shadow-lg">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {dialogMode === "create" ? t("faqManagement.dialog.createTitle") : t("faqManagement.dialog.editTitle")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {dialogMode === "create" ? t("faqManagement.dialog.createDesc") : t("faqManagement.dialog.editDesc")}
              </p>
            </div>

            <FaqFormDialog 
              data={{ 
                question: formData.content, 
                answer: formData.content, 
                category: "Chung" 
              }} 
              setData={(data) => {
                if (typeof data === 'function') {
                  const newData = data({ question: formData.content, answer: formData.content, category: "Chung" });
                  setFormData({ content: newData.question || newData.answer || "" });
                } else {
                  setFormData({ content: data.question || data.answer || "" });
                }
              }} 
              mode={dialogMode} 
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeDialog}>
                {t("common.cancel")}
              </Button>
              <Button onClick={dialogMode === "create" ? handleCreate : handleUpdate}>
                {dialogMode === "create" ? t("faqManagement.dialog.createCta") : t("faqManagement.dialog.updateCta")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
