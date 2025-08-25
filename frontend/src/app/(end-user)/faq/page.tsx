"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Info, Users, Box, BookOpen, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useFaqCategories, useFaqs } from "@/hooks/useFaqs";
import { Faq } from "@/services/end-user/faqService";
import { formatDate } from "@/utils/dateUtils";
import { truncateText } from "@/utils/textUtils";
import { useLocale } from "@/hooks/useLocale";

const icons: any = {
  info: Info,
  users: Users,
  box: Box,
  "book-open": BookOpen,
};

// Helper function to assign icons to categories
const getIconForCategory = (index: number) => {
  const iconKeys = ["info", "users", "box", "book-open"];
  return iconKeys[index % iconKeys.length];
};

// Helper function to get FAQ count (simplified since no parent-child structure)
const getFaqCount = (): number => {
  return 1; // Each FAQ is standalone now
};

export default function FAQHomePage() {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Get all FAQs (no parent-child structure anymore)
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFaqCategories();

  // Search FAQs
  const {
    faqs: searchResults,
    loading: searchLoading,
    searchFaqs,
  } = useFaqs({ autoFetch: false });

  // Handle search
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        setIsSearching(true);
        searchFaqs(searchTerm.trim());
      } else {
        setIsSearching(false);
      }
    },
    [searchTerm, searchFaqs]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setIsSearching(false);
    }
  };

  // Loading state
  if (categoriesLoading && !isSearching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0033FF] via-[#977DFF] to-[#FFCCF2] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>{t("faq.loading")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (categoriesError && !isSearching) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#0033FF] to-[#977DFF] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-200 mb-4">{categoriesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
          >
            {t("faq.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0033FF] via-[#977DFF] to-[#FFCCF2]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{t("faq.title")}</h1>
        <p className="text-lg">{t("faq.description")}</p>
        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder={t("faq.searchPlaceholder")}
              className="w-full rounded-full pl-4 pr-12 py-3 shadow-lg text-[#0600AF] border-2 border-white/20 focus:border-white/50 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0600AF] text-white rounded-full flex items-center justify-center hover:bg-[#0600AF]/80 transition-all disabled:opacity-50"
            >
              {searchLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {isSearching ? (
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="mb-6 text-center">
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchTerm("");
              }}
              className="text-white/80 hover:text-white underline"
            >
              {t("faq.backToList")}
            </button>
          </div>

          {searchLoading ? (
            <div className="text-center text-white">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4" />
              <p>{t("faq.searching")}</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((faq) => (
                <Link key={faq.id} href={`/faq/${faq.id}`}>
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer bg-white/95 backdrop-blur-sm border-0 hover:bg-white">
                    <p className="text-[#0033FF] font-medium line-clamp-3">
                      {truncateText(faq.content, 120)}
                    </p>
                    <p className="text-xs text-[#977DFF] mt-2">
                      {formatDate(faq.created_at)}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-white">
              <p>{t("faq.noResults", { searchTerm })}</p>
            </div>
          )}
        </div>
      ) : (
        /* Categories */
        <div className="max-w-4xl mx-auto px-4 pb-16 grid gap-6 sm:grid-cols-2">
          {categories.map((category, index) => {
            const iconKey = getIconForCategory(index);
            const Icon = icons[iconKey];
            const faqCount = getFaqCount();

            return (
              <Link key={category.id} href={`/faq/${category.id}`}>
                <Card className="p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm border-0 hover:bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFCCF2] to-[#977DFF] rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-[#0033FF] mb-1 line-clamp-2 min-h-[2.5rem]">
                        {truncateText(category.content, 60)}
                      </h2>
                      <span className="text-xs text-[#977DFF] font-medium bg-[#FFCCF2]/30 px-2 py-1 rounded-full">
                        {t("faq.questionLabel")}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
