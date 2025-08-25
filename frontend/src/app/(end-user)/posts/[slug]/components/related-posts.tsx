"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { postService, Post } from "@/services/postService";
import { formatDate } from "@/utils/dateUtils";
import { truncateText } from "@/utils/textUtils";

interface RelatedPostsProps {
  currentPostId: string;
  currentPostCategories?: Array<{ id: string; name: string; slug: string }>;
  currentPostTags?: Array<{ id: string; name: string; slug: string }>;
}

export function RelatedPosts({
  currentPostId,
  currentPostCategories,
  currentPostTags,
}: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get posts by category first
        let posts: Post[] = [];

        if (currentPostCategories && currentPostCategories.length > 0) {
          const categorySlug = currentPostCategories[0].slug;
          const response = await postService.getPostsByCategory(
            categorySlug,
            1,
            5
          );

          if (
            response.success &&
            response.data &&
            Array.isArray(response.data.items)
          ) {
            posts = response.data.items.filter(
              (post) => post.id !== currentPostId
            );
          }
        }

        // If no posts by category, try by tags
        if (
          posts.length === 0 &&
          currentPostTags &&
          currentPostTags.length > 0
        ) {
          const tagSlug = currentPostTags[0].slug;
          const response = await postService.getPostsByTag(tagSlug, 1, 5);

          if (
            response.success &&
            response.data &&
            Array.isArray(response.data.items)
          ) {
            posts = response.data.items.filter(
              (post) => post.id !== currentPostId
            );
          }
        }

        // If still no posts, get recent posts
        if (posts.length === 0) {
          const response = await postService.getRecentPosts(5);
          posts = response.filter((post) => post.id !== currentPostId);
        }

        setRelatedPosts(posts.slice(0, 3)); // Show max 3 related posts
      } catch (err) {
        console.error("Error fetching related posts:", err);
        setError("Không thể tải bài viết liên quan");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, currentPostCategories, currentPostTags]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Bài viết liên quan
          </h3>
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Bài viết liên quan
          </h3>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relatedPosts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Bài viết liên quan
          </h3>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Chưa có bài viết liên quan
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">
          Bài viết liên quan
        </h3>
        <div className="space-y-4">
          {relatedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block group"
            >
              <div className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                {truncateText(post.title, 70)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {formatDate(post.published_at || post.created_at)}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
