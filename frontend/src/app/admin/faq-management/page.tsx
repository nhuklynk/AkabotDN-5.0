"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useFaqs } from "@/hooks/useFaqs";
import faqService, { type Faq as ApiFaq } from "@/services/end-user/faqService";

type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
};

export default function FaqManagementPage() {
  const { t } = useLocale();
  const { faqs: apiFaqs, pagination, fetchFaqs, setCurrentPage, searchFaqs, refreshFaqs } = useFaqs({ initialLimit: 10 });
  const faqs: Faq[] = useMemo(() => (apiFaqs || []).map((f: ApiFaq) => ({
    id: (f.id as unknown as number),
    question: f.content,
    answer: f.content,
    category: "Chung",
    createdAt: (f.created_at || "").toString(),
  })), [apiFaqs]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingFaq, setEditingFaq] = useState<ApiFaq | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Chung",
  });

  const filtered = faqs.filter((f) =>
    [f.question, f.answer, f.category].some((t) =>
      t.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination driven by server
  const currentPage = pagination.currentPage || 1;
  const totalPages = Math.max(1, pagination.totalPages || 1);
  const paginatedFaqs = filtered;

  useEffect(() => {
    if (searchTerm) {
      searchFaqs(searchTerm);
    } else {
      fetchFaqs(1, 10);
    }
  }, [searchTerm, fetchFaqs, searchFaqs]);

  const handleCreate = async () => {
    await faqService.createFaq({ content: formData.question });
    setFormData({ question: "", answer: "", category: "Chung" });
    setDialogOpen(false);
    refreshFaqs();
  };

  const handleEdit = (faq: Faq) => {
    const api = (apiFaqs || []).find((f) => String(f.id) === String(faq.id)) || null;
    setEditingFaq(api);
    setFormData({
      question: faq.question,
      answer: api?.content || "",
      category: faq.category,
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdate = async () => {
    if (!editingFaq) return;
    await faqService.updateFaq(editingFaq.id, { content: formData.question });
    setDialogOpen(false);
    setEditingFaq(null);
    setFormData({ question: "", answer: "", category: "Chung" });
    refreshFaqs();
  };

  const handleDelete = async (id: number) => {
    await faqService.deleteFaq(String(id));
    refreshFaqs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">{t("faqManagement.title")}</h1>
          <p className="text-muted-foreground">{t("faqManagement.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => { setDialogMode("create"); setDialogOpen(true); }}
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

          <FaqTable
            items={paginatedFaqs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingFaq(null);
            setFormData({ question: "", answer: "", category: "Chung" });
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? t("faqManagement.dialog.createTitle") : t("faqManagement.dialog.editTitle")}</DialogTitle>
            <DialogDescription>{dialogMode === "create" ? t("faqManagement.dialog.createDesc") : t("faqManagement.dialog.editDesc")}</DialogDescription>
          </DialogHeader>

          <FaqFormDialog data={formData} setData={setFormData} mode={dialogMode} />

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={dialogMode === "create" ? handleCreate : handleUpdate}>
              {dialogMode === "create" ? t("faqManagement.dialog.createCta") : t("faqManagement.dialog.updateCta")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
