import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Shield, Bot, ArrowRight } from "lucide-react";

export function ProductsSection() {
  const products = [
    {
      title: "Nền tảng Chuỗi khối quốc gia",
      description:
        "Hệ thống blockchain quốc gia đảm bảo tính minh bạch và bảo mật cho các giao dịch dữ liệu",
      icon: Database,
      features: ["Bảo mật cao", "Minh bạch", "Phi tập trung"],
    },
    {
      title: "Ứng dụng định danh phi tập trung",
      description:
        "Giải pháp định danh số an toàn và bảo mật cho công dân Việt Nam",
      icon: Shield,
      features: ["An toàn", "Tiện lợi", "Tuân thủ pháp luật"],
    },
    {
      title: "Trợ lý ảo quốc gia",
      description:
        "AI assistant hỗ trợ công dân trong các thủ tục hành chính và dịch vụ công",
      icon: Bot,
      features: ["Thông minh", "24/7", "Đa ngôn ngữ"],
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Sản phẩm Số
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Các sản phẩm công nghệ tiên tiến phục vụ chuyển đổi số quốc gia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {product.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" className="mt-4 text-primary">
                    Tìm hiểu thêm
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="text-base">
            Xem tất cả sản phẩm
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
