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
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { useLocale } from "@/hooks/useLocale";

type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
};

const initialFaqs: Faq[] = [
  {
    id: 1,
    question: "Làm thế nào để tạo tài khoản?",
    answer: "Nhấn Đăng ký và điền thông tin.",
    category: "Tài khoản",
    createdAt: "2024-02-01",
  },
  {
    id: 2,
    question: "Quên mật khẩu thì sao?",
    answer: "Dùng chức năng Quên mật khẩu để đặt lại.",
    category: "Tài khoản",
    createdAt: "2024-02-05",
  },
];

export default function FaqManagementPage() {
  const { t } = useLocale();
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedFaqs = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreate = () => {
    const newFaq: Faq = {
      id: Math.max(...faqs.map((f) => f.id)) + 1,
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFaqs([newFaq, ...faqs]);
    setFormData({ question: "", answer: "", category: "Chung" });
    setIsCreateOpen(false);
  };

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingFaq) return;
    setFaqs(
      faqs.map((f) =>
        f.id === editingFaq.id
          ? {
              ...f,
              question: formData.question,
              answer: formData.answer,
              category: formData.category,
            }
          : f
      )
    );
    setIsEditOpen(false);
    setEditingFaq(null);
    setFormData({ question: "", answer: "", category: "Chung" });
  };

  const handleDelete = (id: number) => setFaqs(faqs.filter((f) => f.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">{t("faq.title")}</h1>
          <p className="text-muted-foreground">{t("faq.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="h-4 w-4" /> {t("faq.add")}
        </Button>
      </div>

      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("faq.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {t("faq.countSummary", { filtered: filtered.length, total: faqs.length })}
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
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <FaqFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        data={formData}
        setData={setFormData}
        onSubmit={handleCreate}
        mode="create"
      />

      <FaqFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        data={formData}
        setData={setFormData}
        onSubmit={handleUpdate}
        mode="edit"
      />
    </div>
  );
}
