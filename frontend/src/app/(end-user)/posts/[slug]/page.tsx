"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/app/(end-user)/posts/[slug]/components/table-of-contents";
import { RelatedPosts } from "@/app/(end-user)/posts/[slug]/components/related-posts";
import { ShareButtons } from "@/app/(end-user)/posts/[slug]/components/share-buttons";
import { PartnersList } from "@/components/partners-list";
import { postService } from "@/services/end-user/postService";
import { formatDate } from "@/utils/dateUtils";
import { useLocale } from "@/hooks/useLocale";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { t } = useLocale();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const { slug } = resolvedParams;

        console.log("Fetching post with slug:", slug);
        const postData = await postService.getPostBySlug(slug);
        console.log("Post data received:", postData);

        if (!postData) {
          console.log("Post not found");
          setError("Post not found");
          return;
        }

        setPost(postData);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Error loading post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{t("posts.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    notFound();
  }

  // Safe access to post properties with fallbacks - updated for actual API structure
  const postContent = post.content || "";
  const readTime = postContent ? Math.ceil(postContent.length / 500) : 0;
  const postImage = post.featured_image || "/placeholder-hero.svg";
  const postTitle = post.title || t("posts.detail.noTitle");
  const postExcerpt =
    post.summary ||
    post.excerpt ||
    (postContent ? postContent.substring(0, 150) + "..." : "");
  const postAuthor = post.user?.email || post.author_name || t("posts.author");
  const postDate =
    post.published_at || post.created_at
      ? new Date(post.published_at || post.created_at)
      : new Date();

  console.log("Processed post data:", {
    title: postTitle,
    content: postContent ? `${postContent.substring(0, 100)}...` : "No content",
    author: postAuthor,
    date: postDate,
    readTime,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">{t("posts.detail.backToList")}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Article Header */}
              <div className="relative h-64 sm:h-80 lg:h-96">
                <Image
                  src={postImage}
                  alt={postTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  {post.categories && post.categories.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="mb-3 bg-emerald-100 text-emerald-800 border-emerald-200"
                    >
                      {post.categories[0].name}
                    </Badge>
                  )}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {postTitle}
                  </h1>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{postAuthor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {readTime > 0
                        ? t("posts.readingTime", { minutes: readTime })
                        : t("posts.calculating")}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag: any) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-6 lg:p-8">
                {postContent ? (
                  <div
                    className="article-content prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: postContent }}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t("posts.detail.contentUpdating")}
                    </p>
                  </div>
                )}
              </div>
            </article>

            {/* Partners Section - You can add real partners data here */}
            <div className="mt-8">
              <PartnersList partners={[]} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              {postContent && <TableOfContents content={postContent} />}

              {/* Related Articles */}
              <RelatedPosts
                currentPostId={post.id}
                currentPostCategories={post.categories}
                currentPostTags={post.tags}
              />

              {/* Share */}
              <ShareButtons postTitle={postTitle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
