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
    <section className="py-20 bg-gradient-to-b from-white to-[#F2E6EE]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-[#0033FF] mb-4">
            Sản phẩm Số
          </h2>
          <p className="text-lg text-[#0600AF] max-w-2xl mx-auto">
            Các sản phẩm công nghệ tiên tiến phục vụ chuyển đổi số quốc gia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-[#977DFF]/20 bg-white/90 backdrop-blur hover:border-[#0033FF]/40"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#977DFF]/20 to-[#0033FF]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:from-[#977DFF]/30 group-hover:to-[#0033FF]/30 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-[#0033FF]" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-[#0033FF] transition-colors text-[#0600AF]">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-[#0600AF]/80 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {product.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="px-3 py-1 bg-[#FFCCF2]/20 text-[#0033FF] rounded-full text-sm font-medium border border-[#FFCCF2]/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-4 text-[#0033FF] hover:text-[#0600AF] hover:bg-[#FFCCF2]/10"
                  >
                    Tìm hiểu thêm
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="text-base bg-[#0033FF] hover:bg-[#0600AF] text-white border-0"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
