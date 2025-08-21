"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";

export function NewsSection() {
  const news = [
    {
      title: "Lễ khai trương Trung tâm Dữ liệu Quốc gia",
      excerpt:
        "Bộ Công an khai trương Trung tâm dữ liệu quốc gia số 1: Bước tiến mới trong hành trình chuyển đổi số quốc gia",
      date: "18/08/2025",
      category: "Sự kiện",
      image: "/icons/news-placeholder.svg",
    },
    {
      title: "Phiên họp Ban Chấp hành Hiệp hội Dữ liệu quốc gia",
      excerpt:
        "Chuẩn bị diễn ra Phiên họp Ban Chấp hành Hiệp hội Dữ liệu quốc gia với nhiều nội dung quan trọng",
      date: "15/08/2025",
      category: "Hoạt động",
      image: "/icons/news-placeholder.svg",
    },
    {
      title: "AI thực chiến - Cuộc thi về trí tuệ nhân tạo",
      excerpt:
        "Cuộc thi về trí tuệ nhân tạo đầu tiên trên sóng truyền hình với sự tham gia của các chuyên gia hàng đầu",
      date: "12/08/2025",
      category: "Công nghệ",
      image: "/icons/news-placeholder.svg",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#F2E6EE] to-[#977DFF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
            Tin tức & Hoạt động
          </h2>
          <p className="text-lg text-[#0600AF] max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất về hoạt động của Hiệp hội và ngành
            dữ liệu Việt Nam
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 bg-white border-[#977DFF]/20 hover:border-[#0033FF]/40"
            >
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.log(`News image failed to load: ${item.image}`, e);
                    const img = e.target as HTMLImageElement;
                    img.src = "/placeholder-news.png"; // Try placeholder first
                    img.onerror = () => {
                      img.src = "/placeholder-news.png"; // Final fallback
                    };
                  }}
                  onLoad={() => console.log(`News image loaded: ${item.image}`)}
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-[#977DFF] mb-2">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                  <span className="px-2 py-1 bg-[#FFCCF2]/20 text-[#0033FF] rounded-full text-xs border border-[#FFCCF2]/30">
                    {item.category}
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-[#0033FF] transition-colors text-[#0600AF]">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-[#0600AF]/80 text-sm leading-relaxed mb-4">
                  {item.excerpt}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-[#0033FF] hover:text-[#0600AF] hover:bg-[#FFCCF2]/10"
                >
                  Đọc thêm
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-[#0033FF] text-[#0033FF] hover:bg-[#0033FF] hover:text-white"
          >
            Xem tất cả tin tức
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
