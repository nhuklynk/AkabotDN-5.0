import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";

export function NewsSection() {
  const news = [
    {
      title: "Lễ khai trương Trung tâm Dữ liệu Quốc gia",
      excerpt:
        "Bộ Công an khai trương Trung tâm dữ liệu quốc gia số 1: Bước tiến mới trong hành trình chuyển đổi số quốc gia",
      date: "18/08/2025",
      category: "Sự kiện",
      image: "/vietnam-data-center-opening.png",
    },
    {
      title: "Phiên họp Ban Chấp hành Hiệp hội Dữ liệu quốc gia",
      excerpt:
        "Chuẩn bị diễn ra Phiên họp Ban Chấp hành Hiệp hội Dữ liệu quốc gia với nhiều nội dung quan trọng",
      date: "15/08/2025",
      category: "Hoạt động",
      image: "/vietnam-data-association-meeting.png",
    },
    {
      title: "AI thực chiến - Cuộc thi về trí tuệ nhân tạo",
      excerpt:
        "Cuộc thi về trí tuệ nhân tạo đầu tiên trên sóng truyền hình với sự tham gia của các chuyên gia hàng đầu",
      date: "12/08/2025",
      category: "Công nghệ",
      image: "/ai-competition-vietnam-tv.png",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Tin tức & Hoạt động
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất về hoạt động của Hiệp hội và ngành
            dữ liệu Việt Nam
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`aspect-video overflow-hidden rounded-t-lg ${
                  item.image === "/vietnam-data-association-meeting.png"
                    ? "bg-gradient-accent p-2"
                    : ""
                }`}
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${
                    item.image === "/vietnam-data-association-meeting.png"
                      ? "object-contain"
                      : "object-cover"
                  }`}
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {item.category}
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {item.excerpt}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-primary"
                >
                  Đọc thêm
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            Xem tất cả tin tức
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
