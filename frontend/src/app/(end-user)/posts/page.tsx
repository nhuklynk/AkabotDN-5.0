"use client";

import { useState, useCallback } from "react";
import { PostsGrid } from "@/app/(end-user)/posts/components/posts-grid";
import { PostsInfo } from "@/app/(end-user)/posts/components/posts-search";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocale } from "@/hooks/useLocale";

export default function PostsPage() {
  const { t } = useLocale();
  const [paginationInfo, setPaginationInfo] = useState({
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1,
    postsPerPage: 10,
  });

  const handlePaginationUpdate = useCallback(
    (info: {
      totalPosts: number;
      currentPage: number;
      totalPages: number;
      postsPerPage: number;
    }) => {
      setPaginationInfo(info);
    },
    []
  ); // Empty dependency array - function never changes

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                {t("posts.breadcrumb.home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("posts.breadcrumb.posts")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("posts.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t("posts.description")}
          </p>
        </div>

        <PostsInfo
          totalPosts={paginationInfo.totalPosts}
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          postsPerPage={paginationInfo.postsPerPage}
        />

        <PostsGrid onPaginationUpdate={handlePaginationUpdate} />
      </main>
    </div>
  );
}
