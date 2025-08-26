"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { useLocale } from "@/hooks/useLocale"

type Data = { question: string; answer: string; category: string }

export default function FaqFormDialog({
  data,
  setData,
  mode,
}: {
  data: Data
  setData: React.Dispatch<React.SetStateAction<Data>>
  mode: "create" | "edit"
}) {
  const { t } = useLocale()
  return (
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
  )
}


