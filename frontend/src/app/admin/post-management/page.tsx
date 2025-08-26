"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PostTable from "./component/post-table";
import PostFilters from "./component/post-filters";
import { Pagination } from "@/components/pagination-component";
import { Plus, Search } from "lucide-react";
import {
  moderateContent,
  findBannedWords,
} from "@/services/admin/moderationService";
import { classifyContent } from "@/services/admin/classifierService";
import PostFormDialog from "./component/post-form-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/hooks/useLocale";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/admin/post/usePosts";
import { useCreatePost } from "@/hooks/admin/post/useCreatePost";
import { useUpdatePost } from "@/hooks/admin/post/useUpdatePost";
import { useDeletePost } from "@/hooks/admin/post/useDeletePost";
import type { Post } from "@/services/admin/posts/getAllPosts";

// Mock categories and authors for dropdowns (will be replaced with API calls later)
const categories = [
  { id: 1, name: "Công nghệ" },
  { id: 2, name: "Phát triển web" },
  { id: 3, name: "Phát triển di động" },
  { id: 4, name: "Thiết kế" },
  { id: 5, name: "Thiết kế giao diện" },
];

const authors = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Brown" },
];

export default function PostsPage() {
  const { t } = useLocale();
  const { userId } = useAuth();
  const {
    posts,
    pagination,
    loading,
    error,
    setQuery,
    setCurrentPage,
    searchPosts,
    refreshPosts,
  } = usePosts({
    initialQuery: { page: 1, limit: 10, status: "active" },
  });

  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPostType, setFilterPostType] = useState("all");
  const [filterTag, setFilterTag] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    status: "active",
    user_id: "550e8400-e29b-41d4-a716-446655440103", // Content Editor UUID from API
    post_status: "draft",
    published_at: "",
    post_type: "article",
    category_id: "1",
  });

  const [progress, setProgress] = useState(0);
  const [badTitleWords, setBadTitleWords] = useState<string[]>([]);

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      search: searchTerm,
      status: filterStatus !== "all" ? filterStatus : "active", // Default to active status
      category: filterCategory !== "all" ? filterCategory : undefined,
      postType: filterPostType !== "all" ? filterPostType : undefined,
      tag: filterTag || undefined,
    }));
  }, [
    searchTerm,
    filterStatus,
    filterCategory,
    filterPostType,
    filterTag,
    setQuery,
  ]);

  const generateSlug = (title: string) => {
    return title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreatePost = async () => {
    const textForCheck = `${formData.title}\n${formData.summary}\n${formData.content}`;
    const moderation = await moderateContent(textForCheck);
    if (!moderation.isSafe) {
      alert(
        `Nội dung không phù hợp: ${
          moderation.reasons?.join(", ") || "Không rõ"
        }`
      );
      return;
    }

    const classification = await classifyContent(textForCheck);

    const payload = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      content: formData.content,
      excerpt: formData.summary,
      status: formData.post_status || "draft",
      author_id: formData.user_id.toString().trim(),
      categories: formData.category_id ? [formData.category_id] : undefined,
      tags: undefined,
      featured_image: undefined,
    };

    createPost(payload);
    setFormData({
      title: "",
      slug: "",
      summary: "",
      content: "",
      status: "active",
      user_id: "550e8400-e29b-41d4-a716-446655440103", // Use a valid UUID
      post_status: "draft",
      published_at: "",
      post_type: "article",
      category_id: "1",
    });
    setDialogOpen(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      summary: post.excerpt,
      content: post.content,
      status: "active",
      user_id: "550e8400-e29b-41d4-a716-446655440103", // Use fixed UUID
      post_status: post.status,
      published_at: post.publishedAt || "",
      post_type: post.postType || "article",
      category_id: post.categoryId?.toString() || "1",
    });
    setDialogMode("edit");
    setTimeout(() => setDialogOpen(true), 0);
  };

  const handleUpdatePost = async () => {
    if (editingPost) {
      const textForCheck = `${formData.title}\n${formData.summary}\n${formData.content}`;
      const moderation = await moderateContent(textForCheck);
      if (!moderation.isSafe) {
        alert(
          `Nội dung không phù hợp: ${
            moderation.reasons?.join(", ") || "Không rõ"
          }`
        );
        return;
      }

      const classification = await classifyContent(textForCheck);

      const payload = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        post_status: formData.post_status || "draft",
        user_id: formData.user_id.toString().trim(), // Ensure it's string and trim whitespace
        category_ids: formData.category_id || undefined, // Remove hardcoded "1"
        tag_ids: undefined, // Remove classification labels for now
        published_at: formData.published_at || undefined,
      };

      updatePost({ id: editingPost.id, payload });
      setDialogOpen(false);
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        summary: "",
        content: "",
        status: "active",
        user_id: "550e8400-e29b-41d4-a716-446655440103", // Content Editor UUID
        post_status: "draft",
        published_at: "",
        post_type: "article",
        category_id: "1",
      });
    }
  };

  const handleDeletePost = async (postId: string | number) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const getStatusColor = (_status: string) =>
    "bg-secondary text-secondary-foreground";

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const [y, m, d] = dateString.split("-").map((v) => Number(v));
    const dd = String(d).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${dd}/${mm}/${y}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="p-6 pt-0 pb-0">
          <h1 className="text-3xl font-bold text-foreground">
            {t("post.title")}
          </h1>
          <p className="text-muted-foreground">{t("post.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setDialogMode("create");
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("post.add")}
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingPost(null);
              setFormData({
                title: "",
                slug: "",
                summary: "",
                content: "",
                status: "active",
                user_id: "550e8400-e29b-41d4-a716-446655440103", // Content Editor UUID
                post_status: "draft",
                published_at: "",
                post_type: "article",
                category_id: "1",
              });
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create"
                  ? t("post.dialog.createTitle")
                  : t("post.dialog.editTitle")}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? t("post.dialog.createDesc")
                  : t("post.dialog.editDesc")}
              </DialogDescription>
            </DialogHeader>

            <PostFormDialog
              formData={formData}
              setFormData={setFormData}
              authors={authors}
              categories={categories}
              onTitleChange={(title) => {
                setFormData({ ...formData, title, slug: generateSlug(title) });
                setBadTitleWords(findBannedWords(title));
              }}
              mode={dialogMode}
              statusHistory={editingPost?.statusHistory}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={
                  dialogMode === "create" ? handleCreatePost : handleUpdatePost
                }
              >
                {dialogMode === "create"
                  ? t("post.dialog.createCta")
                  : t("post.dialog.updateCta")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("post.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <PostFilters
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterPostType={filterPostType}
              setFilterPostType={setFilterPostType}
              filterTag={filterTag}
              setFilterTag={setFilterTag}
              categories={categories}
            />
            <div className="text-sm text-muted-foreground">
              {t("post.countSummary", {
                filtered: posts.length,
                total: pagination.total,
              })}
            </div>
          </div>

          <PostTable
            items={posts}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
          <Pagination
            className="mt-4"
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Single dialog instance above handles both create and edit */}
    </div>
  );
}
