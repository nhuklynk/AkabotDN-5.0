"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import FaqTable from "./component/faq-table"
import FaqFormDialog from "./component/faq-form-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react"

type Faq = {
  id: number
  question: string
  answer: string
  category: string
  createdAt: string
}

const initialFaqs: Faq[] = [
  { id: 1, question: "Làm thế nào để tạo tài khoản?", answer: "Nhấn Đăng ký và điền thông tin.", category: "Tài khoản", createdAt: "2024-02-01" },
  { id: 2, question: "Quên mật khẩu thì sao?", answer: "Dùng chức năng Quên mật khẩu để đặt lại.", category: "Tài khoản", createdAt: "2024-02-05" },
]

export default function FaqManagementPage() {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [formData, setFormData] = useState({ question: "", answer: "", category: "Chung" })

  const filtered = faqs.filter((f) =>
    [f.question, f.answer, f.category].some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreate = () => {
    const newFaq: Faq = {
      id: Math.max(...faqs.map((f) => f.id)) + 1,
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setFaqs([newFaq, ...faqs])
    setFormData({ question: "", answer: "", category: "Chung" })
    setIsCreateOpen(false)
  }

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq)
    setFormData({ question: faq.question, answer: faq.answer, category: faq.category })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingFaq) return
    setFaqs(
      faqs.map((f) => (f.id === editingFaq.id ? { ...f, question: formData.question, answer: formData.answer, category: formData.category } : f)),
    )
    setIsEditOpen(false)
    setEditingFaq(null)
    setFormData({ question: "", answer: "", category: "Chung" })
  }

  const handleDelete = (id: number) => setFaqs(faqs.filter((f) => f.id !== id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý FAQ</h1>
          <p className="text-muted-foreground">Tạo, chỉnh sửa và quản lý các câu hỏi thường gặp.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Thêm FAQ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách FAQ</CardTitle>
          <CardDescription>Các câu hỏi thường gặp của hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">{filtered.length} / {faqs.length} mục</div>
          </div>

          <FaqTable items={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <FaqFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} data={formData} setData={setFormData} onSubmit={handleCreate} mode="create" />

      <FaqFormDialog open={isEditOpen} onOpenChange={setIsEditOpen} data={formData} setData={setFormData} onSubmit={handleUpdate} mode="edit" />
    </div>
  )
}


