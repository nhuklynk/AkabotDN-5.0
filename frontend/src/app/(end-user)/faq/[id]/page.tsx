"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { faqService, Faq } from "@/services/end-user/faqService";
import { formatDate } from "@/utils/dateUtils";
import { truncateText } from "@/utils/textUtils";
import { useLocale } from "@/hooks/useLocale";

export default function FAQCategoryPage() {
  const { t } = useLocale();
  const { id } = useParams();
  const faqId = Array.isArray(id) ? id[0] : id;

  const [category, setCategory] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // No child FAQs since there's no parent-child structure
  const childFaqs: any[] = [];
  const childLoading = false;

  useEffect(() => {
    const fetchFaq = async () => {
      if (!faqId) return;

      try {
        setLoading(true);
        setError(null);
        const faqData = await faqService.getFaqById(faqId);
        setCategory(faqData);
      } catch (err) {
        console.error("Error fetching FAQ:", err);
        setError(t("faq.error.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [faqId, t]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0033FF] via-[#977DFF] to-[#FFCCF2] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>{t("faq.loadingQuestion")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0033FF] via-[#977DFF] to-[#FFCCF2] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-200 mb-4">
            {error || t("faq.error.notFound")}
          </p>
          <Link
            href="/faq"
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
          >
            {t("faq.backToList")}
          </Link>
        </div>
      </div>
    );
  }

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
            <span className="font-medium">{t("faq.backToListFull")}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 text-white">
        {/* FAQ Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{category.content}</h1>
          <p className="text-xl text-white/90">{t("faq.title")}</p>
          <p className="text-sm text-white/70 mt-2">
            {t("faq.createdDate", { date: formatDate(category.created_at) })}
          </p>
        </div>

        {/* FAQ Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-[#0600AF]">
          {/* If this FAQ has children, show them as a list */}
          {childFaqs.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-[#0033FF] mb-6">
                {t("faq.questionInCategory")}
              </h2>

              {childLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0033FF]" />
                  <p className="text-[#0600AF]/70">
                    {t("faq.loadingQuestion")}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {childFaqs.map((childFaq, index) => (
                    <div
                      key={childFaq.id}
                      className="border-b border-[#FFCCF2]/40 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <Link href={`/faq/${childFaq.id}`}>
                            <h3 className="font-semibold text-[#0033FF] text-lg mb-3 hover:text-[#977DFF] transition-colors cursor-pointer line-clamp-2 min-h-[3.5rem]">
                              {truncateText(childFaq.content, 100)}
                            </h3>
                          </Link>
                          <p className="text-xs text-[#977DFF]">
                            {t("faq.createdDate", {
                              date: formatDate(childFaq.created_at),
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* If this is a single FAQ item, show its content */
            <div>
              <h2 className="text-2xl font-bold text-[#0033FF] mb-6">
                {t("faq.questionLabel")}
              </h2>
              <div className="mb-6">
                <div className="bg-gradient-to-br from-[#F2E6EE] to-[#FFCCF2]/30 p-6 rounded-lg border border-[#FFCCF2]/40">
                  <p className="text-[#0600AF]/80 leading-relaxed text-lg">
                    {category.content}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#FFCCF2]/40">
                    <Link
                      href="/faq"
                      className="text-[#977DFF] hover:text-[#0033FF] font-medium transition-colors"
                    >
                      {t("faq.backToFAQ")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-[#0033FF]/10 to-[#977DFF]/10 rounded-lg border border-[#FFCCF2]/40">
            <h3 className="text-lg font-semibold text-[#0033FF] mb-2">
              {t("faq.contact.title")}
            </h3>
            <p className="text-[#0600AF]/80 mb-4">
              {t("faq.contact.description")}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#FFCCF2] to-[#977DFF] hover:from-[#977DFF] hover:to-[#0033FF] text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
            >
              {t("faq.contact.button")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
