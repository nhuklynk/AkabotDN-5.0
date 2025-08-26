"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, User, Tag, Globe } from "lucide-react";
import { Pagination } from "@/components/pagination-component";
import { formatDate } from "@/utils/dateUtils";
import { truncateText } from "@/utils/textUtils";
import { useLocale } from "@/hooks/useLocale";
import { postService, Post } from "@/services/end-user/postService";

interface DigitalProductsGridProps {
  onPaginationUpdate: (info: {
    totalProducts: number;
    currentPage: number;
    totalPages: number;
    productsPerPage: number;
  }) => void;
}

export function DigitalProductsGrid({
  onPaginationUpdate,
}: DigitalProductsGridProps) {
  const { t } = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [digitalProducts, setDigitalProducts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });
  const hasInitialized = useRef(false);

  // Fallback data if no posts are found
  const fallbackProducts = [
    {
      id: "san-giao-dich",
      title: "Sàn giao dịch",
      slug: "san-giao-dich",
      summary:
        "Nền tảng giao dịch số hiện đại với công nghệ blockchain tiên tiến",
      featured_image: "/trading-platform.svg",
      created_at: new Date().toISOString(),
      categories: [{ id: "1", name: "Blockchain" }],
      tags: [
        { id: "1", name: "Fintech" },
        { id: "2", name: "Blockchain" },
      ],
      user: { email: "admin@nda.gov.vn" },
    },
    {
      id: "nen-tang-blockchain",
      title: "Nền tảng Chuỗi khối quốc gia",
      slug: "nen-tang-blockchain",
      summary: "Hạ tầng blockchain quốc gia đáng tin cậy cho các dịch vụ công",
      featured_image: "/blockchain-platform.svg",
      created_at: new Date().toISOString(),
      categories: [{ id: "2", name: "Government Tech" }],
      tags: [
        { id: "3", name: "Blockchain" },
        { id: "4", name: "Public Service" },
      ],
      user: { email: "admin@nda.gov.vn" },
    },
    {
      id: "ung-dung-dinh-danh",
      title: "Ứng dụng định danh phi tập trung Quốc gia",
      slug: "ung-dung-dinh-danh",
      summary: "Giải pháp định danh số an toàn và bảo mật cho công dân",
      featured_image: "/blockchain-platform.svg",
      created_at: new Date().toISOString(),
      categories: [{ id: "3", name: "Security" }],
      tags: [
        { id: "5", name: "Identity" },
        { id: "6", name: "Security" },
      ],
      user: { email: "admin@nda.gov.vn" },
    },
  ];

  // Fetch digital products
  const fetchDigitalProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getDigitalProducts(page, 10);

      if (response.data.items && response.data.items.length > 0) {
        setDigitalProducts(response.data.items);
        setPagination({
          currentPage: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total,
          limit: response.data.limit,
        });
      } else {
        // Use fallback data if no API data
        setDigitalProducts(fallbackProducts as Post[]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          total: fallbackProducts.length,
          limit: 10,
        });
      }
    } catch (err) {
      console.error("Error fetching digital products:", err);
      setError(t("digitalProducts.errors.fetchFailed"));
      // Use fallback data on error
      setDigitalProducts(fallbackProducts as Post[]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: fallbackProducts.length,
        limit: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update parent component with pagination info
  useEffect(() => {
    if (pagination && pagination.total > 0) {
      onPaginationUpdate({
        totalProducts: pagination.total,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        productsPerPage: pagination.limit,
      });
    }
  }, [
    pagination.total,
    pagination.currentPage,
    pagination.totalPages,
    pagination.limit,
    onPaginationUpdate,
  ]);

  // Fetch products on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchDigitalProducts();
    }
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchDigitalProducts(page);
  };

  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading && digitalProducts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {t("digitalProducts.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error && digitalProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => fetchDigitalProducts()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {t("digitalProducts.retry")}
        </button>
      </div>
    );
  }

  if (digitalProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {t("digitalProducts.noProducts")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {digitalProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-shadow border-slate-200 shadow-lg"
          >
            <Link href={`/posts/${product.slug}`}>
              <CardContent className="p-0 border-slate-200 shadow-lg">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={product.featured_image || "/placeholder-hero.svg"}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      {t("digitalProducts.badge")}
                    </Badge>
                  </div>
                  {product.categories && product.categories.length > 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 border-emerald-200"
                      >
                        {product.categories[0].name}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                    {truncateText(product.title, 80)}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
                    {truncateText(
                      product.summary ||
                        product.excerpt ||
                        t("digitalProducts.noDescription"),
                      120
                    )}
                  </p>

                  {/* Product Meta */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>
                        {product.user?.email ||
                          product.author_name ||
                          t("digitalProducts.author")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {mounted
                          ? formatDate(product.created_at)
                          : product.created_at?.split("T")[0] ||
                            t("digitalProducts.unknownDate")}
                      </span>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {product.tags.length > 2 && (
                            <span className="text-xs">
                              +{product.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
