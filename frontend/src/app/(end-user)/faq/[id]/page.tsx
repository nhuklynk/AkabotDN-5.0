"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { faqData } from "../mockdata";

export default function FAQCategoryPage() {
  const { id } = useParams();
  const categoryId = Number(id);

  const category = faqData.find((f) => f.FAQID === categoryId);
  const questions = faqData.filter((f) => f.ParentId === categoryId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400">
      <div className="max-w-4xl mx-auto px-4 py-12 text-white">
        <Link href="/faq" className="underline mb-4 block">
          ← Quay lại danh mục
        </Link>
        <h1 className="text-3xl font-bold mb-2">{category?.Content}</h1>
        <p className="text-lg mb-8">{category?.Description}</p>

        <div className="bg-white rounded-lg shadow p-6 space-y-4 text-gray-800">
          {questions.map((q) => (
            <div
              key={q.FAQID}
              className="border-b pb-4 last:border-0 last:pb-0"
            >
              <h2 className="font-medium">{q.Content}</h2>
              <p className="text-gray-600 text-sm">
                Đây là nội dung trả lời cho câu hỏi "{q.Content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
