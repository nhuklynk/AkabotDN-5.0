"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PostTable from "./component/post-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search } from "lucide-react";
import {
  moderateContent,
  findBannedWords,
} from "@/services/admin/moderationService";
import { classifyContent } from "@/services/admin/classifierService";

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
};

// Mock categories and authors for dropdowns
const categories = [
  { id: 1, name: "Technology" },
  { id: 2, name: "Web Development" },
  { id: 3, name: "Mobile Development" },
  { id: 4, name: "Design" },
  { id: 5, name: "UI Design" },
];

const authors = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Brown" },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    authorId: 1,
    categoryId: 1,
    featuredImage: "",
    tags: "",
    publishedAt: "",
  });
  const [progress, setProgress] = useState(0);
  const [badTitleWords, setBadTitleWords] = useState<string[]>([]);
  const [badExcerptWords, setBadExcerptWords] = useState<string[]>([]);
  const [badContentWords, setBadContentWords] = useState<string[]>([]);
  const simulateProgress = () => {
    setProgress(0);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(100, current + 10);
      setProgress(current);
      if (current >= 100) clearInterval(timer);
    }, 150);
  };

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
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreatePost = async () => {
    const author = authors.find((a) => a.id === formData.authorId);
    const category = categories.find((c) => c.id === formData.categoryId);

    // Moderator Agent: block unsafe
    const textForCheck = `${formData.title}\n${formData.excerpt}\n${formData.content}`;
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
    const extraTags = (classification.labels || [])
      .filter((l) => l && !formData.tags.includes(l))
      .join(", ");

    const newPost: Post = {
      id: Math.max(...posts.map((p) => p.id)) + 1,
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt,
      content: formData.content,
      status: formData.status,
      author: author?.name || "Unknown",
      authorId: formData.authorId,
      category: category?.name || "Uncategorized",
      categoryId: formData.categoryId,
      featuredImage: formData.featuredImage || "/blog-post-concept.png",
      tags: (formData.tags + (extraTags ? `, ${extraTags}` : ""))
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      publishedAt:
        formData.status === "published"
          ? new Date().toISOString().split("T")[0]
          : formData.publishedAt || null,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      likes: 0,
    };
    setPosts([...posts, newPost]);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      authorId: 1,
      categoryId: 1,
      featuredImage: "",
      tags: "",
      publishedAt: "",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      status: post.status,
      authorId: post.authorId,
      categoryId: post.categoryId,
      featuredImage: post.featuredImage,
      tags: post.tags.join(", "),
      publishedAt: post.publishedAt || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    if (editingPost) {
      const author = authors.find((a) => a.id === formData.authorId);
      const category = categories.find((c) => c.id === formData.categoryId);

      const textForCheck = `${formData.title}\n${formData.excerpt}\n${formData.content}`;
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
      const extraTags = (classification.labels || [])
        .filter((l) => l && !formData.tags.includes(l))
        .join(", ");

      setPosts(
        posts.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                title: formData.title,
                slug: formData.slug || generateSlug(formData.title),
                excerpt: formData.excerpt,
                content: formData.content,
                status: formData.status,
                author: author?.name || "Unknown",
                authorId: formData.authorId,
                category: category?.name || "Uncategorized",
                categoryId: formData.categoryId,
                featuredImage: formData.featuredImage,
                tags: formData.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
                publishedAt:
                  formData.status === "published" && !post.publishedAt
                    ? new Date().toISOString().split("T")[0]
                    : formData.publishedAt || post.publishedAt,
              }
            : post
        )
      );
      setIsEditDialogOpen(false);
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
        authorId: 1,
        categoryId: 1,
        featuredImage: "",
        tags: "",
        publishedAt: "",
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý bài viết
          </h1>
          <p className="text-muted-foreground">
            Tạo, chỉnh sửa và quản lý các bài viết.
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tạo bài viết
        </Button>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo bài viết mới</DialogTitle>
              <DialogDescription>
                Viết bài blog hoặc bài viết mới.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: generateSlug(title),
                      });
                      setBadTitleWords(findBannedWords(title));
                    }}
                    placeholder="Enter post title"
                  />
                  {badTitleWords.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {badTitleWords.map((w) => (
                        <span
                          key={w}
                          className="text-xs rounded bg-red-100 text-red-700 px-2 py-0.5"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="slug">Đường dẫn (slug)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="post-slug"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Mô tả ngắn</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, excerpt: v });
                    setBadExcerptWords(findBannedWords(v));
                  }}
                  placeholder="Brief description of the post"
                  rows={2}
                />
                {badExcerptWords.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {badExcerptWords.map((w) => (
                      <span
                        key={w}
                        className="text-xs rounded bg-red-100 text-red-700 px-2 py-0.5"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData({ ...formData, content: v });
                    setBadContentWords(findBannedWords(v));
                  }}
                  placeholder="Write your post content here..."
                  rows={6}
                />
                {badContentWords.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {badContentWords.map((w) => (
                      <span
                        key={w}
                        className="text-xs rounded bg-red-100 text-red-700 px-2 py-0.5"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Tác giả</Label>
                  <Select
                    value={formData.authorId.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        authorId: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tác giả" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem
                          key={author.id}
                          value={author.id.toString()}
                        >
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Select
                    value={formData.categoryId.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoryId: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publishedAt">Ngày xuất bản</Label>
                  <Input
                    id="publishedAt"
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) =>
                      setFormData({ ...formData, publishedAt: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="featuredImage">Ảnh đại diện (URL)</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredImage: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="tags">Thẻ</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ngăn cách thẻ bằng dấu phẩy (multi-select đơn giản)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCreatePost}>Tạo bài viết</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
          <CardDescription>
            Quản lý toàn bộ bài viết trong hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} of {posts.length} posts
            </div>
          </div>

          <PostTable
            items={filteredPosts}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update post content and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: generateSlug(title),
                    });
                  }}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="post-slug"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief description of the post"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your post content here..."
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-author">Author</Label>
                <Select
                  value={formData.authorId.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      authorId: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id.toString()}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.categoryId.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      categoryId: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-publishedAt">Publish Date</Label>
                <Input
                  id="edit-publishedAt"
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedAt: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-featuredImage">Featured Image URL</Label>
              <Input
                id="edit-featuredImage"
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePost}>Update Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
