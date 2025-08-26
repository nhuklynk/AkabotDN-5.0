"use client";

import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface PostsInfoProps {
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
}

export function PostsInfo({
  totalPosts,
  currentPage,
  totalPages,
  postsPerPage,
}: PostsInfoProps) {
  const { t } = useLocale();
  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, totalPosts);

  return (
    <div className="space-y-4 mb-8">
      {/* Posts Count Info */}
      <div className="bg-muted/50 p-4 rounded-lg hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">
                {t("posts.info.totalPosts", { total: totalPosts })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("posts.info.showing", {
                  start: startPost,
                  end: endPost,
                  total: totalPosts,
                })}
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge variant="secondary" className="text-sm">
              {t("posts.info.page", {
                current: currentPage,
                total: totalPages,
              })}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
