"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, User, Tag } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { Pagination } from "@/components/pagination-component";
import { formatDate } from "@/utils/dateUtils";
import { truncateText } from "@/utils/textUtils";
import { useLocale } from "@/hooks/useLocale";

interface PostsGridProps {
  onPaginationUpdate: (info: {
    totalPosts: number;
    currentPage: number;
    totalPages: number;
    postsPerPage: number;
  }) => void;
}

export function PostsGrid({ onPaginationUpdate }: PostsGridProps) {
  const { t } = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const hasInitialized = useRef(false);

  const {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    setCurrentPage: setHookCurrentPage,
  } = usePosts();

  // Update parent component with pagination info
  useEffect(() => {
    if (pagination && pagination.total > 0) {
      onPaginationUpdate({
        totalPosts: pagination.total,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        postsPerPage: pagination.limit,
      });
    }
  }, [
    pagination.total,
    pagination.currentPage,
    pagination.totalPages,
    pagination.limit,
    onPaginationUpdate,
  ]); // Use individual pagination properties instead of the whole object

  // Fetch posts on mount and page change
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchPosts();
    }
  }, [fetchPosts]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setHookCurrentPage(page);
  };

  // Set mounted state for client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{t("posts.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => fetchPosts()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {t("posts.retry")}
        </button>
      </div>
    );
  }

  // Debug logging (comment out in production)
  // console.log("PostsGrid Debug:", { posts, loading, error, pagination });

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("posts.noPosts")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <Link href={`/posts/${post.slug}`}>
              <CardContent className="p-0">
                {/* Post Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={post.featured_image || "/placeholder-hero.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {post.categories && post.categories.length > 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 border-emerald-200"
                      >
                        {post.categories[0].name}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                    {truncateText(post.title, 80)}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 min-h-[4.5rem]">
                    {truncateText(
                      post.summary || post.excerpt || t("posts.noDescription"),
                      120
                    )}
                  </p>

                  {/* Post Meta */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>
                        {post.user?.email ||
                          post.author_name ||
                          t("posts.author")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {mounted
                          ? formatDate(post.created_at)
                          : post.created_at?.split("T")[0] ||
                            t("posts.unknownDate")}
                      </span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs">
                              +{post.tags.length - 2}
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

      <div className="mt-8">
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
