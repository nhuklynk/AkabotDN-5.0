"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination-component";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const mockPosts = [
  {
    id: 1,
    title: "Visit Vietnam - Bước tiến chiến lược của du lịch số",
    excerpt:
      "Tại Hội thảo 'Dữ liệu du lịch trong phát triển kinh tế số', Hiệp hội Dữ liệu quốc gia, Cục Du lịch quốc gia Việt Nam cùng Tập đoàn Sun Group đã chính thức công bố ra mắt Nền tảng dữ liệu du lịch quốc gia Việt Nam mang tên Visit Vietnam.",
    date: "2025-08-15",
    author: "Hiệp hội Dữ liệu Quốc gia",
    category: "Du lịch số",
    image: "/vietnam-tourism-platform.svg",
    slug: "visit-vietnam-buoc-tien-chien-luoc-du-lich-so",
  },
  {
    id: 2,
    title:
      "Chuyên gia quốc tế hiến kế phát triển ngành công nghiệp dữ liệu cho Việt Nam",
    excerpt:
      "Hội thảo 'Phát triển ngành công nghiệp dữ liệu và thúc đẩy kinh tế số dựa trên dữ liệu' đã diễn ra với sự tham gia của nhiều chuyên gia quốc tế hàng đầu.",
    date: "2025-08-10",
    author: "Ban Biên tập",
    category: "Công nghiệp dữ liệu",
    image: "/international-data-conference.svg",
    slug: "chuyen-gia-quoc-te-hien-ke-phat-trien",
  },
  {
    id: 3,
    title:
      "'AI thực chiến' - Cuộc thi về trí tuệ nhân tạo đầu tiên trên sóng truyền hình",
    excerpt:
      "Chiều ngày 5/8, tại Hà Nội, Trung tâm Dữ liệu quốc gia (NDC), Hiệp hội Dữ liệu quốc gia đã tổ chức cuộc thi AI thực chiến đầu tiên được phát sóng trực tiếp.",
    date: "2025-08-05",
    author: "Trung tâm Dữ liệu Quốc gia",
    category: "Trí tuệ nhân tạo",
    image: "/vietnam-ai-competition-tv.svg",
    slug: "ai-thuc-chien-cuoc-thi-tri-tue-nhan-tao",
  },
  {
    id: 4,
    title:
      "Hiệp hội Dữ liệu quốc gia công bố quyết định thành lập Văn phòng, các Ban chuyên môn",
    excerpt:
      "Tại Hội nghị Ban Chấp hành (BCH) tổ chức chiều ngày 3/8, Hiệp hội Dữ liệu quốc gia đã công bố các quyết định quan trọng về cơ cấu tổ chức.",
    date: "2025-08-03",
    author: "Ban Chấp hành",
    category: "Tổ chức",
    image: "/vietnam-data-sharing-meeting.svg",
    slug: "thanh-lap-van-phong-ban-chuyen-mon",
  },
  {
    id: 5,
    title:
      "Lấy ý kiến hoàn thiện văn bản quy phạm pháp luật về kết nối, chia sẻ dữ liệu",
    excerpt:
      "Chiều ngày 1/8, tại trụ sở Bộ Công an, Trung tâm Dữ liệu quốc gia tổ chức cuộc họp lấy ý kiến tham gia hoàn thiện dự thảo Nghị định của Chính phủ về kết nối, chia sẻ dữ liệu.",
    date: "2025-08-01",
    author: "Trung tâm Dữ liệu Quốc gia",
    category: "Pháp luật",
    image: "/vietnam-data-sharing-meeting.svg",
    slug: "hoan-thien-van-ban-quy-pham-phap-luat",
  },
  {
    id: 6,
    title: "Góc nhìn đa chiều từ 4 diễn giả tại Hội thảo Truy xuất nguồn gốc",
    excerpt:
      "Trong khuôn khổ Hội thảo 'Xác thực truy xuất nguồn gốc - Động lực phát triển bền vững của Kinh tế số Việt Nam', phần chia sẻ chuyên sâu của các diễn giả đã mang đến những thông tin thiết thực.",
    date: "2025-07-28",
    author: "Ban Tổ chức",
    category: "Truy xuất nguồn gốc",
    image: "/vietnam-data-sharing-meeting.svg",
    slug: "goc-nhin-da-chieu-hoi-thao-truy-xuat",
  },
  {
    id: 7,
    title:
      "Ký kết hợp tác giữa PILA và ECO Pharma: Bước tiến mới trong truy xuất nguồn gốc ngành dược",
    excerpt:
      "Hội thảo 'Xác thực truy xuất nguồn gốc - Động lực phát triển bền vững của Kinh tế số Việt Nam' chứng kiến lễ ký kết hợp tác giữa Công ty Cổ phần Tập đoàn PILA và Công ty Cổ phần Dược phẩm ECO.",
    date: "2025-07-25",
    author: "Phòng Truyền thông",
    category: "Hợp tác",
    image: "/vietnam-data-sharing-meeting.svg",
    slug: "ky-ket-hop-tac-pila-eco-pharma",
  },
  {
    id: 8,
    title:
      "Khẳng định nội lực công nghệ Việt tại triển lãm 6 sản phẩm dữ liệu tiên phong",
    excerpt:
      "Ngày 4/7/2025, tại trụ sở Bộ Công an, Trung tâm Dữ liệu quốc gia đã phối hợp cùng Hiệp hội Dữ liệu quốc gia long trọng tổ chức Triển lãm giới thiệu 6 sản phẩm dữ liệu tiên phong.",
    date: "2025-07-20",
    author: "Trung tâm Dữ liệu Quốc gia",
    category: "Sản phẩm số",
    image: "/vietnam-data-sharing-meeting.svg",
    slug: "khang-dinh-noi-luc-cong-nghe-viet",
  },
  {
    id: 9,
    title:
      "Hiệp hội Dữ liệu quốc gia: Kiến thiết hệ sinh thái dữ liệu Việt Nam trong kỷ nguyên số",
    excerpt:
      "'Nền tảng là then chốt, dữ liệu là quyết định' là chỉ đạo mang tính kim chỉ nam của Trung tướng Nguyễn Văn Long, Thứ trưởng Bộ Công an, Phó Chủ tịch Thường trực Hiệp hội Dữ liệu quốc gia.",
    date: "2025-07-15",
    author: "Ban Biên tập",
    category: "Hệ sinh thái",
    image: "/vietnam-data-sharing-meeting.svg",
    slug: "kien-thiet-he-sinh-thai-du-lieu-viet-nam",
  },
  {
    id: 10,
    title: "Khai phá dữ liệu mở đường cho kinh tế phát triển",
    excerpt:
      "Hiệp hội Dữ liệu quốc gia, với sứ mệnh kết nối các cơ quan quản lý, doanh nghiệp, tổ chức trong lĩnh vực dữ liệu và khoa học công nghệ đã, đang nỗ lực xây dựng các hoạt động thiết thực.",
    date: "2025-07-10",
    author: "Hiệp hội Dữ liệu Quốc gia",
    category: "Kinh tế số",
    image: "/vietnam-data-sharing-meeting.svg",
    slug: "khai-pha-du-lieu-mo-duong-kinh-te",
  },
];

const POSTS_PER_PAGE = 6;

export function PostsGrid() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = mockPosts.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post) => (
          <Card
            key={post.id}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={post.image || "/placeholder.png"}
                  alt={post.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {post.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(post.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Đọc thêm
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
