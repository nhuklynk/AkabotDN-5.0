import { Header } from "@/layouts/header";
import { Footer } from "@/layouts/footer";
import { PostsGrid } from "@/app/(end-user)/posts/components/posts-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PostsPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bài đăng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
            Bài đăng
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Cập nhật những tin tức mới nhất về hoạt động của Hiệp hội Dữ liệu
            Quốc gia Việt Nam và các sự kiện quan trọng trong lĩnh vực dữ liệu.
          </p>
        </div>

        <PostsGrid />
      </main>
    </div>
  );
}
