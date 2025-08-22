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
    <div className="min-h-screen bg-gradient-to-br from-[#0033FF] via-[#977DFF] to-[#FFCCF2]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Câu hỏi thường gặp</h1>
        <p className="text-lg">Thông tin cơ bản về Hiệp hội Dữ liệu Quốc gia</p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full max-w-md rounded-full px-4 py-3 shadow-lg text-[#0600AF] border-2 border-white/20 focus:border-white/50 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto px-4 pb-16 grid gap-6 sm:grid-cols-2">
        {categories.map((cat) => {
          const Icon = icons[cat.Icon || "info"];
          return (
            <Link key={cat.FAQID} href={`/faq/${cat.FAQID}`}>
              <Card className="p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm border-0 hover:bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#0033FF] mb-1">
                      {cat.Content}
                    </h2>
                    <p className="text-[#0600AF]/80 text-sm mb-2">
                      {cat.Description}
                    </p>
                    <span className="text-xs text-[#977DFF] font-medium bg-[#FFCCF2]/30 px-2 py-1 rounded-full">
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
