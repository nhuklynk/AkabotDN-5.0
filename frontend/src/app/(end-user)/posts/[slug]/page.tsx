import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableOfContents } from "@/app/(end-user)/posts/[slug]/components/table-of-contents";
import { PartnersList } from "@/components/partners-list";

// Mock data - in a real app, this would come from a CMS or database
const posts = [
  {
    slug: "visit-vietnam-buoc-tien-chien-luoc-du-lich-so",
    title: "Visit Vietnam - Bước tiến chiến lược của du lịch số",
    excerpt:
      'Tại Hội thảo "Dữ liệu du lịch trong phát triển kinh tế số", Hiệp hội Dữ liệu quốc gia, Cục Du lịch quốc gia Việt Nam cùng Tập đoàn Sun Group đã chính thức công bố ra mắt Nền tảng dữ liệu du lịch quốc gia Việt Nam mang tên Visit Vietnam.',
    content: `
      <h2>Giới thiệu về nền tảng Visit Vietnam</h2>
      <p>Tại Hội thảo "Dữ liệu du lịch trong phát triển kinh tế số", Hiệp hội Dữ liệu quốc gia, Cục Du lịch quốc gia Việt Nam cùng Tập đoàn Sun Group đã chính thức công bố ra mắt Nền tảng dữ liệu du lịch quốc gia Việt Nam mang tên Visit Vietnam.</p>
      
      <p>Đây sẽ là nền tảng tích hợp thông tin, đánh giá về điểm đến và công cụ đặt dịch vụ du lịch tại Việt Nam, được xem là bước tiến chiến lược cho du lịch số.</p>

      <h2>Tính năng nổi bật của Visit Vietnam</h2>
      <p>Nền tảng này cũng đóng vai trò trung tâm trong việc kết nối dữ liệu giữa cơ quan quản lý, doanh nghiệp và du khách, từ đó hình thành một hệ sinh thái du lịch minh bạch, thông minh và an toàn.</p>

      <p>Điểm nổi bật của Visit Vietnam nằm ở khả năng tích hợp các công nghệ tiên tiến:</p>
      <ul>
        <li>Hệ thống trợ lý du lịch ảo AI Travel Assistant có thể lập kế hoạch và đặt dịch vụ tự động cho du khách</li>
        <li>Nền tảng NDAchain.vn giúp xác thực phi tập trung, đảm bảo độ tin cậy và tính minh bạch của thông tin</li>
        <li>Các dịch vụ được tích hợp sâu, từ vận chuyển, lưu trú, ẩm thực cho đến các chương trình khách hàng thân thiết toàn quốc</li>
        <li>Công nghệ blockchain và quy trình bảo mật Tokenization để xác minh và bảo vệ dữ liệu nghiêm ngặt</li>
      </ul>

      <h2>Bối cảnh ra đời và mục tiêu</h2>
      <p>Ra đời trong bối cảnh du lịch Việt Nam còn thiếu một hệ thống quản lý và khai thác dữ liệu tập trung, Visit Vietnam được kỳ vọng sẽ khắc phục tình trạng thông tin phân tán, thiếu liên kết và khó tiếp cận.</p>

      <p>Nền tảng này sẽ:</p>
      <ul>
        <li>Giúp du khách dễ dàng tìm kiếm, đặt dịch vụ, khám phá văn hóa địa phương</li>
        <li>Giúp doanh nghiệp nắm bắt xu hướng, thiết kế sản phẩm cá nhân hóa</li>
        <li>Hỗ trợ cơ quan quản lý hoạch định chính sách dựa trên dữ liệu thời gian thực</li>
      </ul>

      <h2>Lộ trình phát triển chiến lược</h2>
      <p>Lộ trình phát triển của Visit Vietnam được chia thành những cột mốc chiến lược rõ ràng:</p>

      <h3>Tháng 10/2025 - Mốc 1: Khởi tạo Nền tảng Dữ liệu Quốc gia</h3>
      <ul>
        <li>Ra mắt Dashboard Du lịch quốc gia phiên bản 1.0 dành cho Chính phủ</li>
        <li>Vận hành Cổng thông tin công bố chương trình</li>
      </ul>

      <h3>Quý II/2026 - Mốc 2: Ra mắt công chúng</h3>
      <ul>
        <li>Nền tảng B2C với Đánh giá Xác thực qua NDAchain.vn</li>
        <li>Công cụ Lập kế hoạch Chuyến đi trực quan</li>
        <li>Tập trung vào việc tạo dựng niềm tin và cung cấp công cụ hoạch định hành trình</li>
      </ul>

      <h3>APEC 2027 - Mốc 3: Thể hiện tầm vóc quốc tế</h3>
      <ul>
        <li>Hệ thống Đặt dịch vụ trực tiếp (Native Booking)</li>
        <li>Công cụ Gợi ý lịch trình bằng AI</li>
        <li>Ra mắt nền tảng dữ liệu như một dịch vụ (DaaS) dành cho doanh nghiệp</li>
      </ul>

      <h3>Sau 2027 - Tầm nhìn tương lai</h3>
      <ul>
        <li>Trở thành "siêu ứng dụng" du lịch toàn diện</li>
        <li>Đặt vé "Một chạm" cho toàn bộ lịch trình</li>
        <li>Tích hợp đa phương tiện (vé máy bay, tàu, xe)</li>
        <li>Dẫn dắt thị trường du lịch Việt Nam vươn ra thế giới</li>
      </ul>

      <h2>Ý nghĩa và tác động</h2>
      <p>Sự ra mắt của Visit Vietnam không chỉ đánh dấu một bước tiến trong quá trình số hóa ngành du lịch, mà còn góp phần nâng cao năng lực cạnh tranh của điểm đến Việt Nam, kết nối mạnh mẽ hơn với thị trường quốc tế và hướng tới mục tiêu phát triển du lịch bền vững trong kỷ nguyên mới.</p>
    `,
    date: "2025-08-15",
    author: "Hiệp hội Dữ liệu Quốc gia",
    category: "Du lịch số",
    image: "/vietnam-tourism-platform.png",
    readTime: "8 phút đọc",
    tags: [
      "Du lịch số",
      "Visit Vietnam",
      "AI",
      "Blockchain",
      "Dữ liệu du lịch",
    ],
  },
];

const partners = [
  {
    name: "Cục Du lịch quốc gia Việt Nam",
    logo: "/partner-tourism-bureau.png",
    description: "Cơ quan quản lý du lịch quốc gia",
  },
  {
    name: "Tập đoàn Sun Group",
    logo: "/partner-sun-group.png",
    description: "Tập đoàn đầu tư và phát triển du lịch hàng đầu",
  },
  {
    name: "Bộ Công an",
    logo: "/partner-ministry-security.png",
    description: "Đối tác công nghệ và bảo mật dữ liệu",
  },
  {
    name: "Trung tâm Dữ liệu Quốc gia",
    logo: "/partner-national-data-center.png",
    description: "Trung tâm quản lý và vận hành dữ liệu quốc gia",
  },
];

export default function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

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
            <span className="font-medium">Quay lại danh sách bài đăng</span>
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
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge
                    variant="secondary"
                    className="mb-3 bg-emerald-100 text-emerald-800 border-emerald-200"
                  >
                    {post.category}
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {post.title}
                  </h1>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 lg:p-8">
                <div
                  className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-ul:text-slate-700 prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>

            {/* Partners Section */}
            <div className="mt-8">
              <PartnersList partners={partners} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <TableOfContents content={post.content} />

              {/* Related Articles */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Bài viết liên quan
                  </h3>
                  <div className="space-y-4">
                    <Link
                      href="/bai-dang/chuyen-gia-quoc-te-hien-ke-phat-trien"
                      className="block group"
                    >
                      <div className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        Chuyên gia quốc tế hiến kế phát triển ngành công nghiệp
                        dữ liệu
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        15/08/2025
                      </div>
                    </Link>
                    <Link
                      href="/bai-dang/ai-thuc-chien-cuoc-thi-tri-tue-nhan-tao"
                      className="block group"
                    >
                      <div className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        "AI thực chiến" - Cuộc thi về trí tuệ nhân tạo đầu tiên
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        12/08/2025
                      </div>
                    </Link>
                    <Link
                      href="/bai-dang/hiep-hoi-du-lieu-quoc-gia-cong-bo-quyet-dinh"
                      className="block group"
                    >
                      <div className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        Hiệp hội Dữ liệu quốc gia công bố quyết định thành lập
                        Văn phòng
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        10/08/2025
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Share */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Chia sẻ bài viết
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                    >
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
