"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { useLocale } from "@/hooks/useLocale"

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
  const { t } = useLocale()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? t("faq.dialog.createTitle") : t("faq.dialog.editTitle")}</DialogTitle>
          <DialogDescription>{isCreate ? t("faq.dialog.createDesc") : t("faq.dialog.editDesc")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="q">Câu hỏi</Label>
            <Input id="q" value={data.question} onChange={(e) => setData((d) => ({ ...d, question: e.target.value }))} placeholder="Nhập câu hỏi" />
          </div>
          <div>
            <Label htmlFor="a">Câu trả lời</Label>
            <RichTextEditor
              value={data.answer}
              onChange={(html) => setData((d) => ({ ...d, answer: html }))}
            />
          </div>
          <div>
            <Label htmlFor="c">Danh mục</Label>
            <Input id="c" value={data.category} onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))} placeholder="Ví dụ: Chung, Tài khoản" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSubmit}>{isCreate ? t("faq.dialog.createCta") : t("faq.dialog.updateCta")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


