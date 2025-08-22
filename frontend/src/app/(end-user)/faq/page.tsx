"use client";

import { Card } from "@/components/ui/card";
import { Info, Users, Box, BookOpen } from "lucide-react";
import Link from "next/link";
import { faqData } from "./mockdata";

const icons: any = {
  info: Info,
  users: Users,
  box: Box,
  "book-open": BookOpen,
};

export default function FAQHomePage() {
  const categories = faqData.filter((f) => f.ParentId === null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Câu hỏi thường gặp</h1>
        <p className="text-lg">Thông tin cơ bản về Hiệp hội Dữ liệu Quốc gia</p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full max-w-md rounded-full px-4 py-2 shadow-md text-gray-800"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto px-4 grid gap-6 sm:grid-cols-2">
        {categories.map((cat) => {
          const Icon = icons[cat.Icon || "info"];
          return (
            <Link key={cat.FAQID} href={`/faq/${cat.FAQID}`}>
              <Card className="p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <Icon className="w-8 h-8 text-purple-600" />
                  <div>
                    <h2 className="text-lg font-semibold">{cat.Content}</h2>
                    <p className="text-gray-600">{cat.Description}</p>
                    <span className="text-sm text-gray-400">
                      {cat.ArticleCount} câu hỏi
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
