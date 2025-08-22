"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Data = { question: string; answer: string; category: string }

export default function FaqFormDialog({
  open,
  onOpenChange,
  data,
  setData,
  onSubmit,
  mode,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  data: Data
  setData: React.Dispatch<React.SetStateAction<Data>>
  onSubmit: () => void
  mode: "create" | "edit"
}) {
  const isCreate = mode === "create"
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Thêm FAQ" : "Chỉnh sửa FAQ"}</DialogTitle>
          <DialogDescription>{isCreate ? "Nhập câu hỏi và câu trả lời." : "Cập nhật nội dung câu hỏi và trả lời."}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="q">Câu hỏi</Label>
            <Input id="q" value={data.question} onChange={(e) => setData((d) => ({ ...d, question: e.target.value }))} placeholder="Nhập câu hỏi" />
          </div>
          <div>
            <Label htmlFor="a">Câu trả lời</Label>
            <Textarea id="a" value={data.answer} onChange={(e) => setData((d) => ({ ...d, answer: e.target.value }))} placeholder="Nhập câu trả lời" rows={4} />
          </div>
          <div>
            <Label htmlFor="c">Danh mục</Label>
            <Input id="c" value={data.category} onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))} placeholder="Ví dụ: Chung, Tài khoản" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>{isCreate ? "Thêm" : "Cập nhật"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


