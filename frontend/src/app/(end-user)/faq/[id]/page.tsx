"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { faqData } from "../mockdata";
import { ArrowLeft } from "lucide-react";

export default function FAQCategoryPage() {
  const { id } = useParams();
  const categoryId = Number(id);

  const category = faqData.find((f) => f.FAQID === categoryId);
  const questions = faqData.filter((f) => f.ParentId === categoryId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0033FF] via-[#977DFF] to-[#FFCCF2]">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Quay lại danh sách câu hỏi</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 text-white">
        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{category?.Content}</h1>
          <p className="text-xl text-white/90">{category?.Description}</p>
        </div>

        {/* Questions List */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-[#0600AF]">
          <h2 className="text-2xl font-bold text-[#0033FF] mb-6">
            Câu hỏi thường gặp
          </h2>

          <div className="space-y-6">
            {questions.map((q, index) => (
              <div
                key={q.FAQID}
                className="border-b border-[#FFCCF2]/40 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0033FF] text-lg mb-3">
                      {q.Content}
                    </h3>
                    <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-4 rounded-lg border border-[#FFCCF2]/40">
                      <p className="text-[#0600AF]/80 leading-relaxed">
                        Đây là nội dung trả lời chi tiết cho câu hỏi "
                        {q.Content}". Thông tin này được cung cấp bởi Hiệp hội
                        Dữ liệu Quốc gia Việt Nam để giúp bạn hiểu rõ hơn về các
                        hoạt động và dịch vụ của chúng tôi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-[#0033FF]/10 to-[#977DFF]/10 rounded-lg border border-[#FFCCF2]/40">
            <h3 className="text-lg font-semibold text-[#0033FF] mb-2">
              Không tìm thấy câu trả lời bạn cần?
            </h3>
            <p className="text-[#0600AF]/80 mb-4">
              Hãy liên hệ với chúng tôi để được hỗ trợ trực tiếp từ đội ngũ
              chuyên gia.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
