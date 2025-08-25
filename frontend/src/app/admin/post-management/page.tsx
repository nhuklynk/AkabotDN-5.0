"use client";

import { useEffect, useState } from "react";
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
import { useLocale } from "@/hooks/useLocale";

// Mock data for posts
const initialPosts = [
  {
    id: 1,
    title: "Getting Started with React 18",
    slug: "getting-started-with-react-18",
    excerpt:
      "Learn the new features and improvements in React 18, including concurrent rendering and automatic batching.",
    content:
      "React 18 introduces several new features that make your applications faster and more responsive...",
    status: "published",
    author: "John Doe",
    authorId: 1,
    category: "Web Development",
    categoryId: 2,
    featuredImage: "/react-logo-abstract.png",
    tags: ["react", "javascript", "frontend"],
    publishedAt: "2024-02-15",
    createdAt: "2024-02-10",
    views: 1250,
    likes: 45,
  },
  {
    id: 2,
    title: "Mobile App Design Trends 2024",
    slug: "mobile-app-design-trends-2024",
    excerpt:
      "Explore the latest design trends shaping mobile applications in 2024.",
    content:
      "Mobile app design continues to evolve with new trends emerging every year...",
    status: "draft",
    author: "Jane Smith",
    authorId: 2,
    category: "UI Design",
    categoryId: 5,
    featuredImage: "/modern-mobile-app-interface.png",
    tags: ["design", "mobile", "ui", "trends"],
    publishedAt: null,
    createdAt: "2024-02-12",
    views: 0,
    likes: 0,
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-nodejs",
    excerpt:
      "Best practices for creating robust and scalable REST APIs using Node.js and Express.",
    content:
      "When building APIs that need to handle thousands of requests, scalability becomes crucial...",
    status: "scheduled",
    author: "Bob Johnson",
    authorId: 3,
    category: "Web Development",
    categoryId: 2,
    featuredImage: "/nodejs-api-concept.png",
    tags: ["nodejs", "api", "backend", "scalability"],
    publishedAt: "2024-02-20",
    createdAt: "2024-02-08",
    views: 0,
    likes: 0,
  },
  {
    id: 4,
    title: "The Future of AI in Design",
    slug: "future-of-ai-in-design",
    excerpt:
      "How artificial intelligence is transforming the design industry and what it means for designers.",
    content:
      "Artificial intelligence is revolutionizing how we approach design problems...",
    status: "published",
    author: "Alice Brown",
    authorId: 4,
    category: "Design",
    categoryId: 4,
    featuredImage: "/ai-design-concept.png",
    tags: ["ai", "design", "future", "technology"],
    publishedAt: "2024-02-05",
    createdAt: "2024-02-01",
    views: 2100,
    likes: 89,
  },
];

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  author: string;
  authorId: number;
  category: string;
  categoryId: number;
  featuredImage: string;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  views: number;
  likes: number;
  // new fields
  allowComments?: boolean;
  isFeatured?: boolean;
  requireLogin?: boolean;
  postType?: string; // article, news, event, guide...
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };
  statusHistory?: { status: string; at: string; by?: string; note?: string }[];
};

// Mock categories and authors for dropdowns
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
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPostType, setFilterPostType] = useState("all");
  const [filterTag, setFilterTag] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    status: "active",
    user_id: 1,
    media_id: "" as number | "",
    post_status: "draft",
    published_at: "",
    post_type: "article",
  });
  const [progress, setProgress] = useState(0);
  const [badTitleWords, setBadTitleWords] = useState<string[]>([]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || post.categoryId.toString() === filterCategory;
    const matchesType = filterPostType === "all" || post.postType === filterPostType;
    const matchesTag = !filterTag || post.tags.map((t) => t.toLowerCase()).includes(filterTag.toLowerCase());
    return matchesSearch && matchesStatus && matchesCategory && matchesType && matchesTag;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCategory]);

  // Generate URL-safe slug from Vietnamese title (strip diacritics, convert đ, hyphenate)
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
    const author = authors.find((a) => a.id === formData.authorId);
    const category = categories.find((c) => c.id === formData.categoryId);

    // Moderator Agent: block unsafe
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

    // Classifier Agent: infer labels (append to tags if missing)
    const classification = await classifyContent(textForCheck);

    const newPost: Post = {
      id: Math.max(...posts.map((p) => p.id)) + 1,
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.summary,
      content: formData.content,
      status: formData.post_status,
      author: author?.name || "Unknown",
      authorId: formData.user_id,
      category: category?.name || "Uncategorized",
      categoryId: 0,
      featuredImage: "/blog-post-concept.png",
      tags: (classification.labels || []) as string[],
      publishedAt: formData.published_at || null,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
      postType: formData.post_type,
      statusHistory: [
        { status: "draft", at: new Date().toISOString(), by: "system" },
        formData.post_status !== "draft"
          ? { status: formData.post_status, at: new Date().toISOString(), by: "system" }
          : undefined,
      ].filter(Boolean) as { status: string; at: string; by?: string; note?: string }[],
    };
    setPosts([...posts, newPost]);
    setFormData({
      title: "",
      slug: "",
      summary: "",
      content: "",
      status: "active",
      user_id: 1,
      media_id: "",
      post_status: "draft",
      published_at: "",
      post_type: "article",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      summary: post.excerpt,
      content: post.content,
      status: "active",
      user_id: post.authorId,
      media_id: "",
      post_status: post.status,
      published_at: post.publishedAt || "",
      post_type: post.postType || "article",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    if (editingPost) {
      const author = authors.find((a) => a.id === formData.authorId);
      const category = categories.find((c) => c.id === formData.categoryId);

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

      setPosts(
        posts.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                title: formData.title,
                slug: formData.slug || generateSlug(formData.title),
                excerpt: formData.summary,
                content: formData.content,
                status: formData.post_status,
                author: author?.name || "Unknown",
                authorId: formData.user_id,
                category: category?.name || "Uncategorized",
                categoryId: 0,
                featuredImage: post.featuredImage,
                tags: classification.labels || post.tags,
                publishedAt: formData.published_at || post.publishedAt,
                postType: formData.post_type,
                statusHistory: [
                  ...(post.statusHistory || []),
                  post.status !== formData.post_status
                    ? { status: formData.post_status, at: new Date().toISOString(), by: "system" }
                    : undefined,
                ].filter(Boolean) as { status: string; at: string; by?: string; note?: string }[],
              }
            : post
        )
      );
      setIsEditDialogOpen(false);
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        summary: "",
        content: "",
        status: "active",
        user_id: 1,
        media_id: "",
        post_status: "draft",
        published_at: "",
        post_type: "article",
      });
    }
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
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
          <h1 className="text-3xl font-bold text-foreground">{t("post.title")}</h1>
          <p className="text-muted-foreground">{t("post.subtitle")}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          {t("post.add")}
        </Button>
        <PostFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          setFormData={setFormData}
          authors={authors}
          categories={categories}
          onSubmit={handleCreatePost}
          onTitleChange={(title) => {
            setFormData({ ...formData, title, slug: generateSlug(title) });
                      setBadTitleWords(findBannedWords(title));
                    }}
          mode="create"
        />
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
              {t("post.countSummary", { filtered: filteredPosts.length, total: posts.length })}
            </div>
          </div>

          <PostTable
            items={paginatedPosts}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
          <Pagination
            className="mt-4"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      <PostFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        authors={authors}
        categories={categories}
        onSubmit={handleUpdatePost}
        onTitleChange={(title) =>
          setFormData({ ...formData, title, slug: generateSlug(title) })
        }
        mode="edit"
        statusHistory={editingPost?.statusHistory}
      />
    </div>
  );
}
