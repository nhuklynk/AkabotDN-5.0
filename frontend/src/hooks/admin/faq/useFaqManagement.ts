import { useState, useCallback } from "react";
import { useFaqs } from "./useFaqs";
import { CreateFaqPayload, UpdateFaqPayload } from "@/services/admin/faqs";
import type { FaqListItem } from "@/services/admin/faqs/listFaqs";

export type FaqFormData = {
  content: string;
  parent_id?: string;
};

export function useFaqManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingFaq, setEditingFaq] = useState<FaqListItem | null>(null);
  const [formData, setFormData] = useState<FaqFormData>({
    content: "",
  });

  const {
    items: apiFaqs,
    loading,
    error,
    create,
    update,
    remove,
    setQuery,
  } = useFaqs({
    initialQuery: { page: 1, limit: 10 },
  });

  const faqs = apiFaqs.map((faq) => {
    const mappedFaq = {
      id: faq.id,
      question: faq.content,
      answer: faq.content,
      category: "Chung",
      createdAt: faq.created_at,
    };
    return mappedFaq;
  });

  const openCreate = useCallback(() => {
    setFormData({
      content: "",
    });
    setDialogMode("create");
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback(
    (faq: any) => {
      console.log("openEdit called with faq:", faq);
      console.log("faq.id type:", typeof faq.id, "value:", faq.id);

      if (!faq.id || typeof faq.id !== "string") {
        console.error("Invalid FAQ ID for editing:", faq.id);
        return;
      }

      const apiFaq = apiFaqs.find((f) => f.id === faq.id);

      if (apiFaq) {
        setEditingFaq(apiFaq);
        setFormData({
          content: apiFaq.content,
          parent_id: apiFaq.parent_id || undefined,
        });
        setDialogMode("edit");
        setDialogOpen(true);
      } else {
        console.error("FAQ not found for editing:", faq.id);
        console.error(
          "Available API FAQ IDs:",
          apiFaqs.map((f) => f.id)
        );
      }
    },
    [apiFaqs]
  );

  const handleCreate = useCallback(async () => {
    try {
      const payload: CreateFaqPayload = {
        content: formData.content,
        parent_id: formData.parent_id,
      };
      await create(payload);
      setDialogOpen(false);
      setFormData({ content: "" });
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      throw error;
    }
  }, [formData, create]);

  const handleUpdate = useCallback(async () => {
    if (!editingFaq) return;
    try {
      const payload: UpdateFaqPayload = {
        content: formData.content,
        parent_id: formData.parent_id,
      };
      await update(editingFaq.id, payload);
      setDialogOpen(false);
      setEditingFaq(null);
      setFormData({ content: "" });
    } catch (error) {
      console.error("Failed to update FAQ:", error);
      throw error;
    }
  }, [formData, editingFaq, update]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await remove(id);
      } catch (error) {
        console.error("Delete failed:", error);
        throw error;
      }
    },
    [remove]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setQuery({
        page: 1,
        limit: 10,
        search: term || undefined,
      });
    },
    [setQuery]
  );

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingFaq(null);
    setFormData({ content: "" });

    setTimeout(() => {
      setDialogOpen(false);
    }, 100);
  }, []);

  return {
    // State
    faqs,
    searchTerm,
    dialogOpen,
    dialogMode,
    editingFaq,
    formData,
    loading,
    error,

    // Actions
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
  };
}

export default useFaqManagement;
